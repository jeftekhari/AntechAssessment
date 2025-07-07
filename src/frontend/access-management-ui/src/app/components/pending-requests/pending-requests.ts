import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AccessRequestService } from '../../services/access-request';
import { AuthService } from '../../services/auth';
import { AccessRequest } from '../../models/access-request.model';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-requests.html',
  styleUrls: ['./pending-requests.css']
})
export class PendingRequestsComponent implements OnInit, OnDestroy {
  pendingRequests: AccessRequest[] = [];
  isLoading = false;
  errorMessage = '';
  private userSubscription: Subscription = new Subscription();
  private requestSubmittedSubscription: Subscription = new Subscription();

  constructor(
    private accessRequestService: AccessRequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes and reload data when user switches
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadPendingRequests();
      } else {
        this.pendingRequests = [];
        this.errorMessage = 'No user logged in';
      }
    });

    // Fallback: Check for current user after subscription setup
    setTimeout(() => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && this.pendingRequests.length === 0 && !this.isLoading) {
        this.loadPendingRequests();
      }
    }, 0);

    //listen on submit
    this.requestSubmittedSubscription = this.accessRequestService.requestSubmitted$.subscribe(() => {
      this.loadPendingRequests();
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.requestSubmittedSubscription.unsubscribe();
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

    // Admin logic: Admins see ALL pending requests, users see only their own
    if (this.authService.canApproveRequests()) {
      // Admin 
      this.accessRequestService.getAllRequests('Pending').subscribe({
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
    } else {
      // User 
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
  }

  canApprove(): boolean {
    return this.authService.canApproveRequests();
  }

  private extractErrorMessage(error: any): string {
    if (error.status === 400 && error.error) {
      return error.error; 
    }
    
    if (error.status === 403) {
      return 'Insufficient permissions to perform this action';
    }
    
    if (error.status === 404) {
      return 'Request not found or already reviewed';
    }
    
    // Generic 
    return error.error?.message || 'Operation failed';
  }

  approveRequest(id: string): void {
    if (confirm('Are you sure you want to approve this request?')) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.errorMessage = 'No user logged in';
        return;
      }

      this.accessRequestService.reviewRequest(id, { 
        statusId: 2, 
        reviewerId: currentUser.id 
      }).subscribe({
        next: (updatedRequest) => {
          this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error approving request:', error);
          this.errorMessage = this.extractErrorMessage(error);
        }
      });
    }
  }

  rejectRequest(id: string): void {
    if (confirm('Are you sure you want to reject this request?')) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.errorMessage = 'No user logged in';
        return;
      }

      this.accessRequestService.reviewRequest(id, { 
        statusId: 3, 
        reviewerId: currentUser.id 
      }).subscribe({
        next: (updatedRequest) => {
          this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error rejecting request:', error);
          this.errorMessage = this.extractErrorMessage(error);
        }
      });
    }
  }
} 