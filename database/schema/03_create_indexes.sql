-- ===== INDEXES FOR PERFORMANCE =====
-- Run this script third (after core tables)

USE AccessManagementSystem;
GO

-- Indexes for sortable/filterable audit table (User Story 2)
CREATE INDEX IX_audit_entries_timestamp ON audit_entries(timestamp_utc);
CREATE INDEX IX_audit_entries_user_id ON audit_entries(user_id);
CREATE INDEX IX_audit_entries_action_type ON audit_entries(action_type);

-- Indexes for access requests queries
CREATE INDEX IX_access_requests_user_id ON access_requests(user_id);
CREATE INDEX IX_access_requests_status_id ON access_requests(status_id);
CREATE INDEX IX_access_requests_created_date ON access_requests(created_date);

-- Index for user role lookups
CREATE INDEX IX_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IX_user_roles_active ON user_roles(is_active);

GO
