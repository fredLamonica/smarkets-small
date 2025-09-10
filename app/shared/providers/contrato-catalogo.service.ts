import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo, ContratoCatalogoCondicaoPagamento, ContratoCatalogoEstado, ContratoCatalogoItem, ContratoCatalogoParticipante, Estado, Paginacao, Situacao, SituacaoContratoCatalogoItem } from '@shared/models';
import { ContratoCatalogoParticipanteItem } from '@shared/models/contrato-catalogo/contrato-catalogo-participante-item';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlteracaoFornecedorContratoCatalogo } from '../models/alteracao-fornecedor-contrato-catalogo';
import { ConfiguracaoColunaDto } from '../models/configuracao-coluna-dto';
import { AprovacaoContratoCatalogoEstadoFornecedor } from '../models/contrato-catalogo/aprovacao-contrato-catalogo-estado-fornecedor';
import { AprovacaoContratoCatalogoFaturamentoFornecedor } from '../models/contrato-catalogo/aprovacao-contrato-catalogo-faturamento-fornecedor';
import { AprovacaoContratoCatalogoItemFornecedor } from '../models/contrato-catalogo/aprovacao-contrato-catalogo-item-fornecedor';
import { ContratoCatalogoDto } from '../models/contrato-catalogo/contrato-catalogo-dto';
import { AprovacaoContratoFornecedorDto } from '../models/dto/aprovacao-contrato-fornecedor-dto';
import { AnaliseAprovacaoCatalogo } from '../models/enums/analise-aprovacao-catalogo';
import { ContratoCatalogoArquivoFiltro } from '../models/fltros/contrato-catalogo-arquivo-filtro';
import { ContratoCatalogoCondicaoPagamentoFiltro } from '../models/fltros/contrato-catalogo-condicao-pagamento-filtro';
import { ContratoCatalogoEstadoFiltro } from '../models/fltros/contrato-catalogo-estado-filtro';
import { ContratoCatalogoFaturamentoFiltro } from '../models/fltros/contrato-catalogo-faturamento-filtro';
import { ContratoCatalogoFiltro } from '../models/fltros/contrato-catalogo-filtro';
import { ContratoCatalogoFornecedorDto } from '../models/fltros/contrato-catalogo-fornecedor-dto';
import { ContratoCatalogoItemFiltro } from '../models/fltros/contrato-catalogo-item-filtro';
import { ContratoCatalogoParticipanteFiltro } from '../models/fltros/contrato-catalogo-participante-filtro';
import { ContratoCatalogoParticipanteItemFiltro } from '../models/fltros/contrato-catalogo-participante-item-filtro';
import { ContratoFornecedorFiltroDto } from '../models/fltros/contrato-fornecedor-filtro-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../models/paginacao-pesquisa-configurada-dto';
import { ErrorService } from '../utils/error.service';
import { ContratoCatalogo } from './../models/contrato-catalogo/contrato-catalogo';
import { ContratoCatalogoFaturamento } from './../models/contrato-catalogo/contrato-catalogo-faturamento';
import { ContratoCatalogoItemEstado } from './../models/contrato-catalogo/contrato-catalogo-item-estado';

