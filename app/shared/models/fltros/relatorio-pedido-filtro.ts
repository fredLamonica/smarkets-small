import { TipoDataRelatorioPedido } from '..';

export class RelatorioPedidoFiltro {
  public tipoDataRelatorio: TipoDataRelatorioPedido;
  public dataInicio: Date;
  public dataFim: Date;

  constructor(tipoDataRelatorio: TipoDataRelatorioPedido, dataInicio: Date, dataFim: Date) {
    this.tipoDataRelatorio = tipoDataRelatorio;
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
  }
}
