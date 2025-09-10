import { SituacaoContratoCatalogoItem } from '../enums/situacao-contrato-catalogo-item';
import { Estado } from '../estado';
import { AprovacaoContratoCatalogoFaturamentoFornecedor } from './aprovacao-contrato-catalogo-faturamento-fornecedor';

export class ContratoCatalogoFaturamento {
  idContratoCatalogoFaturamento: number;
  idContratoCatalogo: number;
  idEstado: number;
  estado: Estado;
  situacao: SituacaoContratoCatalogoItem;
  idTenant: number;
  valorMinimoPedido: number;
  aprovacaoContratoCatalogoFaturamento: AprovacaoContratoCatalogoFaturamentoFornecedor

   constructor( idContratoCatalogo: number, situacao: number, idEstado: number, valorMinimoPedido: number, idContratoCatalogoFaturamento: number = null) {
    this.idContratoCatalogoFaturamento = idContratoCatalogoFaturamento;
    this.idContratoCatalogo = idContratoCatalogo;
    this.situacao = situacao;
    this.idEstado = idEstado;
    this.valorMinimoPedido = valorMinimoPedido;
  }
}



