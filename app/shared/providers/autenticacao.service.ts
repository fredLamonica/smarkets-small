import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Autenticacao, PerfilUsuario, Permissao, Usuario } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MfaSetup } from '../../modules/autenticacao/mfa/models/mfa-setup';
import { DecodedToken } from '../../modules/autenticacao/models/decoded-token';
import { LocalStorageService } from './local-storage.service';
import { TranslationLibraryService } from './translation-library.service';

@Injectable()
export class AutenticacaoService {

  @BlockUI() blockUI: NgBlockUI;

  private API_URL: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router,
    private translationLibrary: TranslationLibraryService,
  ) { }

  autenticar(autenticacao: Autenticacao): Observable<string> {
    return this.httpClient.post<string>(`${this.API_URL}autenticacoes/plataforma`, autenticacao);
  }

  recuperarSenha(auth: Autenticacao): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}autenticacoes/password/`, auth);
  }

  redefinirSenha(autenticacao: Autenticacao, token: string): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.API_URL}autenticacoes/password`, autenticacao, { headers: this.getAuthorizationHeaderWithBearerToken(token) });
  }

  alterarPermissao(idTenant: number): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.API_URL}autenticacoes/${idTenant}`, {});
  }

  listarPermissoes(): Observable<Array<Permissao>> {
    return this.httpClient.get<Array<Permissao>>(`${this.API_URL}autenticacoes/permissoes`);
  }

  perfil(): PerfilUsuario {
    return this.usuario().permissaoAtual.perfil;
  }

  usuario(): Usuario {
    const token = this.localStorage.get('accessToken');
    return JSON.parse(this.decodifiqueToken(token).usuario);
  }

  autenticado() {
    const helper = new JwtHelperService();
    const token = this.localStorage.get('accessToken');
    return token && !helper.isTokenExpired(token);
  }

  autenticacaoSso(tenantSsoId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.API_URL}autenticacoes/login/${tenantSsoId}`);
  }

  obtenharSetupDaAutenticacaoMfa(token: string): Observable<MfaSetup> {
    return this.httpClient.post<MfaSetup>(`${this.API_URL}autenticacoes/setup-mfa`, null, { headers: this.getAuthorizationHeaderWithBearerToken(token) });
  }

  autentiquePeloCodigoPin(token: string, codigoPin: string): Observable<string> {
    return this.httpClient.post<string>(`${this.API_URL}autenticacoes/validate-user-pin/${codigoPin}`, null, { headers: this.getAuthorizationHeaderWithBearerToken(token) });
  }

  autentiquePeloCodigoDeRecuperacao(token: string, codigoDeRecuperacao: string): Observable<string> {
    return this.httpClient.post<string>(`${this.API_URL}autenticacoes/validate-recovery-code/${codigoDeRecuperacao}`, null, { headers: this.getAuthorizationHeaderWithBearerToken(token) });
  }

  obtenhaCodigosDeRecuperacao(): Observable<Array<string>> {
    return this.httpClient.post<Array<string>>(`${this.API_URL}autenticacoes/recovery-codes`, null);
  }

  valideEmail(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}autenticacoes/valide-email`, `"${email}"`);
  }

  valideSenha(senha: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}autenticacoes/valide-senha`, `"${senha}"`);
  }

  obtenhaTokenDecodificado(token: string): DecodedToken {
    return new DecodedToken(this.decodifiqueToken(token));
  }

  obtenhaTokenDaSessaoDecodificado(): DecodedToken {
    return new DecodedToken(this.decodifiqueToken(this.localStorage.get('accessToken')));
  }

  atualizeTokenDeAcesso(token: string): void {
    this.localStorage.set('accessToken', token);
  }

  navegueParaHome(returnUrl: string = null): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let url: string;

    if (returnUrl && returnUrl !== '/') {
      url = returnUrl;
    } else {
      url = this.obterRotaHome(this.perfil());
    }

    this.router.navigateByUrl(url).then(() => this.blockUI.stop());
  }

  redirectPainelOperacoesFup(usuario: Usuario): Observable<string> {
    return this.httpClient.post<string>(`${this.API_URL}autenticacoes/painel-operacoes`, usuario);
  }

  private decodifiqueToken(token: string): any {
    return new JwtHelperService().decodeToken(token);
  }

  private obterRotaHome(perfilUsuario: PerfilUsuario): string {
    switch (perfilUsuario) {
      case PerfilUsuario.Administrador:
      case PerfilUsuario.Comprador:
      case PerfilUsuario.Gestor:
      case PerfilUsuario.Requisitante:
        return '/marketplace';
      case PerfilUsuario.Aprovador:
      case PerfilUsuario.Recebimento:
      case PerfilUsuario.Fornecedor:
        return '/pedidos';
      case PerfilUsuario.Cadastrador:
        return '/produtos';
      case PerfilUsuario.GestorDeFornecedores:
        return '/fornecedores/local';
    }
  }

  private getAuthorizationHeaderWithBearerToken(token: string): HttpHeaders {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' });
  }

}
