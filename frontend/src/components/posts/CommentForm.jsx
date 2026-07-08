import { useState } from 'react';

const MAX_COMMENT_LENGTH = 300;

export default function CommentForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) {
      setError('Please enter a comment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await onSubmit({ name: name.trim(), comment: comment.trim() });

    if (result?.success) {
      setName('');
      setComment('');
    } else {
      setError(result?.message || 'Could not post your comment.');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name (optional)"
        maxLength={100}
        className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment…"
        maxLength={MAX_COMMENT_LENGTH}
        rows={2}
        className="w-full resize-none rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Posting…' : 'Post Comment'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
