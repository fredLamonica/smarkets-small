import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '@shared/providers';

@Injectable()
export class AutenticacaoGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AutenticacaoService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.controlarAcesso(next, state);
  }

  private controlarAcesso(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.autenticado(route)) {      
      return true;
    } else {
      this.router.navigate(['/auth/login'], { queryParams: this.obterParametros(route, state)});
      return false;
    }
  }

  private obterParametros(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let queryParams = {};
    let tenantParams = route.queryParams['idTenant'] || null;
    if(tenantParams)
      queryParams['idTenant'] = tenantParams;
    queryParams['returnUrl'] = state.url.split("?")[0];
    
    return queryParams;
  }

  private autenticado(route: ActivatedRouteSnapshot): boolean {
    if(!this.authService.autenticado())
      return false;

    let permissaoAtual = this.authService.usuario().permissaoAtual;
    let tenantParams = route.queryParams['idTenant'] || null;
    if(tenantParams && (permissaoAtual.idTenant != tenantParams))
      return false;

    return true
  }
}
