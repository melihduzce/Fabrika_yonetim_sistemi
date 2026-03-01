/**
 * Uygulama navigasyon sabitleri
 * Sidebar menü öğeleri ve sayfa tanımları
 */

import { Home, Activity, Box, Zap, Users, ShoppingCart } from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Ana Panel', icon: Home },
  { id: 'uretim', label: 'Üretim Hattı', icon: Activity },
  { id: 'siparis-olustur', label: 'Sipariş Oluşturma', icon: ShoppingCart },
  { id: 'ai', label: 'AI Tahminleri', icon: Zap },
  { id: 'stok', label: 'Stok Depo', icon: Box },
  { id: 'personel', label: 'Personel', icon: Users },
];

export const PAGE_TITLES = {
  dashboard: 'Genel Bakış',
  uretim: 'Üretim Takibi',
  'makine-ekle': 'Makine Ekle',
  'siparis-olustur': 'Sipariş Oluşturma',
  stok: 'Depo Yönetimi',
  'urun-ekle': 'Ürün Ekle',
  ai: 'Yapay Zeka',
  personel: 'Personel',
  'personel-bilgi': 'Personel Bilgisi',
  'personel-ekle': 'Personel Düzenle',
};
