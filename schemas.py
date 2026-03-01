from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from typing import Optional, List

class ProductMachineResponse(BaseModel):
    machine_name: str
    is_used: bool

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    urun_kodu: str
    ham_madde: str = "Demir"
    malzeme_tipi: str = ""
    pres_kategorisi: str = ""
    urun_boy_mm: float = 0.0
    urun_en_mm: float = 0.0
    madde_cap: float = 0.0
    madde_boy_mm: float = 0.0
    kalip_ici_sayi: int = 1
    brut_agirlik_kg: float = 0.0
    net_agirlik_kg: float = 0.0
    hurda_kg: float = 0.0
    hurda_orani: float = 0.0
    malzeme_verimi: float = 0.0
    calisan_sayisi: int = 1
    gunluk_uretim: int = 0
    saat: float = 9.0
    vurus_kw: float = 0.0
    kwh_per_adet: float = 0.0
    kisi_basi_uretim: float = 0.0
    material_cost_per_kg: float = 0.0
    labor_cost_per_hour: float = 0.0
    overhead_rate: float = 0.15
    base_cost: float = 0.0
    has_heat_treatment: bool = False


class ProductResponse(ProductCreate):
    id: int
    net_daily_capacity: float
    monthly_capacity: float
    machines: List[ProductMachineResponse] = []

    class Config:
        from_attributes = True


class PersonnelCreate(BaseModel):
    name: str
    position: str
    department: str = "Üretim"
    gross_salary: float
    performance_score: int = Field(default=100, ge=0, le=100)
    absenteeism_rate: float = 0.02
    is_active: bool = True


class PersonnelResponse(PersonnelCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    sale_price: Optional[float] = None
    customer_name: str = ""
    delivery_date: Optional[datetime] = None
    notes: str = ""


class OrderResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    estimated_days: float
    total_cost: float
    sale_price: float
    margin_percent: float
    status: str
    customer_name: str
    delivery_date: Optional[datetime]
    notes: str
    created_at: datetime
    profit: float

    class Config:
        from_attributes = True


class CapacitySummary(BaseModel):
    total_monthly_capacity: float
    total_open_order_days: float
    utilization_percent: float
    available_days: float
    risk_level: str
    active_order_count: int


class StockRawCreate(BaseModel):
    product_id: Optional[int] = None
    material_name: str
    quantity_kg: float
    unit_price: float
    min_stock_kg: float = 0.0


class StockRawResponse(StockRawCreate):
    id: int
    total_value: float
    is_critical: bool
    updated_at: datetime

    class Config:
        from_attributes = True


class AIAnalyzeRequest(BaseModel):
    mode: str = "risk_analysis"
    order_id: Optional[int] = None


class AIRecommendation(BaseModel):
    action: str
    priority: str
    description: str


class AIAnalyzeResponse(BaseModel):
    risk_level: str
    capacity_utilization: float
    analysis: str
    recommendations: List[AIRecommendation]
    trigger_event: str
    timestamp: datetime


class AIAnalysisLogResponse(BaseModel):
    id: int
    trigger_event: str
    risk_level: str
    capacity_utilization: float
    analysis_text: str
    recommendations: str
    created_at: datetime

    class Config:
        from_attributes = True