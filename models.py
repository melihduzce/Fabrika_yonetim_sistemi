from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PRODUCTION = "in_production"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    urun_kodu = Column(String(50), unique=True, index=True)
    ham_madde = Column(String(50), default="Demir")
    malzeme_tipi = Column(String(50), default="")        # cubuk, sac, vb.
    pres_kategorisi = Column(String(50), default="")     # agir_800t, orta_400t vb.

    # Ölçüler
    urun_boy_mm = Column(Float, default=0.0)
    urun_en_mm = Column(Float, default=0.0)
    madde_cap = Column(Float, default=0.0)
    madde_boy_mm = Column(Float, default=0.0)
    kalip_ici_sayi = Column(Integer, default=1)

    # Ağırlık
    brut_agirlik_kg = Column(Float, default=0.0)
    net_agirlik_kg = Column(Float, default=0.0)
    hurda_kg = Column(Float, default=0.0)
    hurda_orani = Column(Float, default=0.0)
    malzeme_verimi = Column(Float, default=0.0)

    # Üretim
    calisan_sayisi = Column(Integer, default=1)
    gunluk_uretim = Column(Integer, default=0)
    saat = Column(Float, default=9.0)
    vurus_kw = Column(Float, default=0.0)
    kwh_per_adet = Column(Float, default=0.0)
    kisi_basi_uretim = Column(Float, default=0.0)

    # Maliyet
    material_cost_per_kg = Column(Float, default=0.0)
    labor_cost_per_hour = Column(Float, default=0.0)
    overhead_rate = Column(Float, default=0.15)
    base_cost = Column(Float, default=0.0)

    # Isıl işlem
    has_heat_treatment = Column(Boolean, default=False)

    orders = relationship("Order", back_populates="product")
    machines = relationship("ProductMachine", back_populates="product", cascade="all, delete-orphan")

    @property
    def name(self):
        return self.urun_kodu

    @property
    def net_daily_capacity(self):
        from config import EFFICIENCY_RATE
        return self.gunluk_uretim * EFFICIENCY_RATE

    @property
    def monthly_capacity(self):
        from config import WORKING_DAYS_PER_MONTH
        return self.net_daily_capacity * WORKING_DAYS_PER_MONTH


class ProductMachine(Base):
    __tablename__ = "product_machines"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    machine_name = Column(String(50), nullable=False)   # 1000_ton, 800_ton, vb.
    is_used = Column(Boolean, default=False)

    product = relationship("Product", back_populates="machines")


class Personnel(Base):
    __tablename__ = "personnel"

    id = Column(Integer, primary_key=True, index=True)
    personel_id = Column(String(20), unique=True, index=True)
    ad = Column(String(100), default="")
    soyad = Column(String(100), default="")
    departman = Column(String(100), default="")
    pozisyon = Column(String(100), default="")
    maas = Column(Float, default=0.0)
    ise_giris_tarihi = Column(Date, nullable=True)

    # İzin
    yillik_izin_hakki = Column(Integer, default=14)
    kullanilan_izin = Column(Integer, default=0)
    kalan_izin = Column(Integer, default=14)

    # Performans
    performans_puani = Column(Float, default=0.0)
    ortalama_gunluk_uretim = Column(Float, default=0.0)
    devamsizlik_gun = Column(Integer, default=0)
    fazla_mesai_saat = Column(Float, default=0.0)

    egitim_sertifikalari = Column(String(255), default="")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    @property
    def name(self):
        return f"{self.ad} {self.soyad}".strip() or self.personel_id

    @property
    def absenteeism_rate(self):
        # Devamsızlık gün → oran (22 iş günü baz)
        return round(self.devamsizlik_gun / 22, 4) if self.devamsizlik_gun else 0.0


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    estimated_days = Column(Float, default=0.0)
    total_cost = Column(Float, default=0.0)
    sale_price = Column(Float, default=0.0)
    margin_percent = Column(Float, default=0.0)
    status = Column(String(50), default=OrderStatus.PENDING)
    customer_name = Column(String(100), default="")
    delivery_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    product = relationship("Product", back_populates="orders")

    @property
    def profit(self):
        return self.sale_price - self.total_cost


class StockRaw(Base):
    __tablename__ = "stock_raw"

    id = Column(Integer, primary_key=True, index=True)
    material_name = Column(String(100), nullable=False)
    quantity_kg = Column(Float, default=0.0)
    unit_price = Column(Float, default=0.0)
    min_stock_kg = Column(Float, default=0.0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    @property
    def total_value(self):
        return self.quantity_kg * self.unit_price

    @property
    def is_critical(self):
        return self.quantity_kg <= self.min_stock_kg


class AIAnalysisLog(Base):
    __tablename__ = "ai_analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    trigger_event = Column(String(100), default="manual")
    risk_level = Column(String(20), default=RiskLevel.LOW)
    capacity_utilization = Column(Float, default=0.0)
    analysis_text = Column(Text, default="")
    recommendations = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())