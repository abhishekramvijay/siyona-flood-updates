import { useEffect, useRef } from 'react';

/**
 * Repeatedly invokes `callback` every `intervalMs`, pausing while the tab is
 * hidden to avoid wasted requests, and cleaning up on unmount.
 */
export function usePolling(callback, intervalMs) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') {
        callbackRef.current();
      }
    };

    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
