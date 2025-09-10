import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Paginacao, SolicitacaoDocumentoFornecedor } from '@shared/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoDocumentoFornecedorService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {

  }
  
  public filtrar(itensPorPagina: number, pagina: number, itemOrdenacao: string, termo: string): Observable<Paginacao<SolicitacaoDocumentoFornecedor>> {
    return this.httpClient.get<Paginacao<SolicitacaoDocumentoFornecedor>>(`${this.API_URL}solicitacaodocumentosfornecedor/filtro`,
      {
        params: {
          "itensPorPagina": itensPorPagina.toString(),
          "pagina": pagina.toString(),
          "itemOrdenacao": itemOrdenacao,
          "termo": termo
        }
      });
  }
  
  public inserir(solicitacaoDocumento: SolicitacaoDocumentoFornecedor): Observable<SolicitacaoDocumentoFornecedor> {
    return this.httpClient.post<SolicitacaoDocumentoFornecedor>(`${this.API_URL}solicitacaodocumentosfornecedor`, solicitacaoDocumento);
  }

  public alterar(solicitacaoDocumento: SolicitacaoDocumentoFornecedor): Observable<SolicitacaoDocumentoFornecedor> {
    return this.httpClient.put<SolicitacaoDocumentoFornecedor>(`${this.API_URL}solicitacaodocumentosfornecedor`, solicitacaoDocumento);
  }
  public excluir(idSolicitacaoDocumento: number): Observable<SolicitacaoDocumentoFornecedor>{
    return this.httpClient.delete<SolicitacaoDocumentoFornecedor>(`${this.API_URL}solicitacaodocumentosfornecedor/${idSolicitacaoDocumento}`)
  }

  public obterPorId(idSolicitacaoDocumento: number): Observable<SolicitacaoDocumentoFornecedor> {
    return this.httpClient.get<SolicitacaoDocumentoFornecedor>(`${this.API_URL}solicitacaodocumentosfornecedor/${idSolicitacaoDocumento}`);
  }

  public listar(): Observable<Array<SolicitacaoDocumentoFornecedor>> {
    return this.httpClient.get<Array<SolicitacaoDocumentoFornecedor>>(`${this.API_URL}solicitacaodocumentosfornecedor`);
}
}
