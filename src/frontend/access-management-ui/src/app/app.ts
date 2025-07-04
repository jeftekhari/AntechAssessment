import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserRequestForm } from './components/user-request-form/user-request-form';
import { PendingRequestsComponent } from './components/pending-requests/pending-requests';
import { UserSwitcherComponent } from './components/user-switcher/user-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserRequestForm, PendingRequestsComponent, UserSwitcherComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'access-management-ui';
}

