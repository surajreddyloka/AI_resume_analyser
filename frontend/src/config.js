// Central API config - points to live Render backend in production
const API_BASE = import.meta.env.VITE_API_URL || 'https://airesumeanalyser.up.railway.app';

export default API_BASE;
