import { Arquivo } from '../arquivo';
import { CondicaoPagamento } from '../condicao-pagamento';
import { Endereco } from '../endereco';
import { Moeda } from '../enums/moeda';
import { SituacaoCotacaoItem } from '../enums/situacao-cotacao-item';
import { TipoFrete } from '../enums/tipo-frete';
import { Marca } from '../marca';
import { PedidoRecenteMenorValorDto } from '../pedido/pedido-recente-menor-valor-dto';
import { PessoaJuridica } from '../pessoa-juridica';
import { Produto } from '../produto';
import { RequisicaoItem } from '../requisicao/requisicao-item';
import { TipoRequisicao } from '../requisicao/tipo-requisicao';
import { CotacaoPropostaItem } from './cotacao-proposta-item';
import { CotacaoRodada } from './cotacao-rodada';
import { CotacaoRodadaProposta } from './cotacao-rodada-proposta';

export class CotacaoItem {
  idCotacaoItem: number;
  codigo: string;
  idCotacao: number;
  idTenant: number;
  situacao: SituacaoCotacaoItem;
  incoterms: TipoFrete;
  dataInclusao: string;
  idRequisicaoItem: number;
  requisicaoItem: RequisicaoItem;
  idProduto: number;
  produto: Produto;
  idCondicaoPagamento: number;
  condicaoPagamento: CondicaoPagamento;
  valorReferencia: number;
  moeda: Moeda;
  quantidade: number;
  quantidadeComprada: number;
  quantidadeRestante: number;
  idMarca: number;
  marca: Marca;
  idEnderecoEntrega: number;
  enderecoEntrega: Endereco;
  idEnderecoCobranca: number;
  idEnderecoFaturamento: number;
  dataEntrega: string;
  descricao: string;
  observacoes: string;
  anexos: Array<Arquivo>;
  pedidoRecenteMenorValor: PedidoRecenteMenorValorDto;
  idTipoRequisicao: number;
  tipoRequisicao: TipoRequisicao;
  propostasItens: Array<CotacaoPropostaItem>;
  filial: PessoaJuridica;
  targetPrice: number;
  numeroPropostasRecebidas: number;

  // utilizado na tela de propostas
  proposta: CotacaoRodadaProposta;

  // utilizado nos mapas comparativos
  rodadas: Array<CotacaoRodada>;
  propostasVencedoras: Array<CotacaoRodadaProposta>;

  constructor(
    idCotacaoItem: number,
    codigo: string,
    idCotacao: number,
    idTenant: number,
    situacao: SituacaoCotacaoItem,
    incoterms: TipoFrete,
    dataInclusao: string,
    idRequisicaoItem: number,
    requisicaoItem: RequisicaoItem,
    idProduto: number,
    produto: Produto,
    idCondicaoPagamento: number,
    condicaoPagamento: CondicaoPagamento,
    valorReferencia: number,
    moeda: Moeda,
    quantidade: number,
    idMarca: number,
    marca: Marca,
    idEnderecoEntrega: number,
    idEnderecoCobranca: number,
    idEnderecoFaturamento: number,
    dataEntrega: string,
    descricao: string,
    observacoes: string,
    idTipoRequisicao: number,
    tipoRequisicao: TipoRequisicao,
    anexos: Array<Arquivo>,
  ) {
    this.idCotacaoItem = idCotacaoItem;
    this.codigo = codigo;
    this.idCotacao = idCotacao;
    this.idTenant = idTenant;
    this.situacao = situacao;
    this.incoterms = incoterms;
    this.dataInclusao = dataInclusao;
    this.idRequisicaoItem = idRequisicaoItem;
    this.requisicaoItem = requisicaoItem;
    this.idProduto = idProduto;
    this.produto = produto;
    this.idCondicaoPagamento = idCondicaoPagamento;
    this.condicaoPagamento = condicaoPagamento;
    this.valorReferencia = valorReferencia;
    this.moeda = moeda;
    this.quantidade = quantidade;
    this.idMarca = idMarca;
    this.marca = marca;
    this.idEnderecoEntrega = idEnderecoEntrega;
    this.idEnderecoCobranca = idEnderecoCobranca;
    this.idEnderecoFaturamento = idEnderecoFaturamento;
    this.dataEntrega = dataEntrega;
    this.descricao = descricao;
    this.observacoes = observacoes;
    this.idTipoRequisicao = idTipoRequisicao;
    this.tipoRequisicao = tipoRequisicao;
    this.anexos = anexos;
  }
}
