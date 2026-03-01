import React, { useState } from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { getThemeClasses } from 'utils/theme';

const MakineEkle = ({ isDark, onBack }) => {
  const { bgCard, textTitle, textSub, borderCol } = getThemeClasses(isDark);
  const [ad, setAd] = useState('');
  const [id, setId] = useState('');
  const [detay, setDetay] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Şimdilik sadece listeye dön (API bağlanınca kayıt yapılacak)
    onBack();
  };

  return (
    <div className={`p-6 rounded-xl shadow-sm border w-full transition-colors duration-300 ${bgCard}`}>
      <button
        type="button"
        onClick={onBack}
        className={`flex items-center gap-2 mb-6 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <ArrowLeft size={18} /> Listeye dön
      </button>

      <h2 className={`text-xl font-bold mb-6 border-b pb-2 ${textTitle} ${borderCol}`}>Yeni Makine Ekle</h2>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${textSub}`}>Makine Adı</label>
          <input
            type="text"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            placeholder="Örn: CNC Pres - 01"
            className={`w-full p-3 rounded-lg border bg-transparent ${isDark ? 'border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900 placeholder-gray-400'}`}
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${textSub}`}>Makine ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Örn: 1001 veya MK-001"
            className={`w-full p-3 rounded-lg border bg-transparent ${isDark ? 'border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900 placeholder-gray-400'}`}
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${textSub}`}>Detay (Opsiyonel)</label>
          <input
            type="text"
            value={detay}
            onChange={(e) => setDetay(e.target.value)}
            placeholder="Örn: Sıcaklık sensörü mevcut"
            className={`w-full p-3 rounded-lg border bg-transparent ${isDark ? 'border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900 placeholder-gray-400'}`}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Activity size={18} /> Kaydet
          </button>
          <button
            type="button"
            onClick={onBack}
            className={`px-5 py-2.5 font-semibold rounded-lg border transition-colors ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakineEkle;
