import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { WasteType } from '../models/waste.model';
import { Volunteer } from '../models/volunteer.model';

export interface City {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollectService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllWasteTypes(): Observable<WasteType[]> {
    return this.http.get<WasteType[]>(`${this.apiUrl}/waste-types`);
  }

  createCollect(payload: any): Observable<any> {
    console.log('📤 Envoi du payload:', JSON.stringify(payload, null, 2));

    return from(
      fetch(`${this.apiUrl}/collections`, {  // ✅ Changé: /collects → /collections
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    );
  }

  // ✅ Récupère les villes depuis les volontaires
  getCities(): Observable<City[]> {
    return this.http.get<Volunteer[]>(`${this.apiUrl}/volunteers`).pipe(
      map((volunteers: Volunteer[]) => {
        // Extraire les villes uniques
        const uniqueLocations = new Set<string>();
        volunteers.forEach(v => {
          if (v.location && v.location.trim() !== '') {
            uniqueLocations.add(v.location.trim());
          }
        });

        // Convertir en tableau de City avec ID et name
        const cities: City[] = Array.from(uniqueLocations)
          .sort() // Ordre alphabétique
          .map((name, index) => ({
            id: index + 1,
            name: name
          }));

        console.log('🏙️ Villes extraites des volontaires:', cities);
        return cities;
      })
    );
  }

  // ✅ Récupérer toutes les collectes
  getAllCollections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/collections`);
  }

  // ✅ Supprimer une collecte
  deleteCollection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/collections/${id}`);
  }
}
