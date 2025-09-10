export class PedidoCanceladoDto {
  idPedido: number;
  motivo: string;

  constructor(init?: Partial<PedidoCanceladoDto>) {
    Object.assign(this, init);
  }
}
