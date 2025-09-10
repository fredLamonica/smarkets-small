import { SolicitacaoItem } from '../aprovacao/solicitacao-item';
import { CentroCusto } from '../centro-custo';
import { ContaContabil } from '../conta-contabil';
import { ContratoCatalogoItem } from '../contrato-catalogo/contrato-catalogo-item';
import { Endereco } from '../endereco';
import { EntregaProgramada } from '../entrega-programada';
import { EntregaProgramadaUltimaData } from '../entrega-programada-ultima-data';
import { Garantia } from '../enums/garantia';
import { Moeda } from '../enums/moeda';
import { SituacaoPedidoItem } from '../enums/situacao-pedido-item';
import { TipoFrete } from '../enums/tipo-frete';
import { Iva } from '../iva';
import { Marca } from '../marca';
import { PessoaJuridica } from '../pessoa-juridica';
import { Produto } from '../produto';
import { ItemSolicitacaoCompra } from '../solicitacao-compra/item-solicitacao-compra';
import { Usuario } from '../usuario';

export class PedidoItemProdutoDto {
  idPedidoItem: number;
  codigo: string;
  idPedido: number;
  idUsuario: number;
  idTenant: number;
  idContratoCatalogoItem: number;
  contratoCatalogoItem: ContratoCatalogoItem;
  quantidade: number;
  dataEntrega: string;
  dataEntregaPrevista: string;
  entregaProgramada: boolean;
  entregaProgramadaUltimaDataDto: EntregaProgramadaUltimaData;
  datasDasEntregasProgramadas: Array<EntregaProgramada>;
  minDataEntrega: string;
  dataInclusao: string;
  valorTotal: number;
  situacao: SituacaoPedidoItem;
  idPedidoItemPai: number;
  observacao: string;
  valor: number;
  valorLiquido: number;
  valorBruto: number;
  moeda: Moeda;
  idMarca: number;
  marca: Marca;
  idProduto: number;
  produto: Produto;
  idFornecedor: number;
  fornecedor: PessoaJuridica;
  garantia: Garantia;
  frete: TipoFrete;

  idCentroCusto: number;
  centroCusto: CentroCusto;
  idContaContabil: number;
  contaContabil: ContaContabil;
  idAlcada: number;
  idEnderecoEntrega: number;
  enderecoEntrega: Endereco;
  idSubItemSolicitacaoCompra: number;
  usuario: Usuario;

  solicitacaoItem: SolicitacaoItem;
  idIva: number;
  iva: Iva;

  idItemSolicitacaoCompra: number;
  itemSolicitacaoCompra: ItemSolicitacaoCompra;
  idRequisicaoItem: number;
  idCotacaoItem: number;
  idCotacaoRodadaProposta: number;
  loteMinimo: number;
  idUsuarioSolicitante: number;
  descricao: string;
  valorFrete: number;
  prazoEntrega: number;
  faturamentoMinimo: number;

  embalagemEmbarque: number;
  quantidadeDisponivel: number;
  idComprador: number;
  selected: boolean;
  relateds: Array<PedidoItemProdutoDto>;

  //#region NcmImpostos

  ncm: string;
  ipiAliquota: number;
  pisAliquota: number;
  cofinsAliquota: number;
  icmsAliquota: number;
  difalAliquota: number;
  stAliquota: number;

  //#endregion

  constructor(
    idPedidoItem: number,
    codigo: string,
    idPedido: number,
    idUsuario: number,
    idTenant: number,
    idContratoCatalogoItem: number,
    contratoCatalogoItem: ContratoCatalogoItem,
    quantidade: number,
    dataEntrega: string,
    dataInclusao: string,
    situacao: SituacaoPedidoItem,
    idPedidoItemPai: number,
    valor: number,
    valorLiquido: number,
    valorBruto: number,
    moeda: Moeda,
    idMarca: number,
    marca: Marca,
    idProduto: number,
    produto: Produto,
    idFornecedor: number,
    garantia: number,
    frete: TipoFrete,
    idIva: number,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    idRequisicaoItem: number,
    idCotacaoItem: number,
    idCotacaoRodadaProposta: number,
    loteMinimo: number,
    prazoEntrega?: number,
    faturamentoMinimo?: number,
    embalagemEmbarque?: number,
    quantidadeDisponivel?: number,
    idComprador?: number,
    idAlcada?: number,
  ) {
    this.idPedidoItem = idPedidoItem;
    this.codigo = codigo;
    this.idPedido = idPedido;
    this.idUsuario = idUsuario;
    this.idTenant = idTenant;
    this.idContratoCatalogoItem = idContratoCatalogoItem;
    this.contratoCatalogoItem = contratoCatalogoItem;
    this.quantidade = quantidade;
    this.dataEntrega = dataEntrega;
    this.dataInclusao = dataInclusao;
    this.situacao = situacao;
    this.idPedidoItemPai = idPedidoItemPai;
    this.valor = valor;
    this.valorLiquido = valorLiquido;
    this.valorBruto = valorBruto;
    this.moeda = moeda;
    this.idMarca = idMarca;
    this.marca = marca;
    this.idProduto = idProduto;
    this.produto = produto;
    this.idFornecedor = idFornecedor;
    this.garantia = garantia;
    this.frete = frete;
    this.idIva = idIva;
    this.idItemSolicitacaoCompra = idItemSolicitacaoCompra;
    this.idSubItemSolicitacaoCompra = idSubItemSolicitacaoCompra;
    this.idRequisicaoItem = idRequisicaoItem;
    this.idCotacaoItem = idCotacaoItem;
    this.idCotacaoRodadaProposta = idCotacaoRodadaProposta;
    this.loteMinimo = loteMinimo;
    this.prazoEntrega = prazoEntrega;
    this.faturamentoMinimo = faturamentoMinimo;
    this.embalagemEmbarque = embalagemEmbarque;
    this.quantidadeDisponivel = quantidadeDisponivel;
    this.idComprador = idComprador;
    this.idAlcada = idAlcada;
  }
}
