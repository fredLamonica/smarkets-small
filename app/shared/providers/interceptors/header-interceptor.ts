import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlockUI, NgBlockUI } from '../../../../../node_modules/ng-block-ui';
import { LocalStorageService } from './../local-storage.service';
import { Router } from '@angular/router';
import { TranslationLibraryService } from '../translation-library.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private translationLibrary: TranslationLibraryService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let cloneReq = null;
    const headers = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT'
    };

    if (!req.headers.has('Authorization')) {
      const accessToken = this.localStorage.get('accessToken');
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    if (!(req.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    cloneReq = req.clone({
      setHeaders: headers
    });

    return this.nextHandler(next, cloneReq);
  }

  private nextHandler(next: HttpHandler, req: any): Observable<HttpEvent<any>> {
    return next.handle(req).do(
      () => {},
      (error: any) => {
        if (error instanceof HttpErrorResponse && (error as HttpErrorResponse).status === 401) {
          this.blockUI.start(this.translationLibrary.translations.LOADING);
          this.localStorage.remove('currentUser');
          this.localStorage.remove('accessToken');
          this.router.navigate(['/auth/login']);
        }
      }
    );
  }
}
