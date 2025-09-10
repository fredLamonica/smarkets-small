import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo, Ordenacao, Paginacao, Requisicao, RequisicaoItem, RequisicaoItemComentario, RequisicaoItemTramite } from '@shared/models';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfiguracaoColunaDto } from '../models/configuracao-coluna-dto';
import { RequisicaoItemQuantidadeDataEntregaValorReferenciaDto } from '../models/dto/requisicao-item-quantidade-data-entrega-valor-referencia-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../models/paginacao-pesquisa-configurada-dto';
import { RequisicaoAnexo } from '../models/requisicao/requisicao-anexo';
import { RequisicaoDto } from '../models/requisicao/requisicao-dto';
import { RequisicaoFiltroDto } from '../models/requisicao/requisicao-filtro-dto';
import { ErrorService } from '../utils/error.service';

@Injectable()
export class RequisicaoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private errorService: ErrorService) { }

  filtre(filtroRequisicao: RequisicaoFiltroDto): Observable<PaginacaoPesquisaConfiguradaDto<RequisicaoDto>> {
    return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<RequisicaoDto>>(`${this.API_URL}requisicoes/filtro`, filtroRequisicao);
  }

  exporte(filtroRequisicao: RequisicaoFiltroDto): Observable<any> {
    return this.httpClient.post(`${this.API_URL}requisicoes/filtro/relatorio`, filtroRequisicao, { responseType: 'blob' }).pipe(catchError(this.errorService.parseErrorBlob));
  }

  obtenhaFiltroSalvo(): Observable<RequisicaoFiltroDto> {
    return this.httpClient.get<RequisicaoFiltroDto>(`${this.API_URL}requisicoes/filtroSalvo`);
  }

  obtenhaColunasDiponiveis(): Observable<Array<ConfiguracaoColunaDto>> {
    return this.httpClient.get<Array<ConfiguracaoColunaDto>>(`${this.API_URL}requisicoes/colunasDisponiveis`);
  }

  obterRequisicoesCarrinho(): Observable<Requisicao[]> {
    return this.httpClient.get<Requisicao[]>(`${this.API_URL}requisicoes/carrinho`);
  }

  obterRequisicoesAcompanhamento(
    itensPorPagina: number,
    pagina: number,
    itemOrdenacao: string,
    termo: string,
  ): Observable<Paginacao<Requisicao>> {
    return this.httpClient.get<Paginacao<Requisicao>>(`${this.API_URL}requisicoes/acompanhamento`, {
      params: {
        itensPorPagina: itensPorPagina.toString(),
        pagina: pagina.toString(),
        itemOrdenacao: itemOrdenacao,
        termo: termo,
      },
    });
  }

  obterFiltroAvancado(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    idRequisicao: string,
    termoCodigoRCRequisicao: string,
    termoCategoriaRequisicao: string,
    termoEmailRequisitante: string,
    termoResponsavelRequisicao: string,
    termoStatusRequisicao: string,
    termoSituacaoSolicitacao: string,
    termoCategoriaDemanda: string,
    termoCodigoFilialEmpresa: string,
    tipoDocumento: string,
    idRequisicaoErp: string,
  ): Observable<Paginacao<RequisicaoItem>> {
    return this.httpClient.get<Paginacao<RequisicaoItem>>(
      `${this.API_URL}requisicoes/filtroAvancado`,
      {
        params: {
          itemOrdenar: itemOrdenar,
          ordenacao: ordenacao.toString(),
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          idRequisicao: idRequisicao,
          termoCodigoRCRequisicao: termoCodigoRCRequisicao,
          termoCategoriaRequisicao: termoCategoriaRequisicao,
          termoEmailRequisitante: termoEmailRequisitante,
          termoResponsavelRequisicao: termoResponsavelRequisicao,
          termoStatusRequisicao: termoStatusRequisicao,
          termoSituacaoSolicitacao: termoSituacaoSolicitacao,
          termoCategoriaDemanda: termoCategoriaDemanda,
          termoCodigoFilialEmpresa: termoCodigoFilialEmpresa,
          tipoDocumento: tipoDocumento,
          idRequisicaoErp: idRequisicaoErp,
        },
      },
    );
  }

  confirmar(requisicoes: Requisicao[]): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}requisicoes/confirmar`, requisicoes);
  }

  alterarDadosComuns(requisicao: Requisicao): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}requisicoes/dadoscomuns`, requisicao);
  }

  favoritarRequisicao(idRequisicao: number, isFavorita: boolean): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${this.API_URL}requisicoes/favoritar/${idRequisicao}`,
      isFavorita,
    );
  }

  getAnexos(idRequisicao: number): Observable<Array<RequisicaoAnexo>> {
    return this.httpClient.get<Array<RequisicaoAnexo>>(`${this.API_URL}requisicoes/anexos/${idRequisicao}`);
  }

  postAnexos(idRequisicao: number, arquivos: Array<Arquivo>): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}requisicoes/anexos/${idRequisicao}`, arquivos);
  }

  deleteAnexos(idRequisicaoAnexo: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}requisicoes/anexos/${idRequisicaoAnexo}`);
  }

  // #region RequisicaoItem
  filtrarRequisicaoItens(
    itensPorPagina: number,
    pagina: number,
    itemOrdenacao: string,
    termo: string,
  ): Observable<Paginacao<RequisicaoItem>> {
    return this.httpClient.get<Paginacao<RequisicaoItem>>(
      `${this.API_URL}requisicoes/itens/filtro`,
      {
        params: {
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          termo: termo,
        },
      },
    );
  }

  obterItensAprovados(): Observable<Array<RequisicaoItem>> {
    return this.httpClient.get<Array<RequisicaoItem>>(`${this.API_URL}requisicoes/item/aprovados`);
  }

  inserirItem(requisicaoItem: RequisicaoItem): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}requisicoes/item`, requisicaoItem);
  }

  alterarItem(requisicaoItem: RequisicaoItem): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}requisicoes/item`, requisicaoItem);
  }

  alterarEntregaProgramada(requisicaoItem: RequisicaoItem): Observable<RequisicaoItemQuantidadeDataEntregaValorReferenciaDto> {
    return this.httpClient.put<RequisicaoItemQuantidadeDataEntregaValorReferenciaDto>(`${this.API_URL}requisicoes/item/entregaprogramada`, requisicaoItem);
  }

  deletarItem(requisicaoItem: RequisicaoItem): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}requisicoes/item/${requisicaoItem.idRequisicaoItem}`,
    );
  }

  deletarItens(requisicaoItens: Array<RequisicaoItem>): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: requisicaoItens, };
    return this.httpClient.delete<number>(`${this.API_URL}requisicoes/itens`,  httpOptions );
 }

  aprovarItem(requisicaoItem: RequisicaoItem): Observable<RequisicaoItem> {
    return this.httpClient.post<RequisicaoItem>(`${this.API_URL}requisicoes/item/aprovar`, requisicaoItem);
  }

  aprovarItemPorId(idRequisicaoItem: number): Observable<RequisicaoItem> {
    return this.httpClient.post<RequisicaoItem>(`${this.API_URL}requisicoes/item/aprovarPorId`, idRequisicaoItem);
  }

  cancelarItem(requisicaoItem: RequisicaoItem): Observable<RequisicaoItem> {
    return this.httpClient.post<RequisicaoItem>(`${this.API_URL}requisicoes/item/cancelar`, requisicaoItem);
  }

  cancelarItemPorId(idRequisicaoItem: number): Observable<RequisicaoItem> {
    return this.httpClient.post<RequisicaoItem>(`${this.API_URL}requisicoes/item/cancelarPorId`, idRequisicaoItem);
  }

  reprovarItem(requisicaoItem: RequisicaoItem): Observable<RequisicaoItem> {
    return this.httpClient.post<RequisicaoItem>(`${this.API_URL}requisicoes/item/reprovar`, requisicaoItem);
  }

  reprovarItemPorId(idRequisicaoItem: number): Observable<RequisicaoItem> {
    return this.httpClient.post<RequisicaoItem>(`${this.API_URL}requisicoes/item/reprovarPorId`, idRequisicaoItem);
  }

  enviarItemParaAvaliacao(requisicaoItem: RequisicaoItem): Observable<RequisicaoItem> {
    return this.httpClient.post<RequisicaoItem>(`${this.API_URL}requisicoes/item/avaliacao`, requisicaoItem);
  }

  enviarItemParaAvaliacaoPorId(idRequisicaoItem: number): Observable<RequisicaoItem> {
    return this.httpClient.post<RequisicaoItem>(`${this.API_URL}requisicoes/item/avaliacaoPorId`, idRequisicaoItem);
  }

  favoritarItem(idRequisicaoItem: number, isFavorito: boolean): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${this.API_URL}requisicoes/item/favoritar/${idRequisicaoItem}`,
      isFavorito,
    );
  }

  alterarResponsavel(requisicaoItem: RequisicaoItem): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}requisicoes/item/${requisicaoItem.idRequisicaoItem}/responsavel`, requisicaoItem);
  }

  alterarResponsavelPorId(idRequisicaoItem: number, idUsuarioResponsavel: number): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}requisicoes/item/${idRequisicaoItem}/responsavelPorId`, idUsuarioResponsavel);
  }

  iniciarSlaRequisicaoItem(requisicaoItem: RequisicaoItem): Observable<any> {
    return this.httpClient.post(`${this.API_URL}requisicoes/item/sla/inicios`, requisicaoItem);
  }

  iniciarSlaRequisicaoItemPorId(idRequisicaoItem: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}requisicoes/item/sla/iniciosPorId`, idRequisicaoItem);
  }

  pararSlaRequisicaoItem(requisicaoItem: RequisicaoItem): Observable<any> {
    return this.httpClient.post(`${this.API_URL}requisicoes/item/sla/pausas`, requisicaoItem);
  }

  pararSlaRequisicaoItemPorId(idRequisicaoItem: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}requisicoes/item/sla/pausasPorId`, idRequisicaoItem);
  }

  obterTramites(idRequisicaoItem: number): Observable<Array<RequisicaoItemTramite>> {
    return this.httpClient.get<Array<RequisicaoItemTramite>>(
      `${this.API_URL}requisicoes/itens/${idRequisicaoItem}/tramites`,
    );
  }

  obterPorId(idRequisicao: number): Observable<Requisicao> {
    return this.httpClient.get<Requisicao>(`${this.API_URL}requisicoes/${idRequisicao}`);
  }

  comentarItem(
    idRequisicaoItem: number,
    comentario: string,
  ): Observable<RequisicaoItemComentario> {
    return this.httpClient.post<RequisicaoItemComentario>(
      `${this.API_URL}requisicoes/item/${idRequisicaoItem}/comentar`,
      { comentario: comentario },
    );
  }

  obterComentariosPorIdRequisicaoItem(
    idRequisicaoItem: number,
  ): Observable<Array<RequisicaoItemComentario>> {
    return this.httpClient.get<Array<RequisicaoItemComentario>>(
      `${this.API_URL}requisicoes/item/${idRequisicaoItem}/comentarios`,
    );
  }
  // #endregion
}
