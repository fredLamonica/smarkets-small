import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import {
  AutenticacaoService,
  FornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { Observable } from 'rxjs';
import { PerfilUsuario, FornecedorInteressado } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable()
export class ValidaTermoAceiteGuard implements CanActivate {
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private router: Router,
    private authService: AutenticacaoService,
    private fornecedorService: FornecedorService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.permiteAcesso();
  }

  private permiteAcesso(): Observable<boolean> {
    let usuario = this.authService.usuario();
    if (
      usuario.permissaoAtual.perfil != PerfilUsuario.Fornecedor ||
      usuario.idUsuario != usuario.permissaoAtual.pessoaJuridica.idUsuarioPrincipal
    ) {
      return Observable.of(true);
    }

    return this.fornecedorService.obterPorCnpj(usuario.permissaoAtual.pessoaJuridica.cnpj).pipe(
      map(res => {
        let fornecedores = res.filter(
          f => f.pessoaJuridica.idTenant == usuario.permissaoAtual.idTenant
        );
        if (fornecedores && fornecedores.length) {
          let possuiTermos = fornecedores.findIndex(f => f.aceitarTermo) != -1;
          if (
            possuiTermos &&
            usuario.idUsuario == usuario.permissaoAtual.pessoaJuridica.idUsuarioPrincipal
          ) {
            this.router.navigate(['/']);
            return false;
          }
        }

        return true;
      })
    );
  }
}
