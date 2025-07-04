export interface AccessRequest {
  id: string;
  userName: string;
  systemName: string;
  justification: string;
  status: string;
  createdDate: string;
  reviewedByName?: string;
  reviewedDate?: string;
}

export interface SubmitAccessRequest {
  userId: string;
  systemId: number;
  justification: string;
}

export interface ReviewDecision {
  statusId: number;
}
