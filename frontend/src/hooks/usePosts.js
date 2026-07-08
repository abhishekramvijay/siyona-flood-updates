import { useCallback, useEffect, useState } from 'react';
import {
  addComment as addCommentRequest,
  fetchPosts,
  likePost as likePostRequest,
  unlikePost as unlikePostRequest,
} from '../api/postsApi.js';
import { getErrorMessage } from '../utils/apiError.js';
import { getClientId, hasLikedPost, markPostAsLiked, unmarkPostAsLiked } from '../utils/clientId.js';

/**
 * Loads the post timeline and exposes like/comment actions. Refreshes are
 * "silent" after the first successful load (no loading spinner flash) so
 * the 30s auto-refresh doesn't disrupt whatever the resident is reading.
 */
export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load posts.'));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => load({ silent: true }), [load]);

  // Toggles the like for the current browser: likes if not yet liked, unlikes
  // (DELETE /api/posts/{id}/like) if already liked.
  const likePost = useCallback(async (postId) => {
    const clientId = getClientId();

    if (hasLikedPost(postId)) {
      try {
        const result = await unlikePostRequest(postId, clientId);
        unmarkPostAsLiked(postId);
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, likeCount: result.likeCount ?? Math.max(0, post.likeCount - 1) }
              : post
          )
        );
        return { success: true, liked: false };
      } catch (err) {
        return { success: false, message: getErrorMessage(err, 'Could not remove your like.') };
      }
    }

    try {
      const result = await likePostRequest(postId, clientId);
      markPostAsLiked(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likeCount: result.likeCount ?? post.likeCount + 1 } : post
        )
      );
      return { success: true, liked: true };
    } catch (err) {
      if (err.response?.status === 409) {
        // Backend already has a like from this client; sync local state.
        markPostAsLiked(postId);
        return { success: true, liked: true };
      }
      return { success: false, message: getErrorMessage(err, 'Could not like this post.') };
    }
  }, []);

  const addComment = useCallback(async (postId, { name, comment }) => {
    try {
      const newComment = await addCommentRequest(postId, { name, comment });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'Could not post your comment.') };
    }
  }, []);

  return { posts, isLoading, error, refresh, likePost, addComment };
}
