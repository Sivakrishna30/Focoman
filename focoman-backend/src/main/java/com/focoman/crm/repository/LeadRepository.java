package com.focoman.crm.repository;

import com.focoman.crm.entity.LeadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<LeadEntity, String> {
    List<LeadEntity> findByStudioId(String studioId);
    List<LeadEntity> findByStudioIdAndStatus(String studioId, String status);
}