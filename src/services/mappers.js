/**
 * Render API yanıtlarını frontend formatına (ve tersi) çevirir.
 * Backend path'leri: /api/Customer/*, /api/Machine/*, /api/Order/*, /api/Personnel/*, /api/Product/*, /api/Stock/*
 */

/** Backend Customer (id int, isimSoyisim, mail, tel, firmaIsmi) → Frontend (id, idKod, ad, soyad, email, telefon, tip, unvan) */
export function customerFromApi(r) {
  if (!r) return null;
  const parts = (r.isimSoyisim || '').trim().split(/\s+/);
  const ad = parts[0] || '';
  const soyad = parts.slice(1).join(' ') || '';
  const id = r.id != null ? r.id : null;
  return {
    id,
    idKod: id != null ? String(id) : '',
    ad,
    soyad,
    email: r.mail ?? null,
    telefon: r.tel ?? null,
    tip: r.firmaIsmi ? 'kurumsal' : 'bireysel',
    unvan: r.firmaIsmi ?? null,
  };
}

/** Frontend → Backend Customer (POST/PUT) */
export function customerToApi(u) {
  if (!u) return null;
  return {
    id: u.id,
    isimSoyisim: [u.ad, u.soyad].filter(Boolean).join(' ').trim() || ' ',
    mail: u.email || null,
    tel: u.telefon || null,
    firmaIsmi: u.unvan || null,
  };
}

/** Backend Machine → Frontend (id, idKod, ad, detay) */
export function machineFromApi(r) {
  if (!r) return null;
  return {
    id: r.id,
    idKod: r.id != null ? `MK-${r.id}` : '',
    ad: r.machine_name ?? '',
    detay: r.is_used != null ? (r.is_used ? 'Kullanımda' : 'Boşta') : null,
  };
}

/** Frontend → Backend Machine */
export function machineToApi(u) {
  if (!u) return null;
  return {
    id: u.id,
    productId: u.productId ?? 0,
    machine_name: u.ad || '',
    is_used: Boolean(u.is_used),
  };
}

/** Backend Personnel (snake_case) → Frontend (firstName, lastName, tcKimlikNo, ...) */
export function personnelFromApi(r) {
  if (!r) return null;
  const certStr = r.egitim_sertifikalari;
  const egitimSertifikalari = typeof certStr === 'string'
    ? certStr.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean)
    : Array.isArray(certStr) ? certStr : [];
  const iseGiris = r.ise_giris_tarihi;
  const iseGirisTarihi = iseGiris
    ? (typeof iseGiris === 'string' && iseGiris.includes('T')
        ? iseGiris.split('T')[0].split('-').reverse().join('.')
        : iseGiris)
    : null;
  return {
    id: r.id,
    firstName: r.ad ?? '',
    lastName: r.soyad ?? '',
    tcKimlikNo: r.tcNo ?? null,
    telefon: r.telefon ?? null,
    department: r.departman ?? '',
    pozisyon: r.pozisyon ?? null,
    maas: r.maas ?? null,
    yol: null,
    yemek: null,
    iseGirisTarihi,
    yillikIzinHakki: r.yillik_izin_hakki ?? 14,
    kullanilanIzin: r.kullanilan_izin ?? 0,
    fazlaMesaiSaat: r.fazla_mesai_saat ?? 0,
    performansPuani: r.performans_puani ?? null,
    ortalamaGunlukUretim: r.ortalama_gunluk_uretim ?? null,
    devamsizlikGun: r.devamsizlik_gun ?? null,
    acilDurumKisi: r.acil_durum_kisi ?? null,
    acilDurumTel: r.acil_durum_tel ?? null,
    egitimSertifikalari,
  };
}

function normalizeTcNo(v) {
  const digits = String(v ?? '').replace(/\D/g, '').slice(0, 11);
  return digits.padStart(11, '0');
}
function normalizeTelefon(v) {
  const digits = String(v ?? '').replace(/\D/g, '');
  if (digits.length >= 11) return '0' + digits.slice(-10);
  if (digits.length === 10 && digits.startsWith('5')) return '0' + digits;
  return digits ? '0' + digits.slice(-10).padStart(10, '0') : '05000000000';
}

