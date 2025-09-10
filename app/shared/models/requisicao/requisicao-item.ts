import { ContaContabil, GrupoCompradores, ItemSolicitacaoCompra, SubItemSolicitacaoCompra } from '..';
import { CentroCusto } from '../centro-custo';
import { CondicaoPagamento } from '../condicao-pagamento';
import { Endereco } from '../endereco';
import { EntregaProgramada } from '../entrega-programada';
import { EntregaProgramadaUltimaData } from '../entrega-programada-ultima-data';
import { Moeda } from '../enums/moeda';
import { Marca } from '../marca';
import { Produto } from '../produto';
import { SlaItem } from '../sla/sla-item';
import { TimelineItem } from '../timeline-item';
import { Usuario } from '../usuario';
import { SituacaoRequisicaoItem } from './../enums/situacao-requisicao-item';
import { PessoaJuridica } from './../pessoa-juridica';
import { RequisicaoItemComentario } from './requisicao-item-comentario';
import { RequisicaoItemTramite } from './requisicao-item-tramite';
import { TipoRequisicao } from './tipo-requisicao';

export class RequisicaoItem {
  idRequisicaoItem: number;
  idRequisicao: number;
  idMarca: number;
  marca: Marca;
  idProduto: number;
  produto: Produto;
  idTipoRequisicao: number;
  tipoRequisicao: TipoRequisicao;
  idUsuarioResponsavel: number;
  usuarioResponsavel: Usuario;
  idSlaItem: number;
  slaItem: SlaItem;
  idEnderecoEntrega: number;
  enderecoEntrega: Endereco;
  idEnderecoCobranca: number;
  enderecoCobranca: Endereco;
  idEnderecoFaturamento: number;
  enderecoFaturamento: Endereco;
  moeda: Moeda;
  valorReferencia: number;
  idCentroCusto: number;
  centroCusto: CentroCusto;
  idCondicaoPagamento: number;
  condicaoPagamento: CondicaoPagamento;
  observacao: string;
  dataEntrega: string;
  entregaProgramada: boolean;
  entregaProgramadaUltimaDataDto: EntregaProgramadaUltimaData;
  datasDasEntregasProgramadas: Array<EntregaProgramada>;
  minDataEntrega: string;
  situacao: SituacaoRequisicaoItem;
  quantidade: number;
  quantidadeComprada: number;
  quantidadeRestante: number;
  tramites: Array<RequisicaoItemTramite>;
  comentarios: Array<RequisicaoItemComentario>;
  ultimaAlteracao: string;
  timeline: Array<TimelineItem>;
  isFavorito: boolean;

  codigoSolicitacaoCompra: string;
  idItemSolicitacaoCompra: number;
  idSubItemSolicitacaoCompra: number;
  itemSolicitacaoCompra: ItemSolicitacaoCompra;
  subItemSolicitacaoCompra: SubItemSolicitacaoCompra;
  tpDoc: string;

  dataAprovacao: string;
  tempoSla: number;
  unidadeMedidaTempoSla: number;
  ultimoRegistroInicioSla: string;
  ultimoRegistroPausaSla: string;
  duracaoSla: number;

  auxSlaItens: Array<SlaItem>;
  auxValorReferencia: string;

  empresaSolicitante: PessoaJuridica;
  idUsuarioSolicitante: number;
  usuarioSolicitante: Usuario;
  dataCriacao: string;
  dataHoraSla: Date;
  idEmpresaSolicitante: number;
  idIntegracaoRequisicaoERP: string;
  numRequisicaoSistemaChamado: string;
  configuracoesDaIntegracaoErpCarregadas: boolean;

  idGrupoCompradores: number;
  grupoCompradores: GrupoCompradores;

  idContaContabil: number;
  contaContabil: ContaContabil;
  selecionado: boolean = false;

  imobilizado: boolean;

  constructor(
    idRequisicaoItem: number,
    idRequisicao: number,
    idMarca: number,
    marca: Marca,
    idProduto: number,
    produto: Produto,
    idTipoRequisicao: number,
    tipoRequisicao: TipoRequisicao,
    idUsuarioResponsavel: number,
    usuarioResponsavel: Usuario,
    // idSlaItem: number,
    // slaItem: SlaItem,
    // idEnderecoEntrega: number,
    // enderecoEntrega: Endereco,
    // idEnderecoCobranca: number,
    // enderecoCobranca: Endereco,
    // idEnderecoFaturamento: number,
    // enderecoFaturamento: Endereco,
    moeda: Moeda,
    valorReferencia: number,
    idCentroCusto: number,
    centroCusto: CentroCusto,
    idCondicaoPagamento: number,
    condicaoPagamento: CondicaoPagamento,
    // observacao: string,
    dataEntrega: string,
    minDataEntrega: string,
    situacao: SituacaoRequisicaoItem,
    quantidade: number,
    tramites: Array<RequisicaoItemTramite>,
    // comentarios: Array<RequisicaoItemComentario>,
    // ultimaAlteracao: string,
    // timeline: Array<any>,
    // isFavorito: boolean,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    idEmpresaSolicitante?: number,
    imobilizado?: boolean
  ) {
    this.idRequisicaoItem = idRequisicaoItem;
    this.idRequisicao = idRequisicao;
    this.idMarca = idMarca;
    this.marca = marca;
    this.idProduto = idProduto;
    this.produto = produto;
    this.idTipoRequisicao = idTipoRequisicao;
    this.tipoRequisicao = tipoRequisicao;
    this.idUsuarioResponsavel = idUsuarioResponsavel;
    this.usuarioResponsavel = usuarioResponsavel;
    // this.idSlaItem = idSlaItem;
    // this.slaItem = slaItem;
    // this.idEnderecoEntrega = idEnderecoEntrega;
    // this.enderecoEntrega = enderecoEntrega;
    // this.idEnderecoCobranca = idEnderecoCobranca;
    // this.enderecoCobranca = enderecoCobranca;
    // this.idEnderecoFaturamento = idEnderecoFaturamento;
    // this.enderecoFaturamento = enderecoFaturamento;
    this.moeda = moeda;
    this.valorReferencia = valorReferencia;
    this.idCentroCusto = idCentroCusto;
    this.centroCusto = centroCusto;
    this.idCondicaoPagamento = idCondicaoPagamento;
    this.condicaoPagamento = condicaoPagamento;
    // this.observacao = observacao;
    this.dataEntrega = dataEntrega;
    this.minDataEntrega = minDataEntrega;
    this.situacao = situacao;
    this.quantidade = quantidade;
    this.tramites = tramites;
    // this.comentarios = comentarios;
    // this.ultimaAlteracao = ultimaAlteracao;
    // this.timeline = timeline;
    // this.isFavorito = isFavorito;
    this.idItemSolicitacaoCompra = idItemSolicitacaoCompra;
    this.idSubItemSolicitacaoCompra = idSubItemSolicitacaoCompra;
    this.idEmpresaSolicitante = idEmpresaSolicitante;
    this.imobilizado = imobilizado;
  }
}
