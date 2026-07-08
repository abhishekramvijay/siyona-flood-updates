package com.floodalert.service;

import com.floodalert.dto.request.LikeRequest;
import com.floodalert.dto.response.LikeResponse;
import com.floodalert.entity.Like;
import com.floodalert.exception.DuplicateLikeException;
import com.floodalert.exception.ResourceNotFoundException;
import com.floodalert.repository.LikeRepository;
import com.floodalert.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    @Transactional
    public LikeResponse likePost(Long postId, LikeRequest request) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id " + postId);
        }

        if (likeRepository.existsByPostIdAndClientId(postId, request.getClientId())) {
            throw new DuplicateLikeException("This post has already been liked by this client");
        }

        Like like = Like.builder()
                .postId(postId)
                .clientId(request.getClientId())
                .build();

        try {
            likeRepository.save(like);
        } catch (DataIntegrityViolationException e) {
            // Guards against a race between the existsBy check and the insert
            // (the DB unique constraint is the real source of truth).
            throw new DuplicateLikeException("This post has already been liked by this client");
        }

        long likeCount = likeRepository.countByPostId(postId);

        return LikeResponse.builder()
                .postId(postId)
                .likeCount(likeCount)
                .likedByClient(true)
                .build();
    }

    @Transactional
    public LikeResponse unlikePost(Long postId, LikeRequest request) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id " + postId);
        }

        long deleted = likeRepository.deleteByPostIdAndClientId(postId, request.getClientId());
        if (deleted == 0) {
            throw new ResourceNotFoundException("No like found for this client on this post");
        }

        long likeCount = likeRepository.countByPostId(postId);

        return LikeResponse.builder()
                .postId(postId)
                .likeCount(likeCount)
                .likedByClient(false)
                .build();
    }
}
