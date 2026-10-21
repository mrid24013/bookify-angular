import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    //Maneja el token de inicio de sesion al inyectar las cabeceras
    const authHeader = token.startsWith('Token') ? token : `Token ${token}`;
    const cloned = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
    return next(cloned);
  }

  return next(req);
};