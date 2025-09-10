import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { CondicaoPagamento, Paginacao } from '@shared/models';
import { CondicaoPagamentoFiltro } from '../models/fltros/condicao-pagamento-filtro';

@Injectable()
export class CondicaoPagamentoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  inserir(condicaoPagamento: CondicaoPagamento): Observable<CondicaoPagamento> {
    return this.httpClient.post<CondicaoPagamento>(`${this.API_URL}condicoespagamento`, condicaoPagamento);
  }

  alterar(condicaoPagamento: CondicaoPagamento): Observable<CondicaoPagamento> {
    return this.httpClient.put<CondicaoPagamento>(`${this.API_URL}condicoespagamento`, condicaoPagamento);
  }

  obterPorId(idCondicaoPagamento: number): Observable<CondicaoPagamento> {
    return this.httpClient.get<CondicaoPagamento>(`${this.API_URL}condicoespagamento/${idCondicaoPagamento}`);
  }

  listar(): Observable<Array<CondicaoPagamento>> {
    return this.httpClient.get<Array<CondicaoPagamento>>(`${this.API_URL}condicoespagamento`);
  }

  listarAtivos(): Observable<Array<CondicaoPagamento>> {
    return this.httpClient.get<Array<CondicaoPagamento>>(`${this.API_URL}condicoespagamento/ativos`);
  }

  listarPorTenant(idTenant: number): Observable<Array<CondicaoPagamento>> {
    return this.httpClient.get<Array<CondicaoPagamento>>(`${this.API_URL}condicoespagamento/tenant/${idTenant}`);
  }

  listarPorPedido(idPedido: number): Observable<Array<CondicaoPagamento>> {
    return this.httpClient.get<Array<CondicaoPagamento>>(`${this.API_URL}condicoespagamento/pedido/${idPedido}`);
  }

  listarPorContratoCatalogo(idContratoCatalogo: number): Observable<Array<CondicaoPagamento>> {
    return this.httpClient.get<Array<CondicaoPagamento>>(`${this.API_URL}condicoespagamento/contratocatalogo/${idContratoCatalogo}`);
  }

  filtrar(
    condicaoPagamentoFiltro: CondicaoPagamentoFiltro,
  ): Observable<Paginacao<CondicaoPagamento>> {
    return this.httpClient.post<Paginacao<CondicaoPagamento>>(
      `${this.API_URL}condicoespagamento/filtro`,
      condicaoPagamentoFiltro,
    );
  }

  deletarBatch(condicoesPagamento: Array<CondicaoPagamento>) {
    return this.httpClient.patch<number>(`${this.API_URL}condicoespagamento`, condicoesPagamento);
  }

  excluir(idTipo: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}condicoespagamento/${idTipo}`);
  }

}
