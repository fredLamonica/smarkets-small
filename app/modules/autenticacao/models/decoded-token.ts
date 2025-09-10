export class DecodedToken {

  private _idUsuario: number;
  private _usuario: string;
  private _politicaPrivacidadeAceita: boolean;
  private _primeiroAcesso: boolean;
  private _recuperacaoDeSenha: boolean;
  private _algumaEmpresaUtilizaMfa: boolean;
  private _usuarioPossuiMfaConfigurado: boolean;
  private _acessoAutorizado: boolean;

  get idUsuario(): number {
    return this._idUsuario;
  }

  get usuario(): string {
    return this._usuario;
  }

  get politicaPrivacidadeAceita(): boolean {
    return this._politicaPrivacidadeAceita;
  }

  get primeiroAcesso(): boolean {
    return this._primeiroAcesso;
  }

  get recuperacaoDeSenha(): boolean {
    return this._recuperacaoDeSenha;
  }

  get algumaEmpresaUtilizaMfa(): boolean {
    return this._algumaEmpresaUtilizaMfa;
  }

  get usuarioPossuiMfaConfigurado(): boolean {
    return this._usuarioPossuiMfaConfigurado;
  }

  get acessoAutorizado(): boolean {
    return this._acessoAutorizado;
  }

  constructor(decodedToken: any) {
    this._idUsuario = +decodedToken.idUsuario;
    this._usuario = decodedToken.usuario;
    this._politicaPrivacidadeAceita = this.getBoolean(decodedToken.politicaPrivacidadeAceita);
    this._primeiroAcesso = this.getBoolean(decodedToken.firstAccess);
    this._recuperacaoDeSenha = this.getBoolean(decodedToken.recoveryPass);
    this._algumaEmpresaUtilizaMfa = this.getBoolean(decodedToken.twoFactorRequired);
    this._usuarioPossuiMfaConfigurado = this.getBoolean(decodedToken.twoFactorEnabled);
    this._acessoAutorizado = this.getBoolean(decodedToken.accessAuthorized);
  }

  private getBoolean(value: string): boolean {
    return value && value.toLowerCase() === 'true';
  }

}
