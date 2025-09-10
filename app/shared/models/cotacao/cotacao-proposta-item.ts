import { PessoaJuridica } from './../pessoa-juridica';
import { Arquivo } from '../arquivo';
import { ClassificacaoPreco } from '../enums/classificacao-preco';
import { UnidadeMedidaTempo } from '../enums/unidade-medida-tempo';
import { TipoFrete } from '../enums/tipo-frete';


export class CotacaoPropostaItem {
  public idCotacaoPropostaItem: number;
  public idCotacaoProposta: number;
  public idCotacaoItem: number;
  public condicaoPagamento: string;
  public unidadeMedida: string;
  public marca: string;
  public ativo: boolean;
  public ncm: string;
  public ca: string;
  public quantidadeDisponivel: number;
  public modelo: string;
  public precoBruto: number;
  public precoLiquido: number;
  public precoUnidade: number;
  public valorFrete: number;
  public dataEntregaDisponivel: string;
  public ipiAliquota: number;
  public pisAliquota: number;
  public confinsAliquota: number;
  public icmsAliquota: number;
  public difalAliquota: number;
  public stAliquota: number;
  public garantia: number;
  public unidadeMedidaGarantia: UnidadeMedidaTempo;
  public observacao: string;
  public anexos: Array<Arquivo>
  public vencedor: boolean;
  public recomendado: boolean;
  public desclassificado: boolean;
  public classificacaoPreco: ClassificacaoPreco;
  public fornecedor: PessoaJuridica;
  public valorLiquido: number;
  public incoterms: TipoFrete;

  public ultimaAlteracao: string;

  constructor(
    idCotacaoPropostaItem: number,
    idCotacaoProposta: number,
    idCotacaoItem: number,
    condicaoPagamento: string,
    unidadeMedida: string,
    marca: string,
    ativo: boolean,
    ncm: string,
    ca: string,
    quantidadeDisponivel: number,
    modelo: string,
    precoBruto: number,
    precoLiquido: number,
    precoUnidade: number,
    valorFrete: number,
    dataEntregaDisponivel: string,
    ipiAliquota: number,
    pisAliquota: number,
    confinsAliquota: number,
    icmsAliquota: number,
    difalAliquota: number,
    stAliquota: number,
    garantia: number,
    unidadeMedidaGarantia: UnidadeMedidaTempo,
    incoterms: TipoFrete,
    observacao: string,
    anexos: Array<Arquivo>
  ) {
    this.idCotacaoPropostaItem = idCotacaoPropostaItem,
      this.idCotacaoProposta = idCotacaoProposta,
      this.idCotacaoItem = idCotacaoItem,
      this.condicaoPagamento = condicaoPagamento,
      this.unidadeMedida = unidadeMedida,
      this.marca = marca,
      this.ativo = ativo,
      this.ncm = ncm,
      this.ca = ca,
      this.quantidadeDisponivel = quantidadeDisponivel,
      this.modelo = modelo,
      this.precoBruto = precoBruto,
      this.precoLiquido = precoLiquido,
      this.precoUnidade = precoUnidade,
      this.valorFrete = valorFrete,
      this.dataEntregaDisponivel = dataEntregaDisponivel,
      this.ipiAliquota = ipiAliquota,
      this.pisAliquota = pisAliquota,
      this.confinsAliquota = confinsAliquota,
      this.icmsAliquota = icmsAliquota,
      this.difalAliquota = difalAliquota,
      this.stAliquota = stAliquota,
      this.garantia = garantia,
      this.unidadeMedidaGarantia = unidadeMedidaGarantia;
      this.incoterms = incoterms,
      this.observacao = observacao,
      this.anexos = anexos
  }
}