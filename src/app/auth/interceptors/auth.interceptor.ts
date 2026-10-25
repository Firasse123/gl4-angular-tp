import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { API } from '../../../config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);


  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.token();
    const apiUrl = `${new URL(API.login).origin}/api/`;
    if (token && request.url.startsWith(apiUrl) && request.url !== API.login) {
      const cloneReq = request.clone({ setHeaders: {
        'Authorization': token
      } });
      return next.handle(cloneReq);
    }
    return next.handle(request);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
