import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoContas } from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoContasService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public obter(): Observable<Array<GrupoContas>> {
    return this.httpClient.get<Array<GrupoContas>>(`${this.API_URL}gruposcontas`);
  }

  public inserir(grupoContas: GrupoContas): Observable<GrupoContas> {
    return this.httpClient.post<GrupoContas>(`${this.API_URL}gruposcontas`, grupoContas);
  }

  public alterar(grupoContas: GrupoContas): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}gruposcontas`, grupoContas);
  }

  public deletar(idGrupoContas): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}gruposcontas/${idGrupoContas}`);
  }
}
