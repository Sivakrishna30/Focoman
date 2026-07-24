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

        taskRepository.save(new TaskEntity("TASK-001", "Setup Vercel hosting for frontend", "Deploy Next.js app to Vercel with environment variables", "TASK", "HIGH", "IN_PROGRESS", "Dev Team", "Siva Krishna", "FRONTEND", OffsetDateTime.now(), OffsetDateTime.now()));
        taskRepository.save(new TaskEntity("TASK-002", "Setup Railway for backend", "Deploy Spring Boot to Railway with PostgreSQL", "TASK", "HIGH", "OPEN", "Dev Team", "Siva Krishna", "BACKEND", OffsetDateTime.now(), OffsetDateTime.now()));
        taskRepository.save(new TaskEntity("BUG-001", "Fix CRM page loading state", "CRM page shows loading spinner indefinitely on slow network", "BUG", "MEDIUM", "IN_PROGRESS", "Frontend Dev", "Siva Krishna", "FRONTEND", OffsetDateTime.now(), OffsetDateTime.now()));
        taskRepository.save(new TaskEntity("FEAT-001", "Add WhatsApp notification templates", "Create template management UI for WhatsApp messages", "FEATURE", "MEDIUM", "OPEN", null, "Siva Krishna", "BACKEND", OffsetDateTime.now(), OffsetDateTime.now()));
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

    private TaskResponse toResponse(TaskEntity e) {
        return new TaskResponse(e.getId(), e.getTitle(), e.getDescription(), e.getType(), e.getPriority(), e.getStatus(), e.getAssignedTo(), e.getReportedBy(), e.getModule(), e.getCreatedAt(), e.getUpdatedAt());
    }
}