package com.focoman.auth.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "member_join_requests")
public class MemberJoinRequestEntity {

    @Id
    private String id; // Format: REQ-1001

    @Column(nullable = false)
    private String studioId; // Studio ID or Prefix e.g. STU-100201 or RAJ

    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String mobile;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    private String skills; // Comma separated e.g. "Candid Photography, 4K Videography"

    private String primaryExpertise; // e.g. "Candid Photography"

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    private OffsetDateTime requestedAt;
    private OffsetDateTime reviewedAt;

    public MemberJoinRequestEntity() {
    }

    public MemberJoinRequestEntity(String id, String studioId, String applicantName, String email, String mobile, String username, String passwordHash, String skills, String primaryExpertise, String status, OffsetDateTime requestedAt) {
        this.id = id;
        this.studioId = studioId;
        this.applicantName = applicantName;
        this.email = email;
        this.mobile = mobile;
        this.username = username;
        this.passwordHash = passwordHash;
        this.skills = skills;
        this.primaryExpertise = primaryExpertise;
        this.status = status;
        this.requestedAt = requestedAt;
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

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(OffsetDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public OffsetDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(OffsetDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
