"""
Event-Driven Tetikleyici Sistemi
---------------------------------
Sipariş oluşturulduğunda veya güncellendiğinde otomatik olarak
kapasite kontrolü yapar ve gerekirse AI Agent'ı tetikler.

Tetikleme Kuralları:
    - Kapasite > %85  → capacity_threshold
    - Kapasite > %110 → capacity_critical
    - Sipariş adedi > aylık kap. %20'si → critical_order
    - Marj < %10 → low_margin
"""

from sqlalchemy.orm import Session
from typing import Optional
from models import Order, Product, AIAnalysisLog
from services.capacity_service import get_capacity_summary, should_trigger_ai
from services.cost_service import is_low_margin
from config import CRITICAL_ORDER_RATIO, MIN_MARGIN_PERCENT


class TriggerEvent:
    MANUAL = "manual"
    CAPACITY_THRESHOLD = "capacity_threshold"
    CAPACITY_CRITICAL = "capacity_critical"
    CRITICAL_ORDER = "critical_order"
    LOW_MARGIN = "low_margin"


def check_and_trigger(
    db: Session,
    order: Order,
    product: Product,
    auto_analyze: bool = True,
) -> Optional[str]:
    """
    Yeni sipariş sonrası event kontrolü yapar.
    Tetiklenecek event varsa AI analizi başlatır.
    
    Returns:
        trigger_event str veya None (tetiklenmediyse)
    """
    trigger = _detect_trigger(db, order, product)

    if trigger and auto_analyze:
        _run_analysis_async(db, trigger)

    return trigger


def _detect_trigger(db: Session, order: Order, product: Product) -> Optional[str]:
    """Hangi event kuralı tetiklendi?"""

    # 1. Kapasite kontrolü
    capacity = get_capacity_summary(db)
    should_run, reason = should_trigger_ai(capacity.utilization_percent)

    if should_run:
        return reason

    # 2. Büyük sipariş kontrolü
    monthly_capacity = product.monthly_capacity
    if monthly_capacity > 0:
        order_ratio = order.quantity / monthly_capacity
        if order_ratio > CRITICAL_ORDER_RATIO:
            return TriggerEvent.CRITICAL_ORDER

    # 3. Düşük marj kontrolü
    if order.margin_percent > 0 and is_low_margin(order.margin_percent):
        return TriggerEvent.LOW_MARGIN

    return None


def _run_analysis_async(db: Session, trigger: str):
    """
    AI analizi çalıştır.
    Gerçek projede bu Celery task veya BackgroundTask olur.
    Şimdilik sync çalışıyor.
    """
    try:
        from services.ai_agent import run_ai_analysis
        run_ai_analysis(db=db, trigger_event=trigger)
    except Exception as e:
        # Analiz hatası siparişi bloklamamalı
        print(f"[EventTrigger] AI analiz hatası: {e}")


def get_recent_triggers(db: Session, limit: int = 10):
    """Son tetikleme loglarını döner"""
    return (
        db.query(AIAnalysisLog)
        .order_by(AIAnalysisLog.created_at.desc())
        .limit(limit)
        .all()
    )
