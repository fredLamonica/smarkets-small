import { SituacaoRequisicaoItem } from './../enums/situacao-requisicao-item';
import { SituacaoSolicitacaoItemCompra } from './../enums/situacao-solicitacao-item-compra';
export class RequisicaoFiltro {
  idRequisicao: string;
  termoCodigoRCRequisicao: string;
  termoCategoriaRequisicao: string;
  termoEmailRequisitante: string;
  termoResponsavelRequisicao: string;
  termoStatusRequisicao: SituacaoRequisicaoItem;
  termoSituacaoSolicitacao: SituacaoSolicitacaoItemCompra;
  termoCategoriaDemanda: string;
  termoCodigoFilialEmpresa: string;
  tipoDocumento: string;
  idRequisicaoErp: string;

  constructor(
    idRequisicao: string,
    codigoRc: string,
    categoria: string,
    emailRequisitante: string,
    responsavel: string,
    status: SituacaoRequisicaoItem,
    statusSc: SituacaoSolicitacaoItemCompra,
    categoriaDemanda: string,
    centro: string,
    tipoDocumento: string,
  ) {
    this.idRequisicao = idRequisicao;
    this.termoCodigoRCRequisicao = codigoRc;
    this.termoCategoriaRequisicao = categoria;
    this.termoEmailRequisitante = emailRequisitante;
    this.termoResponsavelRequisicao = responsavel;
    this.termoStatusRequisicao = status;
    this.termoSituacaoSolicitacao = statusSc;
    this.termoCategoriaDemanda = categoriaDemanda;
    this.termoCodigoFilialEmpresa = centro;
    this.tipoDocumento = tipoDocumento;
  }
}
