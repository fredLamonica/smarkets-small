import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { FaturamentoMinimoFrete, Paginacao } from '@shared/models';
import { FaturamentoMinimoFreteDto } from '@shared/models/dto/faturamento-minimo-frete-dto';
import { FaturamentoMinimoFreteCidadeEstadoFiltro } from '../models/fltros/faturamento-minimo-frete-cidade-estado-filtro';
import { FaturamentoMinimoFreteFiltro } from '../models/fltros/faturamento-minimo-frete-filtro';

@Injectable()
export class FaturamentoMinimoFreteService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obterPorId(idFaturamentoMinimo: number): Observable<FaturamentoMinimoFrete> {
    return this.httpClient.get<FaturamentoMinimoFrete>(`${this.API_URL}faturamentominimofrete/${idFaturamentoMinimo}`);
  }

  inserir(faturamentoMinimo: FaturamentoMinimoFreteDto): Observable<FaturamentoMinimoFrete> {
    return this.httpClient.post<FaturamentoMinimoFrete>(`${this.API_URL}faturamentominimofrete`, faturamentoMinimo);
  }

  alterar(faturamentoMinimo: FaturamentoMinimoFrete): Observable<FaturamentoMinimoFrete> {
    return this.httpClient.put<FaturamentoMinimoFrete>(`${this.API_URL}faturamentominimofrete`, faturamentoMinimo);
  }

  excluir(idFaturamentoMinimoFrete: number): Observable<FaturamentoMinimoFrete> {
    return this.httpClient.delete<FaturamentoMinimoFrete>(`${this.API_URL}faturamentominimofrete/${idFaturamentoMinimoFrete}`);
  }

  obterPorPessoa(idPessoa: number): Observable<FaturamentoMinimoFrete> {
    return this.httpClient.get<FaturamentoMinimoFrete>(`${this.API_URL}faturamentominimofrete/pessoa/${idPessoa}`, {
    });
  }

  filtrar(
    faturamentoMinimoFreteFiltro: FaturamentoMinimoFreteFiltro,
  ): Observable<Paginacao<FaturamentoMinimoFrete>> {
    return this.httpClient.post<Paginacao<FaturamentoMinimoFrete>>(
      `${this.API_URL}faturamentominimofrete/pessoas/filtro`,
      faturamentoMinimoFreteFiltro,
    );
  }

  deletarBatch(faturamentos: Array<FaturamentoMinimoFrete>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}faturamentominimofrete/`, faturamentos);
  }

  cadastroPorCidadeValido(
    faturamentoMinimoFreteCidadeEstadoFiltro: FaturamentoMinimoFreteCidadeEstadoFiltro,
  ): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${this.API_URL}faturamentominimofrete/cidade`,
      faturamentoMinimoFreteCidadeEstadoFiltro,
    );
  }

  cadastroPorEstadoValido(
    faturamentoMinimoFreteCidadeEstadoFiltro: FaturamentoMinimoFreteCidadeEstadoFiltro,
  ): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${this.API_URL}faturamentominimofrete/estado`,
      faturamentoMinimoFreteCidadeEstadoFiltro,
    );
  }

}
