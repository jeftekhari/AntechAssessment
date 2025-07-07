export interface AuditEntry {
  id: string;
  actionType: string;
  timestampUtc: string;
  accessRequestId?: string;
  requestedUser: string;
  adminActionBy?: string;
  systemAffected?: string;
}
