import axios from 'axios';
import router from './router';
import { getUserId, getRole } from './lib/user';
import { toast } from './lib/toast';

import { ROLES } from '../../server/src/constants/roles';

const API = axios.create({ baseURL: 'http://localhost:3001' });

// Always send the demo user header + language
API.interceptors.request.use((config) => {
  config.headers['X-User-Id'] = String(getUserId());
  const lang = localStorage.getItem('lang') || 'en';
  config.headers['Accept-Language'] = lang;
  return config;
});

// Graceful handling of auth/role errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      toast('Not authenticated — redirected to Requester.', 'error');
      router.push('/requester');
    } else if (status === 403) {
      const role = getRole();
      const fallback = role === ROLES.VALIDATOR ? '/validator' : '/requester';
      toast('You do not have access to that page — redirected.', 'error');
      router.push(fallback);
    }
    return Promise.reject(err);
  }
);

export default API;

// Keep this to avoid breaking existing imports elsewhere
export function setUser(id) {
  // No-op here; we persist in App.vue via user.js
}
