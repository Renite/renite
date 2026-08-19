const API_BASE_URL = 'http://localhost:5000/api';

export const clientApi = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  },
  async post(endpoint, data) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit data');
    return res.json();
  }
};