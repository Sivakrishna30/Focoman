package com.focoman.oms.mapper;

import com.focoman.oms.dto.OrderResponse;
import com.focoman.oms.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.orderId(),
                order.customerName(),
                order.eventType(),
                order.eventDate(),
                order.status().name(),
                order.assignedEmployee(),
                order.amount(),
                order.createdDate(),
                order.lastUpdated(),
                order.studioId(),
                order.customerId(),
                order.employeeId()
        );
    }
}
