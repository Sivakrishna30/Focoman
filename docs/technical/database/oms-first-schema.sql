CREATE SCHEMA IF NOT EXISTS focoman;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE focoman.studios (
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
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_studios_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

CREATE TABLE focoman.admins (
    admin_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
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
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_admins_designation CHECK (designation IN ('OWNER', 'CO_FOUNDER', 'ADMIN', 'MANAGER')),
    CONSTRAINT chk_admins_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED'))
);

CREATE TABLE focoman.roles (
    role_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_code varchar(50) NOT NULL UNIQUE,
    role_name varchar(100) NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE focoman.employees (
    employee_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
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
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_employees_designation CHECK (designation IN ('PHOTOGRAPHER', 'VIDEOGRAPHER', 'EDITOR', 'ALBUM_DESIGNER', 'RECEPTIONIST', 'DRONE_OPERATOR', 'FREELANCER')),
    CONSTRAINT chk_employees_employment_type CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE')),
    CONSTRAINT chk_employees_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'))
);

CREATE TABLE focoman.user_roles (
    user_role_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    admin_id uuid REFERENCES focoman.admins(admin_id) ON DELETE CASCADE,
    employee_id uuid REFERENCES focoman.employees(employee_id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES focoman.roles(role_id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    CONSTRAINT chk_user_roles_one_principal CHECK (
        (admin_id IS NOT NULL AND employee_id IS NULL)
        OR (admin_id IS NULL AND employee_id IS NOT NULL)
    )
);

CREATE TABLE focoman.customers (
    customer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    first_name varchar(100) NOT NULL,
    last_name varchar(100),
    mobile_number varchar(20) NOT NULL,
    whatsapp_number varchar(20),
    email varchar(255),
    address text,
    status varchar(20) NOT NULL DEFAULT 'ACTIVE',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_customers_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED'))
);

CREATE TABLE focoman.leads (
    lead_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    customer_id uuid REFERENCES focoman.customers(customer_id) ON DELETE RESTRICT,
    source varchar(40) NOT NULL,
    event_type varchar(50) NOT NULL,
    event_date date,
    status varchar(30) NOT NULL DEFAULT 'NEW',
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_leads_source CHECK (source IN ('WEBSITE', 'WHATSAPP', 'PHONE_CALL', 'WALK_IN', 'REFERRAL', 'EXISTING_CUSTOMER')),
    CONSTRAINT chk_leads_status CHECK (status IN ('NEW', 'CONTACTED', 'NEGOTIATION', 'QUOTATION_SENT', 'CONFIRMED', 'REJECTED'))
);

CREATE TABLE focoman.orders (
    order_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    customer_id uuid NOT NULL REFERENCES focoman.customers(customer_id) ON DELETE RESTRICT,
    lead_id uuid UNIQUE REFERENCES focoman.leads(lead_id) ON DELETE SET NULL,
    order_number varchar(50) NOT NULL,
    event_type varchar(50) NOT NULL,
    event_name varchar(150),
    event_date date NOT NULL,
    event_location text,
    status varchar(40) NOT NULL DEFAULT 'BOOKING_CONFIRMED',
    priority varchar(20) NOT NULL DEFAULT 'NORMAL',
    assigned_employee_id uuid REFERENCES focoman.employees(employee_id) ON DELETE SET NULL,
    estimated_delivery_date date,
    actual_delivery_date date,
    total_amount numeric(12, 2) NOT NULL DEFAULT 0,
    advance_amount numeric(12, 2) NOT NULL DEFAULT 0,
    balance_amount numeric(12, 2) NOT NULL DEFAULT 0,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    CONSTRAINT uq_orders_studio_order_number UNIQUE (studio_id, order_number),
    CONSTRAINT chk_orders_status CHECK (status IN ('BOOKING_CONFIRMED', 'SHOOT_SCHEDULED', 'SHOOT_COMPLETED', 'RAW_BACKUP', 'PHOTO_SELECTION', 'EDITING', 'PREVIEW', 'ALBUM_DESIGN', 'CUSTOMER_APPROVAL', 'PRINTING', 'PACKAGING', 'DELIVERY_READY', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_orders_priority CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    CONSTRAINT chk_orders_amounts CHECK (total_amount >= 0 AND advance_amount >= 0 AND balance_amount >= 0)
);

CREATE TABLE focoman.order_status_history (
    history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    order_id uuid NOT NULL REFERENCES focoman.orders(order_id) ON DELETE CASCADE,
    old_status varchar(40),
    new_status varchar(40) NOT NULL,
    changed_by_admin_id uuid REFERENCES focoman.admins(admin_id) ON DELETE SET NULL,
    changed_by_employee_id uuid REFERENCES focoman.employees(employee_id) ON DELETE SET NULL,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_order_status_history_actor CHECK (
        changed_by_admin_id IS NOT NULL
        OR changed_by_employee_id IS NOT NULL
    )
);

CREATE TABLE focoman.order_assignments (
    assignment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    order_id uuid NOT NULL REFERENCES focoman.orders(order_id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES focoman.employees(employee_id) ON DELETE RESTRICT,
    assigned_by_admin_id uuid REFERENCES focoman.admins(admin_id) ON DELETE SET NULL,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    assignment_status varchar(20) NOT NULL DEFAULT 'ASSIGNED',
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_order_assignments_status CHECK (assignment_status IN ('ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE focoman.payments (
    payment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    order_id uuid NOT NULL REFERENCES focoman.orders(order_id) ON DELETE CASCADE,
    amount numeric(12, 2) NOT NULL,
    payment_type varchar(20) NOT NULL,
    payment_mode varchar(30),
    payment_status varchar(20) NOT NULL DEFAULT 'RECEIVED',
    paid_at timestamptz,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_payments_amount CHECK (amount > 0),
    CONSTRAINT chk_payments_type CHECK (payment_type IN ('ADVANCE', 'PARTIAL', 'FINAL', 'REFUND')),
    CONSTRAINT chk_payments_status CHECK (payment_status IN ('PENDING', 'RECEIVED', 'FAILED', 'REFUNDED'))
);

CREATE TABLE focoman.notifications (
    notification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid NOT NULL REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    order_id uuid REFERENCES focoman.orders(order_id) ON DELETE CASCADE,
    customer_id uuid REFERENCES focoman.customers(customer_id) ON DELETE SET NULL,
    employee_id uuid REFERENCES focoman.employees(employee_id) ON DELETE SET NULL,
    channel varchar(20) NOT NULL,
    recipient varchar(255) NOT NULL,
    template_code varchar(80),
    message text,
    notification_status varchar(20) NOT NULL DEFAULT 'PENDING',
    sent_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_notifications_channel CHECK (channel IN ('WHATSAPP', 'EMAIL', 'SMS', 'SYSTEM')),
    CONSTRAINT chk_notifications_status CHECK (notification_status IN ('PENDING', 'SENT', 'FAILED', 'CANCELLED'))
);

CREATE TABLE focoman.audit_logs (
    audit_log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id uuid REFERENCES focoman.studios(studio_id) ON DELETE RESTRICT,
    actor_type varchar(20) NOT NULL,
    actor_id uuid,
    module varchar(50) NOT NULL,
    action varchar(80) NOT NULL,
    entity_type varchar(80),
    entity_id uuid,
    description text,
    ip_address inet,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_audit_logs_actor_type CHECK (actor_type IN ('ADMIN', 'EMPLOYEE', 'CUSTOMER', 'SYSTEM'))
);

CREATE UNIQUE INDEX uq_admins_studio_email_lower ON focoman.admins (studio_id, lower(email));
CREATE UNIQUE INDEX uq_admins_studio_mobile ON focoman.admins (studio_id, mobile_number);
CREATE UNIQUE INDEX uq_employees_studio_code ON focoman.employees (studio_id, employee_code);
CREATE UNIQUE INDEX uq_employees_studio_mobile ON focoman.employees (studio_id, mobile_number);
CREATE UNIQUE INDEX uq_customers_studio_mobile ON focoman.customers (studio_id, mobile_number);
CREATE UNIQUE INDEX uq_order_assignments_active ON focoman.order_assignments (studio_id, order_id, employee_id) WHERE assignment_status <> 'CANCELLED';

CREATE INDEX idx_customers_studio_name ON focoman.customers (studio_id, first_name, last_name);
CREATE INDEX idx_leads_studio_status ON focoman.leads (studio_id, status);
CREATE INDEX idx_leads_studio_event_date ON focoman.leads (studio_id, event_date);
CREATE INDEX idx_orders_studio_status ON focoman.orders (studio_id, status);
CREATE INDEX idx_orders_studio_event_date ON focoman.orders (studio_id, event_date);
CREATE INDEX idx_orders_studio_customer ON focoman.orders (studio_id, customer_id);
CREATE INDEX idx_orders_studio_assigned_employee ON focoman.orders (studio_id, assigned_employee_id);
CREATE INDEX idx_order_status_history_order_created ON focoman.order_status_history (order_id, created_at DESC);
CREATE INDEX idx_order_assignments_employee_status ON focoman.order_assignments (studio_id, employee_id, assignment_status);
CREATE INDEX idx_payments_order ON focoman.payments (order_id);
CREATE INDEX idx_notifications_studio_status ON focoman.notifications (studio_id, notification_status);
CREATE INDEX idx_audit_logs_studio_created ON focoman.audit_logs (studio_id, created_at DESC);
