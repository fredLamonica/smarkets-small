import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Paginacao, Situacao } from '../models';
import { Alcada } from '../models/alcada';
import { AlcadaFiltro } from '../models/fltros/alcadas-filtro';

@Injectable({
  providedIn: 'root',
})
export class AlcadaService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  filtrar(alcadaFiltro: AlcadaFiltro): Observable<Paginacao<Alcada>> {
    return this.httpClient.get<Paginacao<Alcada>>(
      `${this.API_URL}alcadas`,
      {
        params: {
          itensPorPagina: alcadaFiltro.itensPorPagina.toString(),
          pagina: alcadaFiltro.pagina.toString(),
          descricao: alcadaFiltro.descricao ? alcadaFiltro.descricao.toString() : '',
          codigo: alcadaFiltro.codigo ? alcadaFiltro.codigo.toString() : '',
          status: alcadaFiltro.status ? alcadaFiltro.status.toString() : '',
        },
      },
    );
  }

  obterPorId(idAlcada: number): Observable<Alcada> {
    return this.httpClient.get<Alcada>(`${this.API_URL}alcadas/${idAlcada}`);
  }

  listar(): Observable<Array<Alcada>> {
    return this.httpClient.get<Array<Alcada>>(`${this.API_URL}alcadas/listar`);
  }

  inserir(alcada: Alcada): Observable<Alcada> {
    return this.httpClient.post<Alcada>(`${this.API_URL}alcadas`, alcada);
  }

  editar(idAlcada: number, alcada: Alcada): Observable<Alcada> {
    return this.httpClient.put<Alcada>(`${this.API_URL}alcadas/${idAlcada}`, alcada);
  }

  alterarStatus(idAlcada: number, situacao: Situacao): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}alcadas/${idAlcada}`, situacao);
  }

  excluir(idAlcada: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}alcadas/${idAlcada}`);
  }

}
