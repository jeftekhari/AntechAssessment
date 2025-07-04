export interface System {
  id: number;
  systemName: string;
  description?: string;
  classificationLevel?: string;
  requiresSpecialApproval: boolean;
  isActive: boolean;
  createdDate: string;
}
