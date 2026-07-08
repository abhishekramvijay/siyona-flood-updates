import { Link } from 'react-router-dom';
import Container from '../components/layout/Container.jsx';
import Footer from '../components/layout/Footer.jsx';
import Header from '../components/layout/Header.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import Spinner from '../components/common/Spinner.jsx';
import PostList from '../components/posts/PostList.jsx';
import StatusCard from '../components/status/StatusCard.jsx';
import { usePolling } from '../hooks/usePolling.js';
import { usePosts } from '../hooks/usePosts.js';
import { useStatus } from '../hooks/useStatus.js';

const REFRESH_INTERVAL_MS = 30_000;

export default function HomePage() {
  const { posts, isLoading: postsLoading, error: postsError, refresh: refreshPosts, likePost, addComment } =
    usePosts();
  const { status, isLoading: statusLoading, error: statusError, refresh: refreshStatus } = useStatus();

  usePolling(() => {
    refreshPosts();
    refreshStatus();
  }, REFRESH_INTERVAL_MS);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        rightSlot={
          <Link to="/admin" className="text-sm text-slate-500 hover:text-slate-700">
            Admin
          </Link>
        }
      />

      <main className="flex-1 py-6">
        <Container className="space-y-6">
          {statusLoading ? (
            <Spinner label="Loading status…" />
          ) : statusError ? (
            <ErrorMessage message={statusError} onRetry={refreshStatus} />
          ) : (
            status && <StatusCard status={status} />
          )}

          <div>
            <h2 className="mb-3 text-base font-semibold text-slate-900">Updates</h2>
            {postsLoading ? (
              <Spinner label="Loading updates…" />
            ) : postsError ? (
              <ErrorMessage message={postsError} onRetry={refreshPosts} />
            ) : (
              <PostList posts={posts} onLike={likePost} onAddComment={addComment} />
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
