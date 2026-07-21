CREATE SCHEMA IF NOT EXISTS erp;
CREATE SCHEMA IF NOT EXISTS oms;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE erp.studios (
    studio_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_name varchar(150) NOT NULL,
    brand_name varchar(150),
    contact_number varchar(20) NOT NULL,
    email varchar(255),
    gst_number varchar(20),
    address text,
    city varchar(100),
    state varchar(100),
    country varchar(100) NOT NULL DEFAULT 'India',
    status varchar(20) NOT NULL DEFAULT 'ACTIVE',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_studios_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    CONSTRAINT chk_studios_email_format
        CHECK (email IS NULL OR email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

CREATE UNIQUE INDEX uq_studios_email_lower
    ON erp.studios (lower(email))
    WHERE email IS NOT NULL;

CREATE UNIQUE INDEX uq_studios_gst_number
    ON erp.studios (gst_number)
    WHERE gst_number IS NOT NULL;

CREATE INDEX idx_studios_status
    ON erp.studios (status);

CREATE INDEX idx_studios_city_state
    ON erp.studios (city, state);

CREATE TABLE erp.studio_admins (
    admin_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL,
    first_name varchar(100) NOT NULL,
    last_name varchar(100),
    mobile_number varchar(20) NOT NULL,
    email varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    designation varchar(30) NOT NULL,
    profile_image_url varchar(500),
    status varchar(20) NOT NULL DEFAULT 'ACTIVE',
    last_login_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT fk_studio_admins_studio
        FOREIGN KEY (studio_id)
        REFERENCES erp.studios (studio_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_studio_admins_designation
        CHECK (designation IN ('OWNER', 'CO_FOUNDER', 'ADMIN', 'MANAGER')),
    CONSTRAINT chk_studio_admins_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED')),
    CONSTRAINT chk_studio_admins_email_format
        CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

CREATE UNIQUE INDEX uq_studio_admins_studio_email_lower
    ON erp.studio_admins (studio_id, lower(email));

CREATE UNIQUE INDEX uq_studio_admins_studio_mobile
    ON erp.studio_admins (studio_id, mobile_number);

CREATE INDEX idx_studio_admins_studio_status
    ON erp.studio_admins (studio_id, status);

CREATE INDEX idx_studio_admins_designation
    ON erp.studio_admins (designation);

CREATE TABLE erp.employees (
    employee_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL,
    employee_code varchar(50) NOT NULL,
    first_name varchar(100) NOT NULL,
    last_name varchar(100),
    mobile_number varchar(20) NOT NULL,
    email varchar(255),
    designation varchar(40) NOT NULL,
    joining_date date,
    experience_years numeric(4, 1) DEFAULT 0,
    employment_type varchar(20) NOT NULL DEFAULT 'FULL_TIME',
    status varchar(20) NOT NULL DEFAULT 'ACTIVE',
    profile_image_url varchar(500),
    emergency_contact varchar(20),
    address text,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT fk_employees_studio
        FOREIGN KEY (studio_id)
        REFERENCES erp.studios (studio_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_employees_designation
        CHECK (designation IN (
            'PHOTOGRAPHER',
            'VIDEOGRAPHER',
            'EDITOR',
            'ALBUM_DESIGNER',
            'RECEPTIONIST',
            'DRONE_OPERATOR',
            'FREELANCER'
        )),
    CONSTRAINT chk_employees_employment_type
        CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE')),
    CONSTRAINT chk_employees_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED')),
    CONSTRAINT chk_employees_experience_years
        CHECK (experience_years IS NULL OR experience_years >= 0),
    CONSTRAINT chk_employees_email_format
        CHECK (email IS NULL OR email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

CREATE UNIQUE INDEX uq_employees_studio_employee_code
    ON erp.employees (studio_id, employee_code);

CREATE UNIQUE INDEX uq_employees_studio_mobile
    ON erp.employees (studio_id, mobile_number);

CREATE UNIQUE INDEX uq_employees_studio_email_lower
    ON erp.employees (studio_id, lower(email))
    WHERE email IS NOT NULL;

CREATE INDEX idx_employees_studio_status
    ON erp.employees (studio_id, status);

CREATE INDEX idx_employees_studio_designation
    ON erp.employees (studio_id, designation);

CREATE INDEX idx_employees_studio_employment_type
    ON erp.employees (studio_id, employment_type);

CREATE TABLE erp.employee_assignments (
    assignment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    assigned_by_admin_id uuid NOT NULL,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    assignment_status varchar(20) NOT NULL DEFAULT 'ASSIGNED',
    notes text,

    CONSTRAINT fk_employee_assignments_employee
        FOREIGN KEY (employee_id)
        REFERENCES erp.employees (employee_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_employee_assignments_assigned_by_admin
        FOREIGN KEY (assigned_by_admin_id)
        REFERENCES erp.studio_admins (admin_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_employee_assignments_status
        CHECK (assignment_status IN ('ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

CREATE UNIQUE INDEX uq_employee_assignments_active_order_employee
    ON erp.employee_assignments (order_id, employee_id)
    WHERE assignment_status <> 'CANCELLED';

CREATE INDEX idx_employee_assignments_order
    ON erp.employee_assignments (order_id);

CREATE INDEX idx_employee_assignments_employee_status
    ON erp.employee_assignments (employee_id, assignment_status);

CREATE INDEX idx_employee_assignments_assigned_by_admin
    ON erp.employee_assignments (assigned_by_admin_id);

CREATE INDEX idx_employee_assignments_assigned_at
    ON erp.employee_assignments (assigned_at DESC);

CREATE TABLE erp.activity_logs (
    log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL,
    user_type varchar(20) NOT NULL,
    user_id uuid,
    module varchar(50) NOT NULL,
    action varchar(80) NOT NULL,
    description text,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    ip_address inet,

    CONSTRAINT fk_activity_logs_studio
        FOREIGN KEY (studio_id)
        REFERENCES erp.studios (studio_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_activity_logs_user_type
        CHECK (user_type IN ('STUDIO_ADMIN', 'EMPLOYEE', 'CUSTOMER', 'SYSTEM')),
    CONSTRAINT chk_activity_logs_module
        CHECK (length(trim(module)) > 0),
    CONSTRAINT chk_activity_logs_action
        CHECK (length(trim(action)) > 0)
);

CREATE INDEX idx_activity_logs_studio_occurred_at
    ON erp.activity_logs (studio_id, occurred_at DESC);

CREATE INDEX idx_activity_logs_studio_module_action
    ON erp.activity_logs (studio_id, module, action);

CREATE INDEX idx_activity_logs_user
    ON erp.activity_logs (user_type, user_id);

CREATE INDEX idx_activity_logs_ip_address
    ON erp.activity_logs (ip_address);

-- Add this constraint only after the OMS orders table is created.
-- Expected OMS contract:
--   oms.orders(order_id uuid primary key)
--
-- ALTER TABLE erp.employee_assignments
--     ADD CONSTRAINT fk_employee_assignments_order
--     FOREIGN KEY (order_id)
--     REFERENCES oms.orders (order_id)
--     ON UPDATE CASCADE
--     ON DELETE RESTRICT;
