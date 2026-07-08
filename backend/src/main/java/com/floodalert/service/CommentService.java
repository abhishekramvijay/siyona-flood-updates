package com.floodalert.service;

import com.floodalert.dto.request.CommentRequest;
import com.floodalert.dto.response.CommentResponse;
import com.floodalert.entity.Comment;
import com.floodalert.exception.ResourceNotFoundException;
import com.floodalert.repository.CommentRepository;
import com.floodalert.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id " + postId);
        }

        Comment comment = Comment.builder()
                .postId(postId)
                .name(StringUtils.hasText(request.getName()) ? request.getName().trim() : null)
                .comment(request.getComment().trim())
                .build();

        Comment saved = commentRepository.save(comment);

        return CommentResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .comment(saved.getComment())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
