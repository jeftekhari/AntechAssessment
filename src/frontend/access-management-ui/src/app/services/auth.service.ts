import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock users matching our database seed data
  private mockUsers: User[] = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'john.doe@dod.gov',
      firstName: 'John',
      lastName: 'Doe',
      department: 'Intelligence',
      role: 'User',
      roleId: 1
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'jane.admin@dod.gov',
      firstName: 'Jane',
      lastName: 'Admin',
      department: 'IT Security',
      role: 'Admin',
      roleId: 2
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'sys.admin@dod.gov',
      firstName: 'System',
      lastName: 'Administrator',
      department: 'System Administration',
      role: 'SystemAdministrator',
      roleId: 3
    }
  ];

  constructor() {
    // Start with the first user (regular user) for demo purposes
    this.currentUserSubject.next(this.mockUsers[0]);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): string {
    return this.currentUserSubject.value?.id || '';
  }

  switchUser(userId: string): void {
    const user = this.mockUsers.find(u => u.id === userId);
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  getAllUsers(): User[] {
    return this.mockUsers;
  }

  canApproveRequests(): boolean {
    const user = this.getCurrentUser();
    return user?.roleId === 2 || user?.roleId === 3; // Admin or SystemAdministrator
  }

  canApproveSpecialRequests(): boolean {
    const user = this.getCurrentUser();
    return user?.roleId === 3; // Only SystemAdministrator
  }
} 