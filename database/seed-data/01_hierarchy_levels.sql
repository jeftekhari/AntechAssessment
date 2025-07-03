-- ===== SEED DATA: HIERARCHY LEVELS =====

USE AccessManagementSystem;
GO

INSERT INTO hierarchy_levels (id, level_name, description, level_order) VALUES
(1, 'User', 'Standard user - can request access', 1),
(2, 'Admin', 'Administrator - can approve basic requests', 2),
(3, 'SystemAdministrator', 'System Administrator - can approve all requests including special approval systems', 3);

GO
