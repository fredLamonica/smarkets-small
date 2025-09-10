import { PedidoItemRecebimentoHistoricoDto } from '..';

export class DataHistoricoRecebimentoDto {
  public dataRecebimento: Date;
  public historicos: Array<PedidoItemRecebimentoHistoricoDto>;
}
