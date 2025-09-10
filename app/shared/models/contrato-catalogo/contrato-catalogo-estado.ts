import { Estado, SituacaoContratoCatalogoItem } from '..';
import { AprovacaoContratoCatalogoEstadoFornecedor } from './aprovacao-contrato-catalogo-estado-fornecedor';

export class ContratoCatalogoEstado {
  idContratoCatalogoEstado: number;
  idContratoCatalogo: number;
  situacao: SituacaoContratoCatalogoItem;
  idEstado: number;
  estado: Estado;
  valorMinimoPedido: number;
  prazoEntregaDias: number;
  aprovacaoContratoCatalogoEstado: AprovacaoContratoCatalogoEstadoFornecedor;
  justificativaReprovacao: string;

  constructor(idContratoCatalogo: number, situacao: number, idEstado: number, valorMinimoPedido: number, prazoEntregaDias: number) {
    this.idContratoCatalogo = idContratoCatalogo;
    this.situacao = situacao;
    this.idEstado = idEstado;
    this.valorMinimoPedido = valorMinimoPedido;
    this.prazoEntregaDias = prazoEntregaDias;
  }
}
