from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src12.database import get_db
from src12.services.capacity_service import calculate_capacity_utilization

router = APIRouter()

@router.get("/summary")
def get_capacity_summary(db: Session = Depends(get_db)):
    """
    Mevcut açık siparişlere göre kapasite doluluk oranını döner.
    """

    capacity_data = calculate_capacity_utilization(db)

    return {
        "monthly_capacity": capacity_data["monthly_capacity"],
        "open_orders": capacity_data["open_orders"],
        "utilization_percent": capacity_data["utilization"],
        "risk_level": classify_risk(capacity_data["utilization"])
    }


def classify_risk(utilization: float):
    if utilization < 85:
        return "LOW"
    elif utilization < 100:
        return "MEDIUM"
    elif utilization < 120:
        return "HIGH"
    else:
        return "CRITICAL"