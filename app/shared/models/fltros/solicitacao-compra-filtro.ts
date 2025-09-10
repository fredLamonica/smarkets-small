import { SituacaoSolicitacaoItemCompra } from './../enums/situacao-solicitacao-item-compra';
export class SolicitacaoCompraFiltro {
  public termoCategoriaSolicitacao: string;
  public termoGrupoCompradores: string;
  public termoTipoRC: string;
  public termoCodigoRCSolicitacao: string;
  public termoSituacaoSolicitacao: SituacaoSolicitacaoItemCompra;
  public termoRequisitante: string;
  public termoDescricaoSolicitacao: string;
  public dataInicial: Date;
  public dataFinal: Date;
  public termoCategoriaDemanda: string;
  public termoCodigoFilialEmpresa: string;
  public tipoDocumento: string;
  public termoComprador: string;

  constructor(
    categoria: string,
    grupoCompradores: string,
    tipoRc: string,
    codigoRc: string,
    situacao: SituacaoSolicitacaoItemCompra,
    requisitante: string,
    descricaoProduto: string,
    dataInicio: Date,
    dataFim: Date,
    categoriaDemanda: string,
    centro: string,
    tipoDocumento: string,
    termoComprador: string
  ) {
    this.termoCategoriaSolicitacao = categoria;
    this.termoGrupoCompradores = grupoCompradores;
    this.termoTipoRC = tipoRc;
    this.termoCodigoRCSolicitacao = codigoRc;
    this.termoSituacaoSolicitacao = situacao;
    this.termoRequisitante = requisitante;
    this.termoDescricaoSolicitacao = descricaoProduto;
    this.dataInicial = dataInicio;
    this.dataFinal = dataFim;
    this.termoCategoriaDemanda = categoriaDemanda;
    this.termoCodigoFilialEmpresa = centro;
    this.tipoDocumento = tipoDocumento;
    this.termoComprador = termoComprador;
  }
}
