import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Paginacao } from '@shared/models';
import { HttpClient } from '@angular/common/http';
import { OrganizacaoCompra } from '@shared/models/organizacao-compra';

@Injectable({
  providedIn: 'root'
})
export class OrganizacaoCompraService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {

  }

  public filtrar(itensPorPagina: number, pagina: number, termo: string): Observable<Paginacao<OrganizacaoCompra>> {    
    return this.httpClient.get<Paginacao<OrganizacaoCompra>>(`${this.API_URL}organizacaocompras`, { params: { "itensPorPagina": itensPorPagina.toString(), "pagina": pagina.toString(), "termo": termo } });
  }
  
  public inserir(organizacaoCompra: OrganizacaoCompra): Observable<OrganizacaoCompra> {
    return this.httpClient.post<OrganizacaoCompra>(`${this.API_URL}organizacaocompras`, organizacaoCompra);
  }

  public alterar(organizacaoCompra: OrganizacaoCompra): Observable<OrganizacaoCompra> {
    return this.httpClient.put<OrganizacaoCompra>(`${this.API_URL}organizacaocompras`, organizacaoCompra);
  }
  public excluir(idOrganizacaoCompra: number): Observable<OrganizacaoCompra>{
    return this.httpClient.delete<OrganizacaoCompra>(`${this.API_URL}organizacaocompras/${idOrganizacaoCompra}`)
  }

  public obterPorId(idOrganizacaoCompra: number): Observable<OrganizacaoCompra> {
    return this.httpClient.get<OrganizacaoCompra>(`${this.API_URL}organizacaocompras/${idOrganizacaoCompra}`);
  }

  public listar(): Observable<Array<OrganizacaoCompra>> {
    return this.httpClient.get<Array<OrganizacaoCompra>>(`${this.API_URL}organizacaocompras/obter`);
  }
}
