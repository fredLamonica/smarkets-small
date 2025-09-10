import { CurrencyPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../pipes/custom-currency.pipe';
import { MoedaCodigoPipe } from '../../pipes/moeda-codigo.pipe';
import { Solicitacao } from '../aprovacao/solicitacao';
import { CentroCusto } from '../centro-custo';
import { CondicaoPagamento } from '../condicao-pagamento';
import { ContaContabil } from '../conta-contabil';
import { ContratoCatalogoEstado } from '../contrato-catalogo/contrato-catalogo-estado';
import { ContratoCatalogoFaturamento } from '../contrato-catalogo/contrato-catalogo-faturamento';
import { Endereco } from '../endereco';
import { Moeda } from '../enums/moeda';
import { OrigemPedido } from '../enums/origem-pedido';
import { SituacaoPedido } from '../enums/situacao-pedido';
import { TipoFrete } from '../enums/tipo-frete';
import { GrupoCompradores } from '../grupo-compradores';
import { Iva } from '../iva';
import { OrganizacaoCompra } from '../organizacao-compra';
import { PessoaJuridica } from '../pessoa-juridica';
import { TipoPedido } from '../tipo-pedido';
import { Usuario } from '../usuario';
import { Transportadora } from './../transportadora';
import { PedidoItem } from './pedido-item';
import { PedidoObservacaoPadrao } from './pedido-observacao-padrao';

export class Pedido {
  idPedido: number;
  codigo: string;
  idUsuario: number;
  usuario: Usuario;
  idTenant: number;
  situacao: SituacaoPedido;
  dataUltimaAtualizacao: string;
  dataConfirmacao: string;
  dataAprovacao: string;
  idFornecedor: number;
  fornecedor: PessoaJuridica;
  comprador: PessoaJuridica;
  itens: Array<PedidoItem>;
  idCondicaoPagamento: number;
  condicaoPagamento: CondicaoPagamento;
  idCentroCusto: number;
  centroCusto: CentroCusto;
  frete: TipoFrete;
  valor: number;
  solicitacao: Solicitacao;
  idsAprovadores: Array<number>;
  ultimaAlteracao: string;
  idItemSolicitacao: number;
  idGrupoCompradores: number;
  grupoCompradores: GrupoCompradores;
  idOrganizacaoCompra: number;
  organizacaoCompra: OrganizacaoCompra;
  tipoPedido: TipoPedido;
  idTipoPedido?: number;
  idComprador: number;
  idCotacao?: number;
  idContratoCatalogo?: number;
  origem?: string;
  idEnderecoEntrega: number;
  enderecoEntrega: Endereco;
  enderecoDeEntregaUnico: boolean;
  estadoDeAtendimentoInvalido: boolean;
  estadoDeAtendimentoMensagemDeErro: string;
  prazoDeEntregaEmDias: number;
  ultimaDataEntrega: string;
  idIva: number;
  iva: Iva;
  origemPedido: OrigemPedido;
  condicoesPagamentos: Array<CondicaoPagamento>;
  condicaoDePagamentoUnica: boolean;
  contratoCatalagoEstado?: ContratoCatalogoEstado;
  contratoCatalogoFaturamento?: ContratoCatalogoFaturamento;
  observacao: string;
  idTransportadora: number;
  transportadora: Transportadora;
  dataEntregaCalculada: Date;
  pedidoObservacaoPadrao: PedidoObservacaoPadrao;
  moeda: Moeda;
  idCampanhaFranquia?: number;
  idIntegracaoRequisicaoERP: string;
  idIntegracaoSistemaChamado: string;
  idIntegracaoSistemaChamadoPai: string;
  idIntegracaoPedidoERP: string;
  numRequisicaoSistemaChamado: string;
  idAlcada: number;
  idRegularizacao: number;
  idContaContabil: number;
  contaContabil: ContaContabil;
  habilitarBtnRemover: boolean = false;
  selecionarTodos: boolean = false;

  get valorFormatado(): string {
    const currencyPipe = new CurrencyPipe('pt-BR');
    const moedaCodigoPipe = new MoedaCodigoPipe();

    const customCurrencyPipe = new CustomCurrencyPipe(currencyPipe, moedaCodigoPipe);
    return customCurrencyPipe.transform(this.valor, this.moeda, '1.2', 'symbol');
  }

  constructor(init?: Partial<Pedido>) {
    Object.assign(this, init);
  }

}
