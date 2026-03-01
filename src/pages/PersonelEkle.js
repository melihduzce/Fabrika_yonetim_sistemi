import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Users, Trash2 } from 'lucide-react';
import { getThemeClasses } from 'utils/theme';
import ThemeDropdown from 'components/ThemeDropdown';
import { DEPARTMAN_OPTIONS, POZISYON_BY_DEPARTMAN } from 'constants/departmanPozisyon';

const inputCls = (isDark) =>
  `w-full p-3 rounded-lg border bg-transparent ${isDark ? 'border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900 placeholder-gray-400'}`;

const PersonelEkle = ({ isDark, personelList = [], setPersonelList, onBack }) => {
  const { bgCard, textTitle, textSub, borderCol } = getThemeClasses(isDark);
  const [view, setView] = useState('menu'); // 'menu' | 'ekle' | 'cikar'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tcKimlikNo, setTcKimlikNo] = useState('');
  const [telefon, setTelefon] = useState('');
  const [department, setDepartment] = useState('');
  const [pozisyon, setPozisyon] = useState('');
  const [iseGirisTarihi, setIseGirisTarihi] = useState('');
  const [egitimSertifikalariText, setEgitimSertifikalariText] = useState(''); // satır veya virgülle ayrılmış

  const parseSertifikalar = (text) =>
    text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !department) return;
    const nextId = personelList.length ? Math.max(...personelList.map((p) => p.id)) + 1 : 1;
    const yeni = {
      id: nextId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      tcKimlikNo: tcKimlikNo.trim() || null,
      telefon: telefon.trim() || null,
      department,
      pozisyon: pozisyon.trim() || null,
      maas: null,
      iseGirisTarihi: iseGirisTarihi.trim() || null,
      yillikIzinHakki: 14,
      kullanilanIzin: 0,
      fazlaMesaiSaat: 0,
      egitimSertifikalari: parseSertifikalar(egitimSertifikalariText),
    };
    setPersonelList([...personelList, yeni]);
    setFirstName('');
    setLastName('');
    setTcKimlikNo('');
    setTelefon('');
    setDepartment('');
    setPozisyon('');
    setIseGirisTarihi('');
    setEgitimSertifikalariText('');
  };

  const handleRemove = (id, adSoyad) => {
    const mesaj = adSoyad
      ? `${adSoyad} listeden çıkarmak istiyor musunuz?`
      : 'Bu personeli listeden çıkarmak istiyor musunuz?';
    if (!window.confirm(mesaj)) return;
    setPersonelList(personelList.filter((p) => p.id !== id));
  };

  const linkCls = `flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <div className={`p-6 rounded-xl shadow-sm border w-full transition-colors duration-300 ${bgCard}`}>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button type="button" onClick={onBack} className={linkCls}>
          <ArrowLeft size={18} /> Listeye dön
        </button>
        {view !== 'menu' && (
          <button type="button" onClick={() => setView('menu')} className={linkCls}>
            <ArrowLeft size={18} /> Geri
          </button>
        )}
      </div>

      {view === 'menu' && (
        <>
          <h2 className={`text-xl font-bold mb-8 border-b pb-2 text-center ${textTitle} ${borderCol}`}>
            Personel Düzenle
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 min-h-[280px]">
            <button
              type="button"
              onClick={() => setView('ekle')}
              className="flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg transition-colors"
            >
              <UserPlus size={28} /> Personel Ekle
            </button>
            <button
              type="button"
              onClick={() => setView('cikar')}
              className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-red-500/80 text-red-500 hover:bg-red-500/10 font-semibold text-lg transition-colors"
            >
              <Trash2 size={28} /> Personel Çıkar
            </button>
          </div>
        </>
      )}

      {view === 'ekle' && (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <h2 className={`text-xl font-bold mb-6 border-b pb-2 text-center ${textTitle} ${borderCol}`}>
              Yeni Personel Ekle
            </h2>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textSub}`}>Ad</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Örn: Ahmet"
                  className={inputCls(isDark)}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textSub}`}>Soyad</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Örn: Yılmaz"
                  className={inputCls(isDark)}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textSub}`}>TC Kimlik No</label>
                <input
                  type="text"
                  value={tcKimlikNo}
                  onChange={(e) => setTcKimlikNo(e.target.value)}
                  placeholder="11 haneli"
                  className={inputCls(isDark)}
                  maxLength={11}
                  pattern="[0-9]{11}"
                  title="11 haneli rakam"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textSub}`}>Telefon</label>
                <input
                  type="tel"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  placeholder="Örn: 0532 111 2233"
                  className={inputCls(isDark)}
                />
              </div>
              <div>
                <ThemeDropdown
                  label="Departman"
                  options={DEPARTMAN_OPTIONS}
                  value={department}
                  onChange={(v) => {
                    setDepartment(v);
                    setPozisyon('');
                  }}
                  renderLabel={(d) => d.ad}
                  placeholder="Departman seçin"
                  isDark={isDark}
                />
              </div>
              <div>
                <ThemeDropdown
                  label="Pozisyon"
                  options={POZISYON_BY_DEPARTMAN[department] || []}
                  value={pozisyon}
                  onChange={setPozisyon}
                  renderLabel={(p) => p.ad}
                  placeholder={department ? 'Pozisyon seçin' : 'Önce departman seçin'}
                  isDark={isDark}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textSub}`}>İşe giriş tarihi</label>
                <input
                  type="text"
                  value={iseGirisTarihi}
                  onChange={(e) => setIseGirisTarihi(e.target.value)}
                  placeholder="Örn: 15.03.2022"
                  className={inputCls(isDark)}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textSub}`}>Eğitim / Sertifikalar</label>
                <textarea
                  value={egitimSertifikalariText}
                  onChange={(e) => setEgitimSertifikalariText(e.target.value)}
                  placeholder="Her satıra bir sertifika veya virgülle ayırın"
                  className={`${inputCls(isDark)} min-h-[100px] resize-y`}
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <UserPlus size={18} /> Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setView('menu')}
                  className={`px-5 py-2.5 font-semibold rounded-lg border transition-colors ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === 'cikar' && (
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <h2 className={`text-xl font-bold mb-6 border-b pb-2 text-center ${textTitle} ${borderCol}`}>
              Mevcut Personel
            </h2>
            <div className="space-y-3">
              {personelList.length === 0 ? (
                <p className={`text-sm text-center ${textSub}`}>Listede personel yok.</p>
              ) : (
                personelList.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between gap-4 p-4 border rounded-lg ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                        <Users size={20} />
                      </div>
                      <div>
                        <div className={`font-semibold ${textTitle}`}>{p.firstName} {p.lastName}</div>
                        <div className={`text-sm ${textSub}`}>{p.department || '—'}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(p.id, `${p.firstName} ${p.lastName}`)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                      title="Listeden çıkar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonelEkle;
