import axiosClient from './axiosClient.js';

/** GET /api/status - current society-wide flood status. */
export function fetchStatus() {
  return axiosClient.get('/api/status').then((res) => res.data);
}
