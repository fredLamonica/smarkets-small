
export class AtividadePessoa {
  public idAtividadePessoa: number;
  public idPessoa: number;
  public administrador: boolean;
  public comprador: boolean;
  public vendedor: boolean;
  public transportadora: boolean;  

  constructor(
      idAtividadePessoa: number = 0
      ,administrador: boolean = false
      ,comprador: boolean = false
      ,vendedor:boolean = false
      ,transportadora: boolean = false
    ) {
    this.idAtividadePessoa = idAtividadePessoa;
    this.administrador = administrador;
    this.comprador = comprador;
    this.vendedor = vendedor;
    this.transportadora = transportadora;
  }
}