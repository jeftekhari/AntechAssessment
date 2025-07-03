-- ===== LOOKUP TABLES =====
-- Run this script first

USE AccessManagementSystem;
GO

-- Hierarchy levels lookup table
CREATE TABLE hierarchy_levels (
    id INT PRIMARY KEY,
    level_name NVARCHAR(50) NOT NULL,
    description NVARCHAR(255),
    level_order INT NOT NULL  -- For easy comparison (1=lowest, 3=highest)
);

-- Access request statuses lookup
CREATE TABLE request_statuses (
    id INT PRIMARY KEY,
    status_name NVARCHAR(50) NOT NULL,  -- Pending, Approved, Rejected
    description NVARCHAR(255)
);

GO
