import { useCallback, useEffect, useState } from 'react';
import { fetchStatus } from '../api/statusApi.js';
import { getErrorMessage } from '../utils/apiError.js';

export function useStatus() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await fetchStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load the current status.'));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => load({ silent: true }), [load]);

  return { status, isLoading, error, refresh };
}
