USE AccessManagementSystem;
GO

CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    cac_id NVARCHAR(50) UNIQUE NOT NULL,  
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
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (access_request_id) REFERENCES access_requests(id)
);

GO
