const HAS_TIMEZONE = /Z$|[+-]\d{2}:?\d{2}$/;

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

/**
 * The backend serializes timestamps as a "naive" Java LocalDateTime (e.g.
 * "2026-07-09T07:38:00") with no timezone/offset designator. That value is
 * always UTC, but `new Date(...)` treats offset-less ISO strings as local
 * time per spec -- silently mis-parsing a UTC instant as if it were already
 * in the viewer's zone. Appending "Z" (when no designator is present) makes
 * the UTC-ness explicit so the browser converts it correctly.
 */
function parseUtcDate(isoString) {
  if (!isoString) return null;

  const normalized = HAS_TIMEZONE.test(isoString) ? isoString : `${isoString}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Formats a backend UTC timestamp into a readable date/time string in the
 * viewer's own local timezone, using Intl.DateTimeFormat (no fixed offsets).
 */
export function formatDateTime(isoString) {
  const date = parseUtcDate(isoString);
  if (!date) return 'Unknown';

  return dateTimeFormatter.format(date);
}

/**
 * Formats a backend UTC timestamp as a relative time (e.g. "5 minutes ago",
 * "2 hours ago") using Intl.RelativeTimeFormat. The diff is computed from
 * epoch milliseconds, so it's correct for viewers in any timezone.
 */
export function formatRelativeTime(isoString) {
  const date = parseUtcDate(isoString);
  if (!date) return 'Unknown';

  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const absSec = Math.abs(diffSec);

  if (absSec < 45) return 'Just now';

  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return relativeTimeFormatter.format(diffMin, 'minute');

  const diffHour = Math.round(diffSec / 3600);
  if (Math.abs(diffHour) < 24) return relativeTimeFormatter.format(diffHour, 'hour');

  const diffDay = Math.round(diffSec / 86400);
  if (Math.abs(diffDay) < 7) return relativeTimeFormatter.format(diffDay, 'day');

  return formatDateTime(isoString);
}
