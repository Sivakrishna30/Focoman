package com.focoman.devportal.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "dev_tasks")
public class TaskEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String type; // BUG, FEATURE, ENHANCEMENT, TASK

    @Column(nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false)
    private String status; // OPEN, IN_PROGRESS, IN_REVIEW, TESTING, DONE, CLOSED

    private String assignedTo;

    @Column(nullable = false)
    private String reportedBy;

    private String module; // CRM, ERP, OMS, AUTH, UI, BACKEND, FRONTEND

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public TaskEntity() {}

    public TaskEntity(String id, String title, String description, String type, String priority, String status, String assignedTo, String reportedBy, String module, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.priority = priority;
        this.status = status;
        this.assignedTo = assignedTo;
        this.reportedBy = reportedBy;
        this.module = module;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}