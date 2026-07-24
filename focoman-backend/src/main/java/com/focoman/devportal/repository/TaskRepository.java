package com.focoman.devportal.repository;

import com.focoman.devportal.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, String> {
    List<TaskEntity> findByStatus(String status);
    List<TaskEntity> findByAssignedTo(String assignedTo);
    List<TaskEntity> findByModule(String module);
    List<TaskEntity> findByType(String type);
}