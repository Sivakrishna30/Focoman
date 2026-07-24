package com.focoman.erp.service;

import com.focoman.erp.dto.EmployeeResponse;
import com.focoman.erp.entity.EmployeeEntity;
import com.focoman.erp.repository.EmployeeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ErpService {

    private final EmployeeRepository employeeRepository;

    public ErpService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @PostConstruct
    @Transactional
    public void seedEmployees() {
        if (employeeRepository.count() > 0) return;

        String studioId = "STU-100201";

        employeeRepository.save(new EmployeeEntity("EMP-101", studioId, "EMP-LUM-01", "Vikram Reddy", "+91 98001 11223", "vikram@luminary.com", "PHOTOGRAPHER", "vikram_lens", "password123", "ACTIVE", "Candid Photography", "Candid Photography,4K Videography,Drone Operation", 3, "Jan 2026", "vikram_lens@luminary", OffsetDateTime.now(), OffsetDateTime.now()));
        employeeRepository.save(new EmployeeEntity("EMP-102", studioId, "EMP-LUM-02", "Ananya Verma", "+91 98002 22334", "ananya@luminary.com", "EDITOR", "ananya_edit", "password123", "ACTIVE", "Photo Editing", "Photo Editing,Color Grading,Raw Processing", 2, "Feb 2026", "ananya_edit@luminary", OffsetDateTime.now(), OffsetDateTime.now()));
        employeeRepository.save(new EmployeeEntity("EMP-103", studioId, "EMP-LUM-03", "Suresh Babu", "+91 98003 33445", "suresh@luminary.com", "VIDEOGRAPHER", "suresh_video", "password123", "ACTIVE", "4K Videography", "4K Videography,Drone Operation,Editing", 2, "Mar 2026", "suresh_video@luminary", OffsetDateTime.now(), OffsetDateTime.now()));
        employeeRepository.save(new EmployeeEntity("EMP-104", studioId, "EMP-LUM-04", "Divya Krishnan", "+91 98004 44556", "divya@luminary.com", "ALBUM_DESIGNER", "divya_album", "password123", "ACTIVE", "Album Design", "Album Design,Layout Design,Print Production", 1, "Apr 2026", "divya_album@luminary", OffsetDateTime.now(), OffsetDateTime.now()));
        employeeRepository.save(new EmployeeEntity("EMP-105", studioId, "EMP-LUM-05", "Meera Iyer", "+91 98005 55667", "meera@luminary.com", "RECEPTIONIST", "meera_front", "password123", "ACTIVE", "Front Desk", "Front Desk,Customer Service,Scheduling", 0, "May 2026", "meera_front@luminary", OffsetDateTime.now(), OffsetDateTime.now()));
    }

    public List<EmployeeResponse> getEmployeesByStudio(String studioId) {
        return employeeRepository.findByStudioId(studioId).stream().map(this::toResponse).toList();
    }

    public EmployeeResponse createEmployee(String studioId, String name, String mobile, String role, String username) {
        String id = "EMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String code = "EMP-" + studioId.substring(0, 3) + "-" + (int)(Math.random() * 100);
        EmployeeEntity entity = new EmployeeEntity(id, studioId, code, name, mobile, null, role, username, "password123", "ACTIVE", role, "", 0, "New", username + "@" + studioId.toLowerCase(), OffsetDateTime.now(), OffsetDateTime.now());
        return toResponse(employeeRepository.save(entity));
    }

    private EmployeeResponse toResponse(EmployeeEntity e) {
        return new EmployeeResponse(e.getId(), e.getStudioId(), e.getEmployeeCode(), e.getName(), e.getMobile(), e.getEmail(), e.getRole(), e.getUsername(), e.getStatus(), e.getPrimaryExpertise(), e.getSkills(), e.getActiveOrders(), e.getJoinedDate(), e.getCrewHandle());
    }
}