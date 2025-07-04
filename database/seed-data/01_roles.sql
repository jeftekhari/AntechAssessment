-- ===== SEED DATA: ROLES =====

USE AccessManagementSystem;
GO

-- Enable inserting explicit IDs
SET IDENTITY_INSERT roles ON;

INSERT INTO roles (id, role_name, description) VALUES
(1, 'User', 'Standard user - can request access to systems'),
(2, 'Admin', 'Administrator - can approve basic system access requests'),
(3, 'SystemAdministrator', 'System Administrator - can approve all requests including special approval systems');

-- Disable explicit ID inserts (back to auto-increment)
SET IDENTITY_INSERT roles OFF;

GO
