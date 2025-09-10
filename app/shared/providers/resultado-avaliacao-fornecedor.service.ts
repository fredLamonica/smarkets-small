import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  Ordenacao,
  ResultadoAvaliacaoFornecedor,
  Paginacao,
  RespostaAvaliacaoFornecedor,
  RespostaAvaliacaoFornecedorComentario
} from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultadoAvaliacaoFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public filtrarResultadosPorUsuario(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    termo: string
  ): Observable<Paginacao<ResultadoAvaliacaoFornecedor>> {
    let params = {
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      ordenarPor: ordenarPor,
      ordenacao: ordenacao.toString(),
      termo: termo
    };

    return this.httpClient.get<Paginacao<ResultadoAvaliacaoFornecedor>>(
      `${this.API_URL}resultadosavaliacaofornecedor/usuario`,
      { params: params }
    );
  }

  public filtrarResultadosPorAvaliacao(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    termo: string,
    idAvaliacao: number
  ): Observable<Paginacao<ResultadoAvaliacaoFornecedor>> {
    let params = {
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      ordenarPor: ordenarPor,
      ordenacao: ordenacao.toString(),
      termo: termo,
      idAvaliacao: idAvaliacao.toString()
    };

    return this.httpClient.get<Paginacao<ResultadoAvaliacaoFornecedor>>(
      `${this.API_URL}resultadosavaliacaofornecedor/avaliacao`,
      { params: params }
    );
  }

  public obterRespostasResultadoAvaliacao(
    idResultadoAvaliacaoFornecedor: number
  ): Observable<Array<RespostaAvaliacaoFornecedor>> {
    return this.httpClient.get<Array<RespostaAvaliacaoFornecedor>>(
      `${this.API_URL}resultadosavaliacaofornecedor/respostas/${idResultadoAvaliacaoFornecedor}`
    );
  }

  public salvarResultadoAvaliacaoFornecedor(
    resultadoAvalicao: ResultadoAvaliacaoFornecedor
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}resultadosavaliacaofornecedor/salvar`,
      resultadoAvalicao
    );
  }

  public finalizarResultadoAvaliacaoFornecedor(
    resultadoAvalicao: ResultadoAvaliacaoFornecedor
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}resultadosavaliacaofornecedor/finalizar`,
      resultadoAvalicao
    );
  }

  //#region Comentarios

  public inserirComentario(
    comentario: RespostaAvaliacaoFornecedorComentario
  ): Observable<RespostaAvaliacaoFornecedorComentario> {
    return this.httpClient.post<RespostaAvaliacaoFornecedorComentario>(
      `${this.API_URL}resultadosavaliacaofornecedor/comentarios`,
      comentario
    );
  }

  public alterarComentario(
    comentario: RespostaAvaliacaoFornecedorComentario
  ): Observable<RespostaAvaliacaoFornecedorComentario> {
    return this.httpClient.put<RespostaAvaliacaoFornecedorComentario>(
      `${this.API_URL}resultadosavaliacaofornecedor/comentarios`,
      comentario
    );
  }

  public deletarComentario(idComentario: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}resultadosavaliacaofornecedor/comentarios/${idComentario}`
    );
  }

  //#endregion
}
