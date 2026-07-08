import axiosClient from './axiosClient.js';

/** GET /api/posts - newest first, each with likeCount + comments. */
export function fetchPosts() {
  return axiosClient.get('/api/posts').then((res) => res.data);
}

/** POST /api/posts/{id}/like - one like per (postId, clientId). */
export function likePost(postId, clientId) {
  return axiosClient
    .post(`/api/posts/${postId}/like`, { clientId })
    .then((res) => res.data);
}

/** DELETE /api/posts/{id}/like - removes this client's like from a post. */
export function unlikePost(postId, clientId) {
  return axiosClient
    .delete(`/api/posts/${postId}/like`, { data: { clientId } })
    .then((res) => res.data);
}

/** POST /api/posts/{id}/comments - name optional, comment required. */
export function addComment(postId, { name, comment }) {
  return axiosClient
    .post(`/api/posts/${postId}/comments`, { name, comment })
    .then((res) => res.data);
}
