package com.focoman.oms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
public class PaymentEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String studioId;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String paymentType; // ADVANCE, PARTIAL, FINAL, REFUND

    private String paymentMode; // CASH, UPI, CARD, BANK_TRANSFER, CHEQUE

    @Column(nullable = false)
    private String paymentStatus; // PENDING, RECEIVED, FAILED, REFUNDED

    private OffsetDateTime paidAt;
    private String notes;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public PaymentEntity() {}

    public PaymentEntity(UUID id, String studioId, UUID orderId, BigDecimal amount, String paymentType, String paymentMode, String paymentStatus, OffsetDateTime paidAt, String notes, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.studioId = studioId;
        this.orderId = orderId;
        this.amount = amount;
        this.paymentType = paymentType;
        this.paymentMode = paymentMode;
        this.paymentStatus = paymentStatus;
        this.paidAt = paidAt;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getStudioId() { return studioId; }
    public void setStudioId(String studioId) { this.studioId = studioId; }
    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public OffsetDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(OffsetDateTime paidAt) { this.paidAt = paidAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}