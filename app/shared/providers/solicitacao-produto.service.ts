import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginacao, SolicitacaoProduto, SolicitacaoProdutoComentario } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AprovarSolicitacaoProdutoDto } from '../models/dto/aprovar-solicitacao-produto-dto';

@Injectable()
export class SolicitacaoProdutoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obter(): Observable<SolicitacaoProduto[]> {
    return this.httpClient.get<SolicitacaoProduto[]>(`${this.API_URL}solicitacaoProduto`);
  }

  obterPorId(idSolicitacaoProduto: number): Observable<SolicitacaoProduto> {
    return this.httpClient.get<SolicitacaoProduto>(`${this.API_URL}solicitacaoProduto/${idSolicitacaoProduto}`);
  }

  obterAcompanhamento(itensPorPagina: number, pagina: number, itemOrdenacao: string, termo: string): Observable<Paginacao<SolicitacaoProduto>> {
    return this.httpClient.get<Paginacao<SolicitacaoProduto>>(`${this.API_URL}solicitacaoProduto/acompanhamento`,
      {
        params: {
          'itensPorPagina': itensPorPagina.toString(),
          'pagina': pagina.toString(),
          'itemOrdenacao': itemOrdenacao,
          'termo': termo,
        },
      });
  }

  obterComentariosPorSolicitacao(idSolicitacaoProduto: number): Observable<Array<SolicitacaoProdutoComentario>> {
    return this.httpClient.get<Array<SolicitacaoProdutoComentario>>(`${this.API_URL}solicitacaoProduto/${idSolicitacaoProduto}/comentarios`);
  }

  inserir(solicitacaoProduto: SolicitacaoProduto): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}solicitacaoProduto`, solicitacaoProduto);
  }

  alterar(solicitacaoProduto: SolicitacaoProduto): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}solicitacaoProduto`, solicitacaoProduto);
  }

  deletar(solicitacaoProduto: SolicitacaoProduto): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}solicitacaoProduto/${solicitacaoProduto.idSolicitacaoProduto}`);
  }

  comentar(idSolicitacaoProduto: number, comentario: string): Observable<SolicitacaoProdutoComentario> {
    return this.httpClient.post<SolicitacaoProdutoComentario>(`${this.API_URL}solicitacaoProduto/${idSolicitacaoProduto}/comentar`, { 'comentario': comentario });
  }

  assumir(idSolicitacaoProduto: number): Observable<SolicitacaoProduto> {
    return this.httpClient.post<SolicitacaoProduto>(`${this.API_URL}solicitacaoProduto/${idSolicitacaoProduto}/assumir`, null);
  }

  reabrir(idSolicitacaoProduto: number): Observable<SolicitacaoProduto> {
    return this.httpClient.post<SolicitacaoProduto>(`${this.API_URL}solicitacaoProduto/${idSolicitacaoProduto}/reabrir`, null);
  }

  aprovar(idSolicitacaoProduto: number, aprovarSolicitacaoProdutoDto: AprovarSolicitacaoProdutoDto): Observable<SolicitacaoProduto> {
    return this.httpClient.post<SolicitacaoProduto>(`${this.API_URL}solicitacaoProduto/${idSolicitacaoProduto}/aprovar`, aprovarSolicitacaoProdutoDto);
  }

  cancelar(idSolicitacaoProduto: number, motivoCancelamento: string): Observable<SolicitacaoProduto> {
    return this.httpClient.post<SolicitacaoProduto>(`${this.API_URL}solicitacaoProduto/${idSolicitacaoProduto}/cancelar`, { motivoCancelamento });
  }

  reprovar(idSolicitacaoProduto: number): Observable<SolicitacaoProduto> {
    return this.httpClient.post<SolicitacaoProduto>(`${this.API_URL}solicitacaoProduto/${idSolicitacaoProduto}/reprovar`, null);
  }
}
