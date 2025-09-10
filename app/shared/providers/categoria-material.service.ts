import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaMaterial, Paginacao } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriaMaterialFiltro } from '../models/fltros/categoria-material-filtro';

@Injectable()
export class CategoriaMaterialService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  filtrar(
    categoriaMaterialFiltro: CategoriaMaterialFiltro,
  ): Observable<Paginacao<CategoriaMaterial>> {
    return this.httpClient.post<Paginacao<CategoriaMaterial>>(
      `${this.API_URL}CategoriasMaterial/filtrar`,
      categoriaMaterialFiltro,
    );
  }

  obterPorId(idCategoriaMaterial: number): Observable<CategoriaMaterial> {
    return this.httpClient.get<CategoriaMaterial>(`${this.API_URL}CategoriasMaterial/${idCategoriaMaterial}`);
  }

  inserir(categoriaMaterial: CategoriaMaterial): Observable<CategoriaMaterial> {
    return this.httpClient.post<CategoriaMaterial>(`${this.API_URL}CategoriasMaterial`, categoriaMaterial);
  }

  alterar(categoriaMaterial: CategoriaMaterial): Observable<CategoriaMaterial> {
    return this.httpClient.put<CategoriaMaterial>(`${this.API_URL}CategoriasMaterial`, categoriaMaterial);
  }

  excluir(idCategoriaMaterial: number): Observable<CategoriaMaterial> {
    return this.httpClient.delete<CategoriaMaterial>(`${this.API_URL}CategoriasMaterial/${idCategoriaMaterial}`);
  }

  listar(): Observable<Array<CategoriaMaterial>> {
    return this.httpClient.get<Array<CategoriaMaterial>>(`${this.API_URL}CategoriasMaterial`);
  }
}
