package com.focoman.oms.repository;

import com.focoman.oms.entity.Order;
import com.focoman.oms.entity.OrderStatus;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class OrderRepository {

    private static final UUID STUDIO_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID EMPLOYEE_ARJUN = UUID.fromString("22222222-2222-2222-2222-222222222201");
    private static final UUID EMPLOYEE_MEERA = UUID.fromString("22222222-2222-2222-2222-222222222202");
    private static final UUID EMPLOYEE_RAHUL = UUID.fromString("22222222-2222-2222-2222-222222222203");

    private final List<Order> orders = List.of(
            order("33333333-3333-3333-3333-333333333301", "44444444-4444-4444-4444-444444444401", EMPLOYEE_ARJUN, "Ananya Sharma", "Wedding", "Arjun Nair", LocalDate.of(2026, 8, 12), OrderStatus.SHOOT_SCHEDULED, "Arjun Nair", "185000.00", 12),
            order("33333333-3333-3333-3333-333333333302", "44444444-4444-4444-4444-444444444402", EMPLOYEE_MEERA, "Rohit Menon", "Engagement", "Meera Iyer", LocalDate.of(2026, 8, 18), OrderStatus.BOOKING_CONFIRMED, "Meera Iyer", "65000.00", 10),
            order("33333333-3333-3333-3333-333333333303", "44444444-4444-4444-4444-444444444403", EMPLOYEE_RAHUL, "Priya Kapoor", "Birthday", "Rahul Das", LocalDate.of(2026, 7, 29), OrderStatus.EDITING, "Rahul Das", "28000.00", 22),
            order("33333333-3333-3333-3333-333333333304", "44444444-4444-4444-4444-444444444404", EMPLOYEE_ARJUN, "Karthik Rao", "Baby Shoot", "Arjun Nair", LocalDate.of(2026, 7, 25), OrderStatus.PHOTO_SELECTION, "Arjun Nair", "22000.00", 18),
            order("33333333-3333-3333-3333-333333333305", "44444444-4444-4444-4444-444444444405", EMPLOYEE_MEERA, "Sneha Reddy", "Reception", "Meera Iyer", LocalDate.of(2026, 9, 2), OrderStatus.SHOOT_SCHEDULED, "Meera Iyer", "120000.00", 8),
            order("33333333-3333-3333-3333-333333333306", "44444444-4444-4444-4444-444444444406", EMPLOYEE_RAHUL, "Vikram Singh", "Corporate Event", "Rahul Das", LocalDate.of(2026, 8, 5), OrderStatus.DELIVERY_READY, "Rahul Das", "95000.00", 30),
            order("33333333-3333-3333-3333-333333333307", "44444444-4444-4444-4444-444444444401", EMPLOYEE_ARJUN, "Ananya Sharma", "Reception", "Arjun Nair", LocalDate.of(2026, 8, 14), OrderStatus.BOOKING_CONFIRMED, "Arjun Nair", "90000.00", 6),
            order("33333333-3333-3333-3333-333333333308", "44444444-4444-4444-4444-444444444407", EMPLOYEE_MEERA, "Divya Thomas", "Wedding", "Meera Iyer", LocalDate.of(2026, 10, 3), OrderStatus.BOOKING_CONFIRMED, "Meera Iyer", "210000.00", 4),
            order("33333333-3333-3333-3333-333333333309", "44444444-4444-4444-4444-444444444408", EMPLOYEE_RAHUL, "Aditya Joshi", "Baby Shoot", "Rahul Das", LocalDate.of(2026, 7, 23), OrderStatus.PREVIEW, "Rahul Das", "24000.00", 16),
            order("33333333-3333-3333-3333-333333333310", "44444444-4444-4444-4444-444444444409", EMPLOYEE_ARJUN, "Nisha Verma", "Engagement", "Arjun Nair", LocalDate.of(2026, 8, 28), OrderStatus.SHOOT_SCHEDULED, "Arjun Nair", "72000.00", 9),
            order("33333333-3333-3333-3333-333333333311", "44444444-4444-4444-4444-444444444410", EMPLOYEE_MEERA, "Sanjay Pillai", "Birthday", "Meera Iyer", LocalDate.of(2026, 7, 26), OrderStatus.ALBUM_DESIGN, "Meera Iyer", "32000.00", 20),
            order("33333333-3333-3333-3333-333333333312", "44444444-4444-4444-4444-444444444411", EMPLOYEE_RAHUL, "Isha Khan", "Corporate Event", "Rahul Das", LocalDate.of(2026, 8, 9), OrderStatus.SHOOT_COMPLETED, "Rahul Das", "110000.00", 14),
            order("33333333-3333-3333-3333-333333333313", "44444444-4444-4444-4444-444444444412", EMPLOYEE_ARJUN, "Manoj Krishnan", "Wedding", "Arjun Nair", LocalDate.of(2026, 9, 18), OrderStatus.BOOKING_CONFIRMED, "Arjun Nair", "195000.00", 3),
            order("33333333-3333-3333-3333-333333333314", "44444444-4444-4444-4444-444444444413", EMPLOYEE_MEERA, "Asha George", "Reception", "Meera Iyer", LocalDate.of(2026, 8, 1), OrderStatus.PRINTING, "Meera Iyer", "88000.00", 26),
            order("33333333-3333-3333-3333-333333333315", "44444444-4444-4444-4444-444444444414", EMPLOYEE_RAHUL, "Neeraj Bhat", "Engagement", "Rahul Das", LocalDate.of(2026, 8, 20), OrderStatus.RAW_BACKUP, "Rahul Das", "58000.00", 11),
            order("33333333-3333-3333-3333-333333333316", "44444444-4444-4444-4444-444444444415", EMPLOYEE_ARJUN, "Pooja Desai", "Birthday", "Arjun Nair", LocalDate.of(2026, 7, 31), OrderStatus.COMPLETED, "Arjun Nair", "30000.00", 35),
            order("33333333-3333-3333-3333-333333333317", "44444444-4444-4444-4444-444444444416", EMPLOYEE_MEERA, "Harish Kumar", "Baby Shoot", "Meera Iyer", LocalDate.of(2026, 8, 7), OrderStatus.CUSTOMER_APPROVAL, "Meera Iyer", "26000.00", 17),
            order("33333333-3333-3333-3333-333333333318", "44444444-4444-4444-4444-444444444417", EMPLOYEE_RAHUL, "Latha Narayan", "Wedding", "Rahul Das", LocalDate.of(2026, 9, 6), OrderStatus.SHOOT_SCHEDULED, "Rahul Das", "175000.00", 7)
    );

    public List<Order> findAll() {
        return orders;
    }

    public List<Order> findByEmployeeId(UUID employeeId) {
        return orders.stream()
                .filter(order -> order.employeeId().equals(employeeId))
                .toList();
    }

    public List<Order> findByCustomerId(UUID customerId) {
        return orders.stream()
                .filter(order -> order.customerId().equals(customerId))
                .toList();
    }

    private static Order order(String orderId, String customerId, UUID employeeId, String customerName, String eventType,
                               String assignedEmployee, LocalDate eventDate, OrderStatus status, String employeeName,
                               String amount, int createdDaysAgo) {
        OffsetDateTime createdAt = OffsetDateTime.now().minusDays(createdDaysAgo);
        return new Order(
                UUID.fromString(orderId),
                customerName,
                eventType,
                eventDate,
                status,
                assignedEmployee,
                new BigDecimal(amount),
                createdAt,
                createdAt.plusDays(Math.max(1, createdDaysAgo / 3)),
                STUDIO_ID,
                UUID.fromString(customerId),
                employeeId
        );
    }
}
