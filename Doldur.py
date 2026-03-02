import pandas as pd
from src12.database import SessionLocal, engine, Base
from src12.models import Product, Personnel

# Tabloları sıfırdan oluştur
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_data():
    try:
        # Ürünleri Yükle
        urunler_df = pd.read_csv('urunler_temiz.csv')
        for _, row in urunler_df.iterrows():
            product = Product(
                urun_kodu=row['urun_kodu'],
                ham_madde=row['ham_madde'],
                daily_capacity=float(row['gunluk_uretim']),
                net_weight=row['net_agirlik_kg'],
                gross_weight=row['brut_agirlik_kg'],
                scrap_rate=row['hurda_orani'],
                has_heat_treatment=bool(row['isil_islem']),
                base_cost=row['net_agirlik_kg'] * 45.0, # Örnek: kg başı 45 TL maliyet
                can_use_1000t=row['1000_ton'],
                can_use_800t=row['800_ton'],
                can_use_400t=row['400_ton'],
                can_use_250t=row['250_ton'],
                pres_kategorisi=row['pres_kategorisi']
            )
            db.add(product)

        # Personeli Yükle
        personel_df = pd.read_csv('personel.csv')
        for _, row in personel_df.iterrows():
            staff = Personnel(
                personel_id=row['personel_id'],
                departman=row['departman'],
                position=row['pozisyon'],
                performance_score=row['performans_puani'] if pd.notna(row['performans_puani']) else 0.0,
                absenteeism_rate=row['devamsizlik_gun'] / 30.0, # Aylık devamsızlık oranı
                is_active=bool(row['aktif'])
            )
            db.add(staff)

        db.commit()
        print("CSV verileri başarıyla veritabanına aktarıldı!")
    except Exception as e:
        print(f"Hata oluştu: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()