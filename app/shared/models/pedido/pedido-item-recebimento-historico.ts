import { AutenticacaoService } from '@shared/providers';

export class PedidoItemRecebimentoHistorico {
  public idPedidoItemRecebimentoHistorico: number;
  public idPedido: number;
  public idUsuario: number;
  public idTenant: number;
  public notaFiscal: string;
  public dataRecebimento: Date;

  constructor(idPedido: number, notaFiscal: string, dataRecebimento: Date) {
    this.idPedido = idPedido;
    this.notaFiscal = notaFiscal;
    this.dataRecebimento = dataRecebimento;
  }
}
