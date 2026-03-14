import { api } from './api';
import { productFromApi, productToApi } from './mappers';

/** Backend: GET /api/products, GET /api/products/{id}, POST/PUT/DELETE /api/products */
const PRODUCTS_BASE = '/api/products';

export async function getUrunler() {
  const list = await api.get(PRODUCTS_BASE);
  return (Array.isArray(list) ? list : []).map(productFromApi);
}

export async function getUrun(id) {
  const r = await api.get(`${PRODUCTS_BASE}/${id}`);
  return productFromApi(r);
}

export async function createUrun(data) {
  const body = productToApi(data);
  delete body.id;
  const created = await api.post(PRODUCTS_BASE, body);
  return productFromApi(created);
}

export async function updateUrun(id, data) {
  const body = productToApi({ ...data, id });
  const updated = await api.put(`${PRODUCTS_BASE}/${id}`, body);
  return productFromApi(updated);
}

export async function deleteUrun(id) {
  await api.delete(`${PRODUCTS_BASE}/${id}`);
}
