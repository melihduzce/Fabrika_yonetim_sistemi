# AI Destekli Üretim Yönetim Sistemi

> FastAPI + SQLite + Claude AI ile geliştirilmiş fabrika yönetim backend'i.  
> Kapasite analizi, sipariş yönetimi ve event-driven AI agent içerir.

---

## Özellikler

- **68 ürün** — malzeme tipi, pres kategorisi, makine ilişkileri ile tam seed verisi
- **Makine yük analizi** — 8 makine için kapasite kullanım hesabı
- **Sipariş yönetimi** — otomatik üretim süresi, maliyet ve marj hesabı
- **AI Agent** — kural motoru + LLM hibrit, provider-agnostic (Anthropic, OpenAI, Gemini, Groq)
- **Event-driven tetikleyici** — sipariş oluşturunca kapasite eşiğini kontrol eder, gerekirse AI'ı çalıştırır

---

## Kurulum

```bash
# Bağımlılıkları kur
pip install -r requirements.txt

# (Opsiyonel) AI için API key
$env:ANTHROPIC_API_KEY = "sk-ant-..."   # Windows
export ANTHROPIC_API_KEY="sk-ant-..."   # Linux/Mac

# Çalıştır — ilk açılışta DB + seed otomatik oluşur
uvicorn main:app --reload
```

Swagger UI: **http://localhost:8000/docs**

---

## Proje Yapısı

```
F_yonetim_sistemi/
├── main.py                  # Uygulama girişi, seed fonksiyonu
├── models.py                # SQLAlchemy modelleri
├── schemas.py               # Pydantic şemaları
├── database.py              # DB bağlantısı
├── config.py                # Ortam değişkenleri
├── routers/
│   ├── products.py
│   ├── orders.py
│   ├── capacity.py
│   ├── personnel.py
│   ├── ai.py
│   └── stock.py
├── services/
│   ├── ai_agent.py          # LLM adapter + analiz motoru
│   ├── capacity_service.py  # Kapasite hesapları
│   ├── cost_service.py      # Maliyet hesapları
│   └── event_trigger.py     # Event-driven tetikleyici
├── urunler_temiz.csv        # Ürün + makine seed verisi
└── personel.csv             # Personel seed verisi
```

---

## API Özeti

| Grup | Prefix | Açıklama |
|------|--------|----------|
| Ürünler | `/api/products` | CRUD + makine ilişkileri |
| Siparişler | `/api/orders` | Oluşturma, durum güncelleme |
| Kapasite | `/api/capacity` | Fabrika geneli doluluk |
| Personel | `/api/personnel` | CRUD |
| AI Agent | `/api/ai` | Analiz, öneri, serbest soru |
| Stok | `/api/stock` | Hammadde takibi |

---

## AI Agent

API key olmadan da çalışır — kural motoru LLM'e bağımlı değildir.

```
POST /api/ai/analyze          → Manuel risk analizi
POST /api/ai/analyze/multi    → Çoklu sipariş önceliklendirme
GET  /api/ai/capacity/machines → Makine yük özeti
POST /api/ai/ask              → Serbest soru
GET  /api/ai/status           → Servis durumu
```

LLM provider seçimi `config.py` içindeki `LLM_PROVIDER` değişkeniyle yapılır:  
`anthropic` | `openai` | `gemini` | `groq` | `mock`

---

## Veri Modeli Notları

- `net_daily_capacity` ve `monthly_capacity` → veritabanı kolonu değil, `@property` ile hesaplanır
- `material_cost_per_kg` ve `labor_cost_per_hour` → şu an `0`, fiyat modülü eklenince doldurulacak
- Personel `ad`/`soyad` alanları CSV'de boş — `personel_id` (P001...) ile çalışılabilir
- DB sıfırlama: `factory.db` dosyasını sil, uvicorn yeniden başlat

---

## DB Sıfırlama

```bash
# Windows
del factory.db

# Linux/Mac
rm factory.db

uvicorn main:app --reload
# → [Seed] 68 ürün yüklendi.
# → [Seed] 8 personel yüklendi.
```

---

## Frontend Rehberi

`frontend_rehber.html` dosyasını tarayıcıda aç — tüm endpoint'ler, request/response örnekleri ve hazır JS kod parçaları içerir.
