package com.floodalert.service;

import com.floodalert.dto.response.CommentResponse;
import com.floodalert.dto.response.PostResponse;
import com.floodalert.entity.Comment;
import com.floodalert.entity.Like;
import com.floodalert.entity.Post;
import com.floodalert.exception.ResourceNotFoundException;
import com.floodalert.repository.CommentRepository;
import com.floodalert.repository.LikeRepository;
import com.floodalert.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final FileStorageService fileStorageService;

    /**
     * Returns all posts, newest first, each enriched with its like count
     * and full comment list. Uses batched lookups to avoid N+1 queries.
     */
    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        if (posts.isEmpty()) {
            return List.of();
        }

        List<Long> postIds = posts.stream().map(Post::getId).toList();

        Map<Long, List<Comment>> commentsByPost = commentRepository.findAllByPostIdInOrderByCreatedAtAsc(postIds)
                .stream()
                .collect(Collectors.groupingBy(Comment::getPostId));

        Map<Long, Long> likeCountByPost = likeRepository.findAllByPostIdIn(postIds)
                .stream()
                .collect(Collectors.groupingBy(Like::getPostId, Collectors.counting()));

        return posts.stream()
                .map(post -> toResponse(post, commentsByPost.getOrDefault(post.getId(), List.of()),
                        likeCountByPost.getOrDefault(post.getId(), 0L)))
                .toList();
    }

    @Transactional
    public PostResponse createPost(String message, MultipartFile image) {
        String imagePath = fileStorageService.storeImage(image);

        Post post = Post.builder()
                .message(message)
                .imagePath(imagePath)
                .build();

        Post saved = postRepository.save(post);
        return toResponse(saved, List.of(), 0L);
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + postId));

        commentRepository.deleteAllByPostId(postId);
        likeRepository.deleteAllByPostId(postId);
        postRepository.delete(post);
        fileStorageService.deleteImage(post.getImagePath());
    }

    private PostResponse toResponse(Post post, List<Comment> comments, long likeCount) {
        List<CommentResponse> commentResponses = comments.stream()
                .sorted(Comparator.comparing(Comment::getCreatedAt))
                .map(c -> CommentResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .comment(c.getComment())
                        .createdAt(c.getCreatedAt())
                        .build())
                .toList();

        return PostResponse.builder()
                .id(post.getId())
                .imagePath(post.getImagePath())
                .message(post.getMessage())
                .createdAt(post.getCreatedAt())
                .likeCount(likeCount)
                .comments(commentResponses)
                .build();
    }
}
