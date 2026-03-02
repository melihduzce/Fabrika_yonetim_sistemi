from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from src12.database import get_db
from src12.schemas import OrderCreate
from src12.models import Product, Order, Personnel
from src12.services.production_service import calculate_production_days
from src12.services.ai_service import run_ai_analysis  # Fonksiyon ismi düzeltildi

router = APIRouter(prefix="/orders", tags=["Siparişler"])


@router.post("/")
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    # 1. Ürün ve Personel Verilerini Çek
    product = db.query(Product).filter(Product.id == order_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı!")

    # 2. Matematiksel Hesaplamalar
    production_days = calculate_production_days(
        order_data.quantity,
        product.daily_capacity,
        product.has_heat_treatment
    )

    # Maliyet ve Fiyatlandırma (%20 Marj)
    total_cost = order_data.quantity * product.base_cost
    sale_price = total_cost * 1.20
    margin = 20.0  # Sabit %20 kâr marjı üzerinden hesaplanıyor

    # 3. Siparişi Veritabanına Kaydet
    new_order = Order(
        product_id=order_data.product_id,
        quantity=order_data.quantity,
        estimated_days=production_days,
        total_cost=total_cost,
        sale_price=sale_price,
        status="OPEN"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # 4. EVENT-DRIVEN AI ANALİZİ

    # Mevcut ürün için bekleyen toplam sipariş miktarını bul
    toplam_acik_siparis = db.query(func.sum(Order.quantity)).filter(
        Order.product_id == product.id,
        Order.status == "OPEN"
    ).scalar() or 0

    # Kapasite Doluluk Oranı Hesaplama (Aylık bazda)
    aylik_kapasite = product.daily_capacity * 30
    utilization = (toplam_acik_siparis / aylik_kapasite) * 100

    # Personel Performans Ortalamasını Çek
    avg_perf = db.query(func.avg(Personnel.performance_score)).scalar() or 0

    # Simülasyon: 800 Tonluk presin arızalı olduğunu varsayalım
    broken_machine = "800_ton"
    affected_count = db.query(Product).filter(Product.can_use_800t == 1).count()

    # Gemini'ye gönderilecek veri paketi
    factory_state = {
        "utilization": round(utilization, 2),
        "broken_machines": broken_machine,
        "affected_count": affected_count,
        "margin": margin,
        "avg_performance": round(avg_perf, 2)
    }

    # SADECE Kapasite %85'i geçerse AI'ı tetikle
    ai_report = "Kapasite eşiği (%85) aşılmadığı için AI analizi tetiklenmedi."
    if utilization > 85:
        ai_report = run_ai_analysis(factory_state)

    # 5. Sonuçları Frontend'e Fırlat
    return {
        "mesaj": "Sipariş oluşturuldu!",
        "analiz_ozeti": {
            "doluluk_orani": f"%{round(utilization, 2)}",
            "risk_seviyesi": "CRITICAL" if utilization > 85 else "LOW",
            "aktif_olmayan_makine": broken_machine
        },
        "ai_analiz_sonucu": ai_report,
        "siparis_detayi": new_order
    }