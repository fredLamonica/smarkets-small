import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CatalogoItem, GrupoCategoriaProdutoDto, GrupoFornecedorDto, GrupoMarcaDto, Paginacao, TipoCatalogoItem } from '@shared/models';
import { Observable, Subject, of } from 'rxjs';
import { delay, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TipoBuscaContrato } from '../../modules/contratos-fornecedor/models/TipoBuscaContrato';
import { TipoBusca } from '../../modules/marketplace/models/tipo-busca.enum';
import { GrupoClienteDto } from '../models/dto/grupo-cliente-dto';
import { GrupoEstadoDto } from '../models/dto/grupo-estado-dto';
import { TipoCatalogo } from '../models/enums/tipo-catalogo';
import { VinculoProdutoFiltro } from '../models/fltros/vinculo-produto-filtro';
import { UtilitiesService } from '../utils/utilities.service';

@Injectable()
export class CatalogoService {
  private API_URL: string = environment.apiUrl;
  private readonly globalDelay: number = 1500;
  private unsubscribeControlProdutosCatalogo: Subject<void> = new Subject<void>();
  private unsubscribeControlProdutosRequisicao: Subject<void> = new Subject<void>();
  private unsubscribeControlEstados: Subject<void> = new Subject<void>();
  private unsubscribeControlCategoriasCatalogo: Subject<void> = new Subject<void>();
  private unsubscribeControlCategoriasRequisicao: Subject<void> = new Subject<void>();
  private unsubscribeControlMarcas: Subject<void> = new Subject<void>();
  private unsubscribeControlFornecedores: Subject<void> = new Subject<void>();

  constructor(private httpClient: HttpClient, private utilitiesService: UtilitiesService) { }

  filtrarProdutosCatalogo(
    itensPorPagina: number,
    pagina: number,
    itemOrdenacao: string,
    ordenacao: string,
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Paginacao<CatalogoItem>> {
    if (utilizarControleDeRequests) {
      this.unsubscribeControlProdutosCatalogo.next();
    }

    // tslint:disable-next-line: deprecation
    return of(new Paginacao<CatalogoItem>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlProdutosCatalogo),
      switchMap(() => this.filtrar(
        itensPorPagina,
        pagina,
        itemOrdenacao,
        ordenacao,
        descricao,
        idsEstados,
        idsCategorias,
        idsFornecedores,
        idsMarcas,
        TipoCatalogoItem.Catalogo,
        tipoBusca,
        idPessoaJuridicaParticipanteContrato,
        idTenantParticipanteContrato,
        tipoCatalogo,
        primeiroFiltroCategoria,
        buscaDetalhada,
      )));
  }

  filtrarProdutosRequisicao(
    itensPorPagina: number,
    pagina: number,
    itemOrdenacao: string,
    ordenacao: string,
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Paginacao<CatalogoItem>> {
    if (utilizarControleDeRequests) {
      this.unsubscribeControlProdutosRequisicao.next();
    }

    // tslint:disable-next-line: deprecation
    return of(new Paginacao<CatalogoItem>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlProdutosRequisicao),
      switchMap(() => this.filtrar(
        itensPorPagina,
        pagina,
        itemOrdenacao,
        ordenacao,
        descricao,
        idsEstados,
        idsCategorias,
        idsFornecedores,
        idsMarcas,
        TipoCatalogoItem.Requisicao,
        tipoBusca,
        idPessoaJuridicaParticipanteContrato,
        idTenantParticipanteContrato,
        null,
        primeiroFiltroCategoria,
        buscaDetalhada,
      )));
  }

filtrarProdutosContratoFornecedor(
    itensPorPagina: number,
    pagina: number,
    itemOrdenacao: string,
    ordenacao: string,
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsClientes: Array<Number>,
    idsMarcas: Array<Number>,
    tipoBusca?: TipoBuscaContrato,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Paginacao<CatalogoItem>> {
    if (utilizarControleDeRequests) {
      this.unsubscribeControlProdutosCatalogo.next();
    }

    const params = {
      itensPorPagina,
      pagina,
      itemOrdenacao,
      ordenacao,
      descricao,
    };

    this.definaParametro(params, TipoCatalogoItem.Catalogo, 'tipoCatalogoItem');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsClientes, 'idsClientes');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    return this.httpClient.post<Paginacao<CatalogoItem>>(`${this.API_URL}catalogos/contrato-fornecedor`, params);
  }


