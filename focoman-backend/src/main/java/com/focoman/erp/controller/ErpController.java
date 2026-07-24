package com.focoman.erp.controller;

import com.focoman.erp.dto.EmployeeResponse;
import com.focoman.erp.service.ErpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erp")
@CrossOrigin(origins = "*")
public class ErpController {

    private final ErpService erpService;

    public ErpController(ErpService erpService) {
        this.erpService = erpService;
    }

    @GetMapping("/employees")
    public List<EmployeeResponse> getEmployees(@RequestParam String studioId) {
        return erpService.getEmployeesByStudio(studioId);
    }

    @PostMapping("/employees")
    public ResponseEntity<EmployeeResponse> createEmployee(@RequestParam String studioId, @RequestParam String name, @RequestParam String mobile, @RequestParam String role, @RequestParam String username) {
        return ResponseEntity.ok(erpService.createEmployee(studioId, name, mobile, role, username));
    }
}