import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AutenticacaoService, LocalStorageService } from '../providers';

@Injectable({
  providedIn: 'root',
})
export class SsoGuard implements CanActivate {

  constructor(private router: Router, private localStorage: LocalStorageService, private autenticacaoService: AutenticacaoService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (next.params.sso && next.params.sso === 'hsl') {
      if (next.queryParams.token) {
        this.autenticacaoService.atualizeTokenDeAcesso(next.queryParams.token);
        this.router.navigate(['/']);
        return false;
      }

      return this.autenticacaoService.autenticacaoSso(next.params.sso).pipe(
        catchError((error) => {
          window.location.href = error.url;
          return throwError(error);
        }),
        map(() => false));
    }

    return false;
  }

}
