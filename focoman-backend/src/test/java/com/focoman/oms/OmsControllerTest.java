package com.focoman.oms;

import com.focoman.oms.dto.OrderResponse;
import com.focoman.oms.entity.OrderStatus;
import com.focoman.oms.service.OmsDbService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class OmsControllerTest {

    @Autowired
    private OmsDbService omsDbService;

    @Test
    @DisplayName("Should successfully retrieve seeded orders and track guest order by Order ID")
    void testTrackGuestOrderById() {
        Optional<OrderResponse> match = omsDbService.trackGuestOrder("ord-8821");

        assertTrue(match.isPresent());
        assertEquals("Ananya Sharma", match.get().customerName());
        assertEquals("SHOOT_SCHEDULED", match.get().status());
    }

    @Test
    @DisplayName("Should track guest order by mobile number")
    void testTrackGuestOrderByMobile() {
        Optional<OrderResponse> match = omsDbService.trackGuestOrder("+91 98765 12345");

        assertTrue(match.isPresent());
        assertEquals("Rohit Menon", match.get().customerName());
    }

    @Test
    @DisplayName("Should update order status and reflect in live database")
    void testUpdateOrderStatus() {
        List<OrderResponse> orders = omsDbService.getAllOrders();
        assertFalse(orders.isEmpty());

        OrderResponse target = orders.get(0);
        OrderResponse updated = omsDbService.updateOrderStatus(target.orderId(), OrderStatus.COMPLETED);

        assertEquals("COMPLETED", updated.status());
    }
}
