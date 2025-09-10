import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginacao, RelatorioSolicitacaoCompraFiltro, Usuario } from '@shared/models';
import { RelatorioPedidoFiltro } from '@shared/models/fltros/relatorio-pedido-filtro';
import { AprovacaoPedidoRelatorio } from '@shared/models/relatorio/aprovacao-pedido-relatorio';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RelatorioRequisicaoFiltro } from '../models/fltros/relatorio-requisicao-filtro';
import { ErrorService } from '../utils/error.service';

@Injectable()
export class RelatoriosService {
  private API_URL: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
  ) { }

  obterHistoricoPedidos(relatorioFiltro: RelatorioPedidoFiltro): Observable<any> {
    return this.httpClient.get(`${this.API_URL}relatorios/historicoPedidos`, {
      params: {
        relatorioFiltro: JSON.stringify(relatorioFiltro),
      },
      responseType: 'blob',
    });
  }

  obterHistoricoAprovacao(
    dataInicio: string,
    dataFim: string,
    fornecedor: string,
    aprovador: string,
    compradores: string,
    categoria: string,
  ): Observable<any> {
    return this.httpClient.get(`${this.API_URL}relatorios/historicoAprovacao`, {
      params: {
        dataInicio: dataInicio,
        dataFim: dataFim,
        fornecedor: fornecedor,
        aprovador: aprovador,
        compradores: compradores,
        categoria: categoria,
      },
      responseType: 'blob',
    });
  }

  exportDebitNoteReport(idCampanhaFranquia: number) {
    return this.httpClient.get(`${this.API_URL}relatorios/debit-note-report/${idCampanhaFranquia}`, { responseType: 'blob' });
  }

  obterRelatorioSolicitacaoCompra(
    relatorioSolicitacaoCompraFiltro: RelatorioSolicitacaoCompraFiltro,
  ): Observable<any> {
    return this.httpClient.get(`${this.API_URL}relatorios/solicitacao-compra`, {
      params: {
        relatorioFiltro: JSON.stringify(relatorioSolicitacaoCompraFiltro),
      },
      responseType: 'blob',
    });
  }

  obterEmpresas(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}relatorios/empresas`);
  }

  obterUsuarios(idsEmpresas: Array<number>): Observable<Array<Usuario>> {
    return this.httpClient.post<Array<Usuario>>(`${this.API_URL}relatorios/usuarios`, idsEmpresas);
  }

  obterRelatorioRequisicao(
    relatorioRequisicaoFiltro: RelatorioRequisicaoFiltro,
  ): Observable<any> {
    return this.httpClient.post(`${this.API_URL}relatorios/historicoRequisicao`, relatorioRequisicaoFiltro, { responseType: 'blob' }).pipe(
      catchError(this.errorService.parseErrorBlob));
  }

  ObterRelatorioParticipacaoCotacao(dataInicio: string, dataFim: string, idTenant: any): Observable<any> {
    const url = idTenant === undefined ? `${this.API_URL}relatorios/participacao-cotacao/${dataInicio}/${dataFim}` : `${this.API_URL}relatorios/participacao-cotacao/${dataInicio}/${dataFim}/${idTenant}`;
    return this.httpClient.get(url, {
      responseType: 'blob',
    });
  }

  ObterRelatorioAcessaramPlataforma(dataInicio: string, dataFim: string, idTenant: any): Observable<any> {
    let data = '';

    if (dataInicio === null || dataInicio === undefined || dataInicio === '') {
      data = `data-fim/${dataFim}`;
    } else {
      data = `data-inicio/${dataInicio}/data-fim/${dataFim}`;
    }

    const url = idTenant === undefined ? `${this.API_URL}relatorios/acessaram-plataforma/${data}` : `${this.API_URL}relatorios/acessaram-plataforma/${data}/${idTenant}`;

    return this.httpClient.get(url, {
      responseType: 'blob',
    });
  }

  obtenhaRelatorioContratoCatalagoFornecedor(ativos: boolean): Observable<any> {
    return this.httpClient.get(
      `${this.API_URL}relatorios/catalogo-fornecedor/${ativos}`,
      { responseType: 'blob' },
    );
  }

  filtrar(
    itemOrdenar: string,
    ordenacao: string,
    itensPorPagina: number,
    pagina: number,
    dataInicio: string,
    dataFim: string,
    fornecedor: string,
    aprovador: string,
    compradores: string,
    categoria: string,
  ): Observable<Paginacao<AprovacaoPedidoRelatorio>> {
    return this.httpClient.get<Paginacao<AprovacaoPedidoRelatorio>>(
      `${this.API_URL}relatorios/filtrar`,
      {
        params: {
          itemOrdenar: itemOrdenar,
          ordenacao: ordenacao,
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          dataInicio: dataInicio,
          dataFim: dataFim,
          fornecedor: fornecedor,
          aprovador: aprovador,
          compradores: compradores,
          categoria: categoria,
        },
      },
    );
  }
}
