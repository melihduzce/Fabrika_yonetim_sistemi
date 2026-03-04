import React, { useState, useEffect, useRef } from 'react';
import AppHeader from './AppHeader';
import { Dashboard, Uretim, MakineEkle, MakineBilgi, Stok, UrunEkle, Personel, PersonelBilgi, PersonelEkle, SiparisOlustur, Musteriler, MusteriEkle, MusteriBilgi, Muhasebe, GiderDüzenle, PlaceholderPage } from 'pages';
import { getThemeClasses } from 'utils/theme';
import { PERSONEL_LISTESI } from 'constants/personelData';
import { MUSTERI_LISTESI } from 'constants/musteriData';

const MainContent = ({ activeTab, setActiveTab, isDark, toggleTheme, userName, onContentReady }) => {
  const { bgMain } = getThemeClasses(isDark);
  const [personelList, setPersonelList] = useState(PERSONEL_LISTESI);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [musteriList, setMusteriList] = useState(MUSTERI_LISTESI);
  const [selectedMusteriId, setSelectedMusteriId] = useState(null);
  const [makineList, setMakineList] = useState([
    { id: 1, ad: 'CNC Pres - 01', idKod: 'MK-1', detay: 'Sıcaklık: 85°C' },
    { id: 2, ad: 'Montaj Hattı - 03', idKod: 'MK-2', detay: 'Sıcaklık: 72°C' },
    { id: 3, ad: 'Paketleme - B2', idKod: 'MK-3', detay: 'Sıcaklık: 62°C' },
    { id: 4, ad: 'Kesim Makinesi - K1', idKod: 'MK-4', detay: 'Lazer kesim' },
    { id: 5, ad: 'Büküm Presi - 400T', idKod: 'MK-5', detay: 'Hidrolik, 400 ton' },
    { id: 6, ad: 'Kaynak Robotu - R02', idKod: 'MK-6', detay: '6 eksen' },
  ]);
  const [selectedMakineId, setSelectedMakineId] = useState(null);
  const [giderList, setGiderList] = useState(() => {
    const sabit = [
      { kalem: 'Elektrik', tutar: 18500 },
      { kalem: 'İşçilik', tutar: 125000 },
      { kalem: 'SGK', tutar: 32000 },
      { kalem: 'Yol', tutar: 8400 },
      { kalem: 'Yemek', tutar: 15600 },
      { kalem: 'Bakım', tutar: 12000 },
      { kalem: 'Nakliye', tutar: 22000 },
      { kalem: 'Kira', tutar: 45000 },
    ].map((g, i) => ({ id: i + 1, ...g, tip: 'sabit' }));
    const degisken = [
      { kalem: 'Hammadde alımı', tutar: 285000 },
      { kalem: 'Hurda kaybı', tutar: 14200 },
    ].map((g, i) => ({ id: 100 + i, ...g, tip: 'degisken' }));
    return [...sabit, ...degisken];
  });
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
        return (
          <Uretim
            isDark={isDark}
            makineList={makineList}
            onMakineEkle={() => setActiveTab('makine-ekle')}
            onMakineBilgi={(m) => {
              setSelectedMakineId(m.id);
              setActiveTab('makine-bilgi');
            }}
          />
        );
      case 'makine-bilgi': {
        const makine = makineList.find((m) => m.id === selectedMakineId);
        return (
          <MakineBilgi
            isDark={isDark}
            makine={makine}
            onBack={() => {
              setActiveTab('uretim');
              setSelectedMakineId(null);
            }}
          />
        );
      }
      case 'siparis-olustur':
        return <SiparisOlustur isDark={isDark} />;
      case 'musteriler':
        return (
          <Musteriler
            isDark={isDark}
            musteriList={musteriList}
            onMusteriEkle={() => setActiveTab('musteriler-ekle')}
            onMusteriBilgi={(m) => {
              setSelectedMusteriId(m.id);
              setActiveTab('musteri-bilgi');
            }}
          />
        );
      case 'musteriler-ekle':
        return (
          <MusteriEkle
            isDark={isDark}
            musteriList={musteriList}
            setMusteriList={setMusteriList}
            onBack={() => setActiveTab('musteriler')}
          />
        );
      case 'musteri-bilgi': {
        const musteri = musteriList.find((m) => m.id === selectedMusteriId);
        return (
          <MusteriBilgi
            isDark={isDark}
            musteri={musteri}
            onBack={() => {
              setActiveTab('musteriler');
              setSelectedMusteriId(null);
            }}
          />
        );
      }
      case 'muhasebe':
        return (
          <Muhasebe
            isDark={isDark}
            giderList={giderList}
            onMuhasebeDuzenle={() => setActiveTab('muhasebe-duzenle')}
          />
        );
      case 'muhasebe-duzenle':
        return (
          <GiderDüzenle
            isDark={isDark}
            giderList={giderList}
            setGiderList={setGiderList}
            onBack={() => setActiveTab('muhasebe')}
          />
        );
      case 'makine-ekle':
        return (
          <MakineEkle
            isDark={isDark}
            makineList={makineList}
            setMakineList={setMakineList}
            onBack={() => setActiveTab('uretim')}
          />
        );
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
          setActiveTab={setActiveTab}
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
