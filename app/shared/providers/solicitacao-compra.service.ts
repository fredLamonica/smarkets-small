import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Arquivo, ItemSolicitacaoCompra, ItemSolicitacaoCompraComentario, Ordenacao, Paginacao, Pedido, PedidoGeradoDto, PedidoItem,
  Requisicao, RequisicaoItem, SituacaoSolicitacaoCompra, SolicitacaoCompra, SubItemSolicitacaoCompraComentario
} from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsavelCompradorSCDto } from '../models/dto/responsavel-comprador-sc-dto';
import { SubItemSolicitacaoCompra } from './../models/solicitacao-compra/sub-item-solicitacao-compra';

@Injectable()
export class SolicitacaoCompraService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obter(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    termo: string,
  ): Observable<Paginacao<SolicitacaoCompra>> {
    return this.httpClient.get<Paginacao<SolicitacaoCompra>>(`${this.API_URL}solicitacoescompra`, {
      params: {
        itemOrdenar: itemOrdenar,
        ordenacao: ordenacao.toString(),
        itensPorPagina: itensPorPagina.toString(),
        pagina: pagina.toString(),
        termo: termo,
      },
    });
  }

  obterFiltroAvancado(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    termoCategoriaSolicitacao: string,
    termoGrupoCompradores: string,
    termoTipoRC: string,
    termoCodigoRCSolicitacao: string,
    termoSituacaoSolicitacao: string,
    termoRequisitante: string,
    termoDescricaoSolicitacao: string,
    dataInicial: string,
    dataFinal: string,
    termoCategoriaDemanda: string,
    termoCodigoFilialEmpresa: string,
    tipoDocumento: string,
    termoComprador: string,
  ): Observable<Paginacao<ItemSolicitacaoCompra>> {
    return this.httpClient.get<Paginacao<ItemSolicitacaoCompra>>(
      `${this.API_URL}solicitacoescompra/itens/filtroAvancado`,
      {
        params: {
          itemOrdenar: itemOrdenar,
          ordenacao: ordenacao.toString(),
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          termoCategoriaSolicitacao: termoCategoriaSolicitacao,
          termoGrupoCompradores: termoGrupoCompradores,
          termoTipoRC: termoTipoRC,
          termoCodigoRCSolicitacao: termoCodigoRCSolicitacao,
          termoSituacaoSolicitacao: termoSituacaoSolicitacao,
          termoRequisitante: termoRequisitante,
          termoDescricaoSolicitacao: termoDescricaoSolicitacao,
          dataInicial: dataInicial,
          dataFinal: dataFinal,
          termoCategoriaDemanda: termoCategoriaDemanda,
          termoCodigoFilialEmpresa: termoCodigoFilialEmpresa,
          tipoDocumento: tipoDocumento,
          termoComprador: termoComprador,
        },
      },
    );
  }

  obterItemFiltro(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    termo: string,
  ): Observable<Paginacao<ItemSolicitacaoCompra>> {
    return this.httpClient.get<Paginacao<ItemSolicitacaoCompra>>(
      `${this.API_URL}solicitacoescompra/itens/filtro`,
      {
        params: {
          itemOrdenar: itemOrdenar,
          ordenacao: ordenacao.toString(),
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          termo: termo,
        },
      },
    );
  }

  obterPorId(idSolicitacaoCompra: number): Observable<SolicitacaoCompra> {
    return this.httpClient.get<SolicitacaoCompra>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}`,
    );
  }

  cancelarSolicitacao(
    idSolicitacaoCompra: number,
    idsItensSolicitacoesCompra: Array<number>,
    justificativa: string,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}solicitacoescompra/cancelar/${idSolicitacaoCompra}`,
      { justificativa: justificativa, idsItensSolicitacoesCompra: idsItensSolicitacoesCompra },
    );
  }

  devolverSolicitacao(
    idSolicitacaoCompra: number,
    idsItensSolicitacoesCompra: Array<number>,
    enviarEmail: boolean,
    justificativa: string,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}solicitacoescompra/devolver/${idSolicitacaoCompra}/${enviarEmail}/justificativa`,
      { justificativa: justificativa, idsItensSolicitacoesCompra: idsItensSolicitacoesCompra },
    );
  }

  alterarSituacao(
    idSolicitacaoCompra: number,
    situacao: SituacaoSolicitacaoCompra,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}solicitacoescompra/alterarSituacao/${idSolicitacaoCompra}/situacao/${situacao}`,
      null,
    );
  }
  desbloquearItensSc(
    itens: Array<ItemSolicitacaoCompra>,
  ): Observable<Array<ItemSolicitacaoCompra>> {
    return this.httpClient.put<Array<ItemSolicitacaoCompra>>(
      `${this.API_URL}solicitacoescompra/debloquearitem`,
      { ItensSolicitacaoCompra: itens },
    );
  }

  desvincularItemSc( item: number ): Observable<number> {
    return this.httpClient.get<number>
      (`${this.API_URL}solicitacoescompra/desvincularitemsc/${item}`);
  }

  alterarResponsavel(responsavelCompradorDto: ResponsavelCompradorSCDto): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}solicitacoescompra/alterarResponsavel`,
      responsavelCompradorDto,
    );
  }

  gerarPedidosSemNegociacao(
    idSolicitacaoCompra: number,
    pedidos: Array<Pedido>,
  ): Observable<Array<PedidoGeradoDto>> {
    return this.httpClient.post<Array<PedidoGeradoDto>>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/pedidosSemNegociacao`,
      pedidos,
    );
  }

  // public alterar(solicitacaoCompra: SolicitacaoCompra): Observable<number> {
  //     return this.httpClient.put<number>(`${this.API_URL}solicitacoescompra/alterar/${solicitacaoCompra}`, solicitacaoCompra);
  // }

  // #region Itens
  obterArquivosPorItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
  ): Observable<Array<Arquivo>> {
    return this.httpClient.get<Array<Arquivo>>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/anexos`,
    );
  }

  inserirArquivosItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    anexos: Array<Arquivo>,
  ): Observable<Array<Arquivo>> {
    return this.httpClient.post<Array<Arquivo>>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/anexos`,
      anexos,
    );
  }

  deletarArquivoItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    idArquivo: number,
  ): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/anexos/${idArquivo}`,
    );
  }

  obterComentariosPorItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
  ): Observable<Array<ItemSolicitacaoCompraComentario>> {
    return this.httpClient.get<Array<ItemSolicitacaoCompraComentario>>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/comentarios`,
    );
  }

  comentarItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    comentario: string,
  ): Observable<ItemSolicitacaoCompraComentario> {
    return this.httpClient.post<ItemSolicitacaoCompraComentario>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/comentarios`,
      { comentario: comentario },
    );
  }
  // #endregion

  // #region SubItem
  obterArquivosPorSubItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
  ): Observable<Array<Arquivo>> {
    return this.httpClient.get<Array<Arquivo>>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/anexos`,
    );
  }

  inserirArquivosSubItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    anexos: Array<Arquivo>,
  ): Observable<Array<Arquivo>> {
    return this.httpClient.post<Array<Arquivo>>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/anexos`,
      anexos,
    );
  }

  deletarArquivoSubItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    idArquivo: number,
  ): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/anexos/${idArquivo}`,
    );
  }

  obterComentariosPorSubItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
  ): Observable<Array<SubItemSolicitacaoCompraComentario>> {
    return this.httpClient.get<Array<SubItemSolicitacaoCompraComentario>>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/comentarios`,
    );
  }

  comentarSubItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    comentario: string,
  ): Observable<SubItemSolicitacaoCompraComentario> {
    return this.httpClient.post<SubItemSolicitacaoCompraComentario>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/comentarios`,
      { comentario: comentario },
    );
  }

  obterSubItens(
    idItemSolicitacaoCompra: number,
  ): Observable<Array<SubItemSolicitacaoCompra>> {
    return this.httpClient.get<Array<SubItemSolicitacaoCompra>>(
      `${this.API_URL}solicitacoescompra/subitem/${idItemSolicitacaoCompra}`,
    );
  }
  //#region Pedido
  vincularPedidoItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    pedidoItem: PedidoItem,
  ): Observable<PedidoItem> {
    return this.httpClient.post<PedidoItem>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/pedidos`,
      pedidoItem,
    );
  }

  vincularPedidoSubItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    pedido: Pedido,
  ): Observable<Pedido> {
    return this.httpClient.post<Pedido>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/pedidos`,
      pedido,
    );
  }

  desvincularSubItemPedidoItem(
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    pedidoItem: PedidoItem,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}solicitacoescompra/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/pedidos/desvincula`,
      pedidoItem,
    );
  }
  //#endregion

  //#region Requisicao
  vincularRequisicaoItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    requisicao: Requisicao,
  ): Observable<Requisicao> {
    return this.httpClient.post<Requisicao>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/requisicoes`,
      requisicao,
    );
  }

  vincularRequisicaoSubItem(
    idSolicitacaoCompra: number,
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    requisicao: Requisicao,
  ): Observable<Requisicao> {
    return this.httpClient.post<Requisicao>(
      `${this.API_URL}solicitacoescompra/${idSolicitacaoCompra}/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/requisicoes`,
      requisicao,
    );
  }

  desvincularSubItemRequisicaoItem(
    idItemSolicitacaoCompra: number,
    idSubItemSolicitacaoCompra: number,
    requisicaoItem: RequisicaoItem,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}solicitacoescompra/itens/${idItemSolicitacaoCompra}/subitens/${idSubItemSolicitacaoCompra}/requisicoes/desvincula`,
      requisicaoItem,
    );
  }
  //#endregion

  vinculeProdutosSelecionados(
    idsItensSolicitacaoCompra: Array<number>): Observable<string> {
    return this.httpClient.post<string>(`${this.API_URL}solicitacoescompra/itens/vincular-produtos/`, idsItensSolicitacaoCompra);
  }

  // #endregion
}
