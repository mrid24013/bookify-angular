import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Reservacion {
  id?: number;
  espacio: any;
  espacio_nombre?: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

@Injectable({
  providedIn: 'root'
})
//CRUD
export class ReservacionesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reservaciones/`; 

  getReservaciones(): Observable<Reservacion[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        const items = Array.isArray(res?.results) ? res.results : (Array.isArray(res) ? res : []);

        return items.map((item: any) => {
          // Extrae los datos de las reservaciones del backend
          const idEspacio = typeof item.espacio === 'object' ? item.espacio?.id : item.espacio;
          const nombreEspacio = typeof item.espacio === 'object' ? item.espacio?.nombre : (item.espacio_nombre || item.espacio_info?.nombre);

          return {
            ...item,
            espacio: idEspacio,
            espacio_nombre: nombreEspacio
          };
        });
      })
    );
  }

  createReservacion(reserva: Reservacion): Observable<Reservacion> {
    return this.http.post<Reservacion>(this.apiUrl, reserva);
  }

  updateReservacion(id: number, reserva: Reservacion): Observable<Reservacion> {
    return this.http.put<Reservacion>(`${this.apiUrl}${id}/`, reserva);
  }

  deleteReservacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}