package com.focoman.erp.dto;

public record EmployeeResponse(
    String id,
    String studioId,
    String employeeCode,
    String name,
    String mobile,
    String email,
    String role,
    String username,
    String status,
    String primaryExpertise,
    String skills,
    int activeOrders,
    String joinedDate,
    String crewHandle
) {}