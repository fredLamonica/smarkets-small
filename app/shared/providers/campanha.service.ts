import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Campanha, CampanhaParticipante, Paginacao } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CampanhaFiltro } from '../models/fltros/campanha-filtro';

@Injectable()
export class CampanhaService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  filtrar(
    campanhaFiltro: CampanhaFiltro,
  ): Observable<Paginacao<Campanha>> {
    return this.httpClient.post<Paginacao<Campanha>>(
      `${this.API_URL}Campanhas/filtrar`,
      campanhaFiltro,
    );
  }

  obterPorUrl(url: string): Observable<Campanha> {
    return this.httpClient.get<Campanha>(`${this.API_URL}Campanhas/urls/${url}`);
  }

  obterPorId(idCampanha: number): Observable<Campanha> {
    return this.httpClient.get<Campanha>(`${this.API_URL}Campanhas/${idCampanha}`);
  }

  inserir(campanha: Campanha): Observable<Campanha> {
    return this.httpClient.post<Campanha>(`${this.API_URL}Campanhas`, campanha);
  }

  alterar(campanha: Campanha): Observable<Campanha> {
    return this.httpClient.put<Campanha>(`${this.API_URL}Campanhas`, campanha);
  }

  excluir(idCampanha: number): Observable<Campanha> {
    return this.httpClient.delete<Campanha>(`${this.API_URL}Campanhas/${idCampanha}`);
  }

  listar(): Observable<Array<Campanha>> {
    return this.httpClient.get<Array<Campanha>>(`${this.API_URL}Campanhas`);
  }

  // #region Participantes

  inserirParticipante(
    idCampanha: number,
    campanhaParticipante: CampanhaParticipante,
  ): Observable<CampanhaParticipante> {
    return this.httpClient.post<CampanhaParticipante>(
      `${this.API_URL}Campanhas/${idCampanha}/Participantes`,
      campanhaParticipante,
    );
  }

  alterarParticipante(
    campanhaParticipante: CampanhaParticipante,
  ): Observable<CampanhaParticipante> {
    return this.httpClient.put<CampanhaParticipante>(
      `${this.API_URL}Campanhas/Participantes`,
      campanhaParticipante,
    );
  }

  // #endregion

  // #region Inserir Interesse Categoria
  inserirConhecerCategorias() {
    return this.httpClient.post(`${this.API_URL}Campanhas/ConhecerCategorias`, null);
  }
  // #endregion
}
