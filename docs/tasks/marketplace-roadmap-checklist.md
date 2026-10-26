# Studio Marketplace & Geolocation Action Items Checklist

This document tracks upcoming verification, testing, and enhancement action items for the Studio Marketplace.

## 1. Action Items
- [ ] **Laptop/Desktop Geolocation Native Permission Testing**:
  - Test `Near by Me` geolocation on desktop browser (Chrome/Edge/Safari).
  - Verify native browser toolbar permission prompt ("focoman.web.app wants to know your location").
  - Test reverse geocoding accuracy for user's city when granted.
  - Test clean error notification when permission is denied.

- [x] **Verified Photography Studios UI Copy & Spacing**:
  - [x] Removed "Cinematography" and "Videography" terms from Marketplace header title & description.
  - [x] Placed "Near by Me" button beside input field.
  - [x] Added generous padding (`px-3.5 pl-2.5`) to input field for comfortable visual spacing.
