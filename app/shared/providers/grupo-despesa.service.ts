import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { GrupoDespesa, Paginacao } from '@shared/models';

@Injectable()
export class GrupoDespesaService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public filtrar(itensPorPagina: number, pagina: number, termo: string): Observable<Paginacao<GrupoDespesa>> {
    return this.httpClient.get<Paginacao<GrupoDespesa>>(`${this.API_URL}gruposdespesa/filtro`, { params: { "itensPorPagina": itensPorPagina.toString(), "pagina": pagina.toString(), "termo": termo } });
  }

  public obterPorId(idGrupoDespesa : number): Observable<GrupoDespesa> {
    return this.httpClient.get<GrupoDespesa>(`${this.API_URL}gruposdespesa/${idGrupoDespesa }`);
  }

  public inserir(grupoDespesa : GrupoDespesa): Observable<GrupoDespesa> {
    return this.httpClient.post<GrupoDespesa>(`${this.API_URL}gruposdespesa`, grupoDespesa );
  }

  public alterar(grupoDespesa : GrupoDespesa): Observable<GrupoDespesa> {
    return this.httpClient.put<GrupoDespesa>(`${this.API_URL}gruposdespesa`, grupoDespesa );
  }

  public excluir(idGrupoDespesa : number): Observable<GrupoDespesa> {
    return this.httpClient.delete<GrupoDespesa>(`${this.API_URL}gruposdespesa/${idGrupoDespesa }`);
  }

  public listar(): Observable<Array<GrupoDespesa>> {
    return this.httpClient.get<Array<GrupoDespesa>>(`${this.API_URL}gruposdespesa`);
  }
}
