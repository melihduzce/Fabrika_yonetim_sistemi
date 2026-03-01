import React from 'react';
import { Activity, Plus } from 'lucide-react';
import { getThemeClasses } from 'utils/theme';

const MAKINE_LISTESI = [
  { id: 1, ad: 'CNC Pres - 01', detay: 'Sıcaklık: 85°C' },
  { id: 2, ad: 'Montaj Hattı - 03', detay: 'Sıcaklık: 72°C' },
  { id: 3, ad: 'Paketleme - B2', detay: 'Sıcaklık: 62°C' },
];

const Uretim = ({ isDark, onMakineEkle }) => {
  const { bgCard, textTitle, textSub, borderCol } = getThemeClasses(isDark);

  return (
    <div className={`p-6 rounded-xl shadow-sm border w-full transition-colors duration-300 ${bgCard}`}>
      <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-200 dark:border-gray-700">
        <h2 className={`text-xl font-bold ${textTitle}`}>Makine Takibi</h2>
        <button
          type="button"
          onClick={onMakineEkle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} /> Makine Ekle
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MAKINE_LISTESI.map((makine) => (
          <div
            key={makine.id}
            className={`flex items-center gap-4 p-5 border rounded-lg transition shadow-sm ${isDark ? 'bg-gray-700 border-gray-600 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <Activity size={24} />
            </div>
            <div>
              <div className={`font-bold ${textTitle}`}>{makine.ad}</div>
              <div className={`text-sm ${textSub}`}>{makine.detay}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Uretim;
