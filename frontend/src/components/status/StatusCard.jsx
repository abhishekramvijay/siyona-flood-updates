import { formatDateTime } from '../../utils/formatDate.js';

const NEGATIVE_WORDS = ['high', 'critical', 'down', 'out', 'unavailable', 'not working', 'stopped', 'flooded'];

function toneFor(value) {
  if (!value) return 'default';
  const lower = value.toLowerCase();
  if (NEGATIVE_WORDS.some((word) => lower.includes(word))) return 'danger';
  return 'ok';
}

const TONE_CLASSES = {
  ok: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
};

function StatusRow({ label, value }) {
  const tone = toneFor(value);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]}`}>
        {value || 'Unknown'}
      </span>
    </div>
  );
}

export default function StatusCard({ status }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-slate-900">Current Status</h2>
      <div className="divide-y divide-slate-100">
        <StatusRow label="Water Level" value={status.waterLevel} />
        <StatusRow label="Domestic Water" value={status.domesticWater} />
        <StatusRow label="Pump Status" value={status.pumpStatus} />
        <StatusRow label="Electricity" value={status.electricityStatus} />
        <StatusRow label="Lift Status" value={status.liftStatus} />
      </div>
      <p className="mt-3 text-xs text-slate-400">Last updated: {formatDateTime(status.updatedAt)}</p>
    </section>
  );
}
