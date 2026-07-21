package com.focoman.oms.controller;

import com.focoman.oms.dto.OrderResponse;
import com.focoman.oms.service.OrderService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/oms/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> getOrders(
            @RequestParam(required = false) UUID employeeId,
            @RequestParam(required = false) UUID customerId
    ) {
        if (employeeId != null) {
            return orderService.getOrdersByEmployee(employeeId);
        }
        if (customerId != null) {
            return orderService.getOrdersByCustomer(customerId);
        }
        return orderService.getAllOrders();
    }
}
