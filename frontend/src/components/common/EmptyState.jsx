export default function EmptyState({ message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
