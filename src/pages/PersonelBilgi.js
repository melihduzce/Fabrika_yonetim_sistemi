import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { getThemeClasses } from 'utils/theme';

const PersonelBilgi = ({ isDark, person, onBack }) => {
  const { bgCard, textTitle, textSub, borderCol } = getThemeClasses(isDark);

  if (!person) {
    return (
      <div className={`p-6 rounded-xl shadow-sm border w-full ${bgCard}`}>
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-2 text-sm font-medium mb-4 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft size={18} /> Listeye dön
        </button>
        <p className={textSub}>Personel bulunamadı.</p>
      </div>
    );
  }

  const kalanIzin = (person.yillikIzinHakki ?? 0) - (person.kullanilanIzin ?? 0);

  const linkCls = `flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <div className={`p-6 rounded-xl shadow-sm border w-full transition-colors duration-300 ${bgCard}`}>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button type="button" onClick={onBack} className={linkCls}>
          <ArrowLeft size={18} /> Listeye dön
        </button>
      </div>

      <div className={`mb-6 pb-4 border-b ${borderCol}`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Users size={28} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textTitle}`}>{person.firstName} {person.lastName}</h2>
            <div className={`text-sm ${textSub}`}>{person.department || '—'} · {person.pozisyon || '—'}</div>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>TC Kimlik No</div>
            <div className={`font-medium ${textTitle}`}>{person.tcKimlikNo ?? '—'}</div>
          </div>
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>Telefon</div>
            <div className={`font-medium ${textTitle}`}>{person.telefon ?? '—'}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>Departman</div>
            <div className={`font-medium ${textTitle}`}>{person.department ?? '—'}</div>
          </div>
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>Pozisyon</div>
            <div className={`font-medium ${textTitle}`}>{person.pozisyon ?? '—'}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>Maaş (₺)</div>
            <div className={`font-medium ${textTitle}`}>{person.maas != null ? person.maas.toLocaleString('tr-TR') : '—'}</div>
          </div>
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>İşe giriş tarihi</div>
            <div className={`font-medium ${textTitle}`}>{person.iseGirisTarihi ?? '—'}</div>
          </div>
        </div>
        <div>
          <div className={`text-xs font-medium uppercase tracking-wider mb-2 ${textSub}`}>İzin bilgileri</div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-xs ${textSub}`}>Yıllık hak</div>
                <div className={`font-semibold ${textTitle}`}>{person.yillikIzinHakki ?? 0} gün</div>
              </div>
              <div>
                <div className={`text-xs ${textSub}`}>Kullanılan</div>
                <div className={`font-semibold ${textTitle}`}>{person.kullanilanIzin ?? 0} gün</div>
              </div>
              <div>
                <div className={`text-xs ${textSub}`}>Kalan</div>
                <div className={`font-semibold ${textTitle}`}>{kalanIzin} gün</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>Fazla mesai süresi</div>
          <div className={`font-medium ${textTitle}`}>{person.fazlaMesaiSaat != null ? `${person.fazlaMesaiSaat} saat` : '—'}</div>
        </div>
        <div>
          <div className={`text-xs font-medium uppercase tracking-wider mb-2 ${textSub}`}>Eğitim / Sertifikalar</div>
          <ul className={`space-y-2 ${textTitle}`}>
            {person.egitimSertifikalari?.length
              ? person.egitimSertifikalari.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`} />
                    {s}
                  </li>
                ))
              : <li className={textSub}>—</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonelBilgi;
