import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PerfilUsuario } from '../models';
import { AutenticacaoService } from '../providers';
import { PermissionService } from '../utils/permission.service';

@Injectable()
export class PermissaoGuard implements CanActivate {

  constructor(private permissionService: PermissionService, private autenticacaoService: AutenticacaoService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.permissionService.loggedUserHasPermission(() => {
      const allowedProfiles = next.data['permissoes'] as Array<PerfilUsuario>;
      return !allowedProfiles || allowedProfiles.includes(this.autenticacaoService.perfil());
    });
  }
}
