import React from 'react';
import { Sparkles, AlertTriangle, ListChecks, History } from 'lucide-react';
import { ProductionLineChart } from 'charts';
import { getThemeClasses } from 'utils/theme';

const MOCK_AI_UYARILARI = [
  'Çelik levha stok seviyesi kritik bölgeye yaklaşıyor.',
  'Üretim hattı 3 için planlı bakım önerilir.',
];

const MOCK_RISK_SEVIYESI = 'orta'; // 'düşük' | 'orta' | 'yüksek'

const MOCK_AKSIYON_ONERILERI = [
  "Stok Depo'dan çelik levha siparişi verin.",
  'Bakım planı oluşturun.',
  'Enerji tüketimini gözden geçirin.',
];

const MOCK_GECMIS_ANALIZLER = [
  { tarih: '26.02.2025 14:30', mesaj: 'Verimlilik analizi tamamlandı.' },
  { tarih: '26.02.2025 09:15', mesaj: 'Stok tahmin modeli güncellendi.' },
  { tarih: '25.02.2025 16:45', mesaj: 'Üretim kapasite analizi çalıştırıldı.' },
  { tarih: '25.02.2025 11:00', mesaj: 'Risk değerlendirmesi yapıldı.' },
];

const riskBadgeClass = (risk, isDark) => {
  const base = 'text-xs font-bold px-3 py-1 rounded-full border';
  if (risk === 'düşük') return `${base} ${isDark ? 'bg-green-900/30 text-green-300 border-green-800' : 'bg-green-100 text-green-800 border-green-200'}`;
  if (risk === 'yüksek') return `${base} ${isDark ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-100 text-red-800 border-red-200'}`;
  return `${base} ${isDark ? 'bg-amber-900/30 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-200'}`;
};

const Dashboard = ({ isDark }) => {
  const { bgCard, textTitle, textSub } = getThemeClasses(isDark);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${bgCard}`}>
          <h3 className={`text-sm font-medium ${textSub}`}>Günlük Üretim</h3>
          <p className={`text-3xl font-bold mt-2 ${textTitle}`}>1,240</p>
          <span className="text-green-500 text-xs font-bold">▲ Hedefin Üzerinde</span>
        </div>
        <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${bgCard}`}>
          <h3 className={`text-sm font-medium ${textSub}`}>Aktif Makine</h3>
          <p className={`text-3xl font-bold mt-2 ${textTitle}`}>5</p>
          <span className="text-blue-500 text-xs font-bold">Makine kayıtlı</span>
        </div>
        <div
          className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-purple-900/50' : 'bg-white border-purple-200'
          }`}
        >
          <h3 className="text-purple-500 text-sm font-medium">AI Tahmini</h3>
          <p className={`text-xl font-bold mt-2 ${textTitle}`}>Verimlilik</p>
          <span className="text-purple-500 text-xs font-bold">Tahmin modelleri aktif</span>
        </div>
      </div>

      <div className={`p-8 rounded-xl shadow-sm border transition-colors duration-300 min-h-[400px] ${bgCard}`}>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className={`font-bold text-lg ${textTitle}`}>Canlı Üretim Grafiği (Temsili Veri)</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {}}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                isDark
                  ? 'border-purple-500/60 text-purple-400 hover:bg-purple-500/20'
                  : 'border-purple-400 text-purple-700 hover:bg-purple-50'
              }`}
              title="Üretim AI analiz modülü bağlanacak"
            >
              <Sparkles size={18} /> AI Analiz
            </button>
            <div className={`flex gap-4 text-xs font-medium ${textSub}`}>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded-full" /> Üretim
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full opacity-50" /> Hedef
              </span>
            </div>
          </div>
        </div>
        <ProductionLineChart isDark={isDark} />
      </div>

      {/* Alt panel: AI Uyarıları */}
      <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${bgCard}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${textTitle}`}>
              <AlertTriangle size={22} className="text-amber-500" /> AI Uyarıları
            </h2>
            <span className={riskBadgeClass(MOCK_RISK_SEVIYESI, isDark)}>
              {MOCK_RISK_SEVIYESI === 'düşük' ? 'Düşük risk' : MOCK_RISK_SEVIYESI === 'yüksek' ? 'Yüksek risk' : 'Orta risk'}
            </span>
          </div>
        </div>
        <div className={`space-y-2 mb-4 ${textSub}`}>
          {MOCK_AI_UYARILARI.map((uyari, i) => (
            <p key={i} className="text-sm flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span> {uyari}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${textTitle}`}>
              <ListChecks size={16} /> Aksiyon önerileri
            </h3>
            <ul className={`text-sm space-y-1.5 ${textSub}`}>
              {MOCK_AKSIYON_ONERILERI.map((aksiyon, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`} />
                  {aksiyon}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${textTitle}`}>
              <History size={16} /> Geçmiş analizler
            </h3>
            <ul className={`text-sm space-y-2 max-h-32 overflow-y-auto ${textSub}`}>
              {MOCK_GECMIS_ANALIZLER.map((log, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="flex-shrink-0 text-xs font-mono opacity-80">{log.tarih}</span>
                  <span>{log.mesaj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
