package com.focoman.auth.service;

import com.focoman.auth.dto.AuthResponse;
import com.focoman.auth.dto.CustomerLoginRequest;
import com.focoman.auth.dto.CustomerRegisterRequest;
import com.focoman.auth.entity.CustomerAccountEntity;
import com.focoman.auth.repository.CustomerAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class CustomerAuthService {

    private final CustomerAccountRepository customerRepository;
    private final Random random = new Random();

    public CustomerAuthService(CustomerAccountRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public AuthResponse registerCustomer(CustomerRegisterRequest request) {
        if (customerRepository.existsByEmailIgnoreCase(request.email())) {
            return AuthResponse.failure("Customer email '" + request.email() + "' is already registered.");
        }

        if (customerRepository.existsByUsernameIgnoreCase(request.username())) {
            return AuthResponse.failure("Username '" + request.username() + "' is already taken.");
        }

        String customerId = "CUST-" + (10000 + random.nextInt(90000));

        CustomerAccountEntity customer = new CustomerAccountEntity(
                customerId,
                request.name(),
                request.email(),
                request.mobile(),
                request.username(),
                request.password(),
                OffsetDateTime.now()
        );

        customerRepository.save(customer);

        return AuthResponse.success(
                "Customer account registered successfully!",
                customerId,
                null,
                null,
                request.username(),
                request.name(),
                "CUSTOMER",
                "ACTIVE",
                "Customer Account"
        );
    }

    public AuthResponse loginCustomer(CustomerLoginRequest request) {
        String identifier = request.identifier().trim();

        Optional<CustomerAccountEntity> customerOpt = customerRepository.findByUsernameIgnoreCase(identifier)
                .or(() -> customerRepository.findByEmailIgnoreCase(identifier))
                .or(() -> customerRepository.findByMobile(identifier));

        if (customerOpt.isEmpty()) {
            return AuthResponse.failure("Customer account '" + identifier + "' not found.");
        }

        CustomerAccountEntity customer = customerOpt.get();

        if (!customer.getPasswordHash().equals(request.password())) {
            return AuthResponse.failure("Invalid password for customer account.");
        }

        return AuthResponse.success(
                "Customer login successful",
                customer.getId(),
                null,
                null,
                customer.getUsername(),
                customer.getName(),
                "CUSTOMER",
                "ACTIVE",
                "Customer Account"
        );
    }
}
