import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TipoRequisicao, Ordenacao, Paginacao } from '@shared/models';

@Injectable()
export class TipoRequisicaoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public inserir(tipo: TipoRequisicao): Observable<TipoRequisicao> {
    return this.httpClient.post<TipoRequisicao>(`${this.API_URL}tiposrequisicao`, tipo);
  }

  public alterar(tipo: TipoRequisicao): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}tiposrequisicao`, tipo);
  }

  public excluir(idTipo: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}tiposrequisicao/${idTipo}`);
  }

  public obterPorId(idTipo: number): Observable<TipoRequisicao> {
    return this.httpClient.get<TipoRequisicao>(`${this.API_URL}tiposrequisicao/${idTipo}`);
  }

  public filtrar(itensPorPagina: number, pagina: number, itemOrdenacao: string, termo: string): Observable<Paginacao<TipoRequisicao>> {
    return this.httpClient.get<Paginacao<TipoRequisicao>>(`${this.API_URL}tiposrequisicao/filtro`,
      {
        params: {
          "itensPorPagina": itensPorPagina.toString(),
          "pagina": pagina.toString(),
          "itemOrdenacao": itemOrdenacao,
          "termo": termo
        }
      });
  }

  public obterTodos(): Observable<Array<TipoRequisicao>> {
    return this.httpClient.get<Array<TipoRequisicao>>(`${this.API_URL}tiposrequisicao`);
  }

  public obterPorMatrizCategoriaProduto(idsCategoriaProduto: string) {
    return this.httpClient.get<Array<TipoRequisicao>>(`${this.API_URL}tiposrequisicao/matrizresponsabilidade/categoriasproduto/`, { params: { "idsCategoriaProduto": idsCategoriaProduto } });
  }
}
