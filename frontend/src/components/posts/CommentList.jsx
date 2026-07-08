import { formatDateTime } from '../../utils/formatDate.js';

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-slate-400">No comments yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {comments.map((comment) => (
        <li key={comment.id} className="rounded-md bg-slate-50 px-3 py-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-slate-800">{comment.name || 'Anonymous'}</span>
            <span className="text-xs text-slate-400">{formatDateTime(comment.createdAt)}</span>
          </div>
          <p className="mt-0.5 break-words text-sm text-slate-600">{comment.comment}</p>
        </li>
      ))}
    </ul>
  );
}
