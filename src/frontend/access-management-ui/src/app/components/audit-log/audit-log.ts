import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { AuditService } from '../../services/audit';
import { AuthService } from '../../services/auth';
import { AuditEntry } from '../../models/audit.model';

@Component({
  selector: 'app-audit-log',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.css'
})
export class AuditLog implements OnInit, OnDestroy {
  displayedColumns: string[] = ['timestampUtc', 'actionType', 'requestedUser', 'systemAffected', 'adminActionBy'];
  dataSource = new MatTableDataSource<AuditEntry>();
  isLoading = false;
  errorMessage = '';
  
  @ViewChild(MatSort) sort!: MatSort;
  private userSubscription: Subscription = new Subscription();

  constructor(
    private auditService: AuditService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user && user.roleId === 3) {
        this.loadAuditEntries(user.id);
      } else {
        this.dataSource.data = [];
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  loadAuditEntries(userId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.auditService.getAllAuditEntries(userId).subscribe({
      next: (entries) => {
        this.dataSource.data = entries;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load audit entries';
        this.isLoading = false;
        console.error('Error loading audit entries:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
