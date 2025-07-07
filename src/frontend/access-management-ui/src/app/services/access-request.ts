import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AccessRequest, SubmitAccessRequest, ReviewDecision, System } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccessRequestService {
  private baseUrl = '/api/accessrequests';
  
  // notify components about new requests
  private requestSubmittedSubject = new Subject<void>();
  public requestSubmitted$ = this.requestSubmittedSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Get all access requests optional status
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

  // notify that a request was submitted
  notifyRequestSubmitted(): void {
    this.requestSubmittedSubject.next();
  }

  getSystems(): Observable<System[]> {
    return this.http.get<System[]>(`${this.baseUrl}/systems`);
  }
}
