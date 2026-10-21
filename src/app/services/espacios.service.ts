import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Espacio {
  id?: number;
  nombre: string;
  descripcion?: string;
  capacidad: number;
  activo?: boolean;
  disponible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
//CRUD
export class EspaciosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/espacios/`;

  getEspacios(): Observable<Espacio[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        // Extrae los datos de los espacios del backend
        const items = Array.isArray(res?.results) ? res.results : (Array.isArray(res) ? res : []);
        return items.map((item: any) => ({
          ...item,
          activo: item.activo ?? item.disponible ?? true
        }));
      })
    );
  }

  createEspacio(espacio: Espacio): Observable<Espacio> {
    const payload = { ...espacio, disponible: espacio.activo };
    return this.http.post<Espacio>(this.apiUrl, payload);
  }

  updateEspacio(id: number, espacio: Espacio): Observable<Espacio> {
    const payload = { ...espacio, disponible: espacio.activo };
    return this.http.put<Espacio>(`${this.apiUrl}${id}/`, payload);
  }

  deleteEspacio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}