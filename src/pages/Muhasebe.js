import React, { useState, useMemo } from 'react';
import { Sparkles, TrendingDown, TrendingUp, Pencil, RefreshCw } from 'lucide-react';
import { getThemeClasses } from 'utils/theme';
import { MOCK_SIPARISLER, MOCK_MUSTERILER } from 'constants/siparisData';

const AY_ADLARI = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/** Kelime başlarını büyük yapar */
const toTitleCase = (str) =>
  (str || '').split(/\s+/).filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || str || '';

/** Sipariş listesinden aylık satış toplamları ve aydaki müşteri bazlı tutarları hesaplar (tarih: DD.MM.YYYY) */
const aylikSatislarFromSiparisler = (siparisler, musteriler) => {
  const byMonth = {};
  siparisler.forEach((s) => {
    const tutar = s.miktar * (s.birimFiyat ?? 0);
    const [, ay, yil] = (s.tarih || '').split('.');
    if (!ay || !yil) return;
    const key = `${ay}.${yil}`;
    if (!byMonth[key]) byMonth[key] = { ay: parseInt(ay, 10) - 1, yil, toplam: 0, byMusteri: {} };
    byMonth[key].toplam += tutar;
    byMonth[key].byMusteri[s.musteriId] = (byMonth[key].byMusteri[s.musteriId] || 0) + tutar;
  });
  const musteriMap = (musteriler || []).reduce((acc, m) => ({ ...acc, [m.id]: m.unvan }), {});
  return Object.entries(byMonth)
    .map(([key, v]) => ({
      aciklama: `${AY_ADLARI[v.ay]} ${v.yil} satışları`,
      tutar: v.toplam,
      yil: parseInt(v.yil, 10),
      ay: v.ay,
      musteriDetay: Object.entries(v.byMusteri).map(([id, t]) => ({ unvan: musteriMap[id] || id, tutar: t })),
    }))
    .sort((a, b) => (a.yil !== b.yil ? a.yil - b.yil : a.ay - b.ay));
};

const MOCK_TAHMINI_AYLIK = {
  beklenenUretim: '28.500 birim',
  tahminiGelir: 445000,
  aciklama: 'Beklenen aylık üretime göre tahmini satış geliri',
};

// AI analiz mock (entegre edilince doldurulacak)
const MOCK_AI_ANALIZ = [
  'Sabit giderler toplamı aylık bütçenin %42\'si; kira ve işçilik en yüksek kalemler.',
  'Değişken giderlerde hammadde maliyeti öne çıkıyor; tedarikçi görüşmeleri önerilir.',
  'Gelir–gider farkı pozitif; mart tahmini ile nakit akışı rahat görünüyor.',
  'Hurda kaybı oranı hedef aralıkta; iyileştirme için süreç gözden geçirilebilir.',
];

