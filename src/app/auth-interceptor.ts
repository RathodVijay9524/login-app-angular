import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.tokenSignal();
  if (token) {
    req = req.clone({
      setHeaders: { 
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = auth.refreshTokenSignal();
        if (refreshToken) {
          // Try refreshing the token
          return auth.refreshToken().pipe(
            switchMap((newTokens) => {
              // Save the new token
              auth.setAuthData(
                newTokens.jwtToken,
                newTokens.refreshTokenDto.refreshToken,
                null
                
              );

              // Retry the original request with the new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newTokens.jwtToken}`
                }
              });
              return next(retryReq);
            }),
            catchError(refreshErr => {
              // Refresh token failed -> log out
              auth.logout();
              return throwError(() => refreshErr);
            })
          );
        } else {
          // No refresh token available -> log out
          auth.logout();
        }
      }
      return throwError(() => error);
    })
  );
};
