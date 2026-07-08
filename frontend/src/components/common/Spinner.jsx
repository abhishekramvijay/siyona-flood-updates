export default function Spinner({ label = 'Loading…', size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'h-4 w-4 border-2' : 'h-8 w-8 border-2';

  return (
    <div className="flex items-center justify-center gap-3 py-8 text-slate-500">
      <span
        className={`${sizeClasses} animate-spin rounded-full border-slate-300 border-t-brand-600`}
        role="status"
        aria-label={label}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
