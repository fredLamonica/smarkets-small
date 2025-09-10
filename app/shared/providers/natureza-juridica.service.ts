import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { NaturezaJuridica, Paginacao } from '@shared/models';

@Injectable()
export class NaturezaJuridicaService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public obterPorId(idNaturezaJuridica: number): Observable<NaturezaJuridica> {
    return this.httpClient.get<NaturezaJuridica>(`${this.API_URL}naturezasjuridicas/${idNaturezaJuridica}`);
  }

  public inserir(naturezaJuridica: NaturezaJuridica): Observable<NaturezaJuridica> {
    return this.httpClient.post<NaturezaJuridica>(`${this.API_URL}naturezasjuridicas`, naturezaJuridica);
  }

  public alterar(naturezaJuridica: NaturezaJuridica): Observable<NaturezaJuridica> {
    return this.httpClient.put<NaturezaJuridica>(`${this.API_URL}naturezasjuridicas`, naturezaJuridica);
  }

  public excluir(idNaturezaJuridica: number): Observable<NaturezaJuridica> {
    return this.httpClient.delete<NaturezaJuridica>(`${this.API_URL}naturezasjuridicas/${idNaturezaJuridica}`);
  }

  public listar(): Observable<Array<NaturezaJuridica>> {
    return this.httpClient.get<Array<NaturezaJuridica>>(`${this.API_URL}naturezasjuridicas`);
  }
}
