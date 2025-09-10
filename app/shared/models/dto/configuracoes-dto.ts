import { TipoAprovacao } from '@shared/models';
import { ConfiguracaoDash } from '../enums/configuracao-dash';
import { ModoAprovacao } from '../enums/modo-aprovacao';
import { TipoAlcadaAprovacao } from '../enums/tipo-alcada-aprovacao';
import { TipoIntegracao } from '../enums/tipo-integracao';

export class ConfiguracoesDto {

  idPessoaJuridica: number;
  idTenant: number;
  razaoSocial: string;
  aprovarRequisicoesAutomatico: boolean;
  habilitarDesvinculoItemSolicitacaoCompra: boolean;
  tipoAprovacao: TipoAprovacao;
  modoAprovacao: ModoAprovacao;
  habilitarModuloFornecedores: boolean;
  codigoNcmObrigatorio: boolean;
  habilitarRestricaoAlcadasMatrizResp: boolean;
  habilitarimpostoNcmCotacao: boolean;
  habilitarEnvelopeFechado: boolean;
  usarCondicoesPagamentoPadraoSmarkets: boolean;
  permiteCompraAcimaQuantidade: boolean;
  configuracaoDash: ConfiguracaoDash;
  holding: boolean;
  centralizaHomologacao: boolean;
  usarSLAPadraoSmarkets: boolean;
  habilitarCompraAutomatizada: boolean;
  habilitarRegularizacao: boolean;
  habilitarImobilizado: boolean;
  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  habilitarMFA: boolean;
  tipoIntegracao: TipoIntegracao;
  habilitarTrack: boolean;
  habilitarFup: boolean;
  habilitarParadaManutencao: boolean;
  habilitarQm: boolean;
  habilitarZ1pz: boolean;

  constructor(init?: Partial<ConfiguracoesDto>) {
    Object.assign(this, init);
  }

}
