import { Arquivo } from '.';
import { CategoriaProduto } from './categoria-produto';
import { ContaContabil } from './conta-contabil';
import { Moeda } from './enums/moeda';
import { SituacaoProduto } from './enums/situacao-produto';
import { SituacaoProdutoIA } from './enums/situacao-produto-ia';
import { TipoProduto } from './enums/tipo-produto';
import { IntegracaoErp } from './integracao-com-erp/integracao-erp';
import { GestaoIntegracaoProduto } from './integracao-com-erp/interfaces/gestao-integracao-produto';
import { Marca } from './marca';
import { PessoaJuridica } from './pessoa-juridica';
import { UnidadeMedida } from './unidade-medida';

export class Produto {
  idProduto: number;
  idTenant: number;
  idCategoriaProduto: number;
  categoria: CategoriaProduto;
  idUnidadeMedida: number;
  unidadeMedida: UnidadeMedida;
  situacao: SituacaoProduto;
  tipo: TipoProduto;
  imagens: Array<any>;
  codigo: string;
  codigoUnico: number;
  codigoNcm: string;
  descricao: string;
  descricaoDetalhada: string;
  consumoMedio: number;
  dataUltimaCompra: string;
  valorUltimaCompra: number;
  valorReferencia: number;
  moeda: Moeda;
  idSolicitante: number;
  nomeSolicitante: string;
  marcas: Array<Marca>;
  fornecedores: Array<PessoaJuridica>;
  contasContabeis: Array<ContaContabil>;
  anexos: Array<Arquivo>;
  produtosSemelhantes: Array<Produto>;
  idGrupoDespesa: number;
  idTipoDespesa: number;
  gestaoIntegracaoProduto: GestaoIntegracaoProduto;
  especificacao: string;
  prioridade: boolean;
  saneado: boolean;
  enviado: boolean;
  situacaoIA: SituacaoProdutoIA;

  // Propriedades SAP
  idOrigemMaterial: number;
  idUtilizacaoMaterial: number;
  idCategoriaMaterial: number;

  integracoesErp: Array<IntegracaoErp>;

  constructor(
    idProduto: number,
    idTenant: number,
    idCategoriaProduto: number,
    idUnidadeMedida: number,
    situacao: SituacaoProduto,
    tipo: TipoProduto,
    imagens: Array<string>,
    codigo: string,
    codigoNcm: string,
    descricao: string,
    descricaoDetalhada: string,
    consumoMedio: number,
    dataUltimaCompra: string,
    valorUltimaCompra: number,
    valorReferencia: number,
    moeda: Moeda,
    idSolicitante: number,
    contasContabeis: Array<ContaContabil>,
    anexos: Array<Arquivo>,
    idGrupoDespesa: number,
    idTipoDespesa: number,
    idOrigemMaterial: number,
    idUtilizacaoMaterial: number,
    idCategoriaMaterial: number,
  ) {
    this.idProduto = idProduto;
    this.idTenant = idTenant;
    this.idCategoriaProduto = idCategoriaProduto;
    this.idUnidadeMedida = idUnidadeMedida;
    this.situacao = situacao;
    this.tipo = tipo;
    this.imagens = imagens;
    this.codigo = codigo;
    this.codigoNcm = codigoNcm;
    this.descricao = descricao;
    this.descricaoDetalhada = descricaoDetalhada;
    this.consumoMedio = consumoMedio;
    this.dataUltimaCompra = dataUltimaCompra;
    this.valorUltimaCompra = valorUltimaCompra;
    this.valorReferencia = valorReferencia;
    this.moeda = moeda;
    this.idSolicitante = idSolicitante;
    this.contasContabeis = contasContabeis;
    this.anexos = anexos;
    this.idGrupoDespesa = idGrupoDespesa;
    this.idTipoDespesa = idTipoDespesa;
    (this.idOrigemMaterial = idOrigemMaterial),
      (this.idUtilizacaoMaterial = idUtilizacaoMaterial),
      (this.idCategoriaMaterial = idCategoriaMaterial);
  }
}
