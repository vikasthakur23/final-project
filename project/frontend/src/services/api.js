const API = (path, opts = {}) => {
    const base = import.meta.env.VITE_API || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const headers = opts.headers || {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(`${base}${path}`, { ...opts, headers }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'API error');
      }
      return res.json();
    });
  };
  
  export default API;
  