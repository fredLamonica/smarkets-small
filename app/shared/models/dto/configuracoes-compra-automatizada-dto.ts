import { CriterioEscolha } from '../enums/criterio-escolha';
import { TipoFrete } from '../enums/tipo-frete';
import { UnidadeMedidaTempo } from '../enums/unidade-medida-tempo';
import { CompraAutomatizadaCotacaoAnexoDto } from './compra-automatizada-cotacao-anexo-dto';

export class ConfiguracoesCompraAutomatizadaDto {
  idTenant: number;
  razaoSocial: string;
  idPessoaJuridica: number;
  idConfiguracaoModuloCompraAutomatizada: number;
  compraAutomatizadaCatalogoHabilitada: boolean;
  precoCatalogo: CriterioEscolha;
  prazoEntregaCatalogo: CriterioEscolha;
  FreteCatalogo: TipoFrete;
  valorLimiteGeracaoCarrinho: number;
  pedidoAutomaticoHabilitado: boolean;
  compraAutomatizadaCotacaoHabilitada: boolean;
  periodoCotacao: number;
  unidadadeMedidaPeriodoCotacao: UnidadeMedidaTempo;
  periodoPrimeiraRodada: number;
  unidadeMedidaPeriodoPrimeiraRodata: UnidadeMedidaTempo;
  freteCotacao: TipoFrete;
  idCondicaoPagamentoCotacao: number;
  termoConcordancia: string;
  textoPadraoHabilidatoCotacoes: boolean;
  limiteItensCotacaoHabilitado: boolean;
  limiteItensCotacao: number;
  anexos: Array<CompraAutomatizadaCotacaoAnexoDto> = new Array<CompraAutomatizadaCotacaoAnexoDto>();

  constructor(init?: Partial<ConfiguracoesCompraAutomatizadaDto>) {
    Object.assign(this, init);
  }

}
