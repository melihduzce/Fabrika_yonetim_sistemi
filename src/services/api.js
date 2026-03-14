/**
 * Backend API fetch wrapper. Tüm istekler buradan geçer.
 */
import { API_BASE_URL } from 'config/api';

/** ASP.NET validation: body.errors / body.Errors → tek metin */
function extractErrorMessage(body) {
  if (!body) return null;
  const raw = body.errors ?? body.Errors;
  if (raw && typeof raw === 'object') {
    const parts = Array.isArray(raw)
      ? raw
      : Object.entries(raw).map(([k, v]) => (Array.isArray(v) ? v.join(' ') : String(v ?? '')));
    const text = parts.flat().filter(Boolean).join(' ');
    if (text) return text;
  }
  return body.message ?? body.title ?? null;
}

function getToken() {
  try {
    return localStorage.getItem('fabrika_token') || sessionStorage.getItem('fabrika_token');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch {
      body = { message: await res.text() };
    }
    const err = new Error(extractErrorMessage(body) || res.statusText || 'API hatası');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (path, body) => request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: (path, body) => request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
