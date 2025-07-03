-- ===== CORE TABLES =====
-- Run this script second (after lookup tables)

USE AccessManagementSystem;
GO

-- Users table (basic info)
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    cac_id NVARCHAR(50) UNIQUE NOT NULL,  -- CAC certificate identifier
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    created_date DATETIME2 DEFAULT GETDATE(),
    is_active BIT DEFAULT 1
);

-- Roles table (defines the hierarchy)
CREATE TABLE roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    role_name NVARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(255),
    hierarchy_level_id INT NOT NULL,
    FOREIGN KEY (hierarchy_level_id) REFERENCES hierarchy_levels(id)
);

-- Junction table for many-to-many relationship between Users and Roles
CREATE TABLE user_roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id UNIQUEIDENTIFIER NOT NULL,
    role_id INT NOT NULL,
    assigned_date DATETIME2 DEFAULT GETDATE(),
    assigned_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    
    -- Prevent duplicate active role assignments
    UNIQUE (user_id, role_id, is_active)
);

-- Systems that users can request access to
CREATE TABLE systems (
    id INT PRIMARY KEY IDENTITY(1,1),
    system_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    classification_level NVARCHAR(50),  -- Generic classification level
    requires_special_approval BIT DEFAULT 0,  -- For authority limits
    is_active BIT DEFAULT 1,
    created_date DATETIME2 DEFAULT GETDATE()
);

-- Main access requests table
CREATE TABLE access_requests (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    system_id INT NOT NULL,
    justification NVARCHAR(1000) NOT NULL,
    status_id INT NOT NULL,
    created_date DATETIME2 DEFAULT GETDATE(),
    reviewed_by UNIQUEIDENTIFIER NULL,
    reviewed_date DATETIME2 NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (system_id) REFERENCES systems(id),
    FOREIGN KEY (status_id) REFERENCES request_statuses(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Audit log entries for all system actions
CREATE TABLE audit_entries (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    action_type NVARCHAR(100) NOT NULL,  -- 'Request Created', 'Request Approved', etc.
    system_id INT NULL,  -- Which system was affected (nullable for user actions)
    access_request_id UNIQUEIDENTIFIER NULL,  -- Link to specific request if applicable
    timestamp_utc DATETIME2 DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (system_id) REFERENCES systems(id),
    FOREIGN KEY (access_request_id) REFERENCES access_requests(id)
);

GO
