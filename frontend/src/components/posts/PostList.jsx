import EmptyState from '../common/EmptyState.jsx';
import PostCard from './PostCard.jsx';

export default function PostList({ posts, onLike, onAddComment }) {
  if (posts.length === 0) {
    return (
      <EmptyState message={'No updates yet.\nAdmins will post updates here.\nPlease check back shortly.'} />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={onLike} onAddComment={onAddComment} />
      ))}
    </div>
  );
}