@Injectable()
export class ContratoCatalogoService {
  private API_URL: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
  ) { }

  listar(): Observable<Array<ContratoCatalogo>> {
    return this.httpClient.get<Array<ContratoCatalogo>>(`${this.API_URL}contratoscatalogo`);
  }

  filtrar(contratoCatalogoFiltro: ContratoCatalogoFiltro): Observable<PaginacaoPesquisaConfiguradaDto<ContratoCatalogoDto>> {
    return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<ContratoCatalogoDto>>(`${this.API_URL}contratoscatalogo/filtro`,
      contratoCatalogoFiltro,
    );
  }

  obterPorId(idContratoCatalogo: number): Observable<ContratoCatalogo> {
    return this.httpClient.get<ContratoCatalogo>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}`,
    );
  }

  inserir(contratoCatalogo: ContratoCatalogo): Observable<ContratoCatalogo> {
    return this.httpClient.post<ContratoCatalogo>(
      `${this.API_URL}contratoscatalogo`,
      contratoCatalogo,
    );
  }

  alterar(contratoCatalogo: ContratoCatalogo): Observable<ContratoCatalogo> {
    return this.httpClient.put<ContratoCatalogo>(
      `${this.API_URL}contratoscatalogo`,
      contratoCatalogo,
    );
  }

  analiseAprovacaoCatalogo(idContratoCatalogo: number, analiseAprovacaoCotacao: AnaliseAprovacaoCatalogo): Observable<ContratoCatalogo> {
    return this.httpClient.get<ContratoCatalogo>(
      `${this.API_URL}contratoscatalogo/analise-aprovacao-catalogo/${idContratoCatalogo}/${analiseAprovacaoCotacao}`,
    );
  }

  enviarAprovacaoContrato(contratoCatalogo: ContratoCatalogo): Observable<ContratoCatalogo> {
    return this.httpClient.post<ContratoCatalogo>(
      `${this.API_URL}contratoscatalogo/envie-aprovacao-contrato/`,
      contratoCatalogo,
    );
  }

  cloneCatalogo(idContratoCatalogo: number): Observable<ContratoCatalogo> {
    return this.httpClient.get<ContratoCatalogo>(
      `${this.API_URL}contratoscatalogo/clone-catalogo/${idContratoCatalogo}`,
    );
  }

  deletar(idContratoCatalogo: number): Observable<ContratoCatalogo> {
    return this.httpClient.delete<ContratoCatalogo>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}`,
    );
  }

  deletarBatch(contratos: Array<ContratoCatalogo>): Observable<any> {
    return this.httpClient.patch<ContratoCatalogo>(`${this.API_URL}contratoscatalogo/`, contratos);
  }
  // #region Condição Pagamento
  obterCondicaoPagamentoPorId(
    idContratoCatalogo: number,
    idContratoCatalogoCondicaoPagamento: number,
  ): Observable<ContratoCatalogoCondicaoPagamento> {
    return this.httpClient.get<ContratoCatalogoCondicaoPagamento>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/condicoesPagamentos/${idContratoCatalogoCondicaoPagamento}`,
    );
  }

  inserirCondicaoPagamento(
    idContratoCatalogo: number,
    contratoCatalogoCondicaoPagamento: ContratoCatalogoCondicaoPagamento,
  ): Observable<ContratoCatalogoCondicaoPagamento> {
    return this.httpClient.post<ContratoCatalogoCondicaoPagamento>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/condicoesPagamentos`,
      contratoCatalogoCondicaoPagamento,
    );
  }

  alterarCondicaoPagamento(
    idContratoCatalogo: number,
    contratoCatalogoCondicaoPagamento: ContratoCatalogoCondicaoPagamento,
  ): Observable<ContratoCatalogoCondicaoPagamento> {
    return this.httpClient.put<ContratoCatalogoCondicaoPagamento>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/condicoesPagamentos`,
      contratoCatalogoCondicaoPagamento,
    );
  }

  alterarSituacaoCondicaoPagamentoBatch(
    idContratoCatalogo: number,
    contratoCatalogoCondicoesPagamentos: Array<ContratoCatalogoCondicaoPagamento>,
    situacao: Situacao,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/condicoesPagamentos/situacao/${situacao}`,
      contratoCatalogoCondicoesPagamentos,
    );
  }

  deletarCondicaoPagamento(
    idContratoCatalogo: number,
    idContratoCatalogoCondicaoPagamento: number,
  ): Observable<ContratoCatalogoCondicaoPagamento> {
    return this.httpClient.delete<ContratoCatalogoCondicaoPagamento>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/condicoesPagamentos/${idContratoCatalogoCondicaoPagamento}`,
    );
  }

  deletarCondicaoPagamentoBatch(
    idContratoCatalogo: number,
    contratoCatalogoCondicoesPagamentos: Array<ContratoCatalogoCondicaoPagamento>,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/condicoesPagamentos`,
      contratoCatalogoCondicoesPagamentos,
    );
  }

  filtrarCondicaoPagamento(
    contratoCatalogoCondicaoPagamentoFiltro: ContratoCatalogoCondicaoPagamentoFiltro,
  ): Observable<Paginacao<ContratoCatalogoCondicaoPagamento>> {
    return this.httpClient.post<Paginacao<ContratoCatalogoCondicaoPagamento>>(
      `${this.API_URL}contratoscatalogo/condicoesPagamentos/filtro`,
      contratoCatalogoCondicaoPagamentoFiltro,
    );
  }
  // #endregion

  ativar(contratoCatalogo: ContratoCatalogoDto): Observable<any> {
    return this.httpClient.post<ContratoCatalogoDto>(
      `${this.API_URL}contratoscatalogo/ativos`,
      contratoCatalogo,
    );
  }

  inativar(contratoCatalogo: ContratoCatalogoDto): Observable<any> {
    return this.httpClient.post<ContratoCatalogoDto>(
      `${this.API_URL}contratoscatalogo/inativos`,
      contratoCatalogo,
    );
  }

  // #region Itens
  alterarItemCatalogo(
    idContratoCatalogo: number,
    contratoCatalogoItem: ContratoCatalogoItem,
  ): Observable<ContratoCatalogo> {
    return this.httpClient.put<ContratoCatalogo>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/itens/`,
      contratoCatalogoItem,
    );
  }

  altereFaturamentoContrato(
    ContratoCatalogoFaturamento: ContratoCatalogoFaturamento,
  ): Observable<ContratoCatalogoFaturamento> {
    return this.httpClient.patch<ContratoCatalogoFaturamento>(
      `${this.API_URL}contratoscatalogo/faturamento`,
      ContratoCatalogoFaturamento,
    );
  }

  deletarItensContratoBatch(
    idContratoCatalogo: number,
    contratoCatalogoItens: Array<ContratoCatalogoItem>,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/itens`,
      contratoCatalogoItens,
    );
  }

  analiseAprovacaoItens(aprovacao: AnaliseAprovacaoCatalogo, contratoCatalogoItens: Array<ContratoCatalogoItem>): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}contratoscatalogo/analise-aprovacao-itens/${aprovacao}`,
      contratoCatalogoItens,
    );
  }

  analiseAprovacaoItem(aprovacao: AnaliseAprovacaoCatalogo, contratoCatalogoItem: ContratoCatalogoItem): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}contratoscatalogo/analise-aprovacao-item/${aprovacao}`,
      contratoCatalogoItem,
    );
  }

  analiseAprovacaoEstados(aprovacao: AnaliseAprovacaoCatalogo, contratoCatalogoItens: Array<ContratoCatalogoEstado>): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}contratoscatalogo/analise-aprovacao-estados/${aprovacao}`,
      contratoCatalogoItens,
    );
  }

  analiseAprovacaoFaturamento(aprovacao: AnaliseAprovacaoCatalogo, contratoCatalogoFaturamento: Array<ContratoCatalogoFaturamento>): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}contratoscatalogo/analise-aprovacao-faturamento/${aprovacao}`,
      contratoCatalogoFaturamento,
    );
  }

  filtrarItensContrato(
    contratoCatalogoItemFiltro: ContratoCatalogoItemFiltro,
  ): Observable<Paginacao<ContratoCatalogoItem>> {
    return this.httpClient.post<Paginacao<ContratoCatalogoItem>>(
      `${this.API_URL}contratoscatalogo/itens/filtro`,
      contratoCatalogoItemFiltro,
    );
  }

  altereEstadosItemFornecedor(
    contratoCatalogoItemEstado: Array<ContratoCatalogoItemEstado>,
    idContratoCatalogoItem: number
  ): Observable<Array<ContratoCatalogoItemEstado>> {
    return this.httpClient.put<Array<ContratoCatalogoItemEstado>>(
      `${this.API_URL}contratoscatalogo/altere-estados-item-fornecedor/${idContratoCatalogoItem}`,
      contratoCatalogoItemEstado,
    );
  }

  filtrarItensVinculoParticipante(
    contratoCatalogoItemFiltro: ContratoCatalogoItemFiltro,
    idContratoCatalogoParticipante: number,
  ): Observable<Paginacao<ContratoCatalogoItem>> {
    return this.httpClient.post<Paginacao<ContratoCatalogoItem>>(
      `${this.API_URL}contratoscatalogo/itens/filtro-vinculo-participante/${idContratoCatalogoParticipante}`,
      contratoCatalogoItemFiltro,
    );
  }

  inserirItemCatalogo(
    idContratoCatalogo: number,
    contratoCatalogoItem: ContratoCatalogoItem,
  ): Observable<ContratoCatalogoItem> {
    return this.httpClient.post<ContratoCatalogoItem>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/itens/`,
      contratoCatalogoItem,
    );
  }

  obterItemContratoPorId(
    idContratoCatalogo: number,
    idContratoCatalogoItem: number,
  ): Observable<ContratoCatalogoItem> {
    return this.httpClient.get<ContratoCatalogoItem>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/itens/${idContratoCatalogoItem}`,
    );
  }

  alterarSituacaoItemContratoBatch(
    idContratoCatalogo: number,
    contratoCatalogoItens: Array<ContratoCatalogoItem>,
    situacao: SituacaoContratoCatalogoItem,
  ) {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/itens/situacao/${situacao}`,
      contratoCatalogoItens,
    );
  }
  // #endregion

  // #region Participantes
  deletarParticipantesContratoBatch(
    idContratoCatalogo: number,
    contratoCatalogoParticipantes: Array<ContratoCatalogoParticipante>,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/participantes`,
      contratoCatalogoParticipantes,
    );
  }

  filtrarParticipantesContrato(
    contratoCatalogoParticipanteFiltro: ContratoCatalogoParticipanteFiltro,
  ): Observable<Paginacao<ContratoCatalogoParticipante>> {
    return this.httpClient.post<Paginacao<ContratoCatalogoParticipante>>(
      `${this.API_URL}contratoscatalogo/participantes/filtro`,
      contratoCatalogoParticipanteFiltro,
    );
  }

  inserirParticipanteContratoBatch(
    idContratoCatalogo: number,
    contratoCatalogoParticipantes: Array<ContratoCatalogoParticipante>,
  ): Observable<ContratoCatalogoParticipante> {
    return this.httpClient.post<ContratoCatalogoParticipante>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/participantes/`,
      contratoCatalogoParticipantes,
    );
  }

  obterParticipanteContratoPorId(
    idContratoCatalogo: number,
    idContratoCatalogoParticipante: number,
  ): Observable<ContratoCatalogoParticipante> {
    return this.httpClient.get<ContratoCatalogoParticipante>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/participantes/${idContratoCatalogoParticipante}`,
    );
  }

  alterarSituacaoParticipantesContratoBatch(
    idContratoCatalogo: number,
    contratoCatalogoParticipantes: Array<ContratoCatalogoParticipante>,
    situacao: SituacaoContratoCatalogoItem,
  ) {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/participantes/situacao/${situacao}`,
      contratoCatalogoParticipantes,
    );
  }
  // #endregion

  // #region Participante Item
  filtrarParticipanteItensContrato(
    contratoCatalogoParticipanteItemFiltro: ContratoCatalogoParticipanteItemFiltro,
  ): Observable<Paginacao<ContratoCatalogoParticipanteItem>> {
    return this.httpClient.post<Paginacao<ContratoCatalogoParticipanteItem>>(
      `${this.API_URL}contratoscatalogo/participantes/itens/filtro`,
      contratoCatalogoParticipanteItemFiltro,
    );
  }

  obterContratoCatalogoParticipanteItem(
    idContratoCatalogoParticipanteItem: number,
  ): Observable<ContratoCatalogoParticipanteItem> {
    return this.httpClient.get<ContratoCatalogoParticipanteItem>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogoParticipanteItem}/contratoCatalogoParticipanteItem`,
    );
  }

  obterItens(idContrato: number): Observable<Array<ContratoCatalogoItem>> {
    return this.httpClient.get<Array<ContratoCatalogoItem>>(
      `${this.API_URL}contratoscatalogo/${idContrato}/itens`,
    );
  }

  alterarSituacaoParticipanteItensContratoBatch(
    idContratoCatalogo: number,
    idContratoCatalogoParticipante: number,
    contratoCatalogoItens: Array<ContratoCatalogoParticipanteItem>,
    situacao: SituacaoContratoCatalogoItem,
  ): Observable<any> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/participantes/${idContratoCatalogoParticipante}/itens/situacao/${situacao}`,
      contratoCatalogoItens,
    );
  }

  alterarParticipanteItemContrato(
    idContratoCatalogo: number,
    idContratoCatalogoParticipante: number,
    contratoCatalogoParticipanteItem: ContratoCatalogoParticipanteItem,
  ): Observable<any> {
    return this.httpClient.put<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/participantes/${idContratoCatalogoParticipante}/itens/`,
      contratoCatalogoParticipanteItem,
    );
  }

  inserirContratoCatalogoParticipanteItem(
    idContratoCatalogo: number,
    idContratoCatalogoParticipante: number,
    contratoCatalogoParticipanteItem: ContratoCatalogoParticipanteItem,
  ): Observable<ContratoCatalogoParticipanteItem> {
    return this.httpClient.post<ContratoCatalogoParticipanteItem>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/participantes/${idContratoCatalogoParticipante}/itens`,
      contratoCatalogoParticipanteItem,
    );
  }
  // #endregion

  // #region Estados
  deleteFaturamentoContratoBatch(
    idContratoCatalogo: number,
    ContratoCatalogoFaturamento: Array<ContratoCatalogoFaturamento>,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/faturamento/${idContratoCatalogo}`,
      ContratoCatalogoFaturamento,
    );
  }

  filtrarEstadosContrato(
    contratoCatalogoEstadoFiltro: ContratoCatalogoEstadoFiltro,
  ): Observable<Paginacao<ContratoCatalogoItemEstado>> {
    return this.httpClient.post<Paginacao<ContratoCatalogoItemEstado>>(
      `${this.API_URL}contratoscatalogo/estados/filtro`,
      contratoCatalogoEstadoFiltro,
    );
  }

  filtrarFaturamentoContrato(
    contratoCatalogoEstadoFiltro: ContratoCatalogoFaturamentoFiltro,
  ): Observable<Paginacao<ContratoCatalogoFaturamento>> {
    return this.httpClient.post<Paginacao<ContratoCatalogoFaturamento>>(
      `${this.API_URL}contratoscatalogo/faturamento/filtro`,
      contratoCatalogoEstadoFiltro,
    );
  }

  obtenhaEstadosDisponiveis(
    idContratoCatalogoitem: number,
  ): Observable<Array<Estado>> {
    return this.httpClient.get<Array<Estado>>(
      `${this.API_URL}contratoscatalogo/obtenha-estados-disponiveis/${idContratoCatalogoitem}`,
    );
  }

  obterContratoEstadoPorIdEstado(
    idContratoCatalogo: number,
    idEstado: number,
  ): Observable<ContratoCatalogoItemEstado> {
    return this.httpClient.get<ContratoCatalogoItemEstado>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/estados/${idEstado}`,
    );
  }

  obterFaturamentoPorIdEstado(
    idContratoCatalogo: number,
    idEstado: number,
  ): Observable<ContratoCatalogoFaturamento> {
    return this.httpClient.get<ContratoCatalogoFaturamento>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/faturamento/${idEstado}`,
    );
  }

  inserirEstadoContrato(
    idContratoCatalogo: number,
    contratoCatalogoEstado: ContratoCatalogoEstado,
  ): Observable<ContratoCatalogoEstado> {
    return this.httpClient.post<ContratoCatalogoEstado>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/estados/`,
      contratoCatalogoEstado,
    );
  }

  insereFaturamentoContrato(
    contratoCatalogoFaturamento: ContratoCatalogoFaturamento,
  ): Observable<ContratoCatalogoFaturamento> {
    return this.httpClient.post<ContratoCatalogoFaturamento>(
      `${this.API_URL}contratoscatalogo/faturamento`,
      contratoCatalogoFaturamento,
    );
  }

  alterarSituacaoEstadoContratoBatch(
    idContratoCatalogo: number,
    contratoCatalogoEstados: Array<ContratoCatalogoItemEstado>,
    situacao: SituacaoContratoCatalogoItem,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/estados/situacao/${situacao}`,
      contratoCatalogoEstados,
    );
  }

  alterarSituacaoFaturamentoContratoBatch(
    idsContratoCatalogoFaturamento: Array<number>,
    situacao: SituacaoContratoCatalogoItem,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/faturamento/situacao/${situacao}`,
      idsContratoCatalogoFaturamento,
    );
  }

  salvarAlteracoesEstadoContrato(
    idContratoCatalogo: number,
    idEstado: ContratoCatalogoEstado['idEstado'],
    contratoCatalogoEstado: ContratoCatalogoEstado,
  ): Observable<ContratoCatalogoEstado> {
    return this.httpClient.patch<ContratoCatalogoEstado>(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/estados/${idEstado}`,
      contratoCatalogoEstado,
    );
  }

  // #endregion

  // #region Anexos
  inserirArquivo(idContratoCatalogo: number, idArquivo: number): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/arquivos/${idArquivo}`,
      {},
    );
  }

  deletarArquivo(idContratoCatalogo: number, idArquivo: number): Observable<any> {
    return this.httpClient.delete(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/arquivos/${idArquivo}`,
    );
  }

  inserirArquivos(idContratoCatalogo: number, arquivos: Array<Arquivo>): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/arquivos`,
      arquivos,
    );
  }

  deletarArquivos(idContratoCatalogo: number, arquivos: Array<Arquivo>): Observable<any> {
    return this.httpClient.patch(
      `${this.API_URL}contratoscatalogo/${idContratoCatalogo}/arquivos`,
      arquivos,
    );
  }

  insereMotivoRecusaContrato(motivoRecusa: string, idContrato: number): Observable<any> {
    return this.httpClient.patch(`${this.API_URL}contratoscatalogo/insere-motivo-recusa-contrato/${idContrato}`,
      { motivoRecusa: motivoRecusa },
    );
  }

  filtrarArquivos(
    contratoCatalogoArquivoFiltro: ContratoCatalogoArquivoFiltro,
  ): Observable<Paginacao<Arquivo>> {
    return this.httpClient.post<Paginacao<Arquivo>>(
      `${this.API_URL}contratoscatalogo/arquivos/filtro`,
      contratoCatalogoArquivoFiltro,
    );
  }

  // #endregion

  AdicioneItensParticipante(itens: Array<ContratoCatalogoItem>, idContratoCatalogoParticipante: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}contratoscatalogo/adicione-itens-participante/${idContratoCatalogoParticipante}`,
      itens,
    );
  }

  ListeVinculoItensParticipante(filtro: ContratoCatalogoParticipanteItemFiltro): Observable<Paginacao<ContratoCatalogoItem>> {
    return this.httpClient.post<Paginacao<ContratoCatalogoItem>>(`${this.API_URL}contratoscatalogo/liste-vinculo-itens-participante`,
      filtro,
    );
  }

  deletarItensVinculoParticipante(
    idContratoCatalogoParticipante: number,
    idsContratoCatalogoItens: Array<ContratoCatalogoItem>,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}contratoscatalogo/delete-vinculo-itens-participantes/${idContratoCatalogoParticipante}`,
      idsContratoCatalogoItens,
    );
  }

  obtenhaExportarContratoCatalago(idContratoCatalogo: number): Observable<any> {
    return this.httpClient.get(
      `${this.API_URL}contratoscatalogo/relatorio-contrato-catalogo/${idContratoCatalogo}`,
      { responseType: 'blob' },
    );
  }

  exporteContratosMarketplaceFornecedor(filtroContrato: ContratoFornecedorFiltroDto): Observable<any> {
    return this.httpClient
      .post(
        `${this.API_URL}contratoscatalogo/exportar-fornecedor`,
        filtroContrato,
        { responseType: 'blob' })
      .pipe(catchError(this.errorService.parseErrorBlob))
      ;
  }

  filtre(filtroContrato: ContratoFornecedorFiltroDto): Observable<PaginacaoPesquisaConfiguradaDto<ContratoCatalogoFornecedorDto>> {
    return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<ContratoCatalogoFornecedorDto>>(`${this.API_URL}contratoscatalogo/filtro-contrato-fornecedor`, filtroContrato);
  }

  obtenhaFiltroSalvo(): Observable<ContratoFornecedorFiltroDto> {
    return this.httpClient.get<ContratoFornecedorFiltroDto>(`${this.API_URL}contratoscatalogo/filtro-salvo`);
  }

  obtenhaFiltroSalvoCliente(): Observable<ContratoCatalogoFiltro> {
    return this.httpClient.get<ContratoCatalogoFiltro>(`${this.API_URL}contratoscatalogo/filtro-salvo-cliente`);
  }

  obtenhaColunasDiponiveis(isFornecedor: boolean): Observable<Array<ConfiguracaoColunaDto>> {
    return this.httpClient.get<Array<ConfiguracaoColunaDto>>(`${this.API_URL}contratoscatalogo/colunas-disponiveis/${isFornecedor}`);
  }

  obtenhaItemContratoPorId(idContratoCatalogoItem: number): Observable<ContratoCatalogoItem> {
    return this.httpClient.get<ContratoCatalogoItem>(`${this.API_URL}contratoscatalogo/obtenha-item-contrato-fornecedor/${idContratoCatalogoItem}`);
  }

  obtenhaFaturamentoContratoPorId(idContratoCatalogoFaturamento: number): Observable<ContratoCatalogoFaturamento> {
    return this.httpClient.get<ContratoCatalogoFaturamento>(`${this.API_URL}contratoscatalogo/obtenha-faturamento-contrato-fornecedor/${idContratoCatalogoFaturamento}`);
  }

  obtenhaEstadoContratoPorId(idContratoCatalogoEstado: number): Observable<ContratoCatalogoEstado> {
    return this.httpClient.get<ContratoCatalogoEstado>(`${this.API_URL}contratoscatalogo/obtenha-estado-contrato-fornecedor/${idContratoCatalogoEstado}`);
  }

  aprovacaoItemContratoFornecedor(aprovacao: AprovacaoContratoCatalogoItemFornecedor, edicao: boolean): Observable<any> {
    return this.httpClient.post(`${this.API_URL}contratoscatalogo/aprovacao-item-contrato-fornecedor/${edicao}`,
      aprovacao,
    );
  }

  aprovacaoEstadoContratoFornecedor(aprovacao: AprovacaoContratoCatalogoEstadoFornecedor, edicao: boolean): Observable<any> {
    return this.httpClient.post(`${this.API_URL}contratoscatalogo/aprovacao-estado-contrato-fornecedor/${edicao}`,
      aprovacao,
    );
  }

   aprovacaoFaturamentoContratoFornecedor(aprovacao: AprovacaoContratoCatalogoFaturamentoFornecedor, edicao: boolean): Observable<any> {
    return this.httpClient.post(`${this.API_URL}contratoscatalogo/aprovacao-faturamento-contrato-fornecedor/${edicao}`,
      aprovacao,
    );
  }

  soliciteExclusaoCondicaoPagamento(idContratoCatalogo: number, idsContratoCatalogoCondicoesPagamentos: Array<number>): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}contratoscatalogo/solicite-exclusao-condicao-pagamento/${idContratoCatalogo}`,
      idsContratoCatalogoCondicoesPagamentos,
    );
  }

  soliciteExclusaoFaturamento(idContratoCatalogo: number, idsContratoCatalogoFaturamento: Array<number>): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}contratoscatalogo/solicite-exclusao-faturamento/${idContratoCatalogo}`,
      idsContratoCatalogoFaturamento,
    );
  }

  soliciteAlteracaoEncerramentoContrato(idContratoCatalogo: number, dataEncerramento: Date): Observable<number>{
    return this.httpClient.post<number>(`${this.API_URL}contratoscatalogo/solicite-alteracao-encerramento-contrato/${idContratoCatalogo}`,
      {'dataEncerramento': dataEncerramento}
    );
  }

  analiseAlteracaoEncerramentoContrato(idContratoCatalogo: number, analise: AnaliseAprovacaoCatalogo): Observable<number>{
    return this.httpClient.get<number>(`${this.API_URL}contratoscatalogo/analise-alteracao-encerramento-contrato/${idContratoCatalogo}/${analise} `,
    );
  }

  concluiEdicao(idContratoCatalogo: number): Observable<number>{
    return this.httpClient.get<number>(`${this.API_URL}contratoscatalogo/conclui-edicao-contrato-fornecedor/${idContratoCatalogo}`);
  }

  verifiqueAlteracaoContrato(idContratoCatalogo: number, isFornecedor: boolean): Observable<AlteracaoFornecedorContratoCatalogo>{
    return this.httpClient.get<AlteracaoFornecedorContratoCatalogo>(`${this.API_URL}contratoscatalogo/verifique-alteracao-contrato/${idContratoCatalogo}/${isFornecedor}`)
  }

  concluiAprovacaoContratoFornecedor(idContratoCatalogo: number): Observable<AprovacaoContratoFornecedorDto>{
    return this.httpClient.get<AprovacaoContratoFornecedorDto>(`${this.API_URL}contratoscatalogo/conclui-aprovacao-contrato-fornecedor/${idContratoCatalogo}`)
  }

  exporte(filtreContrato: ContratoCatalogoFiltro): Observable<any> {
    return this.httpClient
      .post(
        `${this.API_URL}contratoscatalogo/filtro/relatorio`,
        filtreContrato,
        { responseType: 'blob' })
      .pipe(catchError(this.errorService.parseErrorBlob));
  }

}

