from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db, SessionLocal
from routers import products, orders, capacity, ai, stock, personnel

app = FastAPI(
    title="AI Destekli Üretim Yönetim Sistemi",
    version="1.0.0",
    description="Event-driven AI Agent ile kapasite ve üretim analizi",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(personnel.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(capacity.router)
app.include_router(ai.router)
app.include_router(stock.router)


@app.on_event("startup")
def startup():
    init_db()
    _seed_demo_data()


@app.get("/")
def root():
    return {
        "app": "AI Destekli Üretim Yönetim Sistemi",
        "version": "1.0.0",
        "docs": "/docs",
    }


def _seed_demo_data():
    db = SessionLocal()
    try:
        from models import Product, ProductMachine, Personnel
        if db.query(Product).count() > 0:
            return

        import csv
        from pathlib import Path

        # ── Ürünler ──────────────────────────────────────────
        urun_path = Path("urunler_temiz.csv")

        if urun_path.exists():
            with open(urun_path, encoding="utf-8-sig") as f:
                for row in csv.DictReader(f):
                    kod = row["urun_kodu"]
                    hurda_raw = row.get("hurda", "0") or "0"
                    p = Product(
                        urun_kodu=kod,
                        ham_madde=row.get("ham_madde", "Demir"),
                        malzeme_tipi=row.get("malzeme_tipi", ""),
                        pres_kategorisi=row.get("pres_kategorisi", ""),
                        urun_boy_mm=float(row.get("urun_boy_mm") or 0),
                        urun_en_mm=float(row.get("urun_en_mm") or 0),
                        madde_cap=float(row.get("madde_cap") or 0),
                        madde_boy_mm=float(row.get("madde_boy_mm") or 0),
                        kalip_ici_sayi=int(float(row.get("kalip_ici_sayi") or 1)),
                        brut_agirlik_kg=float(row.get("brut_agirlik_kg") or 0),
                        net_agirlik_kg=float(row.get("net_agirlik_kg") or 0),
                        hurda_kg=float(hurda_raw),
                        hurda_orani=float(row.get("hurda_orani") or 0),
                        malzeme_verimi=float(row.get("malzeme_verimi") or 0),
                        calisan_sayisi=int(float(row.get("calisan_sayisi") or 1)),
                        gunluk_uretim=int(float(row.get("gunluk_uretim") or 0)),
                        saat=float(row.get("saat") or 9),
                        vurus_kw=float(row.get("vurus_kw") or 0),
                        kwh_per_adet=float(row.get("kwh_per_adet") or 0),
                        kisi_basi_uretim=float(row.get("kisi_basi_uretim") or 0),
                        has_heat_treatment=str(row.get("isil_islem", "0")).strip() == "1",
                        overhead_rate=0.15,
                    )
                    db.add(p)
                    db.commit()
                    db.refresh(p)

                    # Makine ilişkileri — doğrudan aynı satırdan oku
                    for machine in ["1000_ton", "800_ton", "400_ton", "250_ton",
                                    "eksantrik_125", "eksantrik_80", "induksiyon", "hidrolik_kivirma"]:
                        db.add(ProductMachine(
                            product_id=p.id,
                            machine_name=machine,
                            is_used=str(row.get(machine, "0")).strip() == "1",
                        ))
                    db.commit()

            print(f"[Seed] {db.query(Product).count()} ürün yüklendi.")

        # ── Personel ─────────────────────────────────────────
        personel_path = Path("personel.csv")
        if personel_path.exists():
            from datetime import date
            with open(personel_path, encoding="utf-8-sig") as f:
                for row in csv.DictReader(f):
                    giris = None
                    if row.get("ise_giris_tarihi"):
                        try:
                            giris = date.fromisoformat(row["ise_giris_tarihi"])
                        except Exception:
                            pass
                    db.add(Personnel(
                        personel_id=row["personel_id"],
                        ad=row.get("ad", ""),
                        soyad=row.get("soyad", ""),
                        departman=row.get("departman", ""),
                        pozisyon=row.get("pozisyon", ""),
                        maas=float(row["maas"]) if row.get("maas") else 0.0,
                        ise_giris_tarihi=giris,
                        yillik_izin_hakki=int(row.get("yillik_izin_hakki") or 14),
                        kullanilan_izin=int(row.get("kullanilan_izin") or 0),
                        kalan_izin=int(row.get("kalan_izin") or 14),
                        performans_puani=float(row["performans_puani"]) if row.get("performans_puani") else 0.0,
                        ortalama_gunluk_uretim=float(row["ortalama_gunluk_uretim"]) if row.get("ortalama_gunluk_uretim") else 0.0,
                        devamsizlik_gun=int(row.get("devamsizlik_gun") or 0),
                        fazla_mesai_saat=float(row.get("fazla_mesai_saat") or 0),
                        egitim_sertifikalari=row.get("egitim_sertifikalari", ""),
                        is_active=str(row.get("aktif", "1")).strip() == "1",
                    ))
            db.commit()
            print(f"[Seed] {db.query(Personnel).count()} personel yüklendi.")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Hata: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()