
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Volunteer } from '../models/volunteer.model';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private apiUrl = 'http://localhost:8080/api/volonteers';

  constructor(private http: HttpClient) {}


  getAllVolunteers(): Observable<Volunteer[]> {
    return this.http.get<Volunteer[]>(this.apiUrl);
  }

  getVolunteers(): Observable<Volunteer[]> {
    return this.getAllVolunteers();
  }


  getVolunteerById(id: number): Observable<Volunteer> {
    return this.http.get<Volunteer>(`${this.apiUrl}/${id}`);
  }

  createVolunteer(volunteer: Volunteer): Observable<Volunteer> {
    return this.http.post<Volunteer>(this.apiUrl, volunteer);
  }

  updateVolunteer(id: number, volunteer: Volunteer): Observable<Volunteer> {
    return this.http.put<Volunteer>(`${this.apiUrl}/${id}`, volunteer);
  }

  deleteVolunteer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
