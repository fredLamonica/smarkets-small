import { CondicaoPagamento } from '@shared/models/condicao-pagamento';
import { Endereco } from '@shared/models/endereco';
import { Moeda } from '@shared/models/enums/moeda';
import { SituacaoCotacaoItem } from '@shared/models/enums/situacao-cotacao-item';
import { TipoFrete } from '@shared/models/enums/tipo-frete';
import { Marca } from '@shared/models/marca';
import { Produto } from '@shared/models/produto';
import { TipoRequisicao } from '@shared/models/requisicao/tipo-requisicao';
import { CotacaoRodadaMapaComparativoPorItem } from './cotacao-rodada-mapa-comparativo-por-item';


export class CotacaoItemMapaComparativoPorItem {
  public idCotacaoItem: number;
  public codigo: string;
  public idCotacao: number;
  public idTenant: number;
  public cnpj: string;
  public razaoSocial: string;
  public situacao: SituacaoCotacaoItem;
  public dataInclusao: string;
  public idRequisicaoItem: number;
  public idTipoRequisicao: number;
  public tipoRequisicao: TipoRequisicao;
  public idProduto: number;
  public produto: Produto;
  public idCondicaoPagamento: number;
  public condicaoPagamento: CondicaoPagamento;
  public valorReferencia: number;
  public moeda: Moeda;
  public quantidade: number;
  public idMarca: number;
  public marca: Marca;
  public idEnderecoEntrega: number;
  public enderecoEntrega: Endereco;
  public idEnderecoCobranca: number;
  public idEnderecoFaturamento: number;
  public dataEntrega: string;
  public incoterms: TipoFrete;
  public descricao: string;
  public observacoes: string;
  public rodadas: CotacaoRodadaMapaComparativoPorItem[];
}
