-- ===== SEED DATA: USERS =====

USE AccessManagementSystem;
GO

-- Insert sample users
INSERT INTO users (id, cac_id, email, first_name, last_name, is_active, created_date) VALUES
('11111111-1111-1111-1111-111111111111', '123456789', 'john.doe@dod.gov', 'John', 'Doe', 1, GETDATE()),
('22222222-2222-2222-2222-222222222222', '987654321', 'jane.admin@dod.gov', 'Jane', 'Admin', 1, GETDATE()),
('33333333-3333-3333-3333-333333333333', '111111111', 'sys.admin@dod.gov', 'System', 'Administrator', 1, GETDATE());

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id, assigned_by, is_active, assigned_date) VALUES
('11111111-1111-1111-1111-111111111111', 1, '33333333-3333-3333-3333-333333333333', 1, GETDATE()),  -- John Doe: User
('22222222-2222-2222-2222-222222222222', 2, '33333333-3333-3333-3333-333333333333', 1, GETDATE()),  -- Jane Admin: Admin
('33333333-3333-3333-3333-333333333333', 3, '33333333-3333-3333-3333-333333333333', 1, GETDATE());  -- System Admin: SystemAdministrator

GO 