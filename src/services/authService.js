import { api } from './api';

const TOKEN_KEY = 'fabrika_token';

function storeToken(token, rememberMe) {
  if (!token) return;
  try {
    // Önce eski kalıntıları temizleyelim ki çakışma olmasın
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    
    // api.js'in kolayca bulabilmesi için yedek bir 'token' ismiyle de kaydedebiliriz
    storage.setItem('token', token); 
  } catch {
    // storage hatalarını sessizce yut
  }
}

export async function login(email, password, rememberMe) {
  const body = {
    email: email || null,
    password: password || null,
    rememberMe: !!rememberMe,
  };

  /** * KRİTİK DÜZELTME: 
   * Eğer Backend'de [Route("api/[controller]")] kullanıyorsan 
   * burası '/api/Auth/login' olmalı.
   */
  const result = await api.post('/api/Auth/login', body);
  
  // Backend'den gelen yanıtın içinde 'token' alanı olduğundan emin ol
  const token = result?.token || result?.accessToken || result?.data?.token;
  storeToken(token, rememberMe);
  
  return result;
}

export async function register(email, password) {
  const result = await api.post('/api/Auth/register', {
    email: email || null,
    password: password || null,
  });
  
  const token = result?.token || result?.accessToken;
  storeToken(token, true);
  
  return result;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('token');
  sessionStorage.removeItem(TOKEN_KEY);
  window.location.href = '/login';
}