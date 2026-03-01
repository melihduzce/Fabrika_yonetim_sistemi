from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import CapacitySummary
from services.capacity_service import get_capacity_summary

router = APIRouter(prefix="/api/capacity", tags=["Capacity"])


@router.get("/summary", response_model=CapacitySummary)
def capacity_summary(db: Session = Depends(get_db)):
    return get_capacity_summary(db)