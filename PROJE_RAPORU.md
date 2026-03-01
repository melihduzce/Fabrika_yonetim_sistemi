# Fabrika Yönetim Sistemi – Proje Revizyon Raporu

**Tarih:** Şubat 2025  
**Kapsam:** Mock veri konumları, package.json / node_modules yapısı, genel proje durumu

---

## 1. Mock veri nerede tutuluyor?

Mock (sahte) veri şu anda **üç türde** ve **farklı dosyalarda** tutuluyor:

### 1.1 Sabit dosyalar (constants)

| Dosya | İçerik | Kullanıldığı yerler |
|-------|--------|---------------------|
| `src/constants/personelData.js` | `PERSONEL_LISTESI` – personel listesi (ad, TC, departman, maaş, izin vb.) | `MainContent.js` (başlangıç state), Personel / PersonelBilgi / PersonelEkle sayfaları |
| `src/constants/chartData.js` | `URETIM_GRAFIK_VERISI`, `DEPO_DOLULUK_VERISI` – grafik verileri | `ProductionLineChart.js`, `DepoBarChart.js` |
| `src/constants/navigation.js` | `MENU_ITEMS`, `PAGE_TITLES` – menü ve sayfa başlıkları (mock değil, yapılandırma) | `Sidebar.js`, `AppHeader.js` |

### 1.2 Sayfa içi mock (dosya başında sabit)

| Dosya | Mock sabitler | Açıklama |
|-------|----------------|----------|
| `src/pages/Dashboard.js` | `MOCK_AI_UYARILARI`, `MOCK_RISK_SEVIYESI`, `MOCK_AKSIYON_ONERILERI`, `MOCK_GECMIS_ANALIZLER` | AI uyarıları, risk seviyesi, aksiyon önerileri, geçmiş analiz logları |
| `src/pages/SiparisOlustur.js` | `MOCK_MUSTERILER`, `MOCK_URUNLER`, `MOCK_SIPARISLER` | Müşteriler, ürünler, sipariş listesi |

### 1.3 API katmanı

- `src/api/services/dashboard.js` şu an boş bir placeholder (yorum satırı). İleride backend bağlandığında kullanılacak.

**Özet:** Mock veri hem `src/constants/` hem de ilgili sayfa dosyalarının içinde (Dashboard, SiparisOlustur) dağınık durumda.

---

## 2. package.json ve node_modules – “Aynı dosyalardan çok var” durumu

### 2.1 Proje kökündeki package.json

- **Tek bir** proje `package.json` var: `fabrika-yonetim/package.json`
- İçeriği: `"name": "fabrika-yonetim"` (scope yok, yani **@fabrika-yonetim** değil)

### 2.2 node_modules içindeki package.json dosyaları

- `node_modules` içinde **binlerce** `package.json` dosyası olması **normaldir**.
- Her npm paketi (react, recharts, lucide-react, testing-library, vb.) kendi klasöründe bir `package.json` taşır.
- Bunlar **sizin projenizin** kopyaları değil; **bağımlılıkların** kendi tanım dosyalarıdır.

### 2.3 “@fabrika-yonetim/package.json” nerede?

- Projede **@fabrika-yonetim** adında bir scope veya paket **yok**.
- `package.json` ve `package-lock.json` içinde proje adı sadece **fabrika-yonetim** (tire ile) geçiyor.
- Eğer bir yerde `@fabrika-yonetim` görüyorsanız, büyük ihtimalle:
  - Başka bir proje/workspace, veya
  - IDE/arama sonucunda yanlış bir eşleşme olabilir.

### 2.4 Bu yapı sıkıntı yaratır mı?

- **Hayır.**  
- Tek kök `package.json` + her bağımlılığın kendi `package.json`’ı standart npm yapısıdır.  
- `node_modules` içindeki çok sayıda `package.json` karışıklık değil, npm’in çalışma şeklinin sonucudur.

---

## 3. Genel proje yapısı (kısa revizyon)

### 3.1 Klasör yapısı

```
fabrika-yonetim/
├── public/           # Statik dosyalar (favicon, index.html, logo)
├── src/
│   ├── api/          # API servisleri (şu an placeholder)
│   ├── charts/       # Grafik bileşenleri
│   ├── components/   # Sidebar, Layout, Login, vb.
│   ├── constants/    # personelData, chartData, navigation
│   ├── pages/        # Sayfa bileşenleri
│   ├── utils/        # theme.js
│   ├── App.js, index.js, App.css, index.css
│   └── ...
├── package.json
├── package-lock.json
└── ...
```

### 3.2 Mock veri tutarlılığı

- **Personel:** Tek kaynak (`constants/personelData.js`) → iyi.
- **Grafik:** Tek kaynak (`constants/chartData.js`) → iyi.
- **Sipariş / Dashboard:** Veri ilgili sayfa dosyasında (SiparisOlustur.js, Dashboard.js) → ileride API’ye geçerken bu mock’ların bir constants veya api/mock katmanına alınması faydalı olur.

### 3.3 Öneriler (kısa)

1. **Mock veriyi toplu yönetmek:** Sipariş ve Dashboard mock’larını ileride `src/constants/` veya `src/api/mock/` gibi tek yerde toplayabilirsiniz; API’ye geçişte değiştirmek kolaylaşır.
2. **package.json / node_modules:** Mevcut yapı normal; ek bir işlem gerekmez. `@fabrika-yonetim` kullanmıyorsanız, böyle bir klasör/ad aramaya gerek yok.
3. **.gitignore:** `node_modules` ve `build` zaten ignore’da olmalı; böylece sadece sizin tek `package.json`’ınız repo’da kalır.

---

## 4. Özet tablo

| Konu | Durum | Not |
|------|--------|-----|
| Mock veri – personel | `src/constants/personelData.js` | Merkezi, tutarlı |
| Mock veri – grafik | `src/constants/chartData.js` | Merkezi, tutarlı |
| Mock veri – sipariş / müşteri / ürün | `src/pages/SiparisOlustur.js` içinde | İleride constants veya api/mock’a taşınabilir |
| Mock veri – AI / dashboard | `src/pages/Dashboard.js` içinde | İleride constants veya api/mock’a taşınabilir |
| package.json sayısı | 1 proje + node_modules içinde her paket için 1 | Normal, sorun yok |
| @fabrika-yonetim | Projede yok | Karışıklık yok; gerek yok |

Bu rapor, mevcut kod ve klasör yapısına göre hazırlanmıştır. İsterseniz bir sonraki adımda mock veriyi tek bir katmanda toplayacak somut dosya değişikliklerini de çıkarabilirim.
