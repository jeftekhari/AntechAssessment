-- ===== DATABASE INITIALIZATION SCRIPT =====

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AccessManagementSystem')
BEGIN
    CREATE DATABASE AccessManagementSystem;
    PRINT 'Database AccessManagementSystem created successfully.';
END
ELSE
BEGIN
    PRINT 'Database AccessManagementSystem already exists.';
END
GO

-- ===== SCHEMA CREATION =====

USE AccessManagementSystem;
GO


PRINT 'Creating lookup tables...';

CREATE TABLE request_statuses (
    id INT PRIMARY KEY,
    status_name NVARCHAR(50) NOT NULL, 
    description NVARCHAR(255)
);

GO


PRINT 'Creating core tables...';

CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    cac_id NVARCHAR(50) UNIQUE NOT NULL,  -- CAC certificate identifier
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    created_date DATETIME2 DEFAULT GETDATE(),
    is_active BIT DEFAULT 1
);

CREATE TABLE roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    role_name NVARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(255),
);

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
    
    UNIQUE (user_id, role_id, is_active)
);

CREATE TABLE systems (
    id INT PRIMARY KEY IDENTITY(1,1),
    system_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    classification_level NVARCHAR(50), 
    requires_special_approval BIT DEFAULT 0, 
    is_active BIT DEFAULT 1,
    created_date DATETIME2 DEFAULT GETDATE()
);

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

CREATE TABLE audit_entries (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    action_type NVARCHAR(100) NOT NULL,  
    system_id INT NULL,  
    access_request_id UNIQUEIDENTIFIER NULL,  
    timestamp_utc DATETIME2 DEFAULT GETUTCDATE(),
    performed_by UNIQUEIDENTIFIER NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (access_request_id) REFERENCES access_requests(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

GO


PRINT 'Creating indexes...';

CREATE INDEX IX_audit_entries_timestamp ON audit_entries(timestamp_utc);
CREATE INDEX IX_audit_entries_user_id ON audit_entries(user_id);
CREATE INDEX IX_audit_entries_action_type ON audit_entries(action_type);

CREATE INDEX IX_access_requests_user_id ON access_requests(user_id);
CREATE INDEX IX_access_requests_status_id ON access_requests(status_id);
CREATE INDEX IX_access_requests_created_date ON access_requests(created_date);

CREATE INDEX IX_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IX_user_roles_active ON user_roles(is_active);

GO

-- ===== SEED DATA =====

PRINT 'Inserting roles...';

SET IDENTITY_INSERT roles ON;

INSERT INTO roles (id, role_name, description) VALUES
(1, 'User', 'Standard user - can request access to systems'),
(2, 'Admin', 'Administrator - can approve basic system access requests'),
(3, 'SystemAdministrator', 'System Administrator - can approve all requests including special approval systems');

SET IDENTITY_INSERT roles OFF;

GO


PRINT 'Inserting request statuses...';

INSERT INTO request_statuses (id, status_name, description) VALUES
(1, 'Pending', 'Request submitted and awaiting review'),
(2, 'Approved', 'Request approved by administrator'),
(3, 'Rejected', 'Request denied by administrator'),
(4, 'Withdrawn', 'Request withdrawn by user before review');

GO

PRINT 'Inserting sample systems...';

IF NOT EXISTS (SELECT * FROM systems WHERE system_name = 'JIRA')
INSERT INTO systems (system_name, description, classification_level, requires_special_approval, is_active) VALUES
('JIRA', 'Issue tracking and project management system', 'Confidential', 0, 1),
('SharePoint Collaboration', 'Document management and team collaboration', 'Confidential', 0, 1),
('Database Admin Tools', 'Administrative access to production databases', 'Secret', 1, 1),
('Network Infrastructure Tools', 'Switch and router configuration access', 'Secret', 1, 1),
('Financial Reporting System', 'Access to budget and financial data', 'Confidential', 0, 1),
('Personnel Management System', 'HR and personnel records access', 'Top Secret', 1, 1);

GO


PRINT 'Inserting sample users...';

INSERT INTO users (id, cac_id, email, first_name, last_name, is_active, created_date) VALUES
('11111111-1111-1111-1111-111111111111', '123456789', 'john.doe@dod.gov', 'John', 'Doe', 1, GETDATE()),
('22222222-2222-2222-2222-222222222222', '987654321', 'jane.admin@dod.gov', 'Jane', 'Admin', 1, GETDATE()),
('33333333-3333-3333-3333-333333333333', '111111111', 'sys.admin@dod.gov', 'System', 'Administrator', 1, GETDATE());

INSERT INTO user_roles (user_id, role_id, assigned_by, is_active, assigned_date) VALUES
('11111111-1111-1111-1111-111111111111', 1, '33333333-3333-3333-3333-333333333333', 1, GETDATE()),  -- John Doe: User
('22222222-2222-2222-2222-222222222222', 2, '33333333-3333-3333-3333-333333333333', 1, GETDATE()),  -- Jane Admin: Admin
('33333333-3333-3333-3333-333333333333', 3, '33333333-3333-3333-3333-333333333333', 1, GETDATE());  -- System Admin: SystemAdministrator

GO

-- ALTER TABLE audit_entries ADD performed_by UNIQUEIDENTIFIER NULL;
-- ALTER TABLE audit_entries ADD FOREIGN KEY (performed_by) REFERENCES users(id);

PRINT 'Database initialization completed successfully.';
PRINT 'Schema created: lookup tables, core tables, indexes';
PRINT 'Seed data inserted: roles, request statuses, sample systems, sample users';