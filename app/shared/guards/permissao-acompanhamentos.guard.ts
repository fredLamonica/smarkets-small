import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AutenticacaoService } from '@shared/providers';
import { Observable } from 'rxjs';
import { PermissionService } from '../utils/permission.service';

@Injectable()
export class PermissaoAcompanhamentosGuard implements CanActivate {

  constructor(private authService: AutenticacaoService, private permissionService: PermissionService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.permissionService.loggedUserHasPermission(() => {
      const usuario = this.authService.usuario();
      return usuario.permissaoAtual.pessoaJuridica.habilitarModuloCotacao || usuario.permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra;
    });
  }
}
