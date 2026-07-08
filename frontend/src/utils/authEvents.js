/**
 * Minimal pub/sub so the Axios interceptor (outside the React tree) can
 * notify AdminAuthContext when a session has expired or was rejected,
 * without introducing a circular import between the two modules.
 */
const listeners = new Set();

export function onUnauthorized(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function emitUnauthorized() {
  listeners.forEach((callback) => callback());
}
