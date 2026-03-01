import React, { useState } from 'react';
import { ArrowLeft, Box } from 'lucide-react';
import { getThemeClasses } from 'utils/theme';
import ThemeDropdown from 'components/ThemeDropdown';
import NumberStepperInput from 'components/NumberStepperInput';

const BIRIM_OPTIONS = [
  { id: 'saat', ad: 'Saat' },
  { id: 'dakika', ad: 'Dakika' },
];

// CSV kolonları: urun_kodu + pres/makine (0/1). Etiketler Türkçe gösterim için.
const MAKINE_KOLONLARI = [
  { key: '1000_ton', label: '1000 ton' },
  { key: '800_ton', label: '800 ton' },
  { key: '400_ton', label: '400 ton' },
  { key: '250_ton', label: '250 ton' },
  { key: 'eksantrik_125', label: 'Eksantrik 125' },
  { key: 'eksantrik_80', label: 'Eksantrik 80' },
  { key: 'induksiyon', label: 'İndüksiyon' },
  { key: 'hidrolik_kivirma', label: 'Hidrolik kıvırma' },
];

const initialMakineFlags = () =>
  MAKINE_KOLONLARI.reduce((acc, { key }) => ({ ...acc, [key]: false }), {});

const UrunEkle = ({ isDark, onBack }) => {
  const { textTitle, textSub, borderCol } = getThemeClasses(isDark);
  const [urunKodu, setUrunKodu] = useState('');
  const [urunAdi, setUrunAdi] = useState('');
  const [hammaddeTuru, setHammaddeTuru] = useState('');
  const [birimUretimSuresi, setBirimUretimSuresi] = useState('');
  const [birimSureBirim, setBirimSureBirim] = useState('saat');
  const [beklenenHurdaMiktar, setBeklenenHurdaMiktar] = useState('');
  const [brutAgirlik, setBrutAgirlik] = useState('');
  const [netAgirlik, setNetAgirlik] = useState('');
  const [hurdaOrani, setHurdaOrani] = useState('');
  const [gunlukUretim, setGunlukUretim] = useState('');
  const [makineFlags, setMakineFlags] = useState(initialMakineFlags);

  const toggleMakine = (key) => {
    setMakineFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // CSV satırı üretmek için: urun_kodu, 1000_ton, 800_ton, ... (0 veya 1)
    onBack();
  };

  const inputCls = `w-full p-3 rounded-lg border bg-transparent ${isDark ? 'border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900 placeholder-gray-400'}`;
  const checkboxLabelCls = (checked) =>
    `flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border transition-colors ${
      checked
        ? isDark
          ? 'bg-blue-900/40 border-blue-600'
          : 'bg-blue-50 border-blue-300'
        : isDark
          ? 'border-gray-600 hover:border-gray-500'
          : 'border-gray-200 hover:border-gray-300'
    }`;
  const checkboxTextCls = (checked) =>
    `text-sm font-medium ${checked ? (isDark ? 'text-blue-200' : 'text-blue-800') : isDark ? 'text-gray-200' : 'text-gray-900'}`;

  return (
    <div className={`p-6 rounded-xl shadow-sm border w-full transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <button
        type="button"
        onClick={onBack}
        className={`flex items-center gap-2 mb-6 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <ArrowLeft size={18} /> Listeye dön
      </button>

      <h2 className={`text-xl font-bold mb-6 border-b pb-2 ${textTitle} ${borderCol}`}>Yeni Ürün Ekle</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textSub}`}>Ürün Kodu *</label>
            <input
              type="text"
              value={urunKodu}
              onChange={(e) => setUrunKodu(e.target.value)}
              placeholder="Örn: D3043, D3213"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textSub}`}>Ürün Adı (opsiyonel)</label>
            <input
              type="text"
              value={urunAdi}
              onChange={(e) => setUrunAdi(e.target.value)}
              placeholder="Listede görünecek isim"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textSub}`}>Hammadde türü</label>
          <input
            type="text"
            value={hammaddeTuru}
            onChange={(e) => setHammaddeTuru(e.target.value)}
            placeholder="Örn: Çelik, Sac"
            className={inputCls}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-4 gap-4">
          <div className="flex-1 min-w-0 flex flex-col">
            <label className={`text-sm font-medium mb-2 ${textSub}`}>Birim üretim süresi</label>
            <NumberStepperInput
              value={birimUretimSuresi}
              onChange={(e) => setBirimUretimSuresi(e.target.value)}
              min={0}
              step={0.01}
              placeholder="Örn: 0.5"
              isDark={isDark}
              className="flex-1 min-w-0"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col [&_button]:h-[42px] [&_button]:py-0 [&_button]:flex [&_button]:items-center">
            <label className={`text-sm font-medium mb-2 ${textSub}`}>Birim</label>
            <ThemeDropdown
              label={null}
              options={BIRIM_OPTIONS}
              value={birimSureBirim}
              onChange={setBirimSureBirim}
              renderLabel={(o) => o.ad}
              placeholder="Birim seçin"
              isDark={isDark}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textSub}`}>Beklenen hurda miktarı</label>
          <NumberStepperInput
            value={beklenenHurdaMiktar}
            onChange={(e) => setBeklenenHurdaMiktar(e.target.value)}
            min={0}
            step={0.01}
            placeholder="Örn: 5 veya 2.5"
            isDark={isDark}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textSub}`}>Brüt ağırlık (kg)</label>
            <NumberStepperInput
              value={brutAgirlik}
              onChange={(e) => setBrutAgirlik(e.target.value)}
              min={0}
              step={0.1}
              placeholder="Örn: 6"
              isDark={isDark}
              className="w-full"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textSub}`}>Net ağırlık (kg)</label>
            <NumberStepperInput
              value={netAgirlik}
              onChange={(e) => setNetAgirlik(e.target.value)}
              min={0}
              step={0.1}
              placeholder="Örn: 5.7"
              isDark={isDark}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textSub}`}>Hurda oranı (%)</label>
            <NumberStepperInput
              value={hurdaOrani}
              onChange={(e) => setHurdaOrani(e.target.value)}
              min={0}
              max={100}
              step={0.1}
              placeholder="Örn: 5"
              isDark={isDark}
              className="w-full"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textSub}`}>Günlük üretim</label>
            <NumberStepperInput
              value={gunlukUretim}
              onChange={(e) => setGunlukUretim(e.target.value)}
              min={0}
              step={1}
              placeholder="Örn: 120"
              isDark={isDark}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textSub}`}>Pres / Makine kullanımı</label>
          <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MAKINE_KOLONLARI.map(({ key, label }) => {
                const checked = !!makineFlags[key];
                return (
                  <label key={key} className={checkboxLabelCls(checked)}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMakine(key)}
                      className="rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={checkboxTextCls(checked)}>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Box size={18} /> Kaydet
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

export default UrunEkle;
