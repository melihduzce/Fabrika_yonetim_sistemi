from sqlalchemy import Column, Integer, Float, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from src12.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    urun_kodu = Column(String(50), unique=True)  # CSV: urun_kodu
    ham_madde = Column(String(100))  # CSV: ham_madde
    daily_capacity = Column(Integer)  # CSV: gunluk_uretim
    net_weight = Column(Float)  # CSV: net_agirlik_kg
    gross_weight = Column(Float)  # CSV: brut_agirlik_kg
    scrap_rate = Column(Float)  # CSV: hurda_orani
    has_heat_treatment = Column(Boolean)  # CSV: isil_islem
    base_cost = Column(Float, default=0.0)  # Manuel maliyet alanı

    # Makine Yetkinlikleri (CSV'deki tonaj sütunları)
    can_use_1000t = Column(Integer, default=0)
    can_use_800t = Column(Integer, default=0)
    can_use_400t = Column(Integer, default=0)
    can_use_250t = Column(Integer, default=0)
    pres_kategorisi = Column(String(50))  # CSV: pres_kategorisi


class Personnel(Base):
    __tablename__ = "personnel"

    id = Column(Integer, primary_key=True, index=True)
    personel_id = Column(String(50), unique=True)
    departman = Column(String(100))
    position = Column(String(100))
    performance_score = Column(Float)
    absenteeism_rate = Column(Float)  # CSV: devamsizlik_gun bazlı hesaplanacak
    is_active = Column(Boolean, default=True)  # CSV: aktif


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    estimated_days = Column(Float)
    total_cost = Column(Float)
    sale_price = Column(Float)
    status = Column(String(50), default="OPEN")
    created_at = Column(DateTime(timezone=True), server_default=func.now())