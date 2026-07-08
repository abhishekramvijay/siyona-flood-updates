import { useRef, useState } from 'react';

const MAX_MESSAGE_LENGTH = 500;

export default function CreatePostForm({ onSubmit }) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    setMessage('');
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!image) {
      setError('Please choose an image to upload.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit({ image, message: message.trim() });
    setIsSubmitting(false);

    if (result?.success) {
      setSuccessMessage('Post published.');
      resetForm();
    } else {
      setError(result?.message || 'Could not publish this post.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="image" className="mb-1 block text-sm font-medium text-slate-700">
          Image
        </label>
        <input
          ref={fileInputRef}
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
        />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="mt-2 h-40 w-full rounded-md object-cover" />
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={4}
          placeholder="Describe the update…"
          className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Publishing…' : 'Publish Post'}
      </button>
    </form>
  );
}
