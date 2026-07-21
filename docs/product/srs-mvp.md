# ThreadSafe Project FOCOMAN

# Software Requirements Specification (SRS)

Version: 1.0 (MVP)

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for the Focoman platform.
Focoman is a web-based Business Operating System designed specifically for photography studios. It enables studio owners to manage customer enquiries, orders, workflows, employees, payments, customer communication, and delivery from a single platform.
This document serves as the primary reference for designers, developers, testers, and stakeholders during the development lifecycle.

## 2. Product Overview

Focoman simplifies the complete photography business workflow by replacing manual processes involving WhatsApp, notebooks, spreadsheets, and phone calls with one centralized platform.
The system focuses on:

- Order Management
- Customer Management
- Workflow Tracking
- Team Management
- Customer Order Tracking
- WhatsApp Notifications
- Business Operations

## 3. Objectives

The primary objectives are:

- Simplify photography business operations.
- Reduce manual order tracking.
- Improve customer communication.
- Increase operational visibility.
- Reduce missed deadlines.
- Improve team coordination.
- Deliver a simple and modern business management experience.

## 4. Target Users

- Studio Owner
- Responsible for managing the business.
- Employees
- Photographers, videographers, editors, album designers, receptionists, and support staff.
- Customers
- Customers who have booked photography services and need to track their orders.

## 5. Core Modules

### 5.1 Order Management System (OMS)

The Order Management System is the central module of Focoman.
Functions include:

- Create Lead
- Convert Lead to Order
- Assign Team
- Track Workflow
- Update Status
- Add Notes
- Upload Attachments
- Track Payments
- Track Delivery
- View Timeline
- Search Orders

### 5.2 Customer Relationship Management (CRM)

Stores customer information and previous interactions.

- Customer Information
- Name
- Mobile Number
- WhatsApp Number
- Email
- Address
- Customer History
- Previous Orders
- Event History
- Total Business Value
- Pending Payments
- Referral Source
- Internal Notes

### 5.3 Business Management (Minimal ERP)

Supports basic business operations.
Includes:

- Employee Management
- Team Assignment
- Basic Reports
- Dashboard
- Payment Tracking

The MVP intentionally excludes advanced ERP features such as payroll, inventory, manufacturing, and accounting.

## 6. Lead Management

Lead Sources

Automatic

- Website Booking Form
- WhatsApp

Manual

- Phone Call
- Walk-in Customer
- Referral
- Existing Customer

Each lead stores:

- Source
- Date
- Customer Details
- Event Type
- Event Date
- Status

Lead Status

- New
- Contacted
- Negotiation
- Quotation Sent
- Confirmed
- Rejected

## 7. Order Workflow

Pre-Event

```text
Lead
↓
Discussion
↓
Quotation
↓
Negotiation
↓
Advance Payment
↓
Booking Confirmed
↓
Order Created
↓
Google Calendar Entry
↓
Team Assignment
↓
Shoot Scheduled
```

Post-Event

```text
Shoot Completed
↓
RAW Backup
↓
Photo Selection
↓
Editing
↓
Preview
↓
Album Design
↓
Customer Approval
↓
Printing
↓
Packaging
↓
Delivery Ready
↓
Final Payment
↓
Completed
```

## 8. Customer Portal

Every confirmed order generates a secure customer tracking link.
Customers can:

- Track Order Status
- View Workflow Timeline
- View Payment Status
- Download Invoice
- Access Gallery Links
- Raise Queries
- Request Callback

The customer portal is accessible using a secure link or OTP without requiring a permanent account.

## 9. WhatsApp Integration

WhatsApp is the primary communication channel.

Customer Notifications

- Booking Confirmed
- Payment Confirmation
- Shoot Reminder
- Editing Started
- Album Ready
- Printing Started
- Ready for Delivery
- Payment Reminder

Studio Notifications

- New Lead Received
- Tomorrow's Shoot
- Today's Schedule
- Customer Query Received
- Pending Payment Reminder
- Order Delay Alert

## 10. Google Calendar Integration

Upon booking confirmation:

- Create Calendar Event
- Add Event Details
- Set Reminders
- Notify Studio Owner

## 11. Team Management

Studio Owner can:

- Add Employees
- Edit Employee Details
- Assign Roles
- Assign Orders
- View Assigned Tasks
- Track Employee Workload

Typical roles include:

- Photographer
- Videographer
- Editor
- Album Designer
- Receptionist

## 12. Partner Services

Optional services offered alongside the platform:

- Website Creation
- Website Integration
- Logo Design
- Data Migration

Migration supports:

- Excel
- Existing Customer Lists
- Existing Order Records

## 13. Dashboard

The dashboard provides a business overview.
Displays:

- Total Orders
- Active Orders
- Completed Orders
- Today's Shoots
- Pending Payments
- Delayed Orders
- Recent Leads
- Recent Activities
- Team Workload

## 14. User Roles

Studio Owner

- Full system access.

Employee

- Limited access based on assigned permissions.

Customer

- Access only to their own order tracking portal.

## 15. Non-Functional Requirements

Performance

- Fast page loading
- Responsive user interface

Security

- Secure authentication
- Role-based authorization
- Encrypted communication

Usability

- Simple navigation
- Mobile-friendly interface
- Minimal learning curve

Scalability

- Support multiple studios
- Support thousands of orders
- Modular architecture

Reliability

- High system availability
- Automatic backups
- Error logging

## 16. Platform Strategy

Phase 1

- Responsive Web Application
- Admin Dashboard
- Customer Portal

Phase 2

- Android Application

Future phases may include iOS and additional platform integrations.

## 17. Out of Scope (MVP)

The following features are intentionally excluded from the MVP:

- Public Studio Marketplace
- Review & Rating System
- Native Gallery Platform
- Payroll Management
- Inventory Management
- Accounting System
- AI-powered Business Analytics
- Advanced Reporting
- Social Media Integrations (Instagram/Facebook)

## 18. Success Criteria

The MVP will be considered successful if it enables a photography studio to:

- Manage leads efficiently.
- Convert leads into orders.
- Track every order from enquiry to delivery.
- Keep customers informed through the tracking portal.
- Reduce manual follow-ups using WhatsApp notifications.
- Manage employees and assignments effectively.
- Operate daily business activities from a single platform.

## 19. Document Status

- Version: 1.0
- Status: Draft
- Prepared For: Focoman Development Team

Next Documents:

- High Level Design (HLD)
- UI/UX Wireframes
- Low Level Design (LLD)
- Database Design
- API Specification
- Technical Architecture
