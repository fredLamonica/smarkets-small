import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TermoPesquisa } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class TermoPesquisaService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public obter(): Observable<Array<TermoPesquisa>> {
    return this.httpClient.get<Array<TermoPesquisa>>(`${this.API_URL}termospesquisa`);
  }

  public inserir(termoPesquisa: TermoPesquisa): Observable<TermoPesquisa> {
    return this.httpClient.post<TermoPesquisa>(`${this.API_URL}termospesquisa`, termoPesquisa);
  }

  public alterar(termoPesquisa: TermoPesquisa): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}termospesquisa`, termoPesquisa);
  }

  public deletar(idTermoPesquisa): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}termospesquisa/${idTermoPesquisa}`);
  }
}
