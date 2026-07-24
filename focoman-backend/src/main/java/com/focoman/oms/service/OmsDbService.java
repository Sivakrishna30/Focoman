package com.focoman.oms.service;

import com.focoman.auth.entity.StudioEntity;
import com.focoman.auth.entity.UserEntity;
import com.focoman.auth.repository.StudioRepository;
import com.focoman.auth.repository.UserRepository;
import com.focoman.oms.dto.OrderResponse;
import com.focoman.oms.entity.OrderEntity;
import com.focoman.oms.entity.OrderStatus;
import com.focoman.oms.repository.OrderJpaRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OmsDbService {

    private final OrderJpaRepository orderRepository;
    private final StudioRepository studioRepository;
    private final UserRepository userRepository;

    public OmsDbService(OrderJpaRepository orderRepository, StudioRepository studioRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.studioRepository = studioRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    @Transactional
    public void seedInitialData() {
        if (studioRepository.count() > 0) return;

        // Seed Luminary Studios
        String studioId = "STU-100201";
        StudioEntity luminary = new StudioEntity(
                studioId,
                "RAJ",
                "Luminary Wedding Studios",
                "Luminary Studios",
                "rajesh@luminary.com",
                "+91 98765 43210",
                "Hyderabad",
                OffsetDateTime.now()
        );
        studioRepository.save(luminary);

        // Marketplace studios for location-based discovery.
        studioRepository.save(new StudioEntity("STU-100202", "CHN", "Chennai Frames Studio", "Chennai Frames", "hello@chennaiframes.in", "+91 98840 11223", "Chennai", OffsetDateTime.now()));
        studioRepository.save(new StudioEntity("STU-100203", "MAD", "Madras Lens Collective", "Madras Lens", "book@madraslens.in", "+91 99401 22334", "Chennai", OffsetDateTime.now()));
        studioRepository.save(new StudioEntity("STU-100204", "MUM", "Mumbai Moment Makers", "Moment Makers Mumbai", "hello@momentmakers.in", "+91 98201 33445", "Mumbai", OffsetDateTime.now()));
        studioRepository.save(new StudioEntity("STU-100205", "BLR", "Bangalore Story Studio", "Story Studio Bangalore", "book@storystudio.in", "+91 99000 44556", "Bangalore", OffsetDateTime.now()));

        // Seed Studio Owner
        UserEntity owner = new UserEntity(
                "RAJ-ADM-001",
                studioId,
                "rajesh@luminary.com",
                "Rajesh Kumar",
                "rajesh@luminary.com",
                "+91 98765 43210",
                "password123",
                "STUDIO_OWNER",
                "ACTIVE",
                "Studio Management, Sales, Lead Conversion",
                "Studio Owner",
                OffsetDateTime.now()
        );
        userRepository.save(owner);

        // Seed Crew Member
        UserEntity vikram = new UserEntity(
                "RAJ-MEM-101",
                studioId,
                "vikram_lens@luminary",
                "Vikram Lens",
                "vikram@luminary.com",
                "+91 91234 56789",
                "password123",
                "CREW_MEMBER",
                "ACTIVE",
                "Candid Photography, 4K Videography, Drone Operation",
                "Candid Photography",
                OffsetDateTime.now()
        );
        userRepository.save(vikram);

        // Seed Orders
        seedOrder("ord-8821", "Ananya Sharma", "+91 99887 76655", "CUST-101", studioId, "Wedding", LocalDate.of(2026, 8, 12), OrderStatus.SHOOT_SCHEDULED, "Vikram Lens", "RAJ-MEM-101", "185000.00");
        seedOrder("ord-9042", "Rohit Menon", "+91 98765 12345", "CUST-102", studioId, "Engagement", LocalDate.of(2026, 8, 18), OrderStatus.EDITING, "Vikram Lens", "RAJ-MEM-101", "65000.00");
        seedOrder("ord-3310", "Priya Kapoor", "+91 97654 32109", "CUST-103", studioId, "Birthday", LocalDate.of(2026, 7, 29), OrderStatus.PHOTO_SELECTION, "Vikram Lens", "RAJ-MEM-101", "28000.00");
    }

    private void seedOrder(String displayId, String custName, String mobile, String custId, String studioId, String eventType, LocalDate date, OrderStatus status, String empName, String empId, String amount) {
        OrderEntity order = new OrderEntity(
                UUID.randomUUID(),
                displayId,
                custName,
                mobile,
                custId,
                studioId,
                eventType,
                date,
                status,
                empName,
                empId,
                new BigDecimal(amount),
                OffsetDateTime.now().minusDays(5),
                OffsetDateTime.now()
        );
        orderRepository.save(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> getOrdersByStudio(String studioId) {
        return orderRepository.findByStudioId(studioId).stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> getOrdersByCustomer(String customerIdOrMobile) {
        List<OrderEntity> orders = orderRepository.findByCustomerId(customerIdOrMobile);
        if (orders.isEmpty()) {
            orders = orderRepository.findByCustomerMobile(customerIdOrMobile);
        }
        return orders.stream().map(this::toResponse).toList();
    }

    public Optional<OrderResponse> trackGuestOrder(String query) {
        String trimmed = query.trim();
        Optional<OrderEntity> match = orderRepository.findByDisplayIdIgnoreCase(trimmed);
        if (match.isEmpty()) {
            List<OrderEntity> list = orderRepository.findByCustomerMobile(trimmed);
            if (!list.isEmpty()) {
                match = Optional.of(list.get(0));
            }
        }
        return match.map(this::toResponse);
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, OrderStatus status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        order.setLastUpdated(OffsetDateTime.now());
        OrderEntity saved = orderRepository.save(order);
        return toResponse(saved);
    }

    private OrderResponse toResponse(OrderEntity entity) {
        return new OrderResponse(entity.getId(), entity.getDisplayId(), entity.getStudioId(), entity.getCustomerName(), entity.getCustomerMobile(), entity.getEventType(), entity.getEventDate(), entity.getStatus() != null ? entity.getStatus().name() : OrderStatus.BOOKING_CONFIRMED.name(), entity.getAssignedEmployee(), entity.getAssignedEmployeeId(), entity.getAmount(), entity.getCreatedDate(), entity.getLastUpdated());
    }
}
