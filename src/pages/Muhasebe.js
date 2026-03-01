import React, { useState } from 'react';
import { Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { getThemeClasses } from 'utils/theme';

// Sabit aylık giderler (₺/ay)
const MOCK_SABIT_GIDERLER = [
  { kalem: 'Elektrik', tutar: 18500 },
  { kalem: 'İşçilik', tutar: 125000 },
  { kalem: 'SGK', tutar: 32000 },
  { kalem: 'Yol', tutar: 8400 },
  { kalem: 'Yemek', tutar: 15600 },
  { kalem: 'Bakım', tutar: 12000 },
  { kalem: 'Nakliye', tutar: 22000 },
  { kalem: 'Kira', tutar: 45000 },
];

// Değişken giderler (üretim maliyetleri, ₺/ay)
const MOCK_DEGISKEN_GIDERLER = [
  { kalem: 'Hammadde alımı', tutar: 285000 },
  { kalem: 'Hurda kaybı', tutar: 14200 },
];

// Gelirler: müşterilere satışlar + tahmini (beklenen üretime göre)
const MOCK_SATISLAR = [
  { aciklama: 'Ocak satışları', tutar: 420000 },
  { aciklama: 'Şubat satışları', tutar: 398500 },
  { aciklama: 'Mart (beklenen)', tutar: 435000 },
];

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

const Muhasebe = ({ isDark }) => {
  const { bgCard, textTitle, textSub, borderCol } = getThemeClasses(isDark);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const toplamSabit = MOCK_SABIT_GIDERLER.reduce((s, g) => s + g.tutar, 0);
  const toplamDegisken = MOCK_DEGISKEN_GIDERLER.reduce((s, g) => s + g.tutar, 0);
  const toplamGider = toplamSabit + toplamDegisken;
  const ortalamaGelir = MOCK_SATISLAR.length
    ? Math.round(MOCK_SATISLAR.reduce((s, x) => s + x.tutar, 0) / MOCK_SATISLAR.length)
    : 0;

  const formatTL = (n) => (n != null ? n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end">
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
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${textSub}`}>Sabit aylık giderler</h3>
            <div className="space-y-2">
              {MOCK_SABIT_GIDERLER.map((g) => (
                <div
                  key={g.kalem}
                  className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <span className={`font-medium ${textTitle}`}>{g.kalem}</span>
                  <span className={`font-semibold tabular-nums ${textTitle}`}>{formatTL(g.tutar)} ₺</span>
                </div>
              ))}
              <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${borderCol} ${isDark ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
                <span className={`font-semibold ${textTitle}`}>Toplam sabit</span>
                <span className={`font-bold tabular-nums ${textTitle}`}>{formatTL(toplamSabit)} ₺</span>
              </div>
            </div>

            <h3 className={`text-sm font-semibold uppercase tracking-wider mt-4 ${textSub}`}>Değişken giderler (üretim)</h3>
            <div className="space-y-2">
              {MOCK_DEGISKEN_GIDERLER.map((g) => (
                <div
                  key={g.kalem}
                  className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <span className={`font-medium ${textTitle}`}>{g.kalem}</span>
                  <span className={`font-semibold tabular-nums ${textTitle}`}>{formatTL(g.tutar)} ₺</span>
                </div>
              ))}
              <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${borderCol} ${isDark ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
                <span className={`font-semibold ${textTitle}`}>Toplam değişken</span>
                <span className={`font-bold tabular-nums ${textTitle}`}>{formatTL(toplamDegisken)} ₺</span>
              </div>
            </div>

            <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <span className={`font-bold ${textTitle}`}>Toplam gider (aylık)</span>
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
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${textSub}`}>Müşterilere yapılan satışlar</h3>
            <div className="space-y-2">
              {MOCK_SATISLAR.map((s) => (
                <div
                  key={s.aciklama}
                  className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <span className={`font-medium ${textTitle}`}>{s.aciklama}</span>
                  <span className={`font-semibold tabular-nums ${textTitle}`}>{formatTL(s.tutar)} ₺</span>
                </div>
              ))}
              <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${borderCol} ${isDark ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
                <span className={`font-semibold ${textTitle}`}>Ortalama aylık</span>
                <span className={`font-bold tabular-nums ${textTitle}`}>{formatTL(ortalamaGelir)} ₺</span>
              </div>
            </div>

            <h3 className={`text-sm font-semibold uppercase tracking-wider mt-4 ${textSub}`}>Tahmini (beklenen üretim)</h3>
            <div className={`flex flex-col gap-2 w-full px-4 py-4 rounded-lg border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-sm ${textSub}`}>{MOCK_TAHMINI_AYLIK.aciklama}</p>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSub}`}>Beklenen üretim</span>
                <span className={`font-semibold ${textTitle}`}>{MOCK_TAHMINI_AYLIK.beklenenUretim}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-gray-600/50">
                <span className={`font-semibold ${textTitle}`}>Tahmini gelir</span>
                <span className="font-bold text-green-600 dark:text-green-400 tabular-nums">{formatTL(MOCK_TAHMINI_AYLIK.tahminiGelir)} ₺</span>
              </div>
            </div>

            <div className={`flex justify-between items-center w-full px-4 py-3 rounded-lg border-2 ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
              <span className={`font-bold ${textTitle}`}>Ort. gelir (aylık)</span>
              <span className="font-bold text-green-600 dark:text-green-400 tabular-nums">{formatTL(ortalamaGelir)} ₺</span>
            </div>
          </div>
        </div>

      </div>

      {showAiPanel && (
        <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${bgCard}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textTitle}`}>
            <Sparkles className="text-purple-500" size={22} /> AI Analiz
          </h2>
          <p className={`text-xs ${textSub} mb-4`}>Muhasebe modülü bağlandığında burada analiz sonuçları gösterilecek.</p>
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
