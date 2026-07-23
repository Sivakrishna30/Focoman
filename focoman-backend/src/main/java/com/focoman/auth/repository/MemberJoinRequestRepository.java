package com.focoman.auth.repository;

import com.focoman.auth.entity.MemberJoinRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberJoinRequestRepository extends JpaRepository<MemberJoinRequestEntity, String> {
    List<MemberJoinRequestEntity> findByStudioId(String studioId);
    List<MemberJoinRequestEntity> findByStudioIdAndStatus(String studioId, String status);
}
