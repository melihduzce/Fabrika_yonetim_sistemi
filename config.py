import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./factory.db")

# LLM Provider: "openai" | "anthropic" | "gemini" | "mock"
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "mock")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "")

# Factory Settings
CAPACITY_WARNING_THRESHOLD = float(os.getenv("CAPACITY_WARNING_THRESHOLD", "85"))
CRITICAL_ORDER_RATIO = float(os.getenv("CRITICAL_ORDER_RATIO", "0.20"))
MIN_MARGIN_PERCENT = float(os.getenv("MIN_MARGIN_PERCENT", "10"))
EFFICIENCY_RATE = float(os.getenv("EFFICIENCY_RATE", "0.85"))

# Working days per month
WORKING_DAYS_PER_MONTH = int(os.getenv("WORKING_DAYS_PER_MONTH", "22"))
