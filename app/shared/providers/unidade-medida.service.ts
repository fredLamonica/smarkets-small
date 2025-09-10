import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ordenacao, Paginacao, UnidadeMedida } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UnidadeMedidaService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  filtrar(itensPorPagina: number, pagina: number, ordenarPor: string, ordenacao: Ordenacao, termo: string): Observable<Paginacao<UnidadeMedida>> {
    return this.httpClient.get<Paginacao<UnidadeMedida>>(`${this.API_URL}unidadesmedida/filtro`, {
      params:
      {
        'itensPorPagina': itensPorPagina.toString(),
        'pagina': pagina.toString(),
        'ordenarPor': ordenarPor,
        'ordenacao': ordenacao.toString(),
        'termo': termo,
      },
    });
  }

  obterPorId(idUnidadeMedida: number): Observable<UnidadeMedida> {
    return this.httpClient.get<UnidadeMedida>(`${this.API_URL}unidadesmedida/${idUnidadeMedida}`);
  }

  inserir(unidadeMedida: UnidadeMedida): Observable<UnidadeMedida> {
    return this.httpClient.post<UnidadeMedida>(`${this.API_URL}unidadesmedida`, unidadeMedida);
  }

  alterar(unidadeMedida: UnidadeMedida): Observable<UnidadeMedida> {
    return this.httpClient.put<UnidadeMedida>(`${this.API_URL}unidadesmedida`, unidadeMedida);
  }

  excluir(idUnidadeMedida: number): Observable<UnidadeMedida> {
    return this.httpClient.delete<UnidadeMedida>(`${this.API_URL}unidadesmedida/${idUnidadeMedida}`);
  }

  listar(): Observable<Array<UnidadeMedida>> {
    return this.httpClient.get<Array<UnidadeMedida>>(`${this.API_URL}unidadesmedida`);
  }

  listarDaEmpresaBase(): Observable<Array<UnidadeMedida>> {
    return this.httpClient.get<Array<UnidadeMedida>>(`${this.API_URL}unidadesmedida/empresabase`);
  }
}
