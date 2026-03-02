from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Bağlantı adresi artık bir SQLite dosyası
SQLALCHEMY_DATABASE_URL = "sqlite:///./fabrika_yonetim.db"

# 2. Motoru (engine) oluşturma
# NOT: check_same_thread=False ayarı FastAPI ve SQLite ikilisi için zorunludur!
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 3. Veritabanı oturumunu yöneten o meşhur fonksiyonumuz
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()