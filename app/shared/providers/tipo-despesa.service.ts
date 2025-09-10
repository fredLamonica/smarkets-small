import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Paginacao, TipoDespesa } from '@shared/models';

@Injectable()
export class TipoDespesaService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public filtrar(itensPorPagina: number, pagina: number, termo: string): Observable<Paginacao<TipoDespesa>> {
    return this.httpClient.get<Paginacao<TipoDespesa>>(`${this.API_URL}tiposdespesa/filtro`, { params: { "itensPorPagina": itensPorPagina.toString(), "pagina": pagina.toString(), "termo": termo } });
  }

  public obterPorId(idTipoDespesa: number): Observable<TipoDespesa> {
    return this.httpClient.get<TipoDespesa>(`${this.API_URL}tiposdespesa/${idTipoDespesa}`);
  }

  public inserir(tipoDespesa: TipoDespesa): Observable<TipoDespesa> {
    return this.httpClient.post<TipoDespesa>(`${this.API_URL}tiposdespesa`, tipoDespesa );
  }

  public alterar(tipoDespesa: TipoDespesa): Observable<TipoDespesa> {
    return this.httpClient.put<TipoDespesa>(`${this.API_URL}tiposdespesa`, tipoDespesa );
  }

  public excluir(idTipoDespesa: number): Observable<TipoDespesa> {
    return this.httpClient.delete<TipoDespesa>(`${this.API_URL}tiposdespesa/${idTipoDespesa}`);
  }

  public listar(): Observable<Array<TipoDespesa>> {
    return this.httpClient.get<Array<TipoDespesa>>(`${this.API_URL}tiposdespesa`);
  }
}
