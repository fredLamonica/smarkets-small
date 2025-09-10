import { Banco } from './banco';

export class DomicilioBancario {
  public idDomicilioBancario: number;
  public idBanco: number;
  public idPessoa: number;
  public agencia: string;
  public contaCorrente: string;
  public principal: boolean;
  public banco: Banco;

  constructor(
    idDomicioBancario: number,
    idPessoa: number,
    idBanco: number,
    agencia: string,
    contaCorrente: string,
    principal: boolean
  ) {
    this.idDomicilioBancario = idDomicioBancario;
    this.idPessoa = idPessoa;
    this.idBanco = idBanco;
    this.agencia = agencia;
    this.contaCorrente = contaCorrente;
    this.principal = principal;
  }
}
