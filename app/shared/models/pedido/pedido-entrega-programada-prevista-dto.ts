export class PedidoEntregaProgramadaPrevistaDto {
  idPedidoEntregasProgramadas: number;
  descricao: string;
  dataEntregaPrevista: Date;

  constructor(init?: Partial<PedidoEntregaProgramadaPrevistaDto>) {
    Object.assign(this, init);
  }
}
