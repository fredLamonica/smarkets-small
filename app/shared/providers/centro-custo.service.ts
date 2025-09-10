import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { CentroCusto, CentroCustoAlcada, Paginacao, Situacao } from '@shared/models';
import { CentroCustoAlcadaFiltro } from '../models/fltros/centro-custo-alcada-filtro';
import { CentroCustoFiltro } from '../models/fltros/centro-custo-filtro';

@Injectable()
export class CentroCustoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  inserir(centroCusto: CentroCusto): Observable<CentroCusto> {
    return this.httpClient.post<CentroCusto>(`${this.API_URL}centroscusto`, centroCusto);
  }

  alterar(centroCusto: CentroCusto): Observable<CentroCusto> {
    return this.httpClient.put<CentroCusto>(`${this.API_URL}centroscusto`, centroCusto);
  }

  obterPorId(idCentroCusto: number): Observable<CentroCusto> {
    return this.httpClient.get<CentroCusto>(`${this.API_URL}centroscusto/${idCentroCusto}`);
  }

  listar(): Observable<Array<CentroCusto>> {
    return this.httpClient.get<Array<CentroCusto>>(`${this.API_URL}centroscusto`);
  }

  listarAtivos(): Observable<Array<CentroCusto>> {
    return this.httpClient.get<Array<CentroCusto>>(`${this.API_URL}centroscusto/ativos`);
  }

  listarPorEmpresa(idPessoaJuridica: number): Observable<Array<CentroCusto>> {
    return this.httpClient.get<Array<CentroCusto>>(`${this.API_URL}centroscusto/empresas/${idPessoaJuridica}`);
  }

  obterCentroCustoPadrao(): Observable<CentroCusto> {
    return this.httpClient.get<CentroCusto>(`${this.API_URL}centroscusto/centroPadrao`);
  }

  filtrar(
    centroCustoFiltro: CentroCustoFiltro,
  ): Observable<Paginacao<CentroCusto>> {
    return this.httpClient.post<Paginacao<CentroCusto>>(
      `${this.API_URL}centroscusto/filtro`,
      centroCustoFiltro,
    );
  }

  excluir(idCentroCusto: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}centroscusto/${idCentroCusto}`);
  }

  // #region Alçadas
  filtrarAlcadas(
    centroCustoAlcadaFiltro: CentroCustoAlcadaFiltro,
  ): Observable<Paginacao<CentroCustoAlcada>> {
    return this.httpClient.post<Paginacao<CentroCustoAlcada>>(
      `${this.API_URL}centroscusto/alcadas/filtro`,
      centroCustoAlcadaFiltro,
    );
  }

  deletarAlcadasBatch(idCentroCusto: number, centroCustoAlcadas: Array<CentroCustoAlcada>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}centroscusto/${idCentroCusto}/alcadas`, centroCustoAlcadas);
  }

  alterarSituacaoAlcadasBatch(idCentroCusto: number, centroCustoAlcadas: Array<CentroCustoAlcada>, situacao: Situacao): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}centroscusto/${idCentroCusto}/alcadas/situacao/${situacao}`, centroCustoAlcadas);
  }

  obterAlcadaPorId(idCentroCusto: number, idCentroCustoAlcada: number): Observable<CentroCustoAlcada> {
    return this.httpClient.get<CentroCustoAlcada>(`${this.API_URL}centroscusto/${idCentroCusto}/alcadas/${idCentroCustoAlcada}`);
  }

  inserirAlcada(idCentroCusto: number, alcada: CentroCustoAlcada): Observable<CentroCustoAlcada> {
    return this.httpClient.post<CentroCustoAlcada>(`${this.API_URL}centroscusto/${idCentroCusto}/alcadas`, alcada);
  }

  alterarAlcada(idCentroCusto: number, alcada: CentroCustoAlcada): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}centroscusto/${idCentroCusto}/alcadas`, alcada);
  }
  // #endregion
}
