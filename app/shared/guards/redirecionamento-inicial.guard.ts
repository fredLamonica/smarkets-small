import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { PerfilUsuario } from '../models';
import { AutenticacaoService } from '../providers';

@Injectable({ providedIn: 'root' })
export class RedirecionaPerfilInicialGuard implements CanActivate {
  constructor(
    private auth: AutenticacaoService, private router: Router) {}

   canActivate(): boolean | UrlTree {
    const perfil = this.auth.usuario().permissaoAtual.perfil;

    if ([PerfilUsuario.RequisitanteTrack, PerfilUsuario.ConsultorTrack].includes(perfil)) {
      return this.router.parseUrl('/pedidos-track/liste-pedido-track');
    }

    return this.router.parseUrl('/dashboard');
  }
}
