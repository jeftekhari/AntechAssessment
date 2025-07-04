-- ===== LOOKUP TABLES =====
-- Run this script first

USE AccessManagementSystem;
GO


-- Access request statuses lookup
CREATE TABLE request_statuses (
    id INT PRIMARY KEY,
    status_name NVARCHAR(50) NOT NULL,  -- Pending, Approved, Rejected
    description NVARCHAR(255)
);

GO
