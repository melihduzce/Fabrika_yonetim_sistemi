import { api } from './api';
import { stockFromApi, stockToApi } from './mappers';

/** Backend: GET /api/stok (liste) — backend-api-spec.json ile uyumlu */
const STOCK_BASE = '/api/stok';

export async function getStok() {
  const list = await api.get(STOCK_BASE);
  return (Array.isArray(list) ? list : []).map(stockFromApi);
}

export async function getStokDetay(id) {
  const list = await api.get(STOCK_BASE);
  const found = Array.isArray(list) ? list.find((r) => (r.kod || r.stokKodu || r.id) === id || r.id === id) : null;
  return found ? stockFromApi(found) : null;
}

export async function createStok(data) {
  const body = stockToApi(data);
  delete body.id;
  const created = await api.post(STOCK_BASE, body);
  return stockFromApi(created);
}

export async function updateStok(id, data) {
  const body = stockToApi({ ...data, id });
  const updated = await api.put(`${STOCK_BASE}/${id}`, body);
  return stockFromApi(updated);
}

export async function deleteStok(id) {
  await api.delete(`${STOCK_BASE}/${id}`);
}
