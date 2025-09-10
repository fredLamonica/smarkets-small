import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginacao, PessoaJuridica } from '@shared/models';
import { IntegracaoErpEmpresas } from '@shared/models/integracao-com-erp/integracao-erp-empresas';
import { IntegracaoErpExclusao } from '@shared/models/integracao-com-erp/integracao-erp-exclusao';
import { GestaoIntegracao } from '@shared/models/integracao-com-erp/interfaces/gestao-integracao';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IntegracaoErp } from '../models/integracao-com-erp/integracao-erp';

@Injectable({
  providedIn: 'root'
})
export class IntegracaoErpService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //#region Produto
  obterEmpresasParaIntegracaoProduto(idProduto: number, itensPorPagina: number, pagina: number, termo: string): Observable<Paginacao<PessoaJuridica>> {
    return this.httpClient.get<Paginacao<PessoaJuridica>>(`${this.API_URL}gestaointegracaoproduto/${idProduto}/empresas`, {
      params: {
        'itensPorPagina': itensPorPagina.toString(),
        'pagina': pagina.toString(),
        'filtro': termo
      }
    });
  }

  getListaGestaoIntegracaoProduto(idProduto: number, itensPorPagina: number, pagina: number): Observable<Paginacao<IntegracaoErp>> {
    return this.httpClient.get<Paginacao<IntegracaoErp>>(`${this.API_URL}gestaointegracaoproduto/${idProduto}`, {
      params: new HttpParams()
        .set('itensPorPagina', itensPorPagina.toString())
        .set('pagina', pagina.toString())
    });
  }

  getGestaoIntegracaoProduto(idProduto: number, idGestaoIntegracaoProduto: number): Observable<GestaoIntegracao> {
    return this.httpClient.get<GestaoIntegracao>(`${this.API_URL}gestaointegracaoproduto/${idProduto}/${idGestaoIntegracaoProduto}`);
  }

  postGestaoIntegracaoProduto(idProduto: number, integracaoErpEmpresas: IntegracaoErpEmpresas): Observable<Array<IntegracaoErp>> {
    return this.httpClient.post<Array<IntegracaoErp>>(`${this.API_URL}gestaointegracaoproduto/${idProduto}`, integracaoErpEmpresas);
  }

  updateGestaoIntegracaoProduto(idProduto: number, idGestaoIntegracaoProduto: number, codigoIntegracao: number): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}gestaointegracaoproduto/${idProduto}/${idGestaoIntegracaoProduto}`, { codigoIntegracao });
  }

  deleteGestaoIntegracaoProduto(idProduto: number, integracaoErpExclusao: IntegracaoErpExclusao): Observable<number> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: integracaoErpExclusao
    };

    return this.httpClient.delete<number>(`${this.API_URL}gestaointegracaoproduto/${idProduto}`, httpOptions);
  }
  //#endregion Produto

  //#region Fornecedor
  obterEmpresasParaIntegracaoFornecedor(idFornecedor: number, itensPorPagina: number, pagina: number, termo: string): Observable<Paginacao<PessoaJuridica>> {
    return this.httpClient.get<Paginacao<PessoaJuridica>>(`${this.API_URL}gestaointegracaofornecedor/${idFornecedor}/empresas`, {
      params: {
        'itensPorPagina': itensPorPagina.toString(),
        'pagina': pagina.toString(),
        'filtro': termo
      }
    });
  }

  getListaGestaoIntegracaoFornecedor(idFornecedor: number, itensPorPagina: number, pagina: number): Observable<Paginacao<IntegracaoErp>> {
    return this.httpClient.get<Paginacao<IntegracaoErp>>(`${this.API_URL}gestaointegracaofornecedor/${idFornecedor}`, {
      params: new HttpParams()
        .set('itensPorPagina', itensPorPagina.toString())
        .set('pagina', pagina.toString())
    });
  }

  getGestaoIntegracaoFornecedor(idFornecedor: number, idGestaoIntegracaoFornecedor: number): Observable<GestaoIntegracao> {
    return this.httpClient.get<GestaoIntegracao>(`${this.API_URL}gestaointegracaofornecedor/${idFornecedor}/${idGestaoIntegracaoFornecedor}`);
  }

  postGestaoIntegracaoFornecedor(idFornecedor: number, integracaoErpEmpresas: IntegracaoErpEmpresas): Observable<Array<IntegracaoErp>> {
    return this.httpClient.post<Array<IntegracaoErp>>(`${this.API_URL}gestaointegracaofornecedor/${idFornecedor}`, integracaoErpEmpresas);
  }

  updateGestaoIntegracaoFornecedor(idFornecedor: number, idGestaoIntegracaoFornecedor: number, codigoIntegracao: number): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}gestaointegracaofornecedor/${idFornecedor}/${idGestaoIntegracaoFornecedor}`, { codigoIntegracao });
  }

  deleteGestaoIntegracaoFornecedor(idFornecedor: number, integracaoErpExclusao: IntegracaoErpExclusao): Observable<number> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: integracaoErpExclusao.ids
    };

    return this.httpClient.delete<number>(`${this.API_URL}gestaointegracaofornecedor/${idFornecedor}`, httpOptions);
  }
  //#endregion Fornecedor

  //#region Condição de Pagamento

  getListaGestaoIntegracaoCondicaoPagamento(idVinculo: number, itensPorPagina: number, pagina: number): Observable<Paginacao<IntegracaoErp>> {
    return this.httpClient.get<Paginacao<IntegracaoErp>>(`${this.API_URL}gestao-integracao-condicao-pagamento/lista/${idVinculo}`, {
      params: new HttpParams()
        .set('itensPorPagina', itensPorPagina.toString())
        .set('pagina', pagina.toString())
    });
  }

  obterEmpresasParaIntegracaoCondicaoPagamento(idVinculo: number, itensPorPagina: number, pagina: number, termo: any): Observable<Paginacao<PessoaJuridica>> {
    return this.httpClient.get<Paginacao<PessoaJuridica>>(`${this.API_URL}gestao-integracao-condicao-pagamento/${idVinculo}/empresas`, {
      params: {
        'itensPorPagina': itensPorPagina.toString(),
        'pagina': pagina.toString(),
        'filtro': termo
      }
    });
  }

  getGestaoIntegracaoCondicaoPagamento(id: number): Observable<GestaoIntegracao> {
    return this.httpClient.get<GestaoIntegracao>(`${this.API_URL}gestao-integracao-condicao-pagamento/${id}`);
  }

  updateGestaoIntegracaoCondicaoPagamento(id: number, codigoIntegracao: any): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}gestao-integracao-condicao-pagamento`, { idGestaoIntegracaoCondicaoPagamento: id, codigoIntegracao });
  }

  postGestaoIntegracaoCondicaoPagamento(idVinculo: number, integracaoErpEmpresas: IntegracaoErpEmpresas): Observable<IntegracaoErp[]> {
    return this.httpClient.post<Array<IntegracaoErp>>(`${this.API_URL}gestao-integracao-condicao-pagamento/${idVinculo}`, integracaoErpEmpresas);
  }

  deleteGestaoIntegracaoCondicaoPagamento(integracaoErpExclusao: IntegracaoErpExclusao): Observable<number> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: integracaoErpExclusao.ids
    };

    return this.httpClient.delete<number>(`${this.API_URL}gestao-integracao-condicao-pagamento`, httpOptions);
  }

  //#endregion Condição de Pagamento

}
