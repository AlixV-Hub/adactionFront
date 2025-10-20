import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Volunteer } from '../models/volunteer.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentVolunteerSubject = new BehaviorSubject<Volunteer | null>(null);
  constructor(private http: HttpClient) {
    this.loadCurrentVolunteerFromStorage();
  }

  login(email: string, password: string): Observable<Volunteer | null> {
    this.logout();

    console.log('📤 Envoi de la requête de login pour:', email);

    return this.http.post<Volunteer>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      map((volunteer: Volunteer) => {
        console.log('✅ Connexion réussie:', volunteer.firstname, volunteer.lastname);
        this.setCurrentVolunteer(volunteer);
        return volunteer;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('❌ Échec de connexion:', error.status);
        if (error.status === 401) {
          console.log('⚠️ Identifiants incorrects');
        } else {
          console.error('⚠️ Erreur serveur:', error.message);
        }
        return of(null);
      })
    );
  }

  setCurrentVolunteer(volunteer: Volunteer): void {
    this.currentVolunteerSubject.next(volunteer);
    localStorage.setItem('currentVolunteer', JSON.stringify(volunteer));
    console.log('💾 Session enregistrée pour:', volunteer.firstname, volunteer.lastname);
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
        console.log('🔄 Session restaurée:', volunteer.firstname, volunteer.lastname);
      } catch (e) {
        console.error('❌ Erreur de parsing du localStorage');
        localStorage.removeItem('currentVolunteer');
      }
    }
  }

  logout(): void {
    const currentUser = this.currentVolunteerSubject.value;
    if (currentUser) {
      console.log('👋 Déconnexion de:', currentUser.firstname, currentUser.lastname);
    }
    this.currentVolunteerSubject.next(null);
    localStorage.removeItem('currentVolunteer');
  }
}

 // isAuthenticated(): boolean {
   // return this.currentVolunteerSubject.value !== null;
  //}
//}
