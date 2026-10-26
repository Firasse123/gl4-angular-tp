import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { API } from '../../../config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);


  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const apiUrl = `${new URL(API.login).origin}/api/`;
    if (token && request.url.startsWith(apiUrl) && request.url !== API.login) {
      const cloneReq = request.clone({ setHeaders: {
        'Authorization': token
      } });
      return next.handle(cloneReq).pipe(
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse && error.status === 401 &&
            this.authService.getToken() === token
          ) {
            // A late response from an old session must not clear a newer login.
            this.authService.logout();
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(request);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
