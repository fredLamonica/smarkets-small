import { TipoDataRelatorioSolicitacao, SituacaoSolicitacaoItemCompra } from '..';

export class RelatorioSolicitacaoCompraFiltro {
  public idsTenants: Array<number>;
  public tipoDataRelatorio: TipoDataRelatorioSolicitacao;
  public dataInicio: Date;
  public dataFim: Date;
  public centros: Array<number>;
  public categorias: Array<number>;
  public situacaoSolicitacaoItemCompras: Array<SituacaoSolicitacaoItemCompra>;
}
