# Database Schema Documentation

## Overview
This database supports a DoD internal platform for managing user access requests and audit trails for secure systems. The schema implements a role-based access control system with hierarchical approval workflows.

## Database Structure

### Core Entities
- **Users**: Personnel requiring system access (CAC authentication)
- **Roles**: Administrative hierarchy (User → Admin → System Administrator)  
- **Systems**: Secure systems users can request access to
- **Access Requests**: User-submitted requests with approval workflow
- **Audit Entries**: Complete activity log for accountability

### Schema Diagram
![image](https://github.com/user-attachments/assets/db170372-49d9-4486-addc-7331296d72e8)

## Table Relationships

### Authentication & Authorization
- `users` ↔ `user_roles` ↔ `roles` ↔ `hierarchy_levels`
- Many-to-many: Users can have multiple roles

### Access Request Flow
- `access_requests` → `users` (requester)
- `access_requests` → `systems` (target system)
- `access_requests` → `request_statuses` (workflow state)
- `access_requests` → `users` (reviewer)

### Audit Trail
- `audit_entries` → `users` (actor)
- `audit_entries` → `systems` (affected system)
- `audit_entries` → `access_requests` (related request)

## Setup Instructions

### Local Development
1. Create database: `CREATE DATABASE AccessManagementSystem`
2. Run schema scripts in order:
   ```
   schema/01_create_lookup_tables.sql
   schema/02_create_core_tables.sql  
   schema/03_create_indexes.sql
   ```
3. Insert seed data:
   ```
   seed-data/01_hierarchy_levels.sql
   seed-data/02_request_statuses.sql
   seed-data/03_sample_systems.sql
   ```

### Container Deployment
*[Docker setup instructions will be added later]*

## Seed Data

### Hierarchy Levels
- **User** (Level 1): Can request access
- **Admin** (Level 2): Can approve basic requests  
- **System Administrator** (Level 3): Can approve all requests including special approval systems

### Sample Systems
- **Confidential**: JIRA, SharePoint, Financial Reporting (Admin can approve)
- **Secret**: Database Admin Tools, Network Infrastructure (System Admin required)
- **Top Secret**: Personnel Management System (System Admin required)

## Design Assumptions

### Authentication
- **CAC (Common Access Card)** is primary authentication method
- CAC ID stored as unique identifier for users
- Production would integrate with DoD PKI infrastructure

### Authorization Model
- **Hierarchical roles**: System Administrator > Admin > User
- **System classification** drives approval requirements:
  - `requires_special_approval = false`: Admin can approve
  - `requires_special_approval = true`: System Administrator required
- **Authority checking** handled in business logic layer

### Data Classification
- System contains **CUI (Controlled Unclassified Information)** but not PII
- Classification levels are descriptive (`classification_level` field)
- Compliance requirements addressed in application layer

### Audit Trail
- **Complete audit log** for DoD accountability requirements
- **No hard deletes** - requests can be "Withdrawn" to preserve history
- **UTC timestamps** for consistent logging across time zones

### Scalability Considerations
- **Indexes** on frequently queried fields (timestamp, user_id, status)
- **UNIQUEIDENTIFIER** for primary keys to support distributed systems
- **Foreign key constraints** ensure data integrity

### Business Logic
- **Request workflow**: Pending → Approved/Rejected/Withdrawn
- **Email notifications** stubbed (external service integration)
- **Granular permissions** via user_roles junction table

## Questions for Production Implementation

### Integration Points
- Which external systems need provisioning API integration?
- CAC certificate validation service endpoints?
- Email/notification service configuration?

### Compliance Requirements  
- Data retention policies for audit logs?
- Backup and disaster recovery procedures?
- Security scanning and vulnerability assessment integration?

### Operational Concerns
- Database clustering/high availability requirements?
- Performance monitoring and alerting thresholds?
- Automated approval workflows for certain system types?
