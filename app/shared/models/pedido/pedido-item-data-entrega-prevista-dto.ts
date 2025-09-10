import { PedidoEntregaProgramadaPrevistaDto } from './pedido-entrega-programada-prevista-dto';

export class PedidoItemDataEntregaPrevistaDto {
  idPedidoItem: number;
  dataEntregaPrevista: Date;
  descricao: string;
  entregasProgramadas: PedidoEntregaProgramadaPrevistaDto[];

  constructor(init?: Partial<PedidoItemDataEntregaPrevistaDto>) {
    Object.assign(this, init);
  }
}
