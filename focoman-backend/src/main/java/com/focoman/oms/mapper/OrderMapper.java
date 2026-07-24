package com.focoman.oms.mapper;

import com.focoman.oms.dto.OrderResponse;
import com.focoman.oms.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        // TODO: Load customer mobile from Customer entity when customer service is integrated
        // TODO: Generate proper displayId format (e.g., "ORD-001") from order ID
        String displayId = "ORD-" + order.orderId().toString().substring(0, 8).toUpperCase();
        String customerMobile = ""; // TODO: Fetch from Customer entity
        String assignedEmployeeId = order.employeeId() != null ? order.employeeId().toString() : "";
        
        return new OrderResponse(
                order.orderId(),
                displayId,
                order.studioId().toString(),
                order.customerName(),
                customerMobile,
                order.eventType(),
                order.eventDate(),
                order.status().name(),
                order.assignedEmployee(),
                assignedEmployeeId,
                order.amount(),
                order.createdDate(),
                order.lastUpdated()
        );
    }
}
