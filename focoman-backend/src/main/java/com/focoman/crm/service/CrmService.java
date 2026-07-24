package com.focoman.crm.service;

import com.focoman.crm.dto.CustomerResponse;
import com.focoman.crm.dto.LeadResponse;
import com.focoman.crm.entity.CustomerEntity;
import com.focoman.crm.entity.LeadEntity;
import com.focoman.crm.repository.CustomerRepository;
import com.focoman.crm.repository.LeadRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CrmService {

    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;

    public CrmService(CustomerRepository customerRepository, LeadRepository leadRepository) {
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
    }

    @PostConstruct
    @Transactional
    public void seedCustomers() {
        if (customerRepository.count() > 0) return;

        String studioId = "STU-100201";

        customerRepository.save(new CustomerEntity("CUST-101", studioId, "Siddharth & Sneha", "+91 99887 76655", "siddharth.kumar@gmail.com", "Hyderabad", "INSTAGRAM", 2, 200000, "2026-08-15", "Wedding & Reception,Pre-Wedding", "VIP,Repeat Client", "ACTIVE", OffsetDateTime.now(), OffsetDateTime.now()));
        customerRepository.save(new CustomerEntity("CUST-102", studioId, "Anita & Rohan Mehta", "+91 97766 55443", "anita.mehta@gmail.com", "Secunderabad", "REFERRAL", 1, 55000, "2026-09-02", "Pre-Wedding Shoot", "", "ACTIVE", OffsetDateTime.now(), OffsetDateTime.now()));
        customerRepository.save(new CustomerEntity("CUST-103", studioId, "Karthik Reddy", "+91 94456 78901", "karthik.r@outlook.com", "Hyderabad", "GOOGLE", 1, 18000, "2026-07-20", "Baby Shower", "New Client", "ACTIVE", OffsetDateTime.now(), OffsetDateTime.now()));
        customerRepository.save(new CustomerEntity("CUST-104", studioId, "Neha & Arjun Patel", "+91 91234 56789", "", "Hyderabad", "WHATSAPP", 1, 75000, "2026-10-05", "Wedding", "Upcoming", "ACTIVE", OffsetDateTime.now(), OffsetDateTime.now()));
        customerRepository.save(new CustomerEntity("CUST-105", studioId, "Preethi Nair", "+91 99001 23456", "preethi.nair@yahoo.com", "Hyderabad", "WEBSITE", 3, 85000, "2026-06-10", "Maternity,Baby Shower,Birthday", "VIP,Repeat Client", "ACTIVE", OffsetDateTime.now(), OffsetDateTime.now()));

        // Seed leads
        leadRepository.save(new LeadEntity("LEAD-001", studioId, null, "Ravi & Priya", "+91 98888 77777", "ravi.p@email.com", "WEBSITE", "Wedding", LocalDate.of(2026, 11, 20), "NEW", "Interested in premium wedding package", null, OffsetDateTime.now(), OffsetDateTime.now()));
        leadRepository.save(new LeadEntity("LEAD-002", studioId, null, "Sunita Verma", "+91 97777 66666", null, "WHATSAPP", "Birthday", LocalDate.of(2026, 9, 15), "CONTACTED", "Enquired about birthday shoot pricing", null, OffsetDateTime.now(), OffsetDateTime.now()));
        leadRepository.save(new LeadEntity("LEAD-003", studioId, null, "Amit Sharma", "+91 96666 55555", "amit.s@email.com", "REFERRAL", "Engagement", LocalDate.of(2026, 12, 5), "QUOTATION_SENT", "Sent quotation for engagement + pre-wedding", null, OffsetDateTime.now(), OffsetDateTime.now()));
    }

    public List<CustomerResponse> getCustomersByStudio(String studioId) {
        return customerRepository.findByStudioId(studioId).stream().map(this::toCustomerResponse).toList();
    }

    public List<LeadResponse> getLeadsByStudio(String studioId) {
        return leadRepository.findByStudioId(studioId).stream().map(this::toLeadResponse).toList();
    }

    public CustomerResponse createCustomer(String studioId, String name, String mobile, String email, String city, String leadSource) {
        String id = "CUST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        CustomerEntity entity = new CustomerEntity(id, studioId, name, mobile, email != null ? email : "", city != null ? city : "", leadSource != null ? leadSource : "WALKIN", 0, 0, "", "", "", "ACTIVE", OffsetDateTime.now(), OffsetDateTime.now());
        return toCustomerResponse(customerRepository.save(entity));
    }

    public LeadResponse createLead(String studioId, String customerName, String customerMobile, String source, String eventType, LocalDate eventDate) {
        String id = "LEAD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LeadEntity entity = new LeadEntity(id, studioId, null, customerName, customerMobile, null, source, eventType, eventDate, "NEW", null, null, OffsetDateTime.now(), OffsetDateTime.now());
        return toLeadResponse(leadRepository.save(entity));
    }

    private CustomerResponse toCustomerResponse(CustomerEntity e) {
        return new CustomerResponse(e.getId(), e.getStudioId(), e.getName(), e.getMobile(), e.getEmail(), e.getCity(), e.getLeadSource(), e.getTotalOrders(), e.getTotalRevenue(), e.getLastEventDate(), e.getEventTypes(), e.getTags(), e.getStatus());
    }

    private LeadResponse toLeadResponse(LeadEntity e) {
        return new LeadResponse(e.getId(), e.getStudioId(), e.getCustomerId(), e.getCustomerName(), e.getCustomerMobile(), e.getCustomerEmail(), e.getSource(), e.getEventType(), e.getEventDate(), e.getStatus(), e.getNotes(), e.getAssignedTo());
    }
}