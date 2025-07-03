-- ===== SEED DATA: REQUEST STATUSES =====

USE AccessManagementSystem;
GO

INSERT INTO request_statuses (id, status_name, description) VALUES
(1, 'Pending', 'Request submitted and awaiting review'),
(2, 'Approved', 'Request approved by administrator'),
(3, 'Rejected', 'Request denied by administrator'),
(4, 'Withdrawn', 'Request withdrawn by user before review');

GO
