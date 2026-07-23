package com.focoman.auth.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "studios")
public class StudioEntity {

    @Id
    private String id; // Format: STU-100201 or RAJ-100201

    @Column(nullable = false, unique = true)
    private String prefix; // e.g. RAJ, STU, MM

    @Column(nullable = false)
    private String name; // e.g. Luminary Wedding Studios

    private String brandName; // e.g. Luminary Studios

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String mobile;

    private String city;

    private OffsetDateTime createdAt;

    public StudioEntity() {
    }

    public StudioEntity(String id, String prefix, String name, String brandName, String email, String mobile, String city, OffsetDateTime createdAt) {
        this.id = id;
        this.prefix = prefix;
        this.name = name;
        this.brandName = brandName;
        this.email = email;
        this.mobile = mobile;
        this.city = city;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
