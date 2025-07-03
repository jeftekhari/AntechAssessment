-- ===== SEED DATA: SAMPLE SYSTEMS =====

USE AccessManagementSystem;
GO

INSERT INTO systems (system_name, description, classification_level, requires_special_approval, is_active) VALUES
('JIRA', 'Issue tracking and project management system', 'Confidential', 0, 1),
('SharePoint Collaboration', 'Document management and team collaboration', 'Confidential', 0, 1),
('Database Admin Tools', 'Administrative access to production databases', 'Secret', 1, 1),
('Network Infrastructure Tools', 'Switch and router configuration access', 'Secret', 1, 1),
('Financial Reporting System', 'Access to budget and financial data', 'Confidential', 0, 1),
('Personnel Management System', 'HR and personnel records access', 'Top Secret', 1, 1);

GO
