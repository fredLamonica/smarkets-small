import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '../providers';
import { PermissionService } from '../utils/permission.service';

@Injectable({
  providedIn: 'root',
})
export class NotIsSmarketsGuard implements CanActivate {

  constructor(private authService: AutenticacaoService, private permissionService: PermissionService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.permissionService.loggedUserHasPermission(() => !this.authService.usuario().permissaoAtual.isSmarkets);
  }
}
