import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocalStorageTypes} from '../enums/local-storage-types';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isApiReq = request.url.includes('api/');
    const isSignalOneRequest = request.url.includes('onesignal.com/api');

    if (isApiReq && !isSignalOneRequest) {
      const token = localStorage.getItem(
        LocalStorageTypes.FOOD_ORDERING_AUTH_TOKEN
      );
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};