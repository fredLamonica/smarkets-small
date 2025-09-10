import { SituacaoUsuario } from './enums/situacao-usuario';
import { Permissao } from './permissao';
import { PessoaFisica } from './pessoa-fisica';

export class Usuario {
  public idUsuario: number;
  public idPessoaFisica: number;
  public situacao: SituacaoUsuario;
  public email: string;
  public dataInclusao: string;
  public primeiroAcesso: boolean;
  public token: string;
  public telefone: string;
  public ramal: string;
  public celular: string;
  public pessoaFisica: PessoaFisica;
  public permissoes: Array<Permissao>;
  public codigoERP: string;
  public permissaoAtual: Permissao;
  public dataAceitePoliticaPrivacidade?: Date;

  public get situacaoDescricao() {
    return SituacaoUsuario[this.situacao];
  }

  constructor();

  constructor(
    idUsuario: number,
    idPessoaFisica: number,
    situacao: SituacaoUsuario,
    email: string,
    dataInclusao: string,
    primeiroAcesso: boolean,
    token: string,
    telefone: string,
    ramal: string,
    celular: string,
    pessoaFisica: PessoaFisica,
    permissoes: Array<Permissao>,
    codigoERP?: string
  );

  constructor(
    idUsuario?: number,
    idPessoaFisica?: number,
    situacao?: SituacaoUsuario,
    email?: string,
    dataInclusao?: string,
    primeiroAcesso?: boolean,
    token?: string,
    telefone?: string,
    ramal?: string,
    celular?: string,
    pessoaFisica?: PessoaFisica,
    permissoes?: Array<Permissao>,
    codigoERP?: string
  ) {
    this.idUsuario = idUsuario;
    this.idPessoaFisica = idPessoaFisica;
    this.situacao = situacao;
    this.email = email;
    this.dataInclusao = dataInclusao;
    this.primeiroAcesso = primeiroAcesso;
    this.token = token;
    this.ramal = ramal;
    this.celular = celular;
    this.telefone = telefone;
    this.pessoaFisica = pessoaFisica;
    this.permissoes = permissoes;
    this.codigoERP = codigoERP;
  }
}
