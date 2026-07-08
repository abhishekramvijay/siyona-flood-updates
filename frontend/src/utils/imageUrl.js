const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

/**
 * Posts store a relative image path (e.g. "/uploads/xyz.jpg"); this
 * resolves it against the backend origin so <img> tags load correctly
 * regardless of which host serves the frontend.
 */
export function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${baseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}
