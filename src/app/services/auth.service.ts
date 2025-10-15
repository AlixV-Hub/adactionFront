import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Volonteer } from '../models/volonteer.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/volonteers';
  private currentVolunteerSubject = new BehaviorSubject<Volonteer | null>(null);
  public currentVolunteer$ = this.currentVolunteerSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentVolunteerFromStorage();
  }

  login(email: string, password: string): Observable<Volonteer | null> {
    return this.http.get<Volonteer[]>(this.apiUrl).pipe(
      map((volunteers: Volonteer[]) => {
        const volunteer = volunteers.find(
          (v: Volonteer) =>
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

  setCurrentVolunteer(volunteer: Volonteer): void {
    this.currentVolunteerSubject.next(volunteer);
    localStorage.setItem('currentVolunteer', JSON.stringify(volunteer));
    console.log('✅ Volontaire connecté:', volunteer);
  }

  getCurrentVolunteer(): Volonteer | null {
    return this.currentVolunteerSubject.value;
  }

  private loadCurrentVolunteerFromStorage(): void {
    const stored = localStorage.getItem('currentVolunteer');
    if (stored) {
      try {
        const volunteer: Volonteer = JSON.parse(stored);
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
