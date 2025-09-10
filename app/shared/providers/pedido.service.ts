import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo, AvaliacaoPedido, DataHistoricoRecebimentoDto, Ordenacao, Paginacao, Pedido, PedidoItem, PedidoTramite, SituacaoPedido, SituacaoPedidoItem } from '@shared/models';
import { PedidoFiltro } from '@shared/models/fltros/pedido-filtro';
import { PedidoItemRecebimento } from '@shared/models/pedido/pedido-item-recebimento';
import { PedidoLote } from '@shared/models/pedido/pedido-lote';
import { PedidoObservacaoPadrao } from '@shared/models/pedido/pedido-observacao-padrao';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfiguracaoColunaDto } from '../models/configuracao-coluna-dto';
import { HistoricoCompraUsuarioDto } from '../models/dto/historico-compra-usuario-dto';
import { PedidoItemQuantidadeDataEntregaDto } from '../models/dto/pedido-item-quantidade-data-entrega-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../models/paginacao-pesquisa-configurada-dto';
import { HistoricoPedidosFiltroDto } from '../models/pedido/historico-compras-filtro-dto';
import { PedidoAlteracaoDto } from '../models/pedido/pedido-alteracao-dto';
import { PedidoAnexo } from '../models/pedido/pedido-anexo';
import { PedidoCanceladoDto } from '../models/pedido/pedido-cancelado-dto';
import { PedidoDto } from '../models/pedido/pedido-dto';
import { PedidoFiltroDto } from '../models/pedido/pedido-filtro-dto';
import { VisualizacaoPedido } from '../models/pedido/visualizacao-pedido';
import { ErrorService } from '../utils/error.service';
import { PedidoExibicaoDto } from './../models/pedido/pedido-exibicao-dto';
import { ArquivoService } from './arquivo.service';

