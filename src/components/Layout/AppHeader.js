import React from 'react';
import { Home, Activity, Box, ShoppingCart, Users, Moon, Sun, Calculator } from 'lucide-react';
import { PAGE_TITLES } from 'constants/navigation';

const TAB_ICONS = {
  dashboard: Home,
  uretim: Activity,
  'makine-ekle': Activity,
  'siparis-olustur': ShoppingCart,
  muhasebe: Calculator,
  stok: Box,
  'urun-ekle': Box,
  personel: Users,
  'personel-bilgi': Users,
  'personel-ekle': Users,
};

const AppHeader = ({ activeTab, isDark, toggleTheme, userName }) => {
  const bgCard = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textTitle = isDark ? 'text-white' : 'text-gray-800';

  const Icon = TAB_ICONS[activeTab];

  return (
    <header
      className={`flex justify-between items-center mb-8 p-4 rounded-xl shadow-sm border transition-colors duration-300 ${bgCard}`}
    >
      <h1 className={`text-2xl font-bold capitalize flex items-center gap-2 ${textTitle}`}>
        {Icon && <Icon className="text-blue-600" />}
        {PAGE_TITLES[activeTab] ?? activeTab}
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
          type="button"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div
          className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
            isDark ? 'bg-blue-900/30 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-800 border-blue-100'
          }`}
        >
          {userName ?? ''}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
