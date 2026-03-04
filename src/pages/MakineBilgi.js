import React from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { getThemeClasses } from 'utils/theme';

const MakineBilgi = ({ isDark, makine, onBack }) => {
  const { bgCard, textTitle, textSub, borderCol } = getThemeClasses(isDark);

  const linkCls = `flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`;

  if (!makine) {
    return (
      <div className={`p-6 rounded-xl shadow-sm border w-full ${bgCard}`}>
        <button type="button" onClick={onBack} className={`${linkCls} mb-4`}>
          <ArrowLeft size={18} /> Listeye dön
        </button>
        <p className={textSub}>Makine bulunamadı.</p>
      </div>
    );
  }

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
            <Activity size={28} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textTitle}`}>{makine.ad}</h2>
            {makine.detay && <div className={`text-sm ${textSub}`}>{makine.detay}</div>}
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>Makine adı</div>
            <div className={`font-medium ${textTitle}`}>{makine.ad ?? '—'}</div>
          </div>
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>Makine ID</div>
            <div className={`font-medium ${textTitle}`}>{makine.idKod ?? makine.id ?? '—'}</div>
          </div>
        </div>
        <div>
          <div className={`text-xs font-medium uppercase tracking-wider ${textSub}`}>Detay</div>
          <div className={`font-medium ${textTitle}`}>{makine.detay ?? '—'}</div>
        </div>
      </div>
    </div>
  );
};

export default MakineBilgi;
