import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Volonteer } from '../models/volonteer.model';

@Injectable({
  providedIn: 'root'
})
export class VolonteerService {
  private apiUrl = 'http://localhost:8080/api/volonteers';

  constructor(private http: HttpClient) {}

  getAllVolonteers(): Observable<Volonteer[]> {
    return this.http.get<Volonteer[]>(this.apiUrl);
  }

  getVolonteerById(id: number): Observable<Volonteer> {
    return this.http.get<Volonteer>(`${this.apiUrl}/${id}`);
  }

  createVolonteer(volonteer: Volonteer): Observable<Volonteer> {
    return this.http.post<Volonteer>(this.apiUrl, volonteer);
  }

  updateVolonteer(id: number, volonteer: Volonteer): Observable<Volonteer> {
    return this.http.put<Volonteer>(`${this.apiUrl}/${id}`, volonteer);
  }

  deleteVolonteer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
