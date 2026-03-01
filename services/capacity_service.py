from sqlalchemy.orm import Session
from models import Order, Product, OrderStatus, RiskLevel
from config import CAPACITY_WARNING_THRESHOLD, WORKING_DAYS_PER_MONTH, EFFICIENCY_RATE
from schemas import CapacitySummary


def calculate_production_days(product: Product, quantity: int) -> float:
    """
    Bir sipariş için üretim süresini hesaplar.

    Formül:
        Net Günlük Kapasite = daily_capacity × efficiency_rate
        Üretim Süresi = quantity / net_daily_capacity
        Isıl İşlem varsa → +1 gün
    """
    net_capacity = product.net_daily_capacity * EFFICIENCY_RATE
    if net_capacity <= 0:
        return 0.0

    days = quantity / net_capacity

    if product.has_heat_treatment:
        days += 1.0

    return round(days, 2)


def get_capacity_summary(db: Session) -> CapacitySummary:
    """
    Tüm aktif siparişlerin kapasitedeki toplam yükünü hesaplar.
    Tek bir ürün değil, fabrika geneli kapasite analizi yapar.
    """
    active_orders = db.query(Order).filter(
        Order.status.in_([OrderStatus.PENDING, OrderStatus.IN_PRODUCTION])
    ).all()

    # Her ürünün aylık kapasitesini topla
    products = db.query(Product).all()
    total_monthly_capacity_days = sum(
        (p.net_daily_capacity * EFFICIENCY_RATE * WORKING_DAYS_PER_MONTH)
        for p in products
    )
    # Kapasite günlük birimde tutulur → aylık gün toplamı
    # Basitleştirme: fabrika toplam üretim kapasitesi (adet bazında değil gün bazında)
    total_available_days = len(products) * WORKING_DAYS_PER_MONTH if products else WORKING_DAYS_PER_MONTH

    total_open_days = sum(o.estimated_days for o in active_orders)

    if total_available_days > 0:
        utilization = (total_open_days / total_available_days) * 100
    else:
        utilization = 0.0

    risk_level = _determine_risk_level(utilization)

    return CapacitySummary(
        total_monthly_capacity=total_available_days,
        total_open_order_days=total_open_days,
        utilization_percent=round(utilization, 2),
        available_days=max(0.0, total_available_days - total_open_days),
        risk_level=risk_level,
        active_order_count=len(active_orders),
    )


def _determine_risk_level(utilization: float) -> str:
    if utilization >= 110:
        return RiskLevel.CRITICAL
    elif utilization >= 90:
        return RiskLevel.HIGH
    elif utilization >= CAPACITY_WARNING_THRESHOLD:
        return RiskLevel.MEDIUM
    else:
        return RiskLevel.LOW


def should_trigger_ai(utilization: float, order_ratio: float = 0.0) -> tuple[bool, str]:
    """
    Event-driven tetikleyici: AI Agent çalıştırılmalı mı?

    Returns:
        (should_trigger: bool, reason: str)
    """
    from config import CAPACITY_WARNING_THRESHOLD, CRITICAL_ORDER_RATIO

    if utilization > 110:
        return True, "capacity_critical"

    if utilization > CAPACITY_WARNING_THRESHOLD:
        return True, "capacity_threshold"

    if order_ratio > CRITICAL_ORDER_RATIO:
        return True, "critical_order"

    return False, ""