/** Frontend → Backend Personnel */
export function personnelToApi(u) {
  if (!u) return null;
  const certStr = Array.isArray(u.egitimSertifikalari)
    ? u.egitimSertifikalari.join(', ')
    : '';
  let iseGiris = u.iseGirisTarihi;
  if (iseGiris && typeof iseGiris === 'string') {
    if (iseGiris.includes('.')) {
      const [d, m, y] = iseGiris.split('.');
      iseGiris = `${y}-${(m || '').padStart(2, '0')}-${(d || '').padStart(2, '0')}T00:00:00`;
    } else if (/^\d{4}-\d{2}-\d{2}/.test(iseGiris)) {
      iseGiris = iseGiris.includes('T') ? iseGiris : iseGiris + 'T00:00:00';
    }
  }
  const tel = normalizeTelefon(u.telefon);
  const acilTel = (u.acilDurumTel && String(u.acilDurumTel).replace(/\D/g, '').length >= 10)
    ? normalizeTelefon(u.acilDurumTel)
    : tel;
  return {
    ad: (String(u.firstName ?? '').trim() || ' ').slice(0, 200),
    soyad: (String(u.lastName ?? '').trim() || ' ').slice(0, 200),
    tcNo: normalizeTcNo(u.tcKimlikNo),
    telefon: tel,
    departman: u.department || null,
    pozisyon: u.pozisyon || null,
    maas: u.maas ?? null,
    ise_giris_tarihi: iseGiris || null,
    yillik_izin_hakki: u.yillikIzinHakki ?? 14,
    kullanilan_izin: u.kullanilanIzin ?? 0,
    fazla_mesai_saat: u.fazlaMesaiSaat ?? 0,
    performans_puani: u.performansPuani ?? null,
    ortalama_gunluk_uretim: u.ortalamaGunlukUretim ?? null,
    devamsizlik_gun: u.devamsizlikGun ?? null,
    egitim_sertifikalari: certStr || null,
    acil_durum_kisi: (u.acilDurumKisi && String(u.acilDurumKisi).trim()) ? String(u.acilDurumKisi).trim() : null,
    acil_durum_tel: acilTel,
    aktif: true,
  };
}

/** Backend Order (Orders: musteri_adi, urun_adi, miktar, status, created_at) → Frontend */
export function orderFromApi(r) {
  if (!r) return null;
  const created = r.created_at ? (r.created_at.split('T')[0] || r.created_at) : '';
  return {
    id: r.id,
    no: r.id != null ? `SIP-${r.id}` : '',
    musteriId: null,
    musteriAdi: r.musteri_adi ?? null,
    urunAdi: r.urun_adi ?? null,
    urunId: r.product_id ?? null,
    miktar: r.miktar ?? r.quantity ?? 0,
    birimFiyat: r.sale_price ?? 0,
    tarih: created,
    durum: r.status ?? 'Beklemede',
  };
}

/** Frontend → Backend Order (PUT) */
export function orderToApi(u) {
  if (!u) return null;
  return {
    musteri_adi: u.musteriAdi ?? null,
    urun_adi: u.urunAdi ?? null,
    miktar: u.miktar ?? 0,
    status: u.durum ?? null,
  };
}

/** Backend Product (id, urun_kodu, ham_madde, gunluk_uretim, base_cost, ...) → Frontend */
export function productFromApi(r) {
  if (!r) return null;
  return {
    id: r.id != null ? Number(r.id) : null,
    ad: r.urun_adi || r.urun_kodu || r.ham_madde || `Ürün ${r.id}`,
    birim: 'Adet',
    birimFiyat: r.base_cost ?? 0,
    birimMaliyet: r.base_cost ?? 0,
    birimSure: 0,
    gunlukUretim: r.gunluk_uretim ?? 0,
    urun_kodu: r.urun_kodu ?? '',
    ham_madde: r.ham_madde ?? '',
    malzeme_tipi: r.malzeme_tipi ?? '',
    pres_kategorisi: r.pres_kategorisi ?? '',
    brut_agirlik_kg: r.brut_agirlik_kg ?? 0,
    net_agirlik_kg: r.net_agirlik_kg ?? 0,
    hurda_orani: r.hurda_orani ?? 0,
    malzeme_verimi: r.malzeme_verimi ?? 0,
    calisan_sayisi: r.calisan_sayisi ?? 0,
    has_heat_treatment: r.has_heat_treatment ?? false,
    current_stock: r.current_stock ?? 0,
    machines: r.machines ?? [],
  };
}

