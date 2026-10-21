import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth/login/`;

  //Login por medio de token que se genera y se almacena para mantener la sesion activa
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap((res) => {
        const token = res.token || res.access;
        if (token) {
          localStorage.setItem('token', token);
        }
      })
    );
  }

  //Confirma si la sesion esta activa
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined' && token !== 'null';
  }

  //Borra el token para cerrar sesion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }
}