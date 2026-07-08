import axiosClient from './axiosClient.js';

/** POST /api/admin/login - establishes a session cookie on success. */
export function login(username, password) {
  return axiosClient
    .post('/api/admin/login', { username, password })
    .then((res) => res.data);
}

/** POST /api/admin/logout - invalidates the session. */
export function logout() {
  return axiosClient.post('/api/admin/logout').then((res) => res.data);
}

/**
 * POST /api/admin/posts - multipart form: image (file) + message (text).
 */
export function createPost({ image, message }) {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('message', message);

  return axiosClient
    .post('/api/admin/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
}

/** DELETE /api/admin/posts/{id} */
export function deletePost(postId) {
  return axiosClient.delete(`/api/admin/posts/${postId}`).then((res) => res.data);
}

/** PUT /api/admin/status */
export function updateStatus({ waterLevel, domesticWater, pumpStatus, electricityStatus, liftStatus }) {
  return axiosClient
    .put('/api/admin/status', { waterLevel, domesticWater, pumpStatus, electricityStatus, liftStatus })
    .then((res) => res.data);
}
