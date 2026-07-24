package com.focoman.crm.controller;

import com.focoman.crm.dto.CustomerResponse;
import com.focoman.crm.dto.LeadResponse;
import com.focoman.crm.service.CrmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/crm")
@CrossOrigin(origins = "*")
public class CrmController {

    private final CrmService crmService;

    public CrmController(CrmService crmService) {
        this.crmService = crmService;
    }

    @GetMapping("/customers")
    public List<CustomerResponse> getCustomers(@RequestParam String studioId) {
        return crmService.getCustomersByStudio(studioId);
    }

    @GetMapping("/leads")
    public List<LeadResponse> getLeads(@RequestParam String studioId) {
        return crmService.getLeadsByStudio(studioId);
    }

    @PostMapping("/customers")
    public ResponseEntity<CustomerResponse> createCustomer(@RequestParam String studioId, @RequestParam String name, @RequestParam String mobile, @RequestParam(required = false) String email, @RequestParam(required = false) String city, @RequestParam(required = false) String leadSource) {
        return ResponseEntity.ok(crmService.createCustomer(studioId, name, mobile, email, city, leadSource));
    }

    @PostMapping("/leads")
    public ResponseEntity<LeadResponse> createLead(@RequestParam String studioId, @RequestParam String customerName, @RequestParam String customerMobile, @RequestParam String source, @RequestParam String eventType, @RequestParam(required = false) LocalDate eventDate) {
        return ResponseEntity.ok(crmService.createLead(studioId, customerName, customerMobile, source, eventType, eventDate));
    }
}