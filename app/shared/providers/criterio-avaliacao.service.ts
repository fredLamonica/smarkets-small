import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginacao } from '@shared/models';
import { CriterioAvaliacaoPedido } from '@shared/models/pedido/criterio-avaliacao-pedido';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CriterioAvaliacaoFiltro } from '../models/fltros/criterio-avaliacao-filtro';

@Injectable()
export class CriterioAvaliacaoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  inserir(criterio: CriterioAvaliacaoPedido): Observable<CriterioAvaliacaoPedido> {
    return this.httpClient.post<CriterioAvaliacaoPedido>(`${this.API_URL}criteriosavaliacaopedido`, criterio);
  }

  alterar(criterio: CriterioAvaliacaoPedido): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}criteriosavaliacaopedido`, criterio);
  }

  excluir(idCriterio: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}criteriosavaliacaopedido/${idCriterio}`);
  }

  obterPorId(idCriterio: number): Observable<CriterioAvaliacaoPedido> {
    return this.httpClient.get<CriterioAvaliacaoPedido>(`${this.API_URL}criteriosavaliacaopedido/${idCriterio}`);
  }

  filtrar(
    criterioAvaliacaoFiltro: CriterioAvaliacaoFiltro,
  ): Observable<Paginacao<CriterioAvaliacaoPedido>> {
    return this.httpClient.post<Paginacao<CriterioAvaliacaoPedido>>(
      `${this.API_URL}criteriosavaliacaopedido/filtro`,
      criterioAvaliacaoFiltro,
    );
  }

  obterTodos(): Observable<Array<CriterioAvaliacaoPedido>> {
    return this.httpClient.get<Array<CriterioAvaliacaoPedido>>(`${this.API_URL}criteriosavaliacaopedido`);
  }

}
