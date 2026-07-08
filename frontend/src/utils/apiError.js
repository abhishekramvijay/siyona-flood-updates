/**
 * Extracts a human-readable message from an Axios error, falling back
 * gracefully when the backend's ApiErrorResponse shape isn't present
 * (e.g. network failure, CORS issue, backend down).
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  const data = error.response?.data;

  if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
    const firstField = Object.values(data.fieldErrors)[0];
    if (firstField) return firstField;
  }

  if (data?.message) return data.message;

  if (error.code === 'ERR_NETWORK') {
    return 'Could not reach the server. Check your connection and try again.';
  }

  if (error.message) return error.message;

  return fallback;
}
