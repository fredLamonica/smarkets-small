import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CategoriaFornecimento, CategoriaFornecimentoCategoriaProduto, Paginacao,
  Situacao
} from '@shared/models';
import { CategoriaFornecimentoInteresse } from '@shared/models/categoria-fornecimento/categoria-fornecimento-interesse';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriaFornecimentoFiltro } from '../models/fltros/categoria-fornecimento-filtro';

@Injectable({
  providedIn: 'root',
})
export class CategoriaFornecimentoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obter(): Observable<CategoriaFornecimento[]> {
    return this.httpClient.get<CategoriaFornecimento[]>(`${this.API_URL}categoriasfornecimento`);
  }

  obterCategoriaFornecimentoInteressePorCliente(
    idFornecedor: number,
  ): Observable<CategoriaFornecimentoInteresse[]> {
    return this.httpClient.get<CategoriaFornecimentoInteresse[]>(
      `${this.API_URL}categoriasfornecimento/categoriasinteresse/${idFornecedor}`,
    );
  }

  obterPorId(idCategoriaFornecimento: number): Observable<CategoriaFornecimento> {
    return this.httpClient.get<CategoriaFornecimento>(
      `${this.API_URL}categoriasfornecimento/${idCategoriaFornecimento}`,
    );
  }

  listarPorTenant(idTenant: number): Observable<Array<CategoriaFornecimento>> {
    return this.httpClient.get<Array<CategoriaFornecimento>>(
      `${this.API_URL}categoriasfornecimento/tenants/${idTenant}`,
    );
  }

  inserir(categoriaFornecimento: CategoriaFornecimento): Observable<CategoriaFornecimento> {
    return this.httpClient.post<CategoriaFornecimento>(
      `${this.API_URL}categoriasfornecimento`,
      categoriaFornecimento,
    );
  }

  alterar(categoriaFornecimento: CategoriaFornecimento): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}categoriasfornecimento`,
      categoriaFornecimento,
    );
  }

  deletar(idCategoriaFornecimento: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}categoriasfornecimento/${idCategoriaFornecimento}`,
    );
  }

  filtrar(
    categoriaFornecimentoFiltro: CategoriaFornecimentoFiltro,
  ): Observable<Paginacao<CategoriaFornecimento>> {
    return this.httpClient.post<Paginacao<CategoriaFornecimento>>(
      `${this.API_URL}categoriasfornecimento/filtro`,
      categoriaFornecimentoFiltro,
    );
  }

  filtrarCategoriaProduto(
    categoriaFornecimentoFiltro: CategoriaFornecimentoFiltro,
  ): Observable<Paginacao<CategoriaFornecimentoCategoriaProduto>> {
    return this.httpClient.post<Paginacao<CategoriaFornecimentoCategoriaProduto>>(
      `${this.API_URL}categoriasfornecimento/categoriaproduto/filtro`,
      categoriaFornecimentoFiltro,
    );
  }

  inserirCategoriaProduto(
    categoriaFornecimentoCategoriaProduto: CategoriaFornecimentoCategoriaProduto,
  ): Observable<CategoriaFornecimentoCategoriaProduto> {
    return this.httpClient.post<CategoriaFornecimentoCategoriaProduto>(
      `${this.API_URL}categoriasfornecimento/categoriaproduto`,
      categoriaFornecimentoCategoriaProduto,
    );
  }

  deletarCategoriaProdutoBatch(
    idCategoriaFornecimento: number,
    categoriaFornecimentoCategoriaProdutos: Array<CategoriaFornecimentoCategoriaProduto>,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}categoriasfornecimento/${idCategoriaFornecimento}`,
      categoriaFornecimentoCategoriaProdutos,
    );
  }

  alterarSituacaoCategoriaProdutoBatch(
    categoriaFornecimentoCategoriaProdutos: Array<CategoriaFornecimentoCategoriaProduto>,
    situacao: Situacao,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}categoriasfornecimento/categoriaproduto/situacao/${situacao}`,
      categoriaFornecimentoCategoriaProdutos,
    );
  }
}
