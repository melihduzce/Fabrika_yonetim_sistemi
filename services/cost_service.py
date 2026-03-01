from models import Product, Order
from config import EFFICIENCY_RATE

# Varsayılan kâr marjı (ürüne özel değer yoksa)
DEFAULT_MARGIN = 0.25  # %25


def calculate_total_cost(product: Product, quantity: int, estimated_days: float) -> float:
    """
    Sipariş maliyetini hesaplar.

    Maliyet = Hammadde + İşçilik + Genel Gider + Fire
    """
    # 1. Hammadde maliyeti
    gross_qty_kg = quantity * product.brut_agirlik_kg  # fire dahil toplam kg
    material_cost = gross_qty_kg * product.material_cost_per_kg

    # 2. İşçilik maliyeti (basit: günlük 8 saat, estimated_days bazında)
    hours = estimated_days * 8
    labor_cost = hours * product.labor_cost_per_hour

    # 3. Base cost (sabit birim maliyet varsa)
    base = product.base_cost * quantity

    subtotal = material_cost + labor_cost + base

    # 4. Genel gider
    overhead = subtotal * product.overhead_rate

    total = subtotal + overhead
    return round(total, 2)


def calculate_sale_price(total_cost: float, margin: float = DEFAULT_MARGIN) -> float:
    """
    Satış fiyatı = Maliyet / (1 - marj)
    Örn: maliyet 100, %25 marj → fiyat = 133.33
    """
    if margin >= 1.0:
        margin = margin / 100  # % değer verilmişse normalize et
    return round(total_cost / (1 - margin), 2)


def calculate_margin_percent(sale_price: float, total_cost: float) -> float:
    """Kâr marjı = (Satış - Maliyet) / Satış × 100"""
    if sale_price <= 0:
        return 0.0
    return round(((sale_price - total_cost) / sale_price) * 100, 2)


def is_low_margin(margin_percent: float) -> bool:
    from config import MIN_MARGIN_PERCENT
    return margin_percent < MIN_MARGIN_PERCENT