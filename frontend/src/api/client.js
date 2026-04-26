import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Response interceptor — unwrap data or throw a clean error
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.errors?.[0]?.msg ||
      err.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export const humanizeText = (text) => api.post('/humanize', { text });
export const fetchEntries = ()     => api.get('/entries');
export const deleteEntry  = (id)   => api.delete(`/entries/${id}`);
export const clearEntries = ()     => api.delete('/entries');
