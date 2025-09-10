import { Arquivo } from '../arquivo';
import { TipoFrete } from '../enums/tipo-frete';
import { UnidadeMedidaTempo } from '../enums/unidade-medida-tempo';
import { UnidadeMedida } from '../unidade-medida';

export class CotacaoRodadaPropostaDto {

  idCotacaoRodadaProposta: number;
  idCotacaoRodada: number;
  idCotacaoParticipante: number;
  idCotacaoItem: number;
  ativo: boolean;
  ncm: string;
  ca: string;
  quantidadeDisponivel: number;
  modelo: string;
  precoBruto: number;
  precoLiquido: number;
  precoUnidade: number;
  valorFrete: number;
  dataEntregaDisponivel: string;
  ipiAliquota: number;
  pisAliquota: number;
  confinsAliquota: number;
  icmsAliquota: number;
  difalAliquota: number;
  stAliquota: number;
  csllAliquota: number;
  issAliquota: number;
  irAliquota: number;
  inssAliquota: number;
  garantia: number;
  unidadeMedidaGarantia: UnidadeMedidaTempo;
  marca: string;
  observacao: string;
  anexos: Array<Arquivo>;
  idUsuarioLiberacaoReenvio: number;
  dataHoraLiberacaoReenvio: string;
  idCotacaoRodadaPropostaPai: number;
  embalagemEmbarque: number;
  idUnidadeMedidaEmbalagemEmbarque: number;
  unidadeMedidaEmbalagemEmbarque: UnidadeMedida;
  idCondicaoPagamento: number;
  incoterms: TipoFrete;
  faturamentoMinimo: number;
  prazoEntrega: number;

  constructor(init?: Partial<CotacaoRodadaPropostaDto>) {
    Object.assign(this, init);
  }
}
