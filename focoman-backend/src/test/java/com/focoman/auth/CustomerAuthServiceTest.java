package com.focoman.auth;

import com.focoman.auth.dto.AuthResponse;
import com.focoman.auth.dto.CustomerLoginRequest;
import com.focoman.auth.dto.CustomerRegisterRequest;
import com.focoman.auth.service.CustomerAuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CustomerAuthServiceTest {

    @Autowired
    private CustomerAuthService customerAuthService;

    @Test
    @DisplayName("Should successfully register a new repeated customer and login")
    void testRegisterAndLoginCustomer() {
        CustomerRegisterRequest reg = new CustomerRegisterRequest(
                "Manish Malhotra",
                "manish@fashion.com",
                "+91 95555 44444",
                "manish_m",
                "custPass123"
        );

        AuthResponse regResponse = customerAuthService.registerCustomer(reg);
        assertTrue(regResponse.success());
        assertEquals("CUSTOMER", regResponse.role());

        CustomerLoginRequest loginRequest = new CustomerLoginRequest("manish_m", "custPass123");
        AuthResponse loginResponse = customerAuthService.loginCustomer(loginRequest);

        assertTrue(loginResponse.success());
        assertEquals("Manish Malhotra", loginResponse.name());
    }

    @Test
    @DisplayName("Should prevent registering duplicate customer email or username")
    void testDuplicateCustomerRegistration() {
        CustomerRegisterRequest reg1 = new CustomerRegisterRequest(
                "Sneha Roy", "sneha@gmail.com", "+91 94444 33333", "sneha_r", "pass123"
        );
        customerAuthService.registerCustomer(reg1);

        CustomerRegisterRequest reg2 = new CustomerRegisterRequest(
                "Sneha Roy 2", "sneha@gmail.com", "+91 94444 33334", "sneha_r2", "pass123"
        );

        AuthResponse dupEmailResponse = customerAuthService.registerCustomer(reg2);
        assertFalse(dupEmailResponse.success());
        assertTrue(dupEmailResponse.message().contains("already registered"));
    }
}
