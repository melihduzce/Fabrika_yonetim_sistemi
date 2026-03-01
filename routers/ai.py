from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas import AIAnalyzeRequest, AIAnalyzeResponse, AIAnalysisLogResponse
from services.ai_agent import run_ai_analysis
from services.event_trigger import get_recent_triggers

router = APIRouter(prefix="/api/ai", tags=["AI Agent"])


@router.post("/analyze", response_model=AIAnalyzeResponse)
def analyze(request: AIAnalyzeRequest, db: Session = Depends(get_db)):
    return run_ai_analysis(db=db, trigger_event="manual", order_id=request.order_id)


@router.get("/logs", response_model=List[AIAnalysisLogResponse])
def get_logs(limit: int = 20, db: Session = Depends(get_db)):
    return get_recent_triggers(db, limit=limit)