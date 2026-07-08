import axios from 'axios';
import { emitUnauthorized } from '../utils/authEvents.js';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // Fail loudly in development rather than silently hitting the wrong host.
  // eslint-disable-next-line no-console
  console.error(
    'VITE_API_BASE_URL is not set. Create a .env file (see .env.example) pointing at the backend.'
  );
}

const axiosClient = axios.create({
  baseURL,
  // The backend uses session cookies (JSESSIONID) for admin auth, so every
  // request must carry credentials for the session to be recognized.
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';

    // Don't treat a failed login attempt as "session expired" -- that's a
    // normal, expected 401 that the login form itself should surface.
    const isLoginRequest = url.includes('/api/admin/login');

    if (status === 401 && !isLoginRequest) {
      emitUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
