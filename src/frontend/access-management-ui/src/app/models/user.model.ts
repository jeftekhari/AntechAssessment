export interface User {
  id: string;
  cacId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdDate: string;
  isActive: boolean;
}

export interface UserRoleAssignment {
  roleId: number;
  roleName: string;
  description?: string;
  assignedDate: string;
}
