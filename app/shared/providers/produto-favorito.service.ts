import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ConfiguracaoColunaDto } from '../models/configuracao-coluna-dto';
import { ProdutoFavoritoDto } from '../models/dto/produto-favorito-dto';
import { ProdutoFavoritoFiltroDto } from '../models/dto/produto-favorito-filtro-dto';
import { ProdutoFavoritoInsercaoDto } from '../models/dto/produto-favorito-insercao-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../models/paginacao-pesquisa-configurada-dto';
import { ErrorService } from '../utils/error.service';

@Injectable()
export class ProdutoFavoritoService {

  private API_URL: string = `${environment.apiUrl}favoritos`;

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
  ) { }

  inserir(produtoFavoritoInsercao: ProdutoFavoritoInsercaoDto): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}`, produtoFavoritoInsercao);
  }

  excluir(idProdutoFavorito: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}/${idProdutoFavorito}`);
  }

  obtenhaColunasDiponiveis(): Observable<Array<ConfiguracaoColunaDto>> {
    return this.httpClient.get<Array<ConfiguracaoColunaDto>>(`${this.API_URL}/colunasDisponiveis`);
  }

  obtenhaFiltroSalvo(): Observable<ProdutoFavoritoFiltroDto> {
    return this.httpClient.get<ProdutoFavoritoFiltroDto>(`${this.API_URL}/filtroSalvo`);
  }

  filtre(filtroRequisicao: ProdutoFavoritoFiltroDto): Observable<PaginacaoPesquisaConfiguradaDto<ProdutoFavoritoDto>> {
    return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<ProdutoFavoritoDto>>(`${this.API_URL}/filtro`, filtroRequisicao);
  }

  exportarRelatorio(historicoPedidosFiltroDto: ProdutoFavoritoFiltroDto): Observable<any> {
    return this.httpClient
      .post(
        `${this.API_URL}/relatorio`,
        historicoPedidosFiltroDto,
        { responseType: 'blob' })
      .pipe(catchError(this.errorService.parseErrorBlob));
  }
}
