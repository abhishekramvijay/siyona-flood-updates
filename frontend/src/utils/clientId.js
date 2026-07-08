const CLIENT_ID_KEY = 'floodAlert.clientId';
const LIKED_POSTS_KEY = 'floodAlert.likedPostIds';

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (older browsers).
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Returns a stable per-browser UUID, creating and persisting one if needed. */
export function getClientId() {
  let clientId = localStorage.getItem(CLIENT_ID_KEY);
  if (!clientId) {
    clientId = generateUuid();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }
  return clientId;
}

function readLikedPostIds() {
  try {
    const raw = localStorage.getItem(LIKED_POSTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function hasLikedPost(postId) {
  return readLikedPostIds().includes(postId);
}

export function markPostAsLiked(postId) {
  const liked = new Set(readLikedPostIds());
  liked.add(postId);
  localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify([...liked]));
}

export function unmarkPostAsLiked(postId) {
  const liked = new Set(readLikedPostIds());
  liked.delete(postId);
  localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify([...liked]));
}
