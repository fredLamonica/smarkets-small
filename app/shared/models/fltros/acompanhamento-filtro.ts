import {
  SituacaoPedido,
  SituacaoRequisicaoItem,
  SituacaoSolicitacaoItemCompra
} from '..';
import { Ordenacao } from '../enums/ordenacao';
import { FiltroBase } from './base/filtro-base';

export class AcompanhamentoFiltro extends FiltroBase {
  termoNumeroRc: string;
  termoNumeroPedido: number;
  termoNomeFornecedor: string;
  termoCodigoFornecedorSap: string;
  termoCodigoPedidoSap: string;
  termoComprador: string;
  termoOrigem?: number;
  termoValorMenor?: number;
  termoValorMaior?: number;
  termoCodigoFilialEmpresa: string;
  termoDataCriacao?: Date;
  termoDataLiberacao?: Date;
  termoEtapa?: number;
  termoSituacaoEtapa?: number;
  termoCompradorSc?: string;

  constructor(init?: Partial<AcompanhamentoFiltro>) {
    super();
    Object.assign(this, init);
  }

  construirFiltroAvancado(
    filtroAvancado: any[] | AcompanhamentoFiltro,
    ordenar?: string,
    ordenacao?: Ordenacao,
    itensPorPagina?: number,
    pagina?: number,
  ) {
    if (filtroAvancado == null) {
      return;
    }

    if (Array.isArray(filtroAvancado)) {
      this.itemOrdenar = ordenar;
      this.ordenacao = ordenacao;
      this.itensPorPagina = Number(itensPorPagina);
      this.pagina = Number(pagina);
      this.termoNumeroRc = filtroAvancado[0];
      this.termoNumeroPedido = filtroAvancado[1] ? Number(filtroAvancado[1]) : null;
      this.termoCodigoFilialEmpresa = filtroAvancado[2];
      this.termoNomeFornecedor = filtroAvancado[3];
      this.termoCodigoFornecedorSap = filtroAvancado[4];
      this.termoCodigoPedidoSap = filtroAvancado[5];
      this.termoComprador = filtroAvancado[6];
      this.termoOrigem = filtroAvancado[7] ? Number(filtroAvancado[7]) : null;
      this.termoValorMenor = filtroAvancado[8] ? Number(filtroAvancado[8]) : null;
      this.termoValorMaior = filtroAvancado[9] ? Number(filtroAvancado[9]) : null;
      this.termoDataCriacao = filtroAvancado[10] ? filtroAvancado[10] : null;
      this.termoDataLiberacao = filtroAvancado[11] ? filtroAvancado[11] : null;
      this.termoEtapa = filtroAvancado[12] ? Number(filtroAvancado[12]) : null;
      this.termoSituacaoEtapa = filtroAvancado[13] ? Number(filtroAvancado[13]) : null;
      this.termoCompradorSc = filtroAvancado[14];

    } else {
      this.itemOrdenar = ordenar;
      this.ordenacao = ordenacao;
      this.itensPorPagina = Number(itensPorPagina);
      this.pagina = Number(pagina);
      this.termoNumeroRc = filtroAvancado.termoNumeroRc;
      this.termoNumeroPedido = filtroAvancado.termoNumeroPedido
        ? Number(filtroAvancado.termoNumeroPedido)
        : null;
      this.termoCodigoFilialEmpresa = filtroAvancado.termoCodigoFilialEmpresa;
      this.termoNomeFornecedor = filtroAvancado.termoNomeFornecedor;
      this.termoCodigoFornecedorSap = filtroAvancado.termoCodigoFornecedorSap;
      this.termoCodigoPedidoSap = filtroAvancado.termoCodigoPedidoSap;
      this.termoComprador = filtroAvancado.termoComprador;
      this.termoOrigem = filtroAvancado.termoOrigem ? Number(filtroAvancado.termoOrigem) : null;
      this.termoValorMenor = filtroAvancado.termoValorMenor
        ? Number(filtroAvancado.termoValorMenor)
        : null;
      this.termoValorMaior = filtroAvancado.termoValorMaior
        ? Number(filtroAvancado.termoValorMaior)
        : null;
      this.termoDataCriacao = filtroAvancado.termoDataCriacao
        ? filtroAvancado.termoDataCriacao
        : null;
      this.termoDataLiberacao = filtroAvancado.termoDataLiberacao
        ? filtroAvancado.termoDataLiberacao
        : null;
      this.termoEtapa = filtroAvancado.termoEtapa ? Number(filtroAvancado.termoEtapa) : null;
      this.termoSituacaoEtapa = filtroAvancado.termoSituacaoEtapa
        ? Number(filtroAvancado.termoSituacaoEtapa)
        : null;
      this.termoCompradorSc = filtroAvancado.termoCompradorSc;

    }
  }
}

export class AcompanhamentoFiltroEtapa {

  etapas: any[];
  situacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  situacaoRequisicaoItem = SituacaoRequisicaoItem;
  situacaoPedido = SituacaoPedido;

  situacaoCotacaoExibicao = {
    1: 'Em configuração',
    2: 'Agendada',
    3: 'Em andamento',
    4: 'Em análise',
    5: 'Encerrada',
    6: 'Cancelada',
  };

  private solicitacao = 'Solicitação';
  private requisicao = 'Requisição';
  private cotacao = 'Cotação';
  private pedido = 'Pedido';
  constructor() {
    this.construirEtapas();
  }

  private construirEtapas() {
    this.etapas = [
      {
        etapa: this.solicitacao,
        value: 1,
        enum: this.situacaoSolicitacaoItemCompra,
      },
      {
        etapa: this.requisicao,
        value: 2,
        enum: this.situacaoRequisicaoItem,
      },
      {
        etapa: this.cotacao,
        value: 3,
        enum: this.situacaoCotacaoExibicao,
      },
      {
        etapa: this.pedido,
        value: 4,
        enum: this.situacaoPedido,
      },
    ];
  }
}
