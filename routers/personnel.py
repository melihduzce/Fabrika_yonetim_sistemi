from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Personnel
from schemas import PersonnelCreate, PersonnelResponse

router = APIRouter(prefix="/api/personnel", tags=["Personnel"])


@router.get("/", response_model=List[PersonnelResponse])
def list_personnel(db: Session = Depends(get_db)):
    return db.query(Personnel).all()


@router.get("/active", response_model=List[PersonnelResponse])
def active_personnel(db: Session = Depends(get_db)):
    """Sadece aktif personeli döner"""
    return db.query(Personnel).filter(Personnel.is_active == True).all()


@router.get("/{personnel_id}", response_model=PersonnelResponse)
def get_personnel(personnel_id: int, db: Session = Depends(get_db)):
    person = db.query(Personnel).filter(Personnel.id == personnel_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")
    return person


@router.post("/", response_model=PersonnelResponse, status_code=201)
def create_personnel(data: PersonnelCreate, db: Session = Depends(get_db)):
    person = Personnel(**data.model_dump())
    db.add(person)
    db.commit()
    db.refresh(person)
    return person


@router.put("/{personnel_id}", response_model=PersonnelResponse)
def update_personnel(personnel_id: int, data: PersonnelCreate, db: Session = Depends(get_db)):
    person = db.query(Personnel).filter(Personnel.id == personnel_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")
    for key, value in data.model_dump().items():
        setattr(person, key, value)
    db.commit()
    db.refresh(person)
    return person


@router.patch("/{personnel_id}/deactivate")
def deactivate_personnel(personnel_id: int, db: Session = Depends(get_db)):
    person = db.query(Personnel).filter(Personnel.id == personnel_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")
    person.is_active = False
    db.commit()
    return {"id": personnel_id, "message": "Personel pasife alındı"}


@router.delete("/{personnel_id}", status_code=204)
def delete_personnel(personnel_id: int, db: Session = Depends(get_db)):
    person = db.query(Personnel).filter(Personnel.id == personnel_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")
    db.delete(person)
    db.commit()