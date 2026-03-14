import { api } from './api';
import { orderFromApi, orderToApi } from './mappers';

export async function getSiparisler(durum) {
  const path = durum
    ? `/api/Order/tum-siparis-listesi?durum=${encodeURIComponent(durum)}`
    : '/api/Order/tum-siparis-listesi';
  const list = await api.get(path);
  return (Array.isArray(list) ? list : []).map(orderFromApi);
}

export async function getSiparis(id) {
  const r = await api.get(`/api/Order/siparis-detay-getir/${id}`);
  return orderFromApi(r);
}

export async function createSiparis(musteriAdi, urunAdi, miktar) {
  const created = await api.post('/api/Order/yeni-siparis-olustur', {
    musteriAdi: musteriAdi || null,
    urunAdi: urunAdi || null,
    miktar: Number(miktar) || 0,
  });
  return orderFromApi(created);
}

export async function updateSiparis(id, data) {
  const body = orderToApi(data);
  const updated = await api.put(`/api/Order/siparis-tum-verileri-duzelt/${id}`, body);
  return orderFromApi(updated);
}

export async function updateSiparisStatus(id, status) {
  await api.patch(`/api/Order/siparis-durumu-guncelle/${id}`, { status });
}

export async function deleteSiparis(id) {
  await api.delete(`/api/Order/siparis-kaydi-sil/${id}`);
}
