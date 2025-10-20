import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WasteType } from '../models/waste.model';


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

    return this.http.post<any>(`${this.apiUrl}/collections`, payload);
  }

  getAllCollections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/collections`);
  }

  deleteCollection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/collections/${id}`);
  }
}
