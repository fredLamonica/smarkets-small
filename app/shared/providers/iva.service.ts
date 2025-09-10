import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Paginacao } from '@shared/models';
import { Iva } from '@shared/models/iva';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IvaService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {

  }

  public filtrar(itensPorPagina: number, pagina: number, termo: string): Observable<Paginacao<Iva>> {
    return this.httpClient.get<Paginacao<Iva>>(`${this.API_URL}iva`, { params: { "itensPorPagina": itensPorPagina.toString(), "pagina": pagina.toString(), "termo": termo } });
  }
  
  public inserir(iva: Iva): Observable<Iva> {
    return this.httpClient.post<Iva>(`${this.API_URL}iva`, iva);
  }

  public alterar(iva: Iva): Observable<Iva> {
    return this.httpClient.put<Iva>(`${this.API_URL}iva`, iva);
  }
  public excluir(idIva: number): Observable<Iva>{
    return this.httpClient.delete<Iva>(`${this.API_URL}iva/${idIva}`)
  }

  public obterPorId(idIva: number): Observable<Iva> {
    return this.httpClient.get<Iva>(`${this.API_URL}iva/${idIva}`);
  }

  public listar(): Observable<Array<Iva>> {
    return this.httpClient.get<Array<Iva>>(`${this.API_URL}iva/obter`);
}
}
