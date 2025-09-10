import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginacao, Ordenacao, MatrizResponsabilidadeDto, MatrizResponsabilidade, TipoRequisicao, MatrizClassificacao } from '@shared/models';

@Injectable()
export class MatrizResponsabilidadeService {

  private API_URL: string = environment.apiUrl;
  private url = this.API_URL + "matrizresponsabilidade";

  constructor(private httpClient: HttpClient) { }

  public obter(itemOrdenar: string, ordenacao: Ordenacao, itensPorPagina: number, pagina: number, termo: string, idCategoriaProduto: number = null): Observable<Paginacao<MatrizResponsabilidade>> {
    return this.httpClient.get<Paginacao<MatrizResponsabilidade>>(this.url, {
      params: { "itemOrdenar": itemOrdenar, "ordenacao": ordenacao.toString(), "itensPorPagina": itensPorPagina.toString(), "pagina": pagina.toString(), "termo": termo, "idCategoriaProduto": (idCategoriaProduto ? idCategoriaProduto.toString() : '') }
    });
  }

  public obterPorId(id: number): Observable<MatrizResponsabilidade> {
    return this.httpClient.get<MatrizResponsabilidade>(this.url + "/" + id);
  }

  public inserir(matriz: MatrizResponsabilidade): Observable<MatrizResponsabilidade> {
    return this.httpClient.post<MatrizResponsabilidade>(this.url, matriz)
  }

  public alterar(matrizDto: MatrizResponsabilidadeDto): Observable<number> {
    return this.httpClient.put<number>(this.url + "/" + matrizDto.matriz.idMatrizResponsabilidade, matrizDto)
  }

  public deletar(id: number): Observable<MatrizResponsabilidade> {
    return this.httpClient.delete<MatrizResponsabilidade>(this.url + "/" + id);
  }

  public obterPorCategoriaTipoRequisicao(idCategoriaProduto: number, idTipoRequisicao: number): Observable<MatrizResponsabilidade> {
    return this.httpClient.get<MatrizResponsabilidade>(`${this.url}/categorias/${idCategoriaProduto}/tiposrequisicao/${idTipoRequisicao}`);
  }

  public obterPendencias(): Observable<Array<MatrizResponsabilidade>> {
    return this.httpClient.get<Array<MatrizResponsabilidade>>(`${this.url}/pendencias`);
  }
}