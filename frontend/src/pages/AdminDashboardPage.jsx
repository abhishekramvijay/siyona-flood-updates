import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as adminApi from '../api/adminApi.js';
import Container from '../components/layout/Container.jsx';
import Header from '../components/layout/Header.jsx';
import Spinner from '../components/common/Spinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import CreatePostForm from '../components/admin/CreatePostForm.jsx';
import StatusForm from '../components/admin/StatusForm.jsx';
import PostAdminList from '../components/admin/PostAdminList.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { usePosts } from '../hooks/usePosts.js';
import { useStatus } from '../hooks/useStatus.js';
import { getErrorMessage } from '../utils/apiError.js';

export default function AdminDashboardPage() {
  const { logout } = useAdminAuth();
  const { posts, isLoading: postsLoading, error: postsError, refresh: refreshPosts } = usePosts();
  const { status, refresh: refreshStatus } = useStatus();

  const handleCreatePost = useCallback(
    async ({ image, message }) => {
      try {
        await adminApi.createPost({ image, message });
        await refreshPosts();
        return { success: true };
      } catch (err) {
        return { success: false, message: getErrorMessage(err, 'Could not publish this post.') };
      }
    },
    [refreshPosts]
  );

  const handleDeletePost = useCallback(
    async (postId) => {
      try {
        await adminApi.deletePost(postId);
        await refreshPosts();
        return { success: true };
      } catch (err) {
        return { success: false, message: getErrorMessage(err, 'Could not delete this post.') };
      }
    },
    [refreshPosts]
  );

  const handleUpdateStatus = useCallback(
    async (form) => {
      try {
        await adminApi.updateStatus(form);
        await refreshStatus();
        return { success: true };
      } catch (err) {
        return { success: false, message: getErrorMessage(err, 'Could not update status.') };
      }
    },
    [refreshStatus]
  );

  return (
    <div className="min-h-screen">
      <Header
        rightSlot={
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-slate-500 hover:text-slate-700">
              View site
            </Link>
            <button type="button" onClick={logout} className="font-medium text-slate-700 hover:text-slate-900">
              Log out
            </button>
          </div>
        }
      />

      <main className="py-6">
        <Container className="max-w-3xl space-y-6">
          <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Create New Post</h2>
            <CreatePostForm onSubmit={handleCreatePost} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Update Current Status</h2>
            <StatusForm currentStatus={status} onSubmit={handleUpdateStatus} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Manage Posts</h2>
            {postsLoading ? (
              <Spinner label="Loading posts…" />
            ) : postsError ? (
              <ErrorMessage message={postsError} onRetry={refreshPosts} />
            ) : (
              <PostAdminList posts={posts} onDelete={handleDeletePost} />
            )}
          </section>
        </Container>
      </main>
    </div>
  );
}
