/**
 * Backend API fetch wrapper. Tüm istekler buradan geçer.
 */
import { API_BASE_URL } from 'config/api';

/** ASP.NET validation mesajlarını düzgünce ayıklar */
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
  return body.message ?? body.title ?? body.error ?? null;
}

/** * ÖNEMLİ: Token isminin login kısmındakiyle aynı olduğundan emin ol! 
 * Genelde 'token' veya 'fabrika_token' kullanılır.
 */
function getToken() {
  try {
    // Hem 'token' hem 'fabrika_token' kontrolü yaparak riski azaltıyoruz
    return localStorage.getItem('fabrika_token') || 
           localStorage.getItem('token') || 
           sessionStorage.getItem('fabrika_token');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  // URL'nin sonundaki çift slash hatalarını engellemek için temizlik
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${API_BASE_URL.replace(/\/$/, '')}${cleanPath}`;

  const headers = {
    'Accept': 'application/json', // Backend'e JSON istediğimizi net söyleyelim
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    // Bearer kelimesinden sonra boşluk olduğundan emin oluyoruz
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  try {
    const res = await fetch(url, { 
      ...options, 
      headers,
      mode: 'cors' // CORS hatalarını engellemek için tarayıcıya açıkça belirtiyoruz
    });

    // 401 hatası gelirse kullanıcıyı login'e yönlendirmek iyi bir fikirdir
    if (res.status === 401) {
       console.warn("Yetki hatası! Token geçersiz veya süresi dolmuş olabilir.");
       // İsteğe bağlı: window.location.href = '/login'; 
    }

    if (!res.ok) {
      let body;
      const text = await res.text();
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { message: text };
      }
      
      const message = extractErrorMessage(body) || `Hata kodu: ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    // Yanıt boş değilse JSON parse et
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await res.json();
    }
    return await res.text();

  } catch (networkErr) {
    if (networkErr.name === 'TypeError') {
        throw new Error('CORS hatası veya Sunucuya bağlanılamadı. Backend adresini kontrol et.');
    }
    throw networkErr;
  }
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (path, body) => request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: (path, body) => request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (path) => request(path, { method: 'DELETE' }),
};