from fastapi import FastAPI
from src12.database import engine, Base
from src12.routers import orders, capacity

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Factory Management System")

app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(capacity.router, prefix="/capacity", tags=["Capacity"])

@app.get("/")
def root():
    return {"message": "AI Factory Backend Running"}



"""
günlük üretimin kalıp içi sayı ile çarpılması ve 
gemini hatası çözümü 
"""