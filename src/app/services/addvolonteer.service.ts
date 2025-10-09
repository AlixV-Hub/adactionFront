import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Volonteer {
  firstname: string;
  lastname: string;
  location: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddVolonteerService {
  private apiUrl = 'http://localhost:8080/api/volonteers'; 

  constructor(private http: HttpClient) {}

  addVolonteer(data: Volonteer): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getVolonteers(): Observable<Volonteer[]> {
    return this.http.get<Volonteer[]>(this.apiUrl);
  }
}
