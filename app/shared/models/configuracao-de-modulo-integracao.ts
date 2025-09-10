import { FluxoAprovacaoInternaPedido } from './enums/fluxo-aprovacao-interna-pedido';
import { TipoIntegracao } from './enums/tipo-integracao';

export class ConfiguracaoDeModuloIntegracao {

  idPessoaJuridicaConfiguracaoIntegracao: number;
  idPessoaJuridica: number;
  idTenant: number;
  tipoIntegracao: TipoIntegracao;
  permiteReenvioPedido: boolean;
  permiteReenvioRequisicao: boolean;
  permiteReenvioRegularizacao: boolean;
  habilitarIntegracaoERP: boolean;
  habilitarAprovacaoAutomaticaRequisicao: boolean;
  habilitarAprovacaoAutomaticaPedido: boolean;
  habilitarIntegracaoSistemaChamado: boolean;
  integrarApiPedidos: boolean;
  habilitarAprovacaoPedidoAutomaticaSAPERP: boolean;
  integracaoSapHabilitada: boolean;
  utilizaSolicitacaoCompra: boolean;
  bloquearRequisicaoPedido: boolean;
  permiteAlterarValorReferencia: boolean;
  parametrosIntegracaoSapHabilitado: boolean;
  exibirFlagSapEm: boolean;
  exibirFlagSapEmNaoAvaliada: boolean;
  exibirFlagSapEntrFaturas: boolean;
  exibirFlagSapRevFatEm: boolean;
  origemMaterialObrigatorio: boolean;
  utilizacaoMaterialObrigatorio: boolean;
  categoriaMaterialObrigatorio: boolean;
  valorLimiteAprovacaoAutomaticaPedido: number;
  fluxoAprovacaoInternaPedido: FluxoAprovacaoInternaPedido;

  constructor(init?: Partial<ConfiguracaoDeModuloIntegracao>) {
    Object.assign(this, init);
  }
}
