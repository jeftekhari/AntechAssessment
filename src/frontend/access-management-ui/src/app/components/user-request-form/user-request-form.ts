import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccessRequestService } from '../../services/access-request';
import { AuthService } from '../../services/auth';
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
  errorMessage = '';
  successMessage = '';

  systems: any[] = [];  

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
    this.accessRequestService.getSystems().subscribe({
      next: (systems) => {
        this.systems = systems;
      },
      error: (error) => {
        console.error('Error loading systems:', error);
      }
    });
  }

  isSystemAdministrator(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.roleId === 3; 
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
          this.successMessage = `Access request submitted successfully: ${response.id}`;
          this.requestForm.reset();
          this.accessRequestService.notifyRequestSubmitted();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = `Failed to submit access request: ${error.message}`;
          this.isSubmitting = false;
        }
      });
    }
  }
}
