import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditEntry } from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private baseUrl = '/api/audit';

  constructor(private http: HttpClient) { }

  getAllAuditEntries(userId: string): Observable<AuditEntry[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<AuditEntry[]>(this.baseUrl, { params });
  }
}
