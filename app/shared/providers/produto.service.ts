import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo, ContaContabil, Marca, Ordenacao, Paginacao, Produto, SituacaoProduto } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoCatalogo } from '../models/enums/tipo-catalogo';
import { TipoIA } from '../models/enums/tipo-ia';
import { ProdutoSellerFiltro } from '../models/fltros/produto-seller-filtro';
import { PrecificacaoProdutoIA } from '../models/precificacao-produto-ia';
import { ProdutoEmpresaBase } from '../models/produto-empresa-base';
import { ProdutoEmpresaBaseFiltro } from '../models/produto-empresa-base-filtro';
import { UtilitiesService } from '../utils/utilities.service';
import { ProdutoFiltro } from './../models/fltros/produto-filtro';

@Injectable()
export class ProdutoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private utilitiesServices: UtilitiesService) { }

  filtrar( produtoFiltro: ProdutoFiltro): Observable<Paginacao<Produto>> {
    return this.httpClient.post<Paginacao<Produto>>(`${this.API_URL}produtos/filtro`, produtoFiltro,
    );
  }

  filtreInclusoColaborativos(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    idCategoria: number,
    termo: string,
    codigo: string,
    situacao: SituacaoProduto,
    codigoNcm: string = null,
    idProduto: string = null,
    tipoCatalogo: TipoCatalogo,
  ): Observable<Paginacao<Produto>> {
    const params = {
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      ordenarPor: ordenarPor,
      ordenacao: ordenacao.toString(),
      idCategoria: idCategoria != null ? idCategoria.toString() : '0',
      termo: termo,
      codigo: codigo,
      situacao: situacao.toString(),
      tipoCatalogo: tipoCatalogo.toString(),
    };

    if (codigoNcm != null) { params['codigoNcm'] = codigoNcm; }
    if (idProduto != null) { params['idProduto'] = idProduto; }

    return this.httpClient.get<Paginacao<Produto>>(`${this.API_URL}produtos/filtro-colaborativos`, {
      params: params,
    });
  }

  obterPorId(idProduto: number): Observable<Produto> {
    return this.httpClient.get<Produto>(`${this.API_URL}produtos/${idProduto}`);
  }

  obtenhaPrecificacaoProduto(idProduto: number): Observable<PrecificacaoProdutoIA> {
    return this.httpClient.get<PrecificacaoProdutoIA>(`${this.API_URL}produtos/obtenha-precificacao-produto/${idProduto}`);
  }

  obtenhaProdutoSellerPorId(idProduto: number): Observable<Produto> {
    return this.httpClient.get<Produto>(`${this.API_URL}produtos/obtenha-produto-seller-por-id/${idProduto}`);
  }

  atualizeProdutoSeller(produto: Produto, saneado: boolean): Observable<Produto> {
    return this.httpClient.post<Produto>(`${this.API_URL}produtos/atualize-produto-seller/${saneado}`, produto);
  }

  obterPorCodigo(codigo: string): Observable<Produto> {
    return this.httpClient.get<Produto>(`${this.API_URL}produtos/codigo/${codigo}`);
  }

  obterMaiorCodigoUnico(): Observable<number> {
    return this.httpClient.get<number>(`${this.API_URL}produtos/maior-codigo-unico`);
  }

  buscarPorDescricao(termo: string) {
    return this.httpClient.get<Array<Produto>>(`${this.API_URL}produtos/buscaPorDescricao`, {
      params: { termo: termo },
    });
  }

  searchProducts(termo: string) {
    return this.httpClient.get<Array<Produto>>(`${this.API_URL}produtos/searchProducts`, {
      params: { termo: termo },
    });
  }

  inserir(produto: Produto, gerarCodigoUnicoAutomatico: boolean = true): Observable<Produto> {
    return this.httpClient.post<Produto>(`${this.API_URL}produtos`, produto, { params: { gerarCodigoUnicoAutomatico: gerarCodigoUnicoAutomatico.toString() } });
  }

  alterar(produto: Produto): Observable<Produto> {
    return this.httpClient.put<Produto>(`${this.API_URL}produtos`, produto);
  }

  excluir(idProduto: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}produtos/${idProduto}`);
  }

  excluirBatch(produtos: Array<Produto>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}produtos/`, produtos);
  }

  alterarSituacaoBatch(
    produtos: Array<Produto>,
    situacao: SituacaoProduto,
  ): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}produtos/situacao/${situacao}`, produtos);
  }

  alterarSituacao(situacao: SituacaoProduto, produtos: Array<Produto>): Observable<any> {
    const idsDosProdutos = produtos && produtos.length > 0 ? produtos.map((x) => x.idProduto) : new Array<number>();
    return this.httpClient.patch<any>(`${this.API_URL}produtos/situacao/${situacao}`, idsDosProdutos);
  }

  priorizarEnvioIA(idsProdutos: Array<number>, tipoIA: TipoIA): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}produtos/priorizar-envio-ia/${tipoIA}`, idsProdutos);
  }

  // #region Marcas
  obterMarcas(idProduto: number): Observable<Array<Marca>> {
    return this.httpClient.get<Array<Marca>>(`${this.API_URL}produtos/${idProduto}/marcas`);
  }

  deletarMarcas(idProduto: number, marcas: Array<Marca>): Observable<any> {
    return this.httpClient.patch(`${this.API_URL}produtos/${idProduto}/marcas`, marcas);
  }

  inserirMarcas(idProduto: number, marcas: Array<Marca>): Observable<any> {
    return this.httpClient.post(`${this.API_URL}produtos/${idProduto}/marcas`, marcas);
  }
  // #endregion

  // #region Arquivos
  inserirArquivo(idProduto: number, idArquivo: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}produtos/${idProduto}/arquivos/${idArquivo}`, {});
  }

  deletarArquivo(idProduto: number, idArquivo: number): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}produtos/${idProduto}/arquivos/${idArquivo}`);
  }

  inserirArquivos(idProduto: number, arquivos: Array<Arquivo>): Observable<any> {
    return this.httpClient.post(`${this.API_URL}produtos/${idProduto}/arquivos`, arquivos);
  }

  deletarArquivos(idProduto: number, arquivos: Array<Arquivo>): Observable<any> {
    return this.httpClient.patch(`${this.API_URL}produtos/${idProduto}/arquivos`, arquivos);
  }
  // #endregion

  // #region Contas Contábeis
  deletarContas(idProduto: number, contas: Array<ContaContabil>): Observable<any> {
    return this.httpClient.patch(`${this.API_URL}produtos/${idProduto}/contascontabeis`, contas);
  }

  inserirContas(idProduto: number, contas: Array<ContaContabil>): Observable<any> {
    return this.httpClient.post(`${this.API_URL}produtos/${idProduto}/contascontabeis`, contas);
  }
  // #endregion

  filtreProdutosDaEmpresaBase(filtro: ProdutoEmpresaBaseFiltro): Observable<Paginacao<Produto>> {
    const params = this.utilitiesServices.getHttpParamsFromObject(filtro);
    return this.httpClient.get<Paginacao<Produto>>(`${this.API_URL}produtos/filtro/holding`, { params });
  }

  cloneProdutosDaEmpresaBase(produtos: Array<ProdutoEmpresaBase>): Observable<Paginacao<Produto>> {
    return this.httpClient.post<Paginacao<Produto>>(`${this.API_URL}produtos/vinculaCategoriaUnidadeMedida`, produtos);
  }

  obtenhaProdutosPorCodigo(produtos: string[]): Observable<Produto[]>{
    return this.httpClient.post<Produto[]>(`${this.API_URL}produtos/obtenha-produtos-codigo`, produtos);
  }

  obtenhaProdutosSeller(idCategoriaProduto: number, idTenant: number, filtro: ProdutoSellerFiltro): Observable<Paginacao<Produto>>{
    return this.httpClient.post<Paginacao<Produto>>(`${this.API_URL}produtos/obtenha-produtos-seller/${idCategoriaProduto}/${idTenant}`,
      filtro
    );
  }
}
