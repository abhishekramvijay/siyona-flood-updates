package com.floodalert.controller;

import com.floodalert.dto.request.CommentRequest;
import com.floodalert.dto.request.LikeRequest;
import com.floodalert.dto.response.CommentResponse;
import com.floodalert.dto.response.LikeResponse;
import com.floodalert.dto.response.PostResponse;
import com.floodalert.service.CommentService;
import com.floodalert.service.LikeService;
import com.floodalert.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public, read-mostly endpoints for residents: browsing posts, liking, and
 * commenting. No authentication required.
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final LikeService likeService;
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<LikeResponse> likePost(@PathVariable Long id, @Valid @RequestBody LikeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(likeService.likePost(id, request));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<LikeResponse> unlikePost(@PathVariable Long id, @Valid @RequestBody LikeRequest request) {
        return ResponseEntity.ok(likeService.unlikePost(id, request));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id, @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(id, request));
    }
}
