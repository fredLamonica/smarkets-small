import { Paginacao } from './../models/paginacao';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotivoDesclassificacao } from '@shared/models/cotacao/motivo-desclassificacao';

@Injectable({
  providedIn: 'root'
})
export class MotivoDesclassificacaoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public filtrar(
    itensPorPagina: number,
    pagina: number,
    termo: string
  ): Observable<Paginacao<MotivoDesclassificacao>> {
    return this.httpClient.get<Paginacao<MotivoDesclassificacao>>(
      `${this.API_URL}motivoDesclassificacao/filtro`,
      {
        params: {
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          termo: termo
        }
      }
    );
  }

  public obterPorId(idMotivoDesclassificacao: number): Observable<MotivoDesclassificacao> {
    return this.httpClient.get<MotivoDesclassificacao>(
      `${this.API_URL}motivoDesclassificacao/${idMotivoDesclassificacao}`
    );
  }

  public inserir(
    motivoDesclassificacao: MotivoDesclassificacao
  ): Observable<MotivoDesclassificacao> {
    return this.httpClient.post<MotivoDesclassificacao>(
      `${this.API_URL}motivoDesclassificacao`,
      motivoDesclassificacao
    );
  }

  public alterar(
    motivoDesclassificacao: MotivoDesclassificacao
  ): Observable<MotivoDesclassificacao> {
    return this.httpClient.put<MotivoDesclassificacao>(
      `${this.API_URL}motivoDesclassificacao`,
      motivoDesclassificacao
    );
  }

  public excluir(idMotivoDesclassificacao: number): Observable<MotivoDesclassificacao> {
    return this.httpClient.delete<MotivoDesclassificacao>(
      `${this.API_URL}motivoDesclassificacao/${idMotivoDesclassificacao}`
    );
  }

  public listar(): Observable<Array<MotivoDesclassificacao>> {
    return this.httpClient.get<Array<MotivoDesclassificacao>>(
      `${this.API_URL}motivoDesclassificacao`
    );
  }
}
