import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessRequest, SubmitAccessRequest, ReviewDecision } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccessRequestService {
  private baseUrl = '/api/accessrequests';

  constructor(private http: HttpClient) { }

  // Get all access requests (with optional status filter)
  getAllRequests(status?: string): Observable<AccessRequest[]> {
    const params = status ? new HttpParams().set('status', status) : new HttpParams();
    return this.http.get<AccessRequest[]>(this.baseUrl, { params });
  }

  // Get specific request by ID
  getRequest(id: string): Observable<AccessRequest> {
    return this.http.get<AccessRequest>(`${this.baseUrl}/${id}`);
  }

  // Submit new access request
  submitRequest(request: SubmitAccessRequest): Observable<AccessRequest> {
    return this.http.post<AccessRequest>(this.baseUrl, request);
  }

  // Review request (approve/reject)
  reviewRequest(id: string, decision: ReviewDecision): Observable<AccessRequest> {
    return this.http.put<AccessRequest>(`${this.baseUrl}/${id}/review`, decision);
  }

  getPendingRequests(userId: string): Observable<AccessRequest[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<AccessRequest[]>(`${this.baseUrl}/pending`, { params });
  }
}
