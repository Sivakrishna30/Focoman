package com.focoman.oms.repository;

import com.focoman.oms.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, UUID> {
    List<PaymentEntity> findByOrderId(UUID orderId);
    List<PaymentEntity> findByStudioId(String studioId);
}