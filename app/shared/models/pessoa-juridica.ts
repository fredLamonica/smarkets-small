import { ConfiguracaoDash } from '@shared/models/enums/configuracao-dash';
import { FaturamentoMinimoFrete } from '@shared/models/faturamento-minimo-frete';
import { AtividadePessoa } from './atividade-pessoa';
import { CategoriaProduto } from './categoria-produto';
import { Cnae } from './cnae';
import { Endereco } from './endereco';
import { ModoAprovacao } from './enums/modo-aprovacao';
import { PerfilTributario } from './enums/perfil-tributario';
import { PorteEmpresa } from './enums/porte-empresa';
import { SituacaoPessoaJuridica } from './enums/situacao-pessoa-juridica';
import { TipoAlcadaAprovacao } from './enums/tipo-alcada-aprovacao';
import { TipoAprovacao } from './enums/tipo-aprovacao';
import { TipoCadastroEmpresa } from './enums/tipo-cadastro-empresa';
import { TipoPessoa } from './enums/tipo-pessoa';
import { Pessoa } from './pessoa';
import { Usuario } from './usuario';

export class PessoaJuridica extends Pessoa {

  idPessoaJuridica: number;
  idPessoaJuridicaMatriz: number;
  idNaturezaJuridica: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  tipoCadastro: TipoCadastroEmpresa;
  capitalSocial: number;
  capitalIntegralizado: number;
  dataIntegralizacao: string;
  pastaIntegracao: string;
  patrimonioLiquido: number;
  perfilTributario: PerfilTributario;
  optanteSimplesNacional: boolean;
  observacao: string;
  porte: PorteEmpresa;
  setor: number;
  numeroFuncionarios: number;
  filial: boolean;
  dataCadastro: string;
  dataValidade: string;
  dataExclusao: string;
  situacao: SituacaoPessoaJuridica;
  homePage: string;
  logo: string;
  idUsuarioPrincipal: number;
  assinaturaEletronica: boolean;
  usuarioPrincipal: Usuario;
  cnaes: Array<Cnae>;
  enderecos: Array<Endereco>;
  listaExtensaEnderecos: boolean;
  atividades: AtividadePessoa;
  faturamentoMinimo: FaturamentoMinimoFrete;

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAprovacao: TipoAprovacao;
  modoAprovacao: ModoAprovacao;
  utilizaPreAprovacaoFornecedor: boolean;
  aprovarRequisicoesAutomatico: boolean;
  habilitarDesvinculoItemSolicitacaoCompra: boolean;
  habilitarDepartamentoRequisicao: boolean;
  avaliacaoFornecedor: number;
  avaliacaoComprador: number;
  habilitarModuloCotacao: boolean;
  utilizaSolicitacaoCompra: boolean;
  parametrosIntegracaoSapHabilitado: boolean;
  integrarApiPedidos: boolean;
  integracaoSapHabilitada: boolean;
  bloquearRequisicaoPedido: boolean;
  habilitarModuloFornecedores: boolean;
  codigoNcmObrigatorio: boolean;
  origemMaterialObrigatorio: boolean;
  utilizacaoMaterialObrigatorio: boolean;
  categoriaMaterialObrigatorio: boolean;
  exibirFlagSapEm: boolean;
  exibirFlagSapEmNaoAvaliada: boolean;
  exibirFlagSapEntrFaturas: boolean;
  exibirFlagSapRevFatEm: boolean;
  pessoa: Pessoa;
  categoriasProduto: Array<CategoriaProduto>;
  codigoFilialEmpresa: string;
  contato: string;
  telefone: string;
  email: string;
  habilitarRestricaoAlcadasMatrizResp: boolean;
  abreviacaoUnidadeFederativa: string;
  codigoFornecedor: string;
  habilitarimpostoNcmCotacao: boolean;
  habilitarEnvelopeFechado: boolean;
  permiteAlterarValorReferencia: boolean;
  permiteCompraAcimaQuantidade: boolean;
  usarSLAPadraoSmarkets: boolean;

  holding: boolean;
  configuracaoDash: ConfiguracaoDash;

  isEmpresaCadastradora: boolean;
  idPessoaJuridicaHoldingPai: number;
  centralizaHomologacao: boolean;

  // Controle de Ações por Status - Configuração de cliente para fornecedores
  emAnalisePodeParticiparCotacao: boolean;
  emAnalisePodeTerPedido: boolean;
  ativoComPendenciaPodeTerPedido: boolean;
  ativoRetornarStatusEmAnalise: boolean;

  franquia: boolean;
  marcaFranquia: string;
  codigoFranquia: string;
  hasFranchise: boolean;

