import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Arquivo } from '../models/arquivo';
import { Regularizacao } from '../models/regularizacao/regularizacao';
import { RegularizacaoAnexo } from '../models/regularizacao/regularizacao-anexo';
import { RegularizacaoItem } from '../models/regularizacao/regularizacao-item';

@Injectable({
  providedIn: 'root',
})
export class RegularizacaoService {
  private API_URL: string = environment.apiUrl + 'regularizacoes';

  constructor(private httpClient: HttpClient) { }

  get(): Observable<Array<Regularizacao>> {
    return this.httpClient.get<Array<Regularizacao>>(`${this.API_URL}`);
  }

  getById(id: number): Observable<Regularizacao> {
    return this.httpClient.get<Regularizacao>(`${this.API_URL}/${id}`);
  }

  getCarrinho(): Observable<Array<Regularizacao>> {
    return this.httpClient.get<Array<Regularizacao>>(`${this.API_URL}/carrinho`);
  }

  post(regularizacao: Regularizacao): Observable<Regularizacao> {
    return this.httpClient.post<Regularizacao>(`${this.API_URL}`, regularizacao);
  }

  put(regularizacao: Regularizacao): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}`, regularizacao);
  }

  delete(id: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}/${id}`);
  }

  postItem(regularizacaoItem: RegularizacaoItem, idEmpresa: number): Observable<RegularizacaoItem> {
    return this.httpClient.post<RegularizacaoItem>(`${this.API_URL}/item/${idEmpresa}`, regularizacaoItem);
  }

  putItem(regularizacaoItem: RegularizacaoItem): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}/item`, regularizacaoItem);
  }

  deleteItem(idIRegularizacaoItem: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}/item/${idIRegularizacaoItem}`);
  }

  deleteItens(regularizacaoItens: Array<RegularizacaoItem>): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: regularizacaoItens, };
    return this.httpClient.delete<number>(`${this.API_URL}/itens`,  httpOptions );
  }

  confirmar(regularizacao: Regularizacao): Observable<Regularizacao> {
    return this.httpClient.post<Regularizacao>(`${this.API_URL}/confirmar`, regularizacao);
  }

  getAnexos(idRegularizacao: number): Observable<Array<RegularizacaoAnexo>> {
    return this.httpClient.get<Array<RegularizacaoAnexo>>(`${this.API_URL}/anexos/${idRegularizacao}`);
  }

  postAnexos(idRegularizacao: number, arquivos: Array<Arquivo>): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}/anexos/${idRegularizacao}`, arquivos);
  }

  deleteAnexos(idRegularizacaoAnexo: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}/anexos/${idRegularizacaoAnexo}`);
  }
}
