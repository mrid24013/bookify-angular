import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Espacio } from '../interfaces/espacio';

@Injectable({
  providedIn: 'root'
})
export class EspaciosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/espacios/`;

  getAll(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(this.apiUrl);
  }

  getById(id: number): Observable<Espacio> {
    return this.http.get<Espacio>(`${this.apiUrl}${id}/`);
  }

  create(espacio: Espacio): Observable<Espacio> {
    return this.http.post<Espacio>(this.apiUrl, espacio);
  }

  update(id: number, espacio: Espacio): Observable<Espacio> {
    return this.http.put<Espacio>(`${this.apiUrl}${id}/`, espacio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}