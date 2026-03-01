import React, { useState, useEffect, useRef } from 'react';
import AppHeader from './AppHeader';
import { Dashboard, Uretim, MakineEkle, Stok, UrunEkle, Personel, PersonelBilgi, PersonelEkle, SiparisOlustur, Muhasebe, PlaceholderPage } from 'pages';
import { getThemeClasses } from 'utils/theme';
import { PERSONEL_LISTESI } from 'constants/personelData';

const MainContent = ({ activeTab, setActiveTab, isDark, toggleTheme, userName, onContentReady }) => {
  const { bgMain } = getThemeClasses(isDark);
  const [personelList, setPersonelList] = useState(PERSONEL_LISTESI);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const hasReportedReady = useRef(false);

  useEffect(() => {
    if (!onContentReady || hasReportedReady.current) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hasReportedReady.current = true;
        onContentReady();
      });
    });
    return () => cancelAnimationFrame(id);
  }, [onContentReady]);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard isDark={isDark} />;
      case 'uretim':
        return <Uretim isDark={isDark} onMakineEkle={() => setActiveTab('makine-ekle')} />;
      case 'siparis-olustur':
        return <SiparisOlustur isDark={isDark} />;
      case 'muhasebe':
        return <Muhasebe isDark={isDark} />;
      case 'makine-ekle':
        return <MakineEkle isDark={isDark} onBack={() => setActiveTab('uretim')} />;
      case 'stok':
        return <Stok isDark={isDark} onUrunEkle={() => setActiveTab('urun-ekle')} />;
      case 'urun-ekle':
        return <UrunEkle isDark={isDark} onBack={() => setActiveTab('stok')} />;
      case 'personel':
        return (
          <Personel
            isDark={isDark}
            personelList={personelList}
            onPersonelEkle={() => setActiveTab('personel-ekle')}
            onPersonelBilgi={(p) => {
              setSelectedPersonId(p.id);
              setActiveTab('personel-bilgi');
            }}
          />
        );
      case 'personel-bilgi': {
        const person = personelList.find((p) => p.id === selectedPersonId);
        return (
          <PersonelBilgi
            isDark={isDark}
            person={person}
            onBack={() => {
              setActiveTab('personel');
              setSelectedPersonId(null);
            }}
          />
        );
      }
      case 'personel-ekle':
        return <PersonelEkle isDark={isDark} personelList={personelList} setPersonelList={setPersonelList} onBack={() => setActiveTab('personel')} />;
      case 'ai':
        return <PlaceholderPage activeTab={activeTab} isDark={isDark} />;
      default:
        return <Dashboard isDark={isDark} />;
    }
  };

  return (
    <div className={`ml-64 p-8 min-h-screen transition-colors duration-300 ${bgMain}`}>
      <div className="max-w-7xl mx-auto">
        <AppHeader
          activeTab={activeTab}
          isDark={isDark}
          toggleTheme={toggleTheme}
          userName={userName}
        />
        <div key={activeTab} className="page-transition-enter">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
