import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-user-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-switcher">
      <div class="current-user">
        <strong>Acting as:</strong> {{currentUser?.firstName}} {{currentUser?.lastName}} 
        ({{currentUser?.role}})
      </div>
      
      <div class="user-options">
        <button 
          *ngFor="let user of allUsers" 
          (click)="switchUser(user.id)"
          [class.active]="user.id === currentUser?.id"
          class="user-btn">
          {{user.firstName}} {{user.lastName}} - {{user.role}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .user-switcher {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .current-user {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .user-btn {
      margin: 0.25rem;
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    
    .user-btn.active {
      background: #3498db;
      color: white;
    }
  `]
})
export class UserSwitcherComponent {
  currentUser: User | null = null;
  allUsers: User[] = [];

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.allUsers = this.authService.getAllUsers();
  }

  switchUser(userId: string): void {
    this.authService.switchUser(userId);
  }
}