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
      fetch(`${this.apiUrl}/collections`, {  // ✅ /collections
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

  getCities(): Observable<City[]> {
    return this.http.get<Volunteer[]>(`${this.apiUrl}/volunteers`).pipe(
      map((volunteers: Volunteer[]) => {
        const uniqueLocations = new Set<string>();
        volunteers.forEach(v => {
          if (v.location && v.location.trim() !== '') {
            uniqueLocations.add(v.location.trim());
          }
        });

        const cities: City[] = Array.from(uniqueLocations)
          .sort()
          .map((name, index) => ({
            id: index + 1,
            name: name
          }));

        console.log('🏙️ Villes extraites des volontaires:', cities);
        return cities;
      })
    );
  }
}