  filtrarProdutoVinculo(
    descricao: string,
  ): Observable<Array<CatalogoItem>> {
    const params = {
      descricao,
    };
    return this.httpClient.get<Array<CatalogoItem>>(`${this.API_URL}catalogos/FiltrarVinculoProduto`, { params: this.utilitiesService.getHttpParamsFromObject(params) });
  }

  filtrarCatalogosVinculoProduto(
    vinculoProdutoFiltro: VinculoProdutoFiltro): Observable<Array<CatalogoItem>> {
    if (!vinculoProdutoFiltro.idFornecedor) { vinculoProdutoFiltro.idFornecedor = 0; }
    return this.httpClient.post<Array<CatalogoItem>>(`${this.API_URL}catalogos/filtroVinculoProduto`, vinculoProdutoFiltro);
  }

  filtrar(
    itensPorPagina: number,
    pagina: number,
    itemOrdenacao: string,
    ordenacao: string,
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    tipoCatalogoItem?: TipoCatalogoItem,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    buscaDetalhada: boolean = false,
  ): Observable<Paginacao<CatalogoItem>> {
    const params = {
      itensPorPagina,
      pagina,
      itemOrdenacao,
      ordenacao,
      descricao,
    };

    this.definaParametro(params, tipoCatalogoItem, 'tipoCatalogoItem');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsFornecedores, 'idsFornecedores');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    return this.httpClient.post<Paginacao<CatalogoItem>>(`${this.API_URL}catalogos`, params);
  }

  filtrarCatalogos(
    idCategoria: number,
    idFornecedor: number,
    idMarca: number,
    descricao: string,
    tipoCatalogoItem?: TipoCatalogoItem,
    codigoProduto: string = null,
    codigoNcm: string = null,
    idProduto: string = null,
  ): Observable<Array<CatalogoItem>> {
    const p = {
      descricao: descricao,
      idCategoria: idCategoria ? idCategoria.toString() : '0',
      idFornecedor: idFornecedor ? idFornecedor.toString() : '0',
      idMarca: idMarca ? idMarca.toString() : '0',
      codigoProduto: codigoProduto ? codigoProduto : '',
      codigoNcm: codigoNcm ? codigoNcm : '',
      idProduto: idProduto ? idProduto : '',
    };

    if (tipoCatalogoItem) { p['tipoCatalogoItem'] = tipoCatalogoItem; }

    return this.httpClient.get<Array<CatalogoItem>>(`${this.API_URL}catalogos/filtro`, {
      params: p,
    });
  }

  obterItemOutrosFornecedores(
    idProduto: number,
    idFornecedor: number,
  ): Observable<Array<CatalogoItem>> {
    return this.httpClient.get<Array<CatalogoItem>>(
      `${this.API_URL}catalogos/itens-outros-fornecedores/${idProduto}/${idFornecedor}`,
    );
  }

  obterItensPorCodigoProduto(codigoProduto: string): Observable<Array<CatalogoItem>> {
    return this.httpClient.get<Array<CatalogoItem>>(
      `${this.API_URL}catalogos/produtos/codigos/${codigoProduto}`,
    );
  }

  // #region Favoritos
  inserirFavorito(idContratoCatalogoItem: number): Observable<number> {
    return this.httpClient.post<number>(
      `${this.API_URL}catalogos/favoritos/${idContratoCatalogoItem}`,
      {},
    );
  }

  deletarFavorito(idContratoCatalogoItem: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}catalogos/favoritos/${idContratoCatalogoItem}`,
      {},
    );
  }
  // #endregion

  // #region Marcas
  obterMarcas(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoMarcaDto>> {
    const params = { descricao };

    if (utilizarControleDeRequests) {
      this.unsubscribeControlMarcas.next();
    }

    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsFornecedores, 'idsFornecedores');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, itensPorPagina, 'itensPorPagina');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    // tslint:disable-next-line: deprecation
    return of(new Array<GrupoMarcaDto>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlMarcas),
      switchMap(() => this.httpClient.post<Array<GrupoMarcaDto>>(`${this.API_URL}catalogos/marcas`, params)));
  }

  obterMarcasContratoFornecedor(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsClientes: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBuscaContrato,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoMarcaDto>> {
    const params = { descricao };

    if (utilizarControleDeRequests) {
      this.unsubscribeControlMarcas.next();
    }

    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, idsClientes, 'idsClientes');
    this.definaParametro(params, itensPorPagina, 'itensPorPagina');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    // tslint:disable-next-line: deprecation
    return of(new Array<GrupoMarcaDto>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlMarcas),
      switchMap(() => this.httpClient.post<Array<GrupoMarcaDto>>(`${this.API_URL}catalogos/marcas-contrato-fornecedor`, params)));
  }
  // #endregion

  // #region Fornecedores
  obterFornecedores(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoFornecedorDto>> {
    const params = { descricao };

    if (utilizarControleDeRequests) {
      this.unsubscribeControlFornecedores.next();
    }

    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsFornecedores, 'idsFornecedores');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, itensPorPagina, 'itensPorPagina');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    // tslint:disable-next-line: deprecation
    return of(new Array<GrupoFornecedorDto>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlFornecedores),
      switchMap(() => this.httpClient.post<Array<GrupoFornecedorDto>>(`${this.API_URL}catalogos/fornecedores`, params)));
  }

  obterClientesContratoFornecedor(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsMarcas: Array<Number>,
    idsClientes: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBuscaContrato,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoClienteDto>> {
    const params = { descricao };

    if (utilizarControleDeRequests) {
      this.unsubscribeControlFornecedores.next();
    }

    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, idsClientes, 'idsClientes');
    this.definaParametro(params, itensPorPagina, 'itensPorPagina');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    // tslint:disable-next-line: deprecation
    return of(new Array<GrupoClienteDto>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlFornecedores),
      switchMap(() => this.httpClient.post<Array<GrupoClienteDto>>(`${this.API_URL}catalogos/clientes-contrato-fornecedor`, params)));
  }
  // #endregion

  // #region Categorias
  obterCategoriasCatalogo(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    idCategoriaProdutoPai?: number,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoCategoriaProdutoDto>> {
    if (utilizarControleDeRequests) {
      this.unsubscribeControlCategoriasCatalogo.next();
    }

    // tslint:disable-next-line: deprecation
    return of(new Array<GrupoCategoriaProdutoDto>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlCategoriasCatalogo),
      switchMap(() => this.obterCategorias(
        descricao,
        idsEstados,
        idsCategorias,
        idsFornecedores,
        idsMarcas,
        itensPorPagina,
        TipoCatalogoItem.Catalogo,
        tipoBusca,
        idPessoaJuridicaParticipanteContrato,
        idTenantParticipanteContrato,
        tipoCatalogo,
        idCategoriaProdutoPai,
        primeiroFiltroCategoria,
        buscaDetalhada,
      )));
  }

  obterCategoriasContratoFornecedor(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsClientes: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBuscaContrato,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    idCategoriaProdutoPai?: number,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoCategoriaProdutoDto>> {
    if (utilizarControleDeRequests) {
      this.unsubscribeControlCategoriasCatalogo.next();
    }

    const params = { descricao };

    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsClientes, 'idsClientes');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, itensPorPagina, 'itensPorPagina');
    this.definaParametro(params,  TipoCatalogoItem.Catalogo, 'tipoCatalogoItem');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, idCategoriaProdutoPai, 'idCategoriaProdutoPai');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    return this.httpClient.post<Array<GrupoCategoriaProdutoDto>>(`${this.API_URL}catalogos/categorias-contrato-fornecedor`, params);
  }

  obterCategoriasRequisicao(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    idCategoriaProdutoPai?: number,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoCategoriaProdutoDto>> {
    if (utilizarControleDeRequests) {
      this.unsubscribeControlCategoriasRequisicao.next();
    }

    // tslint:disable-next-line: deprecation
    return of(new Array<GrupoCategoriaProdutoDto>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlCategoriasRequisicao),
      switchMap(() => this.obterCategorias(
        descricao,
        idsEstados,
        idsCategorias,
        idsFornecedores,
        idsMarcas,
        itensPorPagina,
        TipoCatalogoItem.Requisicao,
        tipoBusca,
        idPessoaJuridicaParticipanteContrato,
        idTenantParticipanteContrato,
        null,
        idCategoriaProdutoPai,
        primeiroFiltroCategoria,
        buscaDetalhada,
      )));
  }

  obterCategorias(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoCatalogoItem?: TipoCatalogoItem,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    idCategoriaProdutoPai?: number,
    primeiroFiltroCategoria?: boolean,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoCategoriaProdutoDto>> {
    const params = { descricao };

    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsFornecedores, 'idsFornecedores');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, itensPorPagina, 'itensPorPagina');
    this.definaParametro(params, tipoCatalogoItem, 'tipoCatalogoItem');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, idCategoriaProdutoPai, 'idCategoriaProdutoPai');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    return this.httpClient.post<Array<GrupoCategoriaProdutoDto>>(`${this.API_URL}catalogos/categorias`, params);
  }
  // #endregion

  // #region Estados
  obterEstados(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsFornecedores: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBusca,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoEstadoDto>> {
    const params = { descricao };

    if (utilizarControleDeRequests) {
      this.unsubscribeControlEstados.next();
    }

    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsFornecedores, 'idsFornecedores');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, itensPorPagina, 'itensPorPagina');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    // tslint:disable-next-line: deprecation
    return of(new Array<GrupoEstadoDto>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlEstados),
      switchMap(() => this.httpClient.post<Array<GrupoEstadoDto>>(`${this.API_URL}catalogos/estados`, params)));
  }

  obterEstadosContratoFornecedor(
    descricao: string,
    idsEstados: Array<Number>,
    idsCategorias: Array<Number>,
    idsClientes: Array<Number>,
    idsMarcas: Array<Number>,
    itensPorPagina?: number,
    tipoBusca?: TipoBuscaContrato,
    idPessoaJuridicaParticipanteContrato?: number,
    idTenantParticipanteContrato?: number,
    tipoCatalogo?: TipoCatalogo,
    primeiroFiltroCategoria?: boolean,
    utilizarControleDeRequests: boolean = false,
    buscaDetalhada: boolean = false,
  ): Observable<Array<GrupoEstadoDto>> {
    const params = { descricao };

    if (utilizarControleDeRequests) {
      this.unsubscribeControlEstados.next();
    }

    this.definaParametro(params, idsEstados, 'idsEstados');
    this.definaParametro(params, idsCategorias, 'idsCategorias');
    this.definaParametro(params, idsClientes, 'idsClientes');
    this.definaParametro(params, idsMarcas, 'idsMarcas');
    this.definaParametro(params, itensPorPagina, 'itensPorPagina');
    this.definaParametro(params, tipoBusca, 'tipoBusca');
    this.definaParametro(params, idPessoaJuridicaParticipanteContrato, 'idPessoaJuridicaParticipanteContrato');
    this.definaParametro(params, idTenantParticipanteContrato, 'idTenantParticipanteContrato');
    this.definaParametro(params, tipoCatalogo, 'tipoCatalogo');
    this.definaParametro(params, primeiroFiltroCategoria, 'primeiroFiltroCategoria');
    this.definaParametro(params, buscaDetalhada, 'buscaDetalhada');

    // tslint:disable-next-line: deprecation
    return of(new Array<GrupoEstadoDto>()).pipe(
      delay(this.globalDelay),
      takeUntil(this.unsubscribeControlEstados),
      switchMap(() => this.httpClient.post<Array<GrupoEstadoDto>>(`${this.API_URL}catalogos/estados-contrato-fornecedor`, params)));
  }


  // #endregion

  obterLinkDestaqueLogin(): Observable<any> {
    return this.httpClient.get<any>(`${this.API_URL}catalogos/links/detaques`);
  }

  obterDetalhesCatalogo(idContratoCatalogoItem: number): Observable<CatalogoItem> {
    return this.httpClient.get<CatalogoItem>(
      `${this.API_URL}catalogos/detalhes/${idContratoCatalogoItem}`,
    );
  }

  obterDetalhesRequisicao(idProduto: number): Observable<CatalogoItem> {
    return this.httpClient.get<CatalogoItem>(
      `${this.API_URL}catalogos/requisicao/detalhes/${idProduto}`,
    );
  }

  private definaParametro(objetoDeParametros: any, valorParametro: any, nomeParametro: string) {
    if (valorParametro) {
      objetoDeParametros[nomeParametro] = valorParametro;
    }
  }
}
