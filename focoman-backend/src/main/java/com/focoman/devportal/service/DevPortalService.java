package com.focoman.devportal.service;

import com.focoman.devportal.dto.TaskResponse;
import com.focoman.devportal.entity.TaskEntity;
import com.focoman.devportal.repository.TaskRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DevPortalService {

    private final TaskRepository taskRepository;

    public DevPortalService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @PostConstruct
    @Transactional
    public void seedTasks() {
        if (taskRepository.count() > 0) return;

        // Add team members as initial users (no roles - everyone is a team member)
        taskRepository.save(new TaskEntity("TASK-001", "Team Member - Siva", "Siva Krishna", "TASK", "HIGH", "OPEN", "Siva", "System", "TEAM", OffsetDateTime.now(), OffsetDateTime.now()));
        taskRepository.save(new TaskEntity("TASK-002", "Team Member - Asif", "Asif", "TASK", "HIGH", "OPEN", "Asif", "System", "TEAM", OffsetDateTime.now(), OffsetDateTime.now()));
        taskRepository.save(new TaskEntity("TASK-003", "Team Member - Rohith", "Rohith", "TASK", "HIGH", "OPEN", "Rohith", "System", "TEAM", OffsetDateTime.now(), OffsetDateTime.now()));
        taskRepository.save(new TaskEntity("TASK-004", "Team Member - Manohar", "Manohar", "TASK", "HIGH", "OPEN", "Manohar", "System", "TEAM", OffsetDateTime.now(), OffsetDateTime.now()));
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<TaskResponse> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status).stream().map(this::toResponse).toList();
    }

    public List<TaskResponse> getTasksByAssignee(String assignee) {
        return taskRepository.findByAssignedTo(assignee).stream().map(this::toResponse).toList();
    }

    public TaskResponse createTask(String title, String description, String type, String priority, String reportedBy, String module) {
        String id = "TASK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        TaskEntity entity = new TaskEntity(id, title, description, type, priority, "OPEN", null, reportedBy, module, OffsetDateTime.now(), OffsetDateTime.now());
        return toResponse(taskRepository.save(entity));
    }

    public TaskResponse updateTaskStatus(String taskId, String status) {
        TaskEntity task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        task.setUpdatedAt(OffsetDateTime.now());
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse assignTask(String taskId, String assignedTo) {
        TaskEntity task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setAssignedTo(assignedTo);
        task.setUpdatedAt(OffsetDateTime.now());
        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(String taskId) {
        TaskEntity task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }

    private TaskResponse toResponse(TaskEntity e) {
        return new TaskResponse(e.getId(), e.getTitle(), e.getDescription(), e.getType(), e.getPriority(), e.getStatus(), e.getAssignedTo(), e.getReportedBy(), e.getModule(), e.getCreatedAt(), e.getUpdatedAt());
    }
}