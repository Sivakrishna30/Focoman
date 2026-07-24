package com.focoman.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "crm_leads")
public class LeadEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String studioId;

    private String customerId;
    private String customerName;
    private String customerMobile;
    private String customerEmail;

    @Column(nullable = false)
    private String source; // WEBSITE, WHATSAPP, PHONE_CALL, WALK_IN, REFERRAL, EXISTING_CUSTOMER

    @Column(nullable = false)
    private String eventType;

    private LocalDate eventDate;

    @Column(nullable = false)
    private String status; // NEW, CONTACTED, NEGOTIATION, QUOTATION_SENT, CONFIRMED, REJECTED

    private String notes;
    private String assignedTo;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public LeadEntity() {}

    public LeadEntity(String id, String studioId, String customerId, String customerName, String customerMobile, String customerEmail, String source, String eventType, LocalDate eventDate, String status, String notes, String assignedTo, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.studioId = studioId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerMobile = customerMobile;
        this.customerEmail = customerEmail;
        this.source = source;
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.status = status;
        this.notes = notes;
        this.assignedTo = assignedTo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudioId() { return studioId; }
    public void setStudioId(String studioId) { this.studioId = studioId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}