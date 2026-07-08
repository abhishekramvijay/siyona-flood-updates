package com.floodalert.repository;

import com.floodalert.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByPostIdAndClientId(Long postId, String clientId);

    long countByPostId(Long postId);

    boolean existsByPostIdAndClientId(Long postId, String clientId);

    void deleteAllByPostId(Long postId);

    List<Like> findAllByPostIdIn(List<Long> postIds);
}