const Muhasebe = ({ isDark, giderList = [], onRefresh, onMuhasebeDuzenle }) => {
  const { bgCard, textTitle, textSub, borderCol } = getThemeClasses(isDark);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const sabitGiderler = useMemo(() => giderList.filter((g) => g.tip === 'sabit'), [giderList]);
  const degiskenGiderler = useMemo(() => giderList.filter((g) => g.tip === 'degisken'), [giderList]);

  const toplamSabit = sabitGiderler.reduce((s, g) => s + g.tutar, 0);
  const toplamDegisken = degiskenGiderler.reduce((s, g) => s + g.tutar, 0);
  const toplamGider = toplamSabit + toplamDegisken;

  const satislar = useMemo(() => aylikSatislarFromSiparisler(MOCK_SIPARISLER, MOCK_MUSTERILER), []);
  const ortalamaGelir = satislar.length
    ? Math.round(satislar.reduce((s, x) => s + x.tutar, 0) / satislar.length)
    : 0;
  const netKar = ortalamaGelir - toplamGider;

  const formatTL = (n) => (n != null ? n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end items-center gap-2">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            title="Gider listesini yenile"
          >
            <RefreshCw size={18} /> Yenile
          </button>
        )}
        {onMuhasebeDuzenle && (
          <button
            type="button"
            onClick={onMuhasebeDuzenle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Pencil size={18} /> Düzenle
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowAiPanel((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            showAiPanel
              ? isDark
                ? 'bg-purple-500/30 border-purple-500/60 text-purple-300'
                : 'bg-purple-100 border-purple-400 text-purple-800'
              : isDark
                ? 'border-purple-500/60 text-purple-400 hover:bg-purple-500/20'
                : 'border-purple-400 text-purple-700 hover:bg-purple-50'
          }`}
          title="Muhasebe için AI analizi"
        >
          <Sparkles size={18} /> AI Analiz
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol: Giderler */}
        <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${bgCard}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textTitle}`}>
            <TrendingDown className="text-red-500" size={22} /> Giderler
          </h2>

          <div className="space-y-4">
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${textSub}`}>{toTitleCase('Sabit aylık giderler')}</h3>
            <div className="space-y-2">
              {sabitGiderler.map((g) => (
                <div
                  key={g.id}
                  className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <span className={`font-medium ${textTitle}`}>{g.kalem}</span>
                  <span className={`font-semibold tabular-nums ${textTitle}`}>{formatTL(g.tutar)} ₺</span>
                </div>
              ))}
              <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${borderCol} ${isDark ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
                <span className={`font-semibold ${textTitle}`}>{toTitleCase('Toplam sabit')}</span>
                <span className={`font-bold tabular-nums ${textTitle}`}>{formatTL(toplamSabit)} ₺</span>
              </div>
            </div>

            <h3 className={`text-sm font-semibold uppercase tracking-wider mt-4 ${textSub}`}>{toTitleCase('Değişken giderler (üretim)')}</h3>
            <div className="space-y-2">
              {degiskenGiderler.map((g) => (
                <div
                  key={g.id}
                  className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <span className={`font-medium ${textTitle}`}>{g.kalem}</span>
                  <span className={`font-semibold tabular-nums ${textTitle}`}>{formatTL(g.tutar)} ₺</span>
                </div>
              ))}
              <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${borderCol} ${isDark ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
                <span className={`font-semibold ${textTitle}`}>{toTitleCase('Toplam değişken')}</span>
                <span className={`font-bold tabular-nums ${textTitle}`}>{formatTL(toplamDegisken)} ₺</span>
              </div>
            </div>

            <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <span className={`font-bold ${textTitle}`}>{toTitleCase('Toplam gider (aylık)')}</span>
              <span className="font-bold text-red-600 dark:text-red-400 tabular-nums">{formatTL(toplamGider)} ₺</span>
            </div>
          </div>
        </div>

        {/* Orta: Gelirler */}
        <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${bgCard}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textTitle}`}>
            <TrendingUp className="text-green-500" size={22} /> Gelirler
          </h2>

          <div className="space-y-4">
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${textSub}`}>{toTitleCase('Müşterilere yapılan satışlar')}</h3>
            <div className="space-y-2">
              {satislar.length === 0 ? (
                <div className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'} ${textSub}`}>
                  {toTitleCase('Henüz sipariş yok')}
                </div>
              ) : (
                satislar.map((s) => (
                  <div key={s.aciklama} className="space-y-2">
                    <div
                      className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <span className={`font-medium ${textTitle}`}>{toTitleCase(s.aciklama)}</span>
                      <span className={`font-semibold tabular-nums ${textTitle}`}>{formatTL(s.tutar)} ₺</span>
                    </div>
                    {s.musteriDetay && s.musteriDetay.length > 0 && (
                      <div className="space-y-2 pl-2 border-l-2 border-gray-400/50">
                        {s.musteriDetay.map((m) => (
                          <div
                            key={m.unvan}
                            className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                          >
                            <span className={`font-medium ${textTitle}`}>{m.unvan}</span>
                            <span className={`font-semibold tabular-nums ${textTitle}`}>{formatTL(m.tutar)} ₺</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${borderCol} ${isDark ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
                <span className={`font-semibold ${textTitle}`}>{toTitleCase('Ortalama aylık')}</span>
                <span className={`font-bold tabular-nums ${textTitle}`}>{formatTL(ortalamaGelir)} ₺</span>
              </div>
            </div>

            <h3 className={`text-sm font-semibold uppercase tracking-wider mt-4 ${textSub}`}>{toTitleCase('Tahmini (beklenen üretim)')}</h3>
            <div className={`flex flex-col gap-2 w-full px-4 py-4 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-sm ${textSub}`}>{toTitleCase(MOCK_TAHMINI_AYLIK.aciklama)}</p>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSub}`}>{toTitleCase('Beklenen üretim')}</span>
                <span className={`font-semibold ${textTitle}`}>{MOCK_TAHMINI_AYLIK.beklenenUretim}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-gray-600/50">
                <span className={`font-semibold ${textTitle}`}>{toTitleCase('Tahmini gelir')}</span>
                <span className="font-bold text-green-600 dark:text-green-400 tabular-nums">{formatTL(MOCK_TAHMINI_AYLIK.tahminiGelir)} ₺</span>
              </div>
            </div>

            <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
              <span className={`font-bold ${textTitle}`}>{toTitleCase('Ortalama gelir (aylık)')}</span>
              <span className="font-bold text-green-600 dark:text-green-400 tabular-nums">{formatTL(ortalamaGelir)} ₺</span>
            </div>

            <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${netKar >= 0 ? (isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200') : (isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200')}`}>
              <span className={`font-bold ${textTitle}`}>{toTitleCase('Net kar (aylık)')}</span>
              <span className={`font-bold tabular-nums ${netKar >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatTL(netKar)} ₺
              </span>
            </div>
          </div>
        </div>

      </div>

      {showAiPanel && (
        <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${bgCard}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textTitle}`}>
            <Sparkles className="text-purple-500" size={22} /> AI Analiz
          </h2>
          <p className={`text-xs ${textSub} mb-4`}>{toTitleCase('Muhasebe modülü bağlandığında burada analiz sonuçları gösterilecek.')}</p>
          <ul className="space-y-3">
            {MOCK_AI_ANALIZ.map((m, i) => (
              <li key={i} className={`flex gap-2 text-sm ${textSub}`}>
                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  {i + 1}
                </span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Muhasebe;