@Injectable()
export class PedidoService {
  private API_URL: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private arquivoService: ArquivoService,
    private errorService: ErrorService,
  ) { }

  filtrar(itemOrdenar: string, ordenacao: Ordenacao, itensPorPagina: number, pagina: number, termo: string, filtroAvancado?: PedidoFiltro): Observable<Paginacao<Pedido>> {
    const params = this.obtenhaParametrosParaFiltrar(itemOrdenar, ordenacao, itensPorPagina, pagina, termo, filtroAvancado);
    return this.httpClient.get<Paginacao<Pedido>>(`${this.API_URL}pedidos/filtro`, { params });
  }

  filtrarIntegracoesErp(itemOrdenar: string, ordenacao: Ordenacao, itensPorPagina: number, pagina: number, termo: string, filtroAvancado?: PedidoFiltro): Observable<Paginacao<Pedido>> {
    const params = this.obtenhaParametrosParaFiltrar(itemOrdenar, ordenacao, itensPorPagina, pagina, termo, filtroAvancado);
    return this.httpClient.get<Paginacao<Pedido>>(`${this.API_URL}pedidos/filtro/integracaoerp`, { params });
  }

  listar(): Observable<Array<Pedido>> {
    return this.httpClient.get<Array<Pedido>>(`${this.API_URL}pedidos`);
  }

  obterPorId(idPedido: number): Observable<PedidoExibicaoDto> {
    return this.httpClient
      .get<PedidoExibicaoDto>(`${this.API_URL}pedidos/${idPedido}`).pipe(
        map((res) => Object.assign(new PedidoExibicaoDto(), res)));
  }

  // TODO: Refatorar este método utilizando Dto e Mapper.
  obterPorIdOld(idPedido: number): Observable<Pedido> {
    return this.httpClient
      .get<Pedido>(`${this.API_URL}pedidos/${idPedido}/old`).pipe(
        map((res) => Object.assign(new Pedido(), res)));
  }

  obterIntegracoesErpPorId(idRequisicao: number): Observable<PedidoExibicaoDto> {
    return this.httpClient.get<PedidoExibicaoDto>(`${this.API_URL}pedidos/${idRequisicao}/pedidointegracaoerp`).pipe(
      map((res) => Object.assign(new PedidoExibicaoDto(), res)));
  }

  inserir(pedido: Pedido): Observable<Pedido> {
    return this.httpClient.post<Pedido>(`${this.API_URL}pedidos`, pedido);
  }

  alterar(pedido: Pedido): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}pedidos`, pedido);
  }

  altereInformacoesPedido(pedido: PedidoAlteracaoDto): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}pedidos/altere-informacoes`, pedido);
  }

  alterarSituacao(pedidoTramite: PedidoTramite): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}pedidos/${pedidoTramite.idPedido}/situacoes/${pedidoTramite.situacao}`,
      pedidoTramite,
    );
  }

  excluir(idPedido: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}pedidos/${idPedido}`);
  }

  excluirBatch(pedidos: Array<Pedido>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}pedidos`, pedidos);
  }

  alterarTransportadora(idPedido: number, idTransportadora: number): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}pedidos/${idPedido}/transportadora/${idTransportadora}`,
      null,
    );
  }

  alterarEntregaProgramada(pedidoItem: PedidoItem): Observable<PedidoItemQuantidadeDataEntregaDto> {
    return this.httpClient.put<PedidoItemQuantidadeDataEntregaDto>(`${this.API_URL}pedidos/itens/entregaprogramada`, pedidoItem);
  }

  // #region Tramites
  confirmarPedido(pedido: Pedido): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}pedidos/confirmados`, pedido);
  }

  revisarPedido(pedido: PedidoExibicaoDto): Observable<Pedido> {
    return this.httpClient.post<Pedido>(`${this.API_URL}pedidos/revisados`, pedido);
  }

  prepararPedido(tramite: PedidoTramite): Observable<Pedido> {
    return this.httpClient.post<Pedido>(`${this.API_URL}pedidos/preparados`, tramite);
  }

  faturarPedido(tramite: PedidoTramite): Observable<Pedido> {
    return this.httpClient.post<Pedido>(`${this.API_URL}pedidos/faturados`, tramite);
  }

  enviarPedido(tramite: PedidoTramite): Observable<Pedido> {
    return this.httpClient.post<Pedido>(`${this.API_URL}pedidos/enviados`, tramite);
  }

  receberPedido(tramite: PedidoTramite): Observable<Pedido> {
    return this.httpClient.post<Pedido>(`${this.API_URL}pedidos/entregues`, tramite);
  }

  cancelarSaldoPedido(pedidoTramite: PedidoTramite, notaFiscal: string): Observable<Pedido> {
    return this.httpClient.post<Pedido>(`${this.API_URL}pedidos/entregues/${notaFiscal}`, pedidoTramite);
  }

  receberPedidoItens(
    pedidoItemRecebimento: Array<PedidoItemRecebimento>,
  ): Observable<Pedido> {
    return this.httpClient.post<Pedido>(
      `${this.API_URL}pedidos/pedidoitens/entregues`,
      pedidoItemRecebimento,
    );
  }

  obterSaldoPedidoItensRecebido(idPedido: number): Observable<Array<PedidoItemRecebimento>> {
    return this.httpClient.get<Array<PedidoItemRecebimento>>(
      `${this.API_URL}pedidos/pedidoitens/saldo/${idPedido}`,
    );
  }

  cancelarPedido(pedidoCanceladoDto: PedidoCanceladoDto): Observable<SituacaoPedido> {
    return this.httpClient.post<SituacaoPedido>(`${this.API_URL}pedidos/cancelados`, pedidoCanceladoDto);
  }

  observacaoPedido(pedido: Pedido) {
    return this.httpClient.patch(`${this.API_URL}pedidos/${pedido.idPedido}/observacao-pedido`, { observacao: pedido.observacao });
  }
  // #endregion

  // #region Itens de Pedido
  filtrarItens(
    itensPorPagina: number,
    pagina: number,
    idPedido: number,
  ): Observable<Paginacao<PedidoItem>> {
    return this.httpClient.get<Paginacao<PedidoItem>>(`${this.API_URL}pedidos/${idPedido}/filtro`, {
      params: { itensPorPagina: itensPorPagina.toString(), pagina: pagina.toString() },
    });
  }

  listarItens(idPedido: number): Observable<Array<PedidoItem>> {
    return this.httpClient.get<Array<PedidoItem>>(`${this.API_URL}pedidos/${idPedido}`);
  }

  obterItemPorId(idPedido: number, idPedidoItem: number): Observable<PedidoItem> {
    return this.httpClient.get<PedidoItem>(
      `${this.API_URL}pedidos/${idPedido}/itens/${idPedidoItem}`,
    );
  }

  inserirItem(pedidoItem: PedidoItem): Observable<PedidoItem> {
    return this.httpClient.post<PedidoItem>(`${this.API_URL}pedidos/itens`, pedidoItem);
  }

  alterarItem(idPedido: number, pedidoItem: PedidoItem): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}pedidos/${idPedido}/itens`, pedidoItem);
  }

  alterarItemBatch(idPedido: number, pedidoItens: Array<PedidoItem>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}pedidos/${idPedido}/itens`, pedidoItens);
  }

  alterarItemSituacao(
    idPedido: number,
    idPedidoItem: number,
    situacao: SituacaoPedidoItem,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}pedidos/${idPedido}/itens/${idPedidoItem}/situacao/${situacao}`,
      null,
    );
  }

  excluirItem(idPedido: number, idPedidoItem: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}pedidos/${idPedido}/itens/${idPedidoItem}`,
    );
  }

  excluirItens(idPedido: number, pedidoItens: Array<PedidoItem>): Observable<number> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: pedidoItens };

    return this.httpClient.delete<number>(`${this.API_URL}pedidos/${idPedido}/deleteItens`, httpOptions);
  }

  obterItensAnalise(idPedido: number) {
    return this.httpClient.get<Array<PedidoItem>>(
      `${this.API_URL}pedidos/${idPedido}/itens/analise`,
    );
  }

  obterItensRevisao(idPedido: number) {
    return this.httpClient.get<Array<PedidoItem>>(
      `${this.API_URL}pedidos/${idPedido}/itens/revisao`,
    );
  }

  takeOrder(idPedido: number) {
    return this.httpClient.put<boolean>(`${this.API_URL}pedidos/take-order`, idPedido);
  }

  // #endregion

  // #region Lotes de pedidos
  filtrarLotes(
    itensPorPagina: number,
    pagina: number,
    idPedido: number,
  ): Observable<Paginacao<PedidoLote>> {
    return this.httpClient.get<Paginacao<PedidoLote>>(
      `${this.API_URL}pedidolotes/${idPedido}/filtro`,
      {
        params: { itensPorPagina: itensPorPagina.toString(), pagina: pagina.toString() },
      },
    );
  }

  obterLotePorId(idPedidoLote: number): Observable<PedidoItem> {
    return this.httpClient.get<PedidoItem>(`${this.API_URL}pedidolotes/${idPedidoLote}`);
  }

  inserirLote(pedidoLote: PedidoLote): Observable<PedidoLote> {
    return this.httpClient.post<PedidoLote>(`${this.API_URL}pedidolotes`, pedidoLote);
  }

  alterarLote(pedidoLote: PedidoLote): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}pedidolotes`, pedidoLote);
  }

  excluirLote(idPedidoLote: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}pedidolotes/${idPedidoLote}`);
  }

  inserirAvalicaoPedido(avaliacao: AvaliacaoPedido): Observable<AvaliacaoPedido> {
    return this.httpClient.post<AvaliacaoPedido>(
      `${this.API_URL}pedidos/avaliacaoPedido`,
      avaliacao,
    );
  }

  alterarAvalicaoPedido(avaliacao: AvaliacaoPedido): Observable<AvaliacaoPedido> {
    return this.httpClient.put<AvaliacaoPedido>(
      `${this.API_URL}pedidos/avaliacaoPedido`,
      avaliacao,
    );
  }

  obterCriteriosAvaliacaoPorCategoriaPedido(id: number): Observable<Array<AvaliacaoPedido>> {
    return this.httpClient.get<Array<AvaliacaoPedido>>(
      `${this.API_URL}pedidos/avaliacaoPedido/${id}`,
    );
  }

  obterCriteriosAvaliacaoPorCategoriaPedidoRecebido(
    id: number,
  ): Observable<Array<AvaliacaoPedido>> {
    return this.httpClient.get<Array<AvaliacaoPedido>>(
      `${this.API_URL}pedidos/avaliacaoPedido/recebido/${id}`,
    );
  }
  // #endregion

  //#endregion Configurações
  obterObservacaoPadraoPorId(
    idObservacaoPadrao: number,
  ): Observable<PedidoObservacaoPadrao> {
    return this.httpClient.get<PedidoObservacaoPadrao>(
      `${this.API_URL}pedidos/configuracoes/observacaopadrao/${idObservacaoPadrao}`,
    );
  }

  obterObservacaoPadraoPorIdTenant(): Observable<PedidoObservacaoPadrao> {
    return this.httpClient.get<PedidoObservacaoPadrao>(
      `${this.API_URL}pedidos/configuracoes/observacaopadrao/`,
    );
  }

  inserirObservacaoPadrao(
    pedidoObservacaoPadrao: PedidoObservacaoPadrao,
  ): Observable<PedidoObservacaoPadrao> {
    return this.httpClient.post<PedidoObservacaoPadrao>(
      `${this.API_URL}pedidos/configuracoes/observacaopadrao/`,
      pedidoObservacaoPadrao,
    );
  }

  alterarObservacaoPadrao(
    pedidoObservacaoPadrao: PedidoObservacaoPadrao,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}pedidos/configuracoes/observacaopadrao/`,
      pedidoObservacaoPadrao,
    );
  }
  //#endregion

  //#region historicoRecebimento
  obterHistoricosRecebimento(
    idPedido: number,
  ): Observable<Array<DataHistoricoRecebimentoDto>> {
    return this.httpClient.get<Array<DataHistoricoRecebimentoDto>>(
      `${this.API_URL}pedidos/${idPedido}/itens/historico-recebimento`,
    );
  }
  //#endregion

  gerarPdfPedido(idPedido: number): Observable<any> {
    const descriptioFile = `Pedido_${idPedido}.pdf`;
    return this.download(idPedido).pipe(map((file) => this.arquivoService.createDownloadElement(file, descriptioFile)));
  }

  download(idPedido: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}pedidos/gerar-pdf/${idPedido}`,
      {
        responseType: 'blob',
      },
    );
  }

  obtenhaCodigoDeIntegracaoErpDoProduto(pedido: Pedido, pedidoItem: PedidoItem): string {
    if (pedidoItem.produto && pedidoItem.produto.integracoesErp) {
      const produtoIntegracaoErp = pedidoItem.produto.integracoesErp.find((x) => x.idPessoaJuridica === pedido.idComprador);

      if (produtoIntegracaoErp) {
        return produtoIntegracaoErp.codigoIntegracao;
      }
    }

    return pedidoItem.idProduto.toString();
  }

  registreVisualizacaoFornecedor(idPedido: number): Observable<VisualizacaoPedido> {
    return this.httpClient.post<VisualizacaoPedido>(`${this.API_URL}pedidos/visualizacao/fornecedor`, idPedido);
  }

  // #region Anexos

  inserirAnexos(idPedido: number, anexos: Array<Arquivo>): Observable<any> {
    return this.httpClient.post(`${this.API_URL}pedidos/${idPedido}/files`, anexos);
  }

  deletarAnexo(idPedidoAnexo: number): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}pedidos/file/${idPedidoAnexo}`);
  }

  obterArquivosAnexos(idPedido: number): Observable<Array<PedidoAnexo>> {
    return this.httpClient.get<Array<PedidoAnexo>>(`${this.API_URL}pedidos/${idPedido}/files`);
  }

  filtre(filtroRequisicao: PedidoFiltroDto, integracaoRequisicaoErp: boolean): Observable<PaginacaoPesquisaConfiguradaDto<PedidoDto>> {
    return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<PedidoDto>>(`${this.API_URL}pedidos/filtro/${integracaoRequisicaoErp}`, filtroRequisicao);
  }

  obtenhaFiltroSalvo(integracaoRequisicaoErp: boolean): Observable<PedidoFiltroDto> {
    return this.httpClient.get<PedidoFiltroDto>(`${this.API_URL}pedidos/filtroSalvo/${integracaoRequisicaoErp}`);
  }

  obtenhaFiltroSalvoHistoricoCompra(): Observable<HistoricoPedidosFiltroDto> {
    return this.httpClient.get<HistoricoPedidosFiltroDto>(`${this.API_URL}pedidos/filtro-salvo/historico-compra`);
  }

  obtenhaColunasDiponiveis(integracaoRequisicaoErp: boolean): Observable<Array<ConfiguracaoColunaDto>> {
    return this.httpClient.get<Array<ConfiguracaoColunaDto>>(`${this.API_URL}pedidos/colunasDisponiveis/${integracaoRequisicaoErp}`);
  }

  exporte(filtroRequisicao: PedidoFiltroDto, integracaoRequisicaoErp: boolean): Observable<any> {
    return this.httpClient
      .post(
        `${this.API_URL}pedidos/filtro/relatorio/${integracaoRequisicaoErp}`,
        filtroRequisicao,
        { responseType: 'blob' })
      .pipe(catchError(this.errorService.parseErrorBlob));
  }

  exporteHistorico(historicoPedidosFiltroDto: HistoricoPedidosFiltroDto): Observable<any> {
    return this.httpClient
      .post(
        `${this.API_URL}pedidos/filtro-historico-compra/relatorio`,
        historicoPedidosFiltroDto,
        { responseType: 'blob' })
      .pipe(catchError(this.errorService.parseErrorBlob));
  }

  filtreHistoricoPedidosUsuario(filtroHistorico: HistoricoPedidosFiltroDto): Observable<PaginacaoPesquisaConfiguradaDto<HistoricoCompraUsuarioDto>> {
    return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<HistoricoCompraUsuarioDto>>(`${this.API_URL}pedidos/filtro/historico-pedidos`, filtroHistorico);
  }
  // #endregion

  private obtenhaParametrosParaFiltrar(itemOrdenar: string, ordenacao: Ordenacao, itensPorPagina: number, pagina: number, termo: string, filtroAvancado?: PedidoFiltro): HttpParams {
    const params = {
      itemOrdenar: itemOrdenar,
      ordenacao: ordenacao.toString(),
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      termo: termo,
    };

    if (filtroAvancado != null) {
      params['filtroAvancadoJson'] = JSON.stringify(filtroAvancado);
    }

    return new HttpParams({ fromObject: params });
  }
}
