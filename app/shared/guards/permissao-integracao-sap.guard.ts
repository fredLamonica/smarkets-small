import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AutenticacaoService } from '@shared/providers';
import { Observable } from 'rxjs';
import { PermissionService } from '../utils/permission.service';

@Injectable({
  providedIn: 'root',
})
export class PermissaoIntegracaoSapGuard implements CanActivate {

  constructor(private authService: AutenticacaoService, private permissionService: PermissionService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.permissionService.loggedUserHasPermission(() => this.authService.usuario().permissaoAtual.pessoaJuridica.parametrosIntegracaoSapHabilitado);
  }
}
