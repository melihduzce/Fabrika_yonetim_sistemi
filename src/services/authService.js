import { api } from './api';

export async function login(email, password) {
  return api.post('/api/Auth/login', { email: email || null, password: password || null });
}

export async function register(email, password) {
  return api.post('/api/Auth/register', { email: email || null, password: password || null });
}
