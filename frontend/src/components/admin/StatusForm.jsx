import { useEffect, useState } from 'react';

const FIELDS = [
  { key: 'waterLevel', label: 'Water Level', placeholder: 'e.g. HIGH, MODERATE, LOW' },
  { key: 'domesticWater', label: 'Domestic Water', placeholder: 'e.g. AVAILABLE, LOW, NOT AVAILABLE' },
  { key: 'pumpStatus', label: 'Pump Status', placeholder: 'e.g. RUNNING, STOPPED' },
  { key: 'electricityStatus', label: 'Electricity Status', placeholder: 'e.g. AVAILABLE, OUT' },
  { key: 'liftStatus', label: 'Lift Status', placeholder: 'e.g. WORKING, OUT_OF_SERVICE' },
];

const EMPTY_FORM = {
  waterLevel: '',
  domesticWater: '',
  pumpStatus: '',
  electricityStatus: '',
  liftStatus: '',
};

export default function StatusForm({ currentStatus, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (currentStatus) {
      setForm({
        waterLevel: currentStatus.waterLevel ?? '',
        domesticWater: currentStatus.domesticWater ?? '',
        pumpStatus: currentStatus.pumpStatus ?? '',
        electricityStatus: currentStatus.electricityStatus ?? '',
        liftStatus: currentStatus.liftStatus ?? '',
      });
    }
  }, [currentStatus]);

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (Object.values(form).some((value) => !value.trim())) {
      setError('Please fill in all status fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(form);
    setIsSubmitting(false);

    if (result?.success) {
      setSuccessMessage('Status updated.');
    } else {
      setError(result?.message || 'Could not update status.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {FIELDS.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label htmlFor={key} className="mb-1 block text-sm font-medium text-slate-700">
            {label}
          </label>
          <input
            id={key}
            type="text"
            value={form[key]}
            onChange={handleChange(key)}
            placeholder={placeholder}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Updating…' : 'Update Status'}
      </button>
    </form>
  );
}
