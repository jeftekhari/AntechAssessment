import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccessRequestService } from '../../services/access-request';
import { AuthService } from '../../services/auth.service';
import { SubmitAccessRequest } from '../../models/access-request.model';

@Component({
  selector: 'app-user-request-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-request-form.html',
  styleUrl: './user-request-form.css'
})
export class UserRequestForm implements OnInit {
  requestForm: FormGroup;
  isSubmitting = false;
  successMessage = 'Access request submitted successfully';
  errorMessage = 'Failed to submit access request';

  systems: any[] = [];  // Array to hold available systems

  constructor(
    private fb: FormBuilder,
    private accessRequestService: AccessRequestService,
    private authService: AuthService
  ) {
    this.requestForm = this.fb.group({
      systemId: ['', Validators.required],
      justification: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.loadSystems();
  }

  loadSystems() {
    // For now, hardcode systems (later we'll create a systems service)
    this.systems = [
      { id: 1, systemName: 'JIRA', description: 'Issue tracking and project management', classificationLevel: 'Confidential', requiresSpecialApproval: false, isActive: true, createdDate: '' },
      { id: 2, systemName: 'SharePoint Collaboration', description: 'Document management and team collaboration', classificationLevel: 'Confidential', requiresSpecialApproval: false, isActive: true, createdDate: '' },
      { id: 3, systemName: 'Database Admin Tools', description: 'Administrative access to production databases', classificationLevel: 'Secret', requiresSpecialApproval: true, isActive: true, createdDate: '' }
    ];
  }

  onSubmit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'No user logged in';
      return;
    }
  
    if (this.requestForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
  
      const request: SubmitAccessRequest = {
        userId: currentUser.id,
        systemId: this.requestForm.value.systemId,
        justification: this.requestForm.value.justification
      };

      this.accessRequestService.submitRequest(request).subscribe({
        next: (response) => {
          this.successMessage = `${this.successMessage}: ${response.id}`;
          this.requestForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = `${this.errorMessage}: ${error.message}`;
          this.isSubmitting = false;
        }
      });
    }
  }
}
