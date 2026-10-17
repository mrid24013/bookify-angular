import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const authHeader = token.startsWith('Bearer ') || token.startsWith('Token ') 
      ? token 
      : `Bearer ${token}`;

    const cloned = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
    return next(cloned);
  }

  return next(req);
};