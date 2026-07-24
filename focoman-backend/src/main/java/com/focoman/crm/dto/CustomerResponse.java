package com.focoman.crm.dto;

public record CustomerResponse(
    String id,
    String studioId,
    String name,
    String mobile,
    String email,
    String city,
    String leadSource,
    int totalOrders,
    double totalRevenue,
    String lastEventDate,
    String eventTypes,
    String tags,
    String status
) {}