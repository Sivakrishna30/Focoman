package com.focoman.crm.repository;

import com.focoman.crm.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, String> {
    List<CustomerEntity> findByStudioId(String studioId);
    List<CustomerEntity> findByStudioIdAndStatus(String studioId, String status);
    List<CustomerEntity> findByMobileContainingOrNameContainingIgnoreCase(String mobile, String name);
}