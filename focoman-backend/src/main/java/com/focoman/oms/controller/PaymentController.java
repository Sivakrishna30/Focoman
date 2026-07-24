package com.focoman.oms.controller;

import com.focoman.oms.dto.PaymentResponse;
import com.focoman.oms.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/oms/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<PaymentResponse> getPayments(@RequestParam(required = false) String studioId, @RequestParam(required = false) UUID orderId) {
        if (orderId != null) return paymentService.getPaymentsByOrder(orderId);
        if (studioId != null) return paymentService.getPaymentsByStudio(studioId);
        return List.of();
    }
}