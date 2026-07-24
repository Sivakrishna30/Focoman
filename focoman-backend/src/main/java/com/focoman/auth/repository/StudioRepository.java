package com.focoman.auth.repository;

import com.focoman.auth.entity.StudioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudioRepository extends JpaRepository<StudioEntity, String> {
    Optional<StudioEntity> findByPrefixIgnoreCase(String prefix);
    Optional<StudioEntity> findByEmailIgnoreCase(String email);
    boolean existsByPrefixIgnoreCase(String prefix);
    boolean existsByEmailIgnoreCase(String email);
    List<StudioEntity> findByCityIgnoreCaseOrderByBrandNameAsc(String city);
    List<StudioEntity> findAllByOrderByBrandNameAsc();
}
