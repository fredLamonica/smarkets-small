import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProdutoIAService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  downloadRetornoIA(idLog: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}produtos-ia/retorno-ia/${idLog}`, { responseType: 'blob' });
  }

  downloadRetornoPrecificacaoIA(idLog: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}produtos-ia/retorno-precificacao-ia/${idLog}`, { responseType: 'blob' });
  }

}
