package com.focoman.oms.service;

import com.focoman.oms.dto.PaymentResponse;
import com.focoman.oms.entity.PaymentEntity;
import com.focoman.oms.repository.PaymentRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @PostConstruct
    @Transactional
    public void seedPayments() {
        if (paymentRepository.count() > 0) return;

        String studioId = "STU-100201";
        paymentRepository.save(new PaymentEntity(UUID.randomUUID(), studioId, UUID.fromString("00000000-0000-0000-0000-000000000001"), new BigDecimal("50000"), "ADVANCE", "UPI", "RECEIVED", OffsetDateTime.now().minusDays(30), "Advance payment for wedding", OffsetDateTime.now(), OffsetDateTime.now()));
        paymentRepository.save(new PaymentEntity(UUID.randomUUID(), studioId, UUID.fromString("00000000-0000-0000-0000-000000000001"), new BigDecimal("25000"), "PARTIAL", "BANK_TRANSFER", "RECEIVED", OffsetDateTime.now().minusDays(15), "Partial payment", OffsetDateTime.now(), OffsetDateTime.now()));
        paymentRepository.save(new PaymentEntity(UUID.randomUUID(), studioId, UUID.fromString("00000000-0000-0000-0000-000000000002"), new BigDecimal("55000"), "FINAL", "CASH", "RECEIVED", OffsetDateTime.now().minusDays(5), "Full payment received", OffsetDateTime.now(), OffsetDateTime.now()));
    }

    public List<PaymentResponse> getPaymentsByStudio(String studioId) {
        return paymentRepository.findByStudioId(studioId).stream().map(this::toResponse).toList();
    }

    public List<PaymentResponse> getPaymentsByOrder(UUID orderId) {
        return paymentRepository.findByOrderId(orderId).stream().map(this::toResponse).toList();
    }

    private PaymentResponse toResponse(PaymentEntity e) {
        return new PaymentResponse(e.getId(), e.getStudioId(), e.getOrderId(), e.getAmount(), e.getPaymentType(), e.getPaymentMode(), e.getPaymentStatus(), e.getPaidAt(), e.getNotes());
    }
}