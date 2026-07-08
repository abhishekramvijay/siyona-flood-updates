/**
 * Formats an ISO timestamp (as returned by the backend, e.g.
 * "2026-07-08T10:15:30") into a readable local date/time string.
 */
export function formatDateTime(isoString) {
  if (!isoString) return 'Unknown';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/** Formats a timestamp as a short relative time, e.g. "5m ago". */
export function formatRelativeTime(isoString) {
  if (!isoString) return 'Unknown';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return 'Just now';

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return formatDateTime(isoString);
}
