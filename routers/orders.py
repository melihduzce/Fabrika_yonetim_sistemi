from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Order, Product, OrderStatus
from schemas import OrderCreate, OrderResponse
from services.capacity_service import calculate_production_days
from services.cost_service import calculate_total_cost, calculate_sale_price, calculate_margin_percent
from services.event_trigger import check_and_trigger

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.get("/", response_model=List[OrderResponse])
def list_orders(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    return query.order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    return order


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(
    data: OrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Sipariş oluşturur ve otomatik olarak:
    1. Üretim süresini hesaplar
    2. Maliyeti hesaplar
    3. Satış fiyatını üretir (belirtilmemişse)
    4. Marj hesaplar
    5. Event-driven AI tetikleyiciyi çalıştırır
    """
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # 1. Üretim süresi
    estimated_days = calculate_production_days(product, data.quantity)

    # 2. Maliyet
    total_cost = calculate_total_cost(product, data.quantity, estimated_days)

    # 3. Satış fiyatı
    sale_price = data.sale_price if data.sale_price else calculate_sale_price(total_cost)

    # 4. Marj
    margin = calculate_margin_percent(sale_price, total_cost)

    order = Order(
        product_id=data.product_id,
        quantity=data.quantity,
        estimated_days=estimated_days,
        total_cost=total_cost,
        sale_price=sale_price,
        margin_percent=margin,
        status=OrderStatus.PENDING,
        customer_name=data.customer_name,
        delivery_date=data.delivery_date,
        notes=data.notes,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # 5. Event trigger (background task olarak → response'u bloklamaz)
    background_tasks.add_task(check_and_trigger, db, order, product, True)

    return order


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    valid_statuses = [s.value for s in OrderStatus]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Geçersiz status. Seçenekler: {valid_statuses}")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")

    order.status = status
    db.commit()
    return {"id": order_id, "status": status, "message": "Durum güncellendi"}


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    db.delete(order)
    db.commit()
