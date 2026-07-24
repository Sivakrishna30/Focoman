package com.focoman.erp.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "erp_employees")
public class EmployeeEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String studioId;

    @Column(nullable = false)
    private String employeeCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String mobile;
    private String email;

    @Column(nullable = false)
    private String role; // PHOTOGRAPHER, VIDEOGRAPHER, EDITOR, ALBUM_DESIGNER, RECEPTIONIST, MANAGER

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String status; // ACTIVE, INACTIVE, ON_LEAVE, TERMINATED

    private String primaryExpertise;
    private String skills; // Comma separated
    private int activeOrders;
    private String joinedDate;
    private String crewHandle;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public EmployeeEntity() {}

    public EmployeeEntity(String id, String studioId, String employeeCode, String name, String mobile, String email, String role, String username, String passwordHash, String status, String primaryExpertise, String skills, int activeOrders, String joinedDate, String crewHandle, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.studioId = studioId;
        this.employeeCode = employeeCode;
        this.name = name;
        this.mobile = mobile;
        this.email = email;
        this.role = role;
        this.username = username;
        this.passwordHash = passwordHash;
        this.status = status;
        this.primaryExpertise = primaryExpertise;
        this.skills = skills;
        this.activeOrders = activeOrders;
        this.joinedDate = joinedDate;
        this.crewHandle = crewHandle;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudioId() { return studioId; }
    public void setStudioId(String studioId) { this.studioId = studioId; }
    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPrimaryExpertise() { return primaryExpertise; }
    public void setPrimaryExpertise(String primaryExpertise) { this.primaryExpertise = primaryExpertise; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public int getActiveOrders() { return activeOrders; }
    public void setActiveOrders(int activeOrders) { this.activeOrders = activeOrders; }
    public String getJoinedDate() { return joinedDate; }
    public void setJoinedDate(String joinedDate) { this.joinedDate = joinedDate; }
    public String getCrewHandle() { return crewHandle; }
    public void setCrewHandle(String crewHandle) { this.crewHandle = crewHandle; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}