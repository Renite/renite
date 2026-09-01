import axios from 'axios';
import { supabase } from '../supabase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attaches the live Supabase session token (not a localStorage 'token'
// that nothing in this app ever wrote) -- this is what the backend's
// authenticate middleware actually verifies via supabase.auth.getUser().
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Every backend response is { success: true, data: <payload> } on success,
// or { success: false, error: { code, message } } on failure. Axios already
// puts the whole JSON body on response.data, so call sites written as
// `const { data } = await api.get(...)` were previously getting the raw
// envelope, not the payload one level in -- e.g. lookup-email's response
// was { success, data: { email } }, so `lookup.email` was always
// undefined and every Fayda-ID login silently failed at the sign-in step.
// Unwrapping here means every existing call site (already written as if
// `data` were the payload directly) works without being touched.
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const backendMessage = error.response?.data?.error?.message;
    if (backendMessage) {
      error.message = backendMessage;
    }
    return Promise.reject(error);
  }
);

export default api;
