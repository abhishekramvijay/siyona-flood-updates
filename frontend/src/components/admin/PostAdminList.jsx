import { useState } from 'react';
import EmptyState from '../common/EmptyState.jsx';
import { formatDateTime } from '../../utils/formatDate.js';
import { buildImageUrl } from '../../utils/imageUrl.js';

export default function PostAdminList({ posts, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;

    setDeletingId(postId);
    setError(null);
    const result = await onDelete(postId);
    if (!result?.success) {
      setError(result?.message || 'Could not delete this post.');
    }
    setDeletingId(null);
  };

  if (posts.length === 0) {
    return <EmptyState message="No posts yet." />;
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {posts.map((post) => {
        const imageUrl = buildImageUrl(post.imagePath);
        return (
          <div
            key={post.id}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
            {imageUrl && (
              <img src={imageUrl} alt="" className="h-14 w-14 flex-shrink-0 rounded-md object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-800">{post.message}</p>
              <p className="text-xs text-slate-400">
                {formatDateTime(post.createdAt)} · {post.likeCount} likes · {post.comments?.length ?? 0} comments
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(post.id)}
              disabled={deletingId === post.id}
              className="flex-shrink-0 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
            >
              {deletingId === post.id ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
