# Focoman Backend

Spring Boot backend for the Focoman photography studio business operating system.

## Architecture

The backend is organized as a modular monolith. Each business module owns its controller, service, repository, entity, DTO, and mapper packages.

## Modules

- `oms`: Order Management System
- `crm`: Customer Relationship Management
- `erp`: Minimal business management
- `partner`: Partner services
- `integrations`: WhatsApp, Google Calendar, Google Drive
- `auth`: Authentication and authorization
- `common`: Shared utilities and base types
- `config`: Application configuration
- `exception`: Error handling

## Tech Stack

- Java 21
- Spring Boot 3
- Maven
- PostgreSQL
- Spring Data JPA
- Spring Security
- Flyway
