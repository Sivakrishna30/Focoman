package com.focoman.auth.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    private String id; // Format: STU-ADM-001 or RAJ-MEM-101

    private String studioId; // Links to StudioEntity.id

    @Column(nullable = false, unique = true)
    private String username; // e.g. rajesh@luminary or vikram_lens@luminary

    @Column(nullable = false)
    private String name;

    private String email;
    private String mobile;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role; // STUDIO_OWNER, STUDIO_ADMIN, CREW_MEMBER, CUSTOMER

    @Column(nullable = false)
    private String status; // ACTIVE, PENDING_APPROVAL, INACTIVE

    private String skills; // Comma separated e.g. "Candid Photography,4K Videography"
    private String primaryExpertise; // e.g. "Candid Photography"

    private OffsetDateTime createdAt;

    public UserEntity() {
    }

    public UserEntity(String id, String studioId, String username, String name, String email, String mobile, String passwordHash, String role, String status, String skills, String primaryExpertise, OffsetDateTime createdAt) {
        this.id = id;
        this.studioId = studioId;
        this.username = username;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.passwordHash = passwordHash;
        this.role = role;
        this.status = status;
        this.skills = skills;
        this.primaryExpertise = primaryExpertise;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudioId() {
        return studioId;
    }

    public void setStudioId(String studioId) {
        this.studioId = studioId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getPrimaryExpertise() {
        return primaryExpertise;
    }

    public void setPrimaryExpertise(String primaryExpertise) {
        this.primaryExpertise = primaryExpertise;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
