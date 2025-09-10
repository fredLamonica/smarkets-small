import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaProduto, Paginacao } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriaProdutoSellerDto } from '../models/categoria-produto-seller-dto';
import { CategoriaProdutoSellerFiltroDto } from '../models/categoria-produto-seller-filtro-dto';
import { ConfiguracaoColunaDto } from '../models/configuracao-coluna-dto';
import { CategoriaProdutoFiltro } from '../models/fltros/categoria-produto-filtro';
import { PaginacaoPesquisaConfiguradaDto } from '../models/paginacao-pesquisa-configurada-dto';

@Injectable()
export class CategoriaProdutoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  filtrar(categoriaProdutoFiltro: CategoriaProdutoFiltro): Observable<Paginacao<CategoriaProduto>> {
    return this.httpClient.post<Paginacao<CategoriaProduto>>(
      `${this.API_URL}categoriasprodutos/filtro`,
      categoriaProdutoFiltro,
    );
  }

  listar(): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(`${this.API_URL}categoriasprodutos`);
  }

  listarAtivas(): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(`${this.API_URL}categoriasprodutos/ativas`);
  }

  listarAtivasSemHierarquia(): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(`${this.API_URL}categoriasprodutos/ativas/semhierarquia`);
  }

  listarAtivasDaEmpresaBase(): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(`${this.API_URL}categoriasprodutos/ativas/empresabase`);
  }

  listarAtivasDaEmpresaBaseSemHierarquia(): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(`${this.API_URL}categoriasprodutos/ativas/empresabase/semhierarquia`);
  }

  listarAtivasPorTenant(idTenant: number): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(`${this.API_URL}categoriasprodutos/tenants/${idTenant}/ativas`);
  }

  obterPorId(idCategoriaProduto: number): Observable<CategoriaProduto> {
    return this.httpClient.get<CategoriaProduto>(`${this.API_URL}categoriasprodutos/${idCategoriaProduto}`);
  }

  inserir(categoriaProduto: CategoriaProduto): Observable<CategoriaProduto> {
    return this.httpClient.post<CategoriaProduto>(`${this.API_URL}categoriasprodutos`, categoriaProduto);
  }

  alterar(categoriaProduto: CategoriaProduto): Observable<CategoriaProduto> {
    return this.httpClient.put<CategoriaProduto>(`${this.API_URL}categoriasprodutos`, categoriaProduto);
  }

  excluir(idCategoriaProduto: number): Observable<CategoriaProduto> {
    return this.httpClient.delete<CategoriaProduto>(`${this.API_URL}categoriasprodutos/${idCategoriaProduto}`);
  }

  maisCompradas(): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(`${this.API_URL}categoriasprodutos/maiscompradas`);
  }

  //#region PDM seller

    filtre(filtroCategoria: CategoriaProdutoSellerFiltroDto): Observable<PaginacaoPesquisaConfiguradaDto<CategoriaProdutoSellerDto>> {
      return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<CategoriaProdutoSellerDto>>(`${this.API_URL}categoriasprodutos/filtro`, filtroCategoria);
    }

    obtenhaFiltroSalvo(): Observable<CategoriaProdutoSellerDto> {
      return this.httpClient.get<CategoriaProdutoSellerDto>(`${this.API_URL}categoriasprodutos/filtroSalvo`);
    }

    obtenhaColunasDiponiveis(): Observable<Array<ConfiguracaoColunaDto>> {
      return this.httpClient.get<Array<ConfiguracaoColunaDto>>(`${this.API_URL}categoriasprodutos/colunasDisponiveis`);
    }

    obtenhaCategoriaSeller(idCategoriaProduto: number, idTenant: number): Observable<CategoriaProdutoSellerDto> {
      return this.httpClient.get<CategoriaProdutoSellerDto>(`${this.API_URL}categoriasprodutos/obtenha-categoria-seller/${idCategoriaProduto}/${idTenant}`);
    }
  //#endregion
}
