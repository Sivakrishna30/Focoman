package com.focoman.auth.repository;

import com.focoman.auth.entity.CustomerAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerAccountRepository extends JpaRepository<CustomerAccountEntity, String> {
    Optional<CustomerAccountEntity> findByUsernameIgnoreCase(String username);
    Optional<CustomerAccountEntity> findByEmailIgnoreCase(String email);
    Optional<CustomerAccountEntity> findByMobile(String mobile);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
}
