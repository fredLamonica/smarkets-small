import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoVisitaTecnica } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class ResultadoVisitaTecnicaService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }
  
  public obter(idVisitaTecnica): Observable<ResultadoVisitaTecnica> {
    return this.httpClient.get<ResultadoVisitaTecnica>(`${this.API_URL}resultadosvisitastecnicas/${idVisitaTecnica}`);
  }

  public inserir(resultado: ResultadoVisitaTecnica): Observable<ResultadoVisitaTecnica> {
    return this.httpClient.post<ResultadoVisitaTecnica>(`${this.API_URL}resultadosvisitastecnicas`, resultado);
  }

  public alterar(resultado: ResultadoVisitaTecnica): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}resultadosvisitastecnicas`, resultado);
  }

  public deletar(idResultado): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}resultadosvisitastecnicas/${idResultado}`);
  }

}