/** Frontend → Backend Product (POST/PUT) */
export function productToApi(u) {
  if (!u) return null;
  return {
    id: u.id,
    urun_kodu: u.urun_kodu ?? u.ad ?? '',
    ham_madde: u.ham_madde ?? u.ad ?? '',
    malzeme_tipi: u.malzeme_tipi ?? '',
    pres_kategorisi: u.pres_kategorisi ?? '',
    gunluk_uretim: u.gunlukUretim ?? u.gunluk_uretim ?? 0,
    base_cost: u.base_cost ?? u.birimFiyat ?? u.birimMaliyet ?? 0,
    brut_agirlik_kg: u.brut_agirlik_kg ?? 0,
    net_agirlik_kg: u.net_agirlik_kg ?? 0,
    hurda_orani: u.hurda_orani ?? 0,
    malzeme_verimi: u.malzeme_verimi ?? 0,
    calisan_sayisi: u.calisan_sayisi ?? 0,
    has_heat_treatment: u.has_heat_treatment ?? false,
    current_stock: u.current_stock ?? 0,
  };
}

/** Ürün (productFromApi çıktısı) → Depo tablosu satır formatı (brüt/net ağırlık, hurda oranı, miktar, maliyet vb.) */
export function productToStokRow(p) {
  if (!p) return null;
  const miktarSayi = p.current_stock ?? 0;
  const kritik = 100;
  const durum = miktarSayi < kritik ? 'kritik' : 'yeterli';
  return {
    id: p.id,
    kod: p.urun_kodu ?? p.ad ?? '',
    ad: p.ad ?? p.ham_madde ?? '',
    brutAgirlik: p.brut_agirlik_kg,
    netAgirlik: p.net_agirlik_kg,
    hurdaOrani: p.hurda_orani,
    kapasite: p.gunlukUretim ?? 0,
    kritik,
    miktar: String(miktarSayi),
    miktarSayi,
    birimMaliyet: p.birimMaliyet ?? p.base_cost ?? 0,
    birimFiyat: p.birimFiyat ?? p.base_cost ?? 0,
    durum,
  };
}

/** Backend Stock (kod, ad, miktarSayi, kapasite, ...) → Frontend */
export function stockFromApi(r) {
  if (!r) return null;
  const miktarSayi = r.miktarSayi ?? 0;
  const kod = r.kod ?? r.stokKodu ?? '';
  return {
    id: r.id ?? kod,
    kod,
    ad: r.ad ?? '',
    miktar: `${miktarSayi}`,
    miktarSayi,
    kapasite: r.kapasite ?? 0,
    kritik: r.kritik ?? 0,
    birimMaliyet: Number(r.birimMaliyet) ?? 0,
    birimFiyat: Number(r.birimFiyat) ?? 0,
    durum: r.durum ?? 'yeterli',
  };
}

/** Frontend → Backend Stock */
export function stockToApi(u) {
  if (!u) return null;
  return {
    id: u.id,
    stokKodu: u.kod ?? u.stokKodu ?? '',
    ad: u.ad ?? '',
    miktarSayi: Number(u.miktarSayi) || 0,
    kapasite: Number(u.kapasite) || 0,
    kritik: Number(u.kritik) || 0,
    birimMaliyet: Number(u.birimMaliyet) || 0,
    birimFiyat: Number(u.birimFiyat) || 0,
    durum: u.durum ?? null,
  };
}

/** Müşteri → Sipariş dropdown */
export function customerToDropdown(r) {
  if (!r) return null;
  const full = customerFromApi(r);
  return {
    id: full.idKod ?? full.id,
    unvan: full.unvan || `${full.ad} ${full.soyad}`.trim(),
    yetkili: `${full.ad} ${full.soyad}`.trim(),
    tel: full.telefon || '',
  };
}
