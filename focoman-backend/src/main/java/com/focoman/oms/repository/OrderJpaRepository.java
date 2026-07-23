package com.focoman.oms.repository;

import com.focoman.oms.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderJpaRepository extends JpaRepository<OrderEntity, UUID> {
    Optional<OrderEntity> findByDisplayIdIgnoreCase(String displayId);
    List<OrderEntity> findByCustomerMobile(String customerMobile);
    List<OrderEntity> findByCustomerId(String customerId);
    List<OrderEntity> findByStudioId(String studioId);
    List<OrderEntity> findByAssignedEmployeeId(String assignedEmployeeId);
}
