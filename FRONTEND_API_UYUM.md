# Frontend – Backend API Uyum Rehberi

Backend, frontend ile **%100 uyumlu** çalışacak şekilde ayarlandı. Frontend’in kullanması gereken path’ler ve body formatları aşağıda.

## Genel

- **Base URL:** `http://localhost:5138` (lokal) veya Render URL’iniz.
- **Tüm endpoint’ler** `[AllowAnonymous]` (token zorunlu değil).
- **CORS** tüm origin’lere açık.

---

## 1. Auth

| Metot | Path | Body / Açıklama |
|--------|------|------------------|
| POST | `/api/Auth/register` | `{ "email", "password" }` |
| POST | `/api/Auth/login` | `{ "email", "password" }` → Yanıt: `{ "Token", "Email", "Rol", "Mesaj" }` |

---

## 2. Müşteriler (Customer)

| Metot | Path | Açıklama |
|--------|------|----------|
| GET | `/api/musteriler` | Tüm müşteriler. Yanıt: `[{ "id", "isimSoyisim", "mail", "tel", "firmaIsmi" }]` |
| GET | `/api/musteriler/{id}` | Tek müşteri (id = string, örn. "M-1234") |
| POST | `/api/musteriler` | Body: `{ "id"?, "isimSoyisim", "mail", "tel", "firmaIsmi"? }` |
| PUT | `/api/musteriler/{id}` | Body: müşteri objesi |
| DELETE | `/api/musteriler/{id}` | Müşteri sil |

---

## 3. Ürünler (Product)

| Metot | Path | Açıklama |
|--------|------|----------|
| GET | `/api/products` | Liste. Yanıt: `[{ "id", "urun_kodu", "ham_madde", "gunluk_uretim", "base_cost", "current_stock", ... }]` |
| GET | `/api/products/{id}` | Tek ürün (id = int) |
| POST | `/api/products` | Body: Product (urun_kodu, ham_madde, malzeme_tipi, pres_kategorisi, gunluk_uretim, base_cost, brut_agirlik_kg, net_agirlik_kg, hurda_orani, ...) |
| PUT | `/api/products/{id}` | Body: Product |
| DELETE | `/api/products/{id}` | Ürün sil |

---

## 4. Siparişler (Order) – Frontend uyumlu

| Metot | Path | Açıklama |
|--------|------|----------|
| GET | `/api/orders` | Liste. Yanıt: `[{ "id", "product_id", "quantity", "musteri_adi", "urun_adi", "sale_price", "status", "created_at", ... }]` |
| GET | `/api/orders?status=pending` | Filtre: pending, in_production, completed, cancelled |
| GET | `/api/orders/{id}` | Tek sipariş |
| POST | `/api/orders` | **Frontend formatı:** `{ "musteri_adi", "urun_adi", "miktar" }`. Ürün, urun_adi ile (ürün kodu veya ham madde adı) bulunur. |
| POST | `/api/orders` | **Backend formatı:** `{ "productId", "quantity" }` |
| PATCH | `/api/orders/{id}/status` | Body: `{ "status": "Beklemede" | "Üretimde" | "Tamamlandı" | "İptal" }` (Türkçe/İngilizce) |
| PUT | `/api/orders/{id}` | Tüm sipariş güncelleme |
| DELETE | `/api/orders/{id}` | Sipariş sil |

---

## 5. Stok (Stock)

| Metot | Path | Açıklama |
|--------|------|----------|
| GET | `/api/stock` | Liste. Yanıt: `[{ "kod", "ad", "miktar", "miktarSayi", "kapasite", "kritik", "birimMaliyet", "birimFiyat", "durum" }]` |
| GET | `/api/stock/{id}` | Tek stok (id = stok kodu, string) |
| POST | `/api/stock` | Body: Stock (kod, ad, miktar, miktarSayi, kapasite, kritik, birimMaliyet, birimFiyat, durum) |
| PUT | `/api/stock/{id}` | id = kod (string) |
| DELETE | `/api/stock/{id}` | id = kod (string) |

---

## 6. Makine (Machine)

| Metot | Path | Açıklama |
|--------|------|----------|
| GET | `/api/Machine` veya `/api/machine` | Liste. Yanıt: `[{ "id", "productId", "machine_name", "is_used" }]` |
| POST | `/api/Machine` | Body: `{ "productId", "machine_name", "is_used" }` |
| PUT | `/api/Machine/{id}` | id = int |
| DELETE | `/api/Machine/{id}` | id = int |

---

## 7. Personel (Personnel)

| Metot | Path | Açıklama |
|--------|------|----------|
| GET | `/api/Personnel` veya `/api/personnel` | Liste. Yanıt: snake_case (ad, soyad, tcNo, telefon, departman, ise_giris_tarihi, ...) |
| POST | `/api/Personnel` | Body: Personnel (ad, soyad, tcNo, telefon, departman, ...) |
| PUT | `/api/Personnel/{id}` | id = int |
| DELETE | `/api/Personnel/{id}` | id = int |

---

## 8. Health

| Metot | Path | Yanıt |
|--------|------|--------|
| GET | `/api/health` | `{ "status": "ok", "api": "FabrikaBackend" }` |

---

## Frontend servis path özeti

- **Ürün:** `GET/POST /api/products`, `GET/PUT/DELETE /api/products/{id}`
- **Stok:** `GET/POST /api/stock`, `GET/PUT/DELETE /api/stock/{id}` (id = kod)
- **Sipariş:** `GET /api/orders`, `POST /api/orders` body: `{ musteri_adi, urun_adi, miktar }`
- **Müşteri:** `GET/POST /api/musteriler`, `GET/PUT/DELETE /api/musteriler/{id}`
- **Makine:** `GET/POST /api/Machine`, `PUT/DELETE /api/Machine/{id}`
- **Personel:** `GET/POST /api/Personnel`, `PUT/DELETE /api/Personnel/{id}`

Bu path ve body’leri kullandığınız sürece frontend ile backend uyumlu çalışır.
