import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Volunteer } from '../models/volunteer.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/volunteers';
  private currentVolunteerSubject = new BehaviorSubject<Volunteer | null>(null);
  public currentVolunteer$ = this.currentVolunteerSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentVolunteerFromStorage();
  }

  login(email: string, password: string): Observable<Volunteer | null> {
    return this.http.get<Volunteer[]>(this.apiUrl).pipe(
      map((volunteers: Volunteer[]) => {
        const volunteer = volunteers.find(
          (v: Volunteer) =>
            v.email.toLowerCase() === email.toLowerCase() &&
            v.password === password
        );

        if (volunteer) {
          this.setCurrentVolunteer(volunteer);
        }

        return volunteer ?? null;
      })
    );
  }

  setCurrentVolunteer(volunteer: Volunteer): void {
    this.currentVolunteerSubject.next(volunteer);
    localStorage.setItem('currentVolunteer', JSON.stringify(volunteer));
    console.log('✅ Volontaire connecté:', volunteer);
  }

  getCurrentVolunteer(): Volunteer | null {
    return this.currentVolunteerSubject.value;
  }

  private loadCurrentVolunteerFromStorage(): void {
    const stored = localStorage.getItem('currentVolunteer');
    if (stored) {
      try {
        const volunteer: Volunteer = JSON.parse(stored);
        this.currentVolunteerSubject.next(volunteer);
        console.log('✅ Session restaurée:', volunteer);
      } catch (e) {
        console.error('Erreur de parsing du localStorage');
      }
    }
  }

  logout(): void {
    this.currentVolunteerSubject.next(null);
    localStorage.removeItem('currentVolunteer');
    console.log('👋 Déconnexion');
  }

  // Vérifier si connecté
  isAuthenticated(): boolean {
    return this.currentVolunteerSubject.value !== null;
  }
}
