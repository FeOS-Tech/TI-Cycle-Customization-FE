const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
export const THEME_API_BASE = `${BACKEND_URL}/api/theme-config/slug`;
export const CUSTOM_API = `${BACKEND_URL}/api/customizations`;

export default BACKEND_URL;