from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import StockRaw
from schemas import StockRawCreate, StockRawResponse

router = APIRouter(prefix="/api/stock", tags=["Stock"])


@router.get("/", response_model=List[StockRawResponse])
def list_stock(db: Session = Depends(get_db)):
    return db.query(StockRaw).all()


@router.get("/critical", response_model=List[StockRawResponse])
def critical_stock(db: Session = Depends(get_db)):
    """Kritik seviyenin altındaki stokları döner"""
    items = db.query(StockRaw).all()
    return [item for item in items if item.is_critical]


@router.get("/{stock_id}", response_model=StockRawResponse)
def get_stock(stock_id: int, db: Session = Depends(get_db)):
    item = db.query(StockRaw).filter(StockRaw.id == stock_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Stok kalemi bulunamadı")
    return item


@router.post("/", response_model=StockRawResponse, status_code=201)
def create_stock(data: StockRawCreate, db: Session = Depends(get_db)):
    item = StockRaw(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{stock_id}", response_model=StockRawResponse)
def update_stock(stock_id: int, data: StockRawCreate, db: Session = Depends(get_db)):
    item = db.query(StockRaw).filter(StockRaw.id == stock_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Stok kalemi bulunamadı")
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{stock_id}", status_code=204)
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    item = db.query(StockRaw).filter(StockRaw.id == stock_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Stok kalemi bulunamadı")
    db.delete(item)
    db.commit()