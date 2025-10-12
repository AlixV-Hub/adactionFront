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

  private apiUrl = 'http://localhost:8080/api'; // adapte à ton backend

  constructor(private http: HttpClient) {}

  getAllWasteTypes(): Observable<WasteType[]> {
    return this.http.get<WasteType[]>(`${this.apiUrl}/waste-types`);
  }

  createCollect(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/collects`, payload);
  }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/cities`);
  }
}
