package com.floodalert.controller;

import com.floodalert.dto.response.MessageResponse;
import com.floodalert.dto.response.PostResponse;
import com.floodalert.service.PostService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Admin-only endpoints for publishing and removing flood update posts.
 * Protected by session-based Spring Security authentication.
 */
@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
@Validated
public class AdminPostController {

    private final PostService postService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PostResponse> createPost(
            @RequestParam("image") MultipartFile image,
            @RequestParam("message") @NotBlank @Size(max = 500) String message) {
        PostResponse response = postService.createPost(message, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(MessageResponse.of("Post deleted successfully"));
    }
}