  habilitarIntegracaoERP: boolean;
  habilitarAprovacaoAutomaticaRequisicao: boolean;
  habilitarAprovacaoAutomaticaPedido: boolean;
  habilitarIntegracaoSistemaChamado: boolean;
  habilitarRegularizacao: boolean;
  habilitarImobilizado: boolean;
  habilitarMFA: boolean;
  transportadoraObrigatoriaPedidoFob: boolean;

  habilitarTrack: boolean;
  habilitarFup: boolean;
  habilitarParadaManutencao: boolean;
  habilitarQm: boolean;
  habilitarZ1pz: boolean;

  constructor(
    idPessoa: number,
    codigoPessoa: string,
    tipoPessoa: TipoPessoa,
    cnd: string,
    idTenant: number,
    idPessoaJuridica: number,
    idNaturezaJuridica: number,
    cnpj: string,
    razaoSocial: string,
    nomeFantasia: string,
    inscricaoEstadual: string,
    inscricaoMunicipal: string,
    tipoCadastro: TipoCadastroEmpresa,
    capitalSocial: number,
    capitalIntegralizado: number,
    dataIntegralizacao: string,
    dataValidade: string,
    pastaIntegracao: string,
    patrimonioLiquido: number,
    perfilTributario: PerfilTributario,
    optanteSimplesNacional: boolean,
    observacao: string,
    porte: PorteEmpresa,
    setor: number,
    numeroFuncionarios: number,
    homePage: string,
    filial: boolean,
    logo: string,
    idUsuarioPrincipal: number,
    situacao: SituacaoPessoaJuridica,
    assinaturaEletronica: boolean = false,
    idPessoaJuridicaMatriz: number,
    atividades: AtividadePessoa = new AtividadePessoa(),
    tipoAprovacao: TipoAprovacao,
    utilizaPreAprovacaoFornecedor: boolean,
    aprovarRequisicoesAutomatico: boolean,
    habilitarModuloCotacao: boolean,
    utilizaSolicitacaoCompra: boolean,
    integrarApiPedidos: boolean,
    integracaoSapHabilitada: boolean,
    bloquearRequisicaoPedido: boolean,
    parametrosIntegracaoSapHabilitado: boolean,
    codigoFilialEmpresa: string,
    contato: string,
    telefone: string,
    email: string,
  ) {
    super(idPessoa, codigoPessoa, tipoPessoa, cnd, idTenant);
    this.idPessoaJuridica = idPessoaJuridica;
    this.idNaturezaJuridica = idNaturezaJuridica;
    this.cnpj = cnpj;
    this.razaoSocial = razaoSocial;
    this.nomeFantasia = nomeFantasia;
    this.inscricaoEstadual = inscricaoEstadual;
    this.inscricaoMunicipal = inscricaoMunicipal;
    this.tipoCadastro = tipoCadastro;
    this.capitalSocial = capitalSocial;
    this.capitalIntegralizado = capitalIntegralizado;
    this.dataIntegralizacao = dataIntegralizacao;
    this.dataValidade = dataValidade;
    this.pastaIntegracao = pastaIntegracao;
    this.patrimonioLiquido = patrimonioLiquido;
    this.perfilTributario = perfilTributario;
    this.optanteSimplesNacional = optanteSimplesNacional;
    this.observacao = observacao;
    this.porte = porte;
    this.setor = setor;
    this.numeroFuncionarios = numeroFuncionarios;
    this.homePage = homePage;
    this.filial = filial;
    this.logo = logo;
    this.idUsuarioPrincipal = idUsuarioPrincipal;
    this.situacao = situacao;
    this.assinaturaEletronica = assinaturaEletronica;
    this.idPessoaJuridicaMatriz = idPessoaJuridicaMatriz;
    this.atividades = atividades;
    this.tipoAprovacao = tipoAprovacao;
    this.utilizaPreAprovacaoFornecedor = utilizaPreAprovacaoFornecedor;
    this.aprovarRequisicoesAutomatico = aprovarRequisicoesAutomatico;
    this.habilitarModuloCotacao = habilitarModuloCotacao;
    this.utilizaSolicitacaoCompra = utilizaSolicitacaoCompra;
    this.integrarApiPedidos = integrarApiPedidos;
    this.integracaoSapHabilitada = integracaoSapHabilitada;
    this.bloquearRequisicaoPedido = bloquearRequisicaoPedido;
    this.parametrosIntegracaoSapHabilitado = parametrosIntegracaoSapHabilitado;
    this.codigoFilialEmpresa = codigoFilialEmpresa;
    this.contato = contato;
    this.telefone = telefone;
    this.email = email;
  }

}
