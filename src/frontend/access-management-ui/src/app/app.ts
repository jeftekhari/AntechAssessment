import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserRequestForm } from './components/user-request-form/user-request-form';
import { PendingRequestsComponent } from './components/pending-requests/pending-requests';
import { UserSwitcherComponent } from './components/user-switcher/user-switcher';
import { AuditLog } from './components/audit-log/audit-log';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserRequestForm, PendingRequestsComponent, UserSwitcherComponent, AuditLog, CommonModule],
  templateUrl: './app.html',  
  styleUrl: './app.css'
})
export class App {
  protected title = 'access-management-ui';

  constructor(public authService: AuthService) {}

  isSystemAdministrator(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.roleId === 3;
  }
}

