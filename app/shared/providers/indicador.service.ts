import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Indicador } from '@shared/models';
import { BackLogDto } from '@shared/models/dto/back-log-dto';
import { DashboardFiltro } from '@shared/models/fltros/dash-board-filtro';
import { IndicadoresAging } from '@shared/models/indicador/indicadores-aging';
import { IndicadoresFornecedorDto } from '@shared/models/indicador/indicadores-fornecedor';
import { IndicadoresFornecedorDocumentosDto } from '@shared/models/indicador/indicadores-fornecedor-documento';
import { IndicadoresPendenciaDto } from '@shared/models/indicador/indicadores-fornecedor-pendencia';
import { IndicadorFornecedorPlanoAcao } from '@shared/models/indicador/indicadores-fornecedor-plano-acao';
import { IndicadoresFornecedorQuestionariosPorStatusDto } from '@shared/models/indicador/indicadores-fornecedor-questionarios-status';
import { IndicadoresPedido } from '@shared/models/indicador/indicadores-pedido';
import { IndicadoresRequisicao } from '@shared/models/indicador/indicadores-requisicao';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PeriodoFiltroDashboard } from '../models/enums/periodo-filtro-dashboard';
import { TipoRelatorioDashboard } from '../models/enums/tipo-relatorio-dashboard';
import { IndicadorCategoriaDto } from '../models/indicador/indicador-categoria-dto';
import { IndicadorFornecedorFast } from '../models/indicador/indicador-fornecedor-fast';
import { IndicadorGmvFast } from '../models/indicador/indicador-gmv-fast';
import { IndicadorTransacoesSkuFast } from '../models/indicador/indicador-transacoes-sku-fast';
import { IndicadorUsuarioFast } from '../models/indicador/indicador-usuario-fast';
import { ErrorService } from '../utils/error.service';

@Injectable()
export class IndicadorService {
  private API_URL: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService
    ) {

  }

  public obter(): Observable<Array<Indicador>> {
    return this.httpClient.get<Array<Indicador>>(`${this.API_URL}indicadores`);
  }

  public indicadoresRequisicao(
    dashboardFiltro: DashboardFiltro
  ): Observable<IndicadoresRequisicao> {
    return this.httpClient.get<IndicadoresRequisicao>(
      `${this.API_URL}indicadores/indicadoresRequisicao`,
      {
        params: {
          dashboardFiltro: JSON.stringify(dashboardFiltro)
        }
      }
    );
  }

  public indicadoresPedido(dashboardFiltro: DashboardFiltro): Observable<IndicadoresPedido> {
    return this.httpClient.get<IndicadoresPedido>(`${this.API_URL}indicadores/indicadoresPedido`, {
      params: {
        dashboardFiltro: JSON.stringify(dashboardFiltro)
      }
    });
  }

  public indicadoresAging(dashboardFiltro: DashboardFiltro): Observable<IndicadoresAging> {
    return this.httpClient.get<IndicadoresAging>(`${this.API_URL}indicadores/indicadoresAging`, {
      params: {
        dashboardFiltro: JSON.stringify(dashboardFiltro)
      }
    });
  }

  public backLog(dashboardFiltro: DashboardFiltro): Observable<Array<BackLogDto>> {
    return this.httpClient.get<Array<BackLogDto>>(`${this.API_URL}indicadores/backLog`, {
      params: {
        dashboardFiltro: JSON.stringify(dashboardFiltro)
      }
    });
  }

  public downloadRequisicoesSemResponsavel(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}indicadores/downloads/requisicoes-sem-responsavel`, {
      responseType: 'blob'
    });
  }

  public downloadMatrizPendencias(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}indicadores/downloads/categorias-pendentes-matriz`, {
      responseType: 'blob'
    });
  }

  public fornecedores(): Observable<IndicadoresFornecedorDto> {
    return this.httpClient.get<IndicadoresFornecedorDto>(
      `${this.API_URL}indicadores/pendenciasfornecedores/fornecedores`
    );
  }

  public fornecedoresdocumentos(): Observable<IndicadoresFornecedorDocumentosDto> {
    return this.httpClient.get<IndicadoresFornecedorDocumentosDto>(
      `${this.API_URL}indicadores/pendenciasfornecedores/fornecedoresdocumentos`
    );
  }

  public fornecedoresquestionarios(): Observable<IndicadoresFornecedorQuestionariosPorStatusDto> {
    return this.httpClient.get<IndicadoresFornecedorQuestionariosPorStatusDto>(
      `${this.API_URL}indicadores/pendenciasfornecedores/fornecedoresquestionarios`
    );
  }

  public fornecedorespendencias(): Observable<IndicadoresPendenciaDto> {
    return this.httpClient.get<IndicadoresPendenciaDto>(
      `${this.API_URL}indicadores/pendenciasfornecedores`
    );
  }

  public fornecedoresplanoacao(): Observable<IndicadorFornecedorPlanoAcao> {
    return this.httpClient.get<IndicadorFornecedorPlanoAcao>(
      `${this.API_URL}indicadores/pendenciasfornecedores/planoacao`
    );
  }

  public obterGmvfast(periodo: PeriodoFiltroDashboard): Observable<IndicadorGmvFast> {
    return this.httpClient.get<IndicadorGmvFast>(
      `${this.API_URL}Indicadores/gmv-fast/${periodo}`
    );
  }

  public obterUsuarioFast(periodo: PeriodoFiltroDashboard): Observable<IndicadorUsuarioFast>{
    return this.httpClient.get<IndicadorUsuarioFast>(
      `${this.API_URL}Indicadores/usuarios-fast/${periodo}`
    )
  }

  public obterFornecedorFast(periodo: PeriodoFiltroDashboard): Observable<IndicadorFornecedorFast>{
    return this.httpClient.get<IndicadorFornecedorFast>(
      `${this.API_URL}Indicadores/fornecedor-fast/${periodo}`
    )
  }

  public obterTransacoesSKUFast(periodo: PeriodoFiltroDashboard): Observable<IndicadorTransacoesSkuFast>{
    return this.httpClient.get<IndicadorTransacoesSkuFast>(
      `${this.API_URL}Indicadores/transacoes-sku-fast/${periodo}`
    )
  }

  public obterCategoriasSkU(idtenant: number): Observable<IndicadorCategoriaDto>{
    return this.httpClient.get<IndicadorCategoriaDto>(
      `${this.API_URL}Indicadores/categorias-sku/${idtenant}`
    )
  }

  public obterCompradorIndicadorFast(): Observable<any>{
    return this.httpClient.get(
      `${this.API_URL}Indicadores/comprador-indicador-fast`
    )
  }

  public obterRelatorioCategorias(): Observable<any>{
    return this.httpClient.get(
      `${this.API_URL}Indicadores/relatorio-categorias`,
      { responseType: 'blob' }
    ).pipe(catchError(this.errorService.parseErrorBlob));
  }

  public obtenhaRelatorio(tipo: TipoRelatorioDashboard, periodo: PeriodoFiltroDashboard): Observable<any>{
    return this.httpClient.get(
      `${this.API_URL}Indicadores/relatorio/${tipo}/${periodo}`,
      { responseType: 'blob' }
    ).pipe(catchError(this.errorService.parseErrorBlob));
  }
}
