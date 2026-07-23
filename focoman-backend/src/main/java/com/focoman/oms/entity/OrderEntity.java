package com.focoman.oms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String displayId; // e.g. ord-8821 or FOC-2026-8821

    @Column(nullable = false)
    private String customerName;

    private String customerMobile;

    private String customerId; // Linked to CustomerAccountEntity.id or external customer ID

    @Column(nullable = false)
    private String studioId; // Linked to StudioEntity.id

    private String eventType; // e.g. Wedding, Engagement, Birthday, Corporate Event
    private LocalDate eventDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    private String assignedEmployee; // Name of assigned employee
    private String assignedEmployeeId; // ID of assigned employee

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private OffsetDateTime createdDate;
    private OffsetDateTime lastUpdated;

    public OrderEntity() {
    }

    public OrderEntity(UUID id, String displayId, String customerName, String customerMobile, String customerId, String studioId, String eventType, LocalDate eventDate, OrderStatus status, String assignedEmployee, String assignedEmployeeId, BigDecimal amount, OffsetDateTime createdDate, OffsetDateTime lastUpdated) {
        this.id = id;
        this.displayId = displayId;
        this.customerName = customerName;
        this.customerMobile = customerMobile;
        this.customerId = customerId;
        this.studioId = studioId;
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.status = status;
        this.assignedEmployee = assignedEmployee;
        this.assignedEmployeeId = assignedEmployeeId;
        this.amount = amount;
        this.createdDate = createdDate;
        this.lastUpdated = lastUpdated;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDisplayId() {
        return displayId;
    }

    public void setDisplayId(String displayId) {
        this.displayId = displayId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerMobile() {
        return customerMobile;
    }

    public void setCustomerMobile(String customerMobile) {
        this.customerMobile = customerMobile;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getStudioId() {
        return studioId;
    }

    public void setStudioId(String studioId) {
        this.studioId = studioId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getAssignedEmployee() {
        return assignedEmployee;
    }

    public void setAssignedEmployee(String assignedEmployee) {
        this.assignedEmployee = assignedEmployee;
    }

    public String getAssignedEmployeeId() {
        return assignedEmployeeId;
    }

    public void setAssignedEmployeeId(String assignedEmployeeId) {
        this.assignedEmployeeId = assignedEmployeeId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public OffsetDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(OffsetDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public OffsetDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(OffsetDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
