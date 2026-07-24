package com.focoman.crm.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "crm_customers")
public class CustomerEntity {

    @Id
    private String id; // Format: CUST-10001

    @Column(nullable = false)
    private String studioId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String mobile;

    private String email;
    private String city;
    private String address;

    @Column(nullable = false)
    private String leadSource; // INSTAGRAM, WEBSITE, REFERRAL, WALKIN, GOOGLE, WHATSAPP

    @Column(nullable = false)
    private int totalOrders;

    @Column(nullable = false)
    private double totalRevenue;

    private String lastEventDate;
    private String eventTypes; // Comma separated
    private String tags; // Comma separated
    private String notes;

    @Column(nullable = false)
    private String status; // ACTIVE, INACTIVE, BLOCKED

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public CustomerEntity() {}

    public CustomerEntity(String id, String studioId, String name, String mobile, String email, String city, String leadSource, int totalOrders, double totalRevenue, String lastEventDate, String eventTypes, String tags, String status, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.studioId = studioId;
        this.name = name;
        this.mobile = mobile;
        this.email = email;
        this.city = city;
        this.leadSource = leadSource;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.lastEventDate = lastEventDate;
        this.eventTypes = eventTypes;
        this.tags = tags;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudioId() { return studioId; }
    public void setStudioId(String studioId) { this.studioId = studioId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getLeadSource() { return leadSource; }
    public void setLeadSource(String leadSource) { this.leadSource = leadSource; }
    public int getTotalOrders() { return totalOrders; }
    public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }
    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
    public String getLastEventDate() { return lastEventDate; }
    public void setLastEventDate(String lastEventDate) { this.lastEventDate = lastEventDate; }
    public String getEventTypes() { return eventTypes; }
    public void setEventTypes(String eventTypes) { this.eventTypes = eventTypes; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}