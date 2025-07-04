import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessRequestService } from '../../services/access-request';
import { AuthService } from '../../services/auth.service';
import { AccessRequest } from '../../models/access-request.model';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-requests.html',
  styleUrls: ['./pending-requests.css']
})
export class PendingRequestsComponent implements OnInit {
  pendingRequests: AccessRequest[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private accessRequestService: AccessRequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'No user logged in';
      this.isLoading = false;
      return;
    }

    // For now, we'll show requests for the current user only
    // Later we can add admin view to see all pending requests
    this.accessRequestService.getPendingRequests(currentUser.id).subscribe({
      next: (requests) => {
        this.pendingRequests = requests;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load pending requests';
        this.isLoading = false;
        console.error('Error loading pending requests:', error);
      }
    });
  }

  canApprove(): boolean {
    return this.authService.canApproveRequests();
  }

  approveRequest(id: string): void {
    console.log('Approve request:', id);
  }

  rejectRequest(id: string): void {
    console.log('Reject request:', id);
  }
} 