import { AtividadePessoa } from './atividade-pessoa';
import { CategoriaProduto } from './categoria-produto';
import { PerfilTributario } from './enums/perfil-tributario';
import { PorteEmpresa } from './enums/porte-empresa';
import { SituacaoPessoaJuridica } from './enums/situacao-pessoa-juridica';
import { TipoAprovacao } from './enums/tipo-aprovacao';
import { TipoCadastroEmpresa } from './enums/tipo-cadastro-empresa';
import { TipoPessoa } from './enums/tipo-pessoa';
import { PessoaJuridica } from './pessoa-juridica';

export class Fornecedor extends PessoaJuridica {
  fornecedorHabilitado: boolean;
  categoriasProduto: Array<CategoriaProduto>;
  aceitarTermo: boolean;

  idPessoaJuridicaOrigem: number;
  pessoaJuridicaOrigem: PessoaJuridica;

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
    atividades: AtividadePessoa,
    tipoAprovacao: TipoAprovacao,
    utilizaPreAprovacaoFornecedor: boolean,
    aprovarRequisicoesAutomatico: boolean,
    permitirRequisicao: boolean,
    utilizaSolicitacaoCompra: boolean,
    integrarApiPedidos: boolean,
    integracaoSapHabilitada: boolean,
    bloquearRequisicaoPedido: boolean,
    parametrosIntegracaoSapHabilitado: boolean,
    aceitarTermo: boolean,
    codigoFilialEmpresa: string,
    contato: string,
    telefone: string,
    email: string,
  ) {
    super(
      idPessoa,
      codigoPessoa,
      tipoPessoa,
      cnd,
      idTenant,
      idPessoaJuridica,
      idNaturezaJuridica,
      cnpj,
      razaoSocial,
      nomeFantasia,
      inscricaoEstadual,
      inscricaoMunicipal,
      tipoCadastro,
      capitalSocial,
      capitalIntegralizado,
      dataIntegralizacao,
      dataValidade,
      pastaIntegracao,
      patrimonioLiquido,
      perfilTributario,
      optanteSimplesNacional,
      observacao,
      porte,
      setor,
      numeroFuncionarios,
      homePage,
      filial,
      logo,
      idUsuarioPrincipal,
      situacao,
      assinaturaEletronica,
      idPessoaJuridicaMatriz,
      atividades,
      tipoAprovacao,
      utilizaPreAprovacaoFornecedor,
      aprovarRequisicoesAutomatico,
      permitirRequisicao,
      utilizaSolicitacaoCompra,
      integrarApiPedidos,
      integracaoSapHabilitada,
      bloquearRequisicaoPedido,
      parametrosIntegracaoSapHabilitado,
      codigoFilialEmpresa,
      contato,
      telefone,
      email,
    );
    this.aceitarTermo = aceitarTermo;
  }
}
