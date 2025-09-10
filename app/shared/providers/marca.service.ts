import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Marca, Paginacao, Ordenacao } from '@shared/models';

@Injectable()
export class MarcaService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public filtrar(itensPorPagina: number, pagina: number, ordenarPor: string, ordenacao: Ordenacao, termo: string): Observable<Paginacao<Marca>> {
    return this.httpClient.get<Paginacao<Marca>>(`${this.API_URL}marcas/filtro`, 
    {
       params: {
         "itensPorPagina": itensPorPagina.toString(),
         "pagina": pagina.toString(),
         "ordenarPor": ordenarPor,
         "ordenacao": ordenacao.toString(),
         "termo": termo
       }
    });
  }

  public obterPorId(idMarca: number): Observable<Marca> {
    return this.httpClient.get<Marca>(`${this.API_URL}marcas/${idMarca}`);
  }

  public inserir(marca: Marca): Observable<Marca> {
    return this.httpClient.post<Marca>(`${this.API_URL}marcas`, marca);
  }

  public alterar(marca: Marca): Observable<Marca> {
    return this.httpClient.put<Marca>(`${this.API_URL}marcas`, marca);
  }

  public excluir(idMarca: number): Observable<Marca> {
    return this.httpClient.delete<Marca>(`${this.API_URL}marcas/${idMarca}`);
  }
  
  public filtrarMarcasProduto(idProduto: number, itensPorPagina: number, pagina: number, termo: string): Observable<Paginacao<Marca>> {
    return this.httpClient.get<Paginacao<Marca>>(`${this.API_URL}marcas/produtos/filtro`, { 
      params: {"idProduto": idProduto.toString(), "itensPorPagina": itensPorPagina.toString(), "pagina": pagina.toString(), "termo": termo } 
    });
  }

  public listar(): Observable<Array<Marca>> {
    return this.httpClient.get<Array<Marca>>(`${this.API_URL}marcas`);
  }

  public listarHolding(): Observable<Array<Marca>> {
    return this.httpClient.get<Array<Marca>>(`${this.API_URL}marcas/holding`);
  }
}
