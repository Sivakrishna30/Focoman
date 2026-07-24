package com.focoman.erp.repository;

import com.focoman.erp.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, String> {
    List<EmployeeEntity> findByStudioId(String studioId);
    List<EmployeeEntity> findByStudioIdAndRole(String studioId, String role);
    List<EmployeeEntity> findByStudioIdAndStatus(String studioId, String status);
}