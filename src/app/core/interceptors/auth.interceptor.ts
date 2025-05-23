import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BROWSER_STORAGE } from '../../app.config';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(BROWSER_STORAGE);
  const token = storage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
}; 