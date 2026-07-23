package com.focoman.oms.controller;

import com.focoman.oms.dto.OrderResponse;
import com.focoman.oms.entity.OrderStatus;
import com.focoman.oms.service.OmsDbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/oms/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OmsDbService omsDbService;

    public OrderController(OmsDbService omsDbService) {
        this.omsDbService = omsDbService;
    }

    @GetMapping
    public List<OrderResponse> getOrders(@RequestParam(required = false) String studioId) {
        if (studioId != null && !studioId.isBlank()) {
            return omsDbService.getOrdersByStudio(studioId);
        }
        return omsDbService.getAllOrders();
    }

    @GetMapping("/track")
    public ResponseEntity<OrderResponse> trackOrder(@RequestParam String query) {
        Optional<OrderResponse> match = omsDbService.trackGuestOrder(query);
        return match.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerIdOrMobile}")
    public List<OrderResponse> getCustomerOrders(@PathVariable String customerIdOrMobile) {
        return omsDbService.getOrdersByCustomer(customerIdOrMobile);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable UUID orderId, @RequestParam OrderStatus status) {
        try {
            OrderResponse updated = omsDbService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
