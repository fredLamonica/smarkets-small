import { PedidoItemRecebimentoDto, Usuario } from '..';

export class PedidoItemRecebimentoHistoricoDto {
  public notaFiscal: string;
  public dataRecebimento: Date;
  public usuario: Usuario;
  public itens: Array<PedidoItemRecebimentoDto>;
}
