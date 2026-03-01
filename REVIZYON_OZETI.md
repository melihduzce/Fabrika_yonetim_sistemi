# Kod Revizyonu Özeti (API Geçişine Hazırlık)

## Yapılan Değişiklikler

### 1. Departman / pozisyon tek yerde toplandı
- **Yeni dosya:** `src/constants/departmanPozisyon.js`
  - `DEPARTMAN_OPTIONS`, `DEPARTMAN_FILTRE_OPTIONS`, `POZISYON_BY_DEPARTMAN` burada.
  - API bağlandığında sadece bu dosyada değişiklik yaparak müşteri/pozisyon listeleri API’den alınabilir.
- **Personel.js:** Yerel sabitler kaldırıldı, `DEPARTMAN_FILTRE_OPTIONS` import ediliyor.
- **PersonelEkle.js:** Yerel sabitler kaldırıldı, `DEPARTMAN_OPTIONS` ve `POZISYON_BY_DEPARTMAN` import ediliyor.

### 2. Kullanılmayan kod kaldırıldı
- **PlaceholderPage.js:** Sadece `ai` sekmesi için kullanıldığı için `personel` config’i ve `Users` ikonu kaldırıldı. Açıklama metni API’ye göre güncellendi.
- **AppHeader.js:** Kullanılmayan default `userName = 'Admin: Berdan Dağ'` kaldırıldı; `userName` artık sadece prop (App’ten geliyor). `userName ?? ''` ile güvenli gösterim eklendi.

### 3. API servis dosyası
- **api/services/dashboard.js:** `export default {}` eklendi; modül geçerli. Backend bağlandığında burada fonksiyonlar tanımlanacak.

## Silinmeyen / Korunan Yapılar (API için)

- **Mock veriler** (personelData, chartData, SiparisOlustur/Dashboard mock’ları): API’ye geçerken tek tek bu dosyalar/sabitler değiştirilecek; şimdilik kaldı.
- **Boş onClick’ler** (Stok “AI Analiz”, Dashboard “AI Analiz”): API bağlanınca doldurulacak; butonlar bırakıldı.
- **Form submit’ler** (SiparisOlustur, UrunEkle, MakineEkle): Şu an sadece `onBack()` veya `alert`; API bağlanınca POST çağrıları eklenecek.

## Dosya Değişiklik Listesi

| Dosya | Değişiklik |
|-------|------------|
| `src/constants/departmanPozisyon.js` | **Yeni** – departman/pozisyon sabitleri |
| `src/pages/Personel.js` | Yerel sabitler kaldırıldı, import eklendi |
| `src/pages/PersonelEkle.js` | Yerel sabitler kaldırıldı, import eklendi |
| `src/pages/PlaceholderPage.js` | Kullanılmayan `personel` config ve `Users` import kaldırıldı |
| `src/components/Layout/AppHeader.js` | Gereksiz default userName kaldırıldı, `?? ''` eklendi |
| `src/api/services/dashboard.js` | `export default {}` eklendi |

## API Bağlarken Öncelikli Noktalar

1. **Personel:** `MainContent` içinde liste API’den yüklenecek; ekleme/silme için `api/services` (örn. `personel.js`) eklenip POST/DELETE çağrılacak.
2. **Sipariş:** Müşteri/ürün/sipariş listeleri API’den; sipariş oluşturma POST ile.
3. **Grafikler:** Dashboard’da `chartData` API’den alınıp ProductionLineChart ve DepoBarChart’a prop olarak verilecek.
4. **Departman/pozisyon:** İsterseniz `constants/departmanPozisyon.js` içinde sabitler yerine API’den dönen listeler kullanılacak.

Bu revizyonla tekrarlar azaltıldı, kullanılmayan kod silindi ve API geçişi için tek temas noktaları netleştirildi.
