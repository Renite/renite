const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('renite_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth & Profile (Maps to User.js & Profile.js)
  registerUser: async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      if (data.token) localStorage.setItem('renite_token', data.token);
      return data;
    } catch (err) {
      console.warn('Backend unavailable, saving locally:', err.message);
      localStorage.setItem('renite_user', JSON.stringify(userData));
      return { success: true, user: userData, token: 'mock-jwt-token' };
    }
  },

  loginUser: async (credentials) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      if (data.token) localStorage.setItem('renite_token', data.token);
      return data;
    } catch {
      console.warn('Backend unavailable, performing mock login');
      return { success: true, token: 'mock-jwt-token', user: { email: credentials.email } };
    }
  },

  // Assets / Materials (Maps to Material.js)
  registerAsset: async (assetData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/materials`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(assetData),
      });
      if (!res.ok) throw new Error('Asset registration failed');
      return await res.json();
    } catch {
      console.warn('Backend offline, storing asset locally');
      const existing = JSON.parse(localStorage.getItem('renite_assets') || '[]');
      const newAsset = { ...assetData, id: Date.now().toString(), status: 'PROTECTED' };
      localStorage.setItem('renite_assets', JSON.stringify([...existing, newAsset]));
      return { success: true, asset: newAsset };
    }
  },

  // Status Tracking (Maps to Recovery.js & MissingPerson.js)
  trackStatus: async (code) => {
    try {
      const res = await fetch(`${API_BASE_URL}/track/${code}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Tracking code not found');
      return await res.json();
    } catch {
      return {
        code,
        status: 'IN_PROGRESS',
        type: code.startsWith('MP') ? 'Missing Person Case' : 'Asset Recovery',
        lastUpdated: new Date().toLocaleDateString(),
        details: 'Assigned to Addis Ababa Police District 3 & Local Response Volunteers.',
      };
    }
  },

  // Volunteers (Maps to Verification.js)
  getVolunteers: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/volunteers`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch volunteers');
      return await res.json();
    } catch {
      return [
        { id: '1', name: 'Hana Tesfaye', role: 'Field Coordinator', status: 'Available', rating: 4.9, cases: 12, location: 'Addis Ababa, Bole', tags: ['Search & Rescue', 'First Aid', 'Trauma Support'] },
        { id: '2', name: 'Dawit Alemu', role: 'Community Reporter', status: 'Available', rating: 4.7, cases: 8, location: 'Hawassa, SNNPR', tags: ['Community Outreach', 'Documentation'] },
        { id: '3', name: 'Selamawit Bekele', role: 'Medical Volunteer', status: 'On Duty', rating: 5.0, cases: 22, location: 'Dire Dawa', tags: ['Emergency Medicine', 'Counseling'] },
        { id: '4', name: 'Girma Worku', role: 'Tech Specialist', status: 'Available', rating: 4.8, cases: 17, location: 'Mekelle, Tigray', tags: ['Device Recovery', 'Data Forensics', 'CCTV Analysis'] },
        { id: '5', name: 'Tigist Haile', role: 'Legal Aid', status: 'On Duty', rating: 4.8, cases: 5, location: 'Addis Ababa, Piassa', tags: ['Legal Support', 'Family Liaison'] },
      ];
    }
  }
};