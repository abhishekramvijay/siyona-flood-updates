import { useState } from 'react';
import { formatRelativeTime } from '../../utils/formatDate.js';
import { buildImageUrl } from '../../utils/imageUrl.js';
import CommentForm from './CommentForm.jsx';
import CommentList from './CommentList.jsx';
import LikeButton from './LikeButton.jsx';

export default function PostCard({ post, onLike, onAddComment }) {
  const [showComments, setShowComments] = useState(false);
  const imageUrl = buildImageUrl(post.imagePath);
  const commentCount = post.comments?.length ?? 0;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          className="h-56 w-full object-cover"
        />
      )}
      <div className="space-y-3 p-4">
        <p className="whitespace-pre-wrap break-words text-sm text-slate-800">{post.message}</p>
        <p className="text-xs text-slate-400">{formatRelativeTime(post.createdAt)}</p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <LikeButton post={post} onLike={onLike} />
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </button>
        </div>

        {showComments && (
          <div className="space-y-3 border-t border-slate-100 pt-3">
            <CommentList comments={post.comments} />
            <CommentForm onSubmit={(payload) => onAddComment(post.id, payload)} />
          </div>
        )}
      </div>
    </article>
  );
}
