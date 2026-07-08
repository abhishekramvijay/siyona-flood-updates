import { useState } from 'react';
import { hasLikedPost } from '../../utils/clientId.js';

export default function LikeButton({ post, onLike }) {
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState(null);
  const alreadyLiked = hasLikedPost(post.id);

  const handleClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setError(null);
    const result = await onLike(post.id);
    if (result?.success === false) {
      setError(result.message);
    }
    setIsLiking(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLiking}
        aria-pressed={alreadyLiked}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          alreadyLiked
            ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        } disabled:opacity-60`}
      >
        <span aria-hidden="true">{alreadyLiked ? '❤️' : '🤍'}</span>
        <span>{alreadyLiked ? 'Liked' : 'Like'}</span>
      </button>
      <span className="text-sm text-slate-500">{post.likeCount}</span>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
