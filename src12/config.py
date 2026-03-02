import os
from dotenv import load_dotenv

load_dotenv()

# Eğer .env içinde DATABASE_URL yoksa SQLite fallback
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./factory.db"
)

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "mock")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")

# Sabit sistem parametreleri
MONTHLY_CAPACITY = int(os.getenv("MONTHLY_CAPACITY", 120000))
EFFICIENCY_RATE = float(os.getenv("EFFICIENCY_RATE", 0.85))
CAPACITY_WARNING_THRESHOLD = float(os.getenv("CAPACITY_WARNING_THRESHOLD", 85))