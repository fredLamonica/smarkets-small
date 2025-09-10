import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Arquivo, CotacaoParticipante, CotacaoRodada, CotacaoRodadaProposta
} from '@shared/models';
import { CotacaoRodadaPropostaMotivoDesclassificacao } from '@shared/models/cotacao/cotacao-rodada-proposta-motivo-desclassificacao';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CotacaoRodadaPropostaDto } from '../models/dto/cotacao-rodada-proposta-dto';

@Injectable()
export class CotacaoRodadaService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obterRodadasPorCotacao(idCotacao: number): Observable<Array<CotacaoRodada>> {
    return this.httpClient.get<Array<CotacaoRodada>>(
      `${this.API_URL}cotacoesrodadas/cotacao/${idCotacao}`,
    );
  }

  obterRodadasPorItem(idCotacaoItem: number): Observable<Array<CotacaoRodada>> {
    return this.httpClient.get<Array<CotacaoRodada>>(
      `${this.API_URL}cotacoesrodadas/cotacaoitens/${idCotacaoItem}`,
    );
  }

  obterUltimosPrecosPorItem(idCotacaoItem: number): Observable<Array<CotacaoRodada>> {
    return this.httpClient.get<Array<CotacaoRodada>>(
      `${this.API_URL}cotacoesrodadas/cotacaoitens/ultimosprecos/${idCotacaoItem}`,
    );
  }

  obterPorIdCotacao(idCotacao: number): Observable<Array<CotacaoRodadaProposta>> {
    return this.httpClient.get<Array<CotacaoRodadaProposta>>(
      `${this.API_URL}cotacoesrodadas/propostasRodadaAtual/${idCotacao}`,
    );
  }

  GetParticipantesProximaRodada(idCotacao: number): Observable<Array<CotacaoParticipante>> {
    return this.httpClient.get<Array<CotacaoParticipante>>(
      `${this.API_URL}cotacoesrodadas/participantesProximaRodada/${idCotacao}`,
    );
  }

  criarRodada(cotacaoRodada: CotacaoRodada): Observable<CotacaoRodada> {
    return this.httpClient.post<CotacaoRodada>(`${this.API_URL}cotacoesrodadas`, cotacaoRodada);
  }

  alterarRodada(cotacaoRodada: CotacaoRodada): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}cotacoesrodadas`, cotacaoRodada);
  }

  prorrogar(rodadaAtual: CotacaoRodada): Observable<CotacaoRodada> {
    return this.httpClient.put<CotacaoRodada>(
      `${this.API_URL}cotacoesrodadas/prorrogar`,
      rodadaAtual,
    );
  }

  encerrarRodadaManual(
    idCotacaoRodada: number,
    motivoEncerramentoAntecipado: string,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}cotacoesrodadas/encerrar/${idCotacaoRodada}`,
      { motivoEncerramentoAntecipado: motivoEncerramentoAntecipado },
    );
  }

  finalizar(idCotacaoRodada: number): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}cotacoesrodadas/finalizadas/${idCotacaoRodada}`,
      null,
    );
  }

  inserirProposta(proposta: CotacaoRodadaPropostaDto): Observable<CotacaoRodadaPropostaDto> {
    return this.httpClient.post<CotacaoRodadaPropostaDto>(
      `${this.API_URL}cotacoesrodadas/proposta`,
      proposta,
    );
  }

  inserirPropostas(propostas: CotacaoRodadaPropostaDto[]): Observable<CotacaoRodadaPropostaDto[]> {
    return this.httpClient.post<CotacaoRodadaPropostaDto[]>(
      `${this.API_URL}cotacoesrodadas/propostas`,
      propostas,
    );
  }

  inserirMotivoDesclassificacao(
    motivoDesclassificacao: CotacaoRodadaPropostaMotivoDesclassificacao,
  ): Observable<CotacaoRodadaPropostaMotivoDesclassificacao> {
    return this.httpClient.post<CotacaoRodadaPropostaMotivoDesclassificacao>(
      `${this.API_URL}cotacoesrodadas/propostas/motivoDesclassificacao`,
      motivoDesclassificacao,
    );
  }

  desconsiderarProposta(
    idCotacaoRodadaProposta: number,
    desconsiderar: boolean,
  ): Observable<any> {
    return this.httpClient.put<any>(
      `${this.API_URL}cotacoesrodadas/propostas/${idCotacaoRodadaProposta}/desconsideracao`,
      desconsiderar,
    );
  }

  AlterarMotivoDesclassificacao(
    motivoDesclassificacao: CotacaoRodadaPropostaMotivoDesclassificacao,
  ): Observable<CotacaoRodadaPropostaMotivoDesclassificacao> {
    return this.httpClient.put<CotacaoRodadaPropostaMotivoDesclassificacao>(
      `${this.API_URL}cotacoesrodadas/propostas/motivoDesclassificacao`,
      motivoDesclassificacao,
    );
  }

  obterMotivoDesclassificacao(
    idCotacaoRodadaProposta: number,
  ): Observable<CotacaoRodadaPropostaMotivoDesclassificacao> {
    return this.httpClient.get<CotacaoRodadaPropostaMotivoDesclassificacao>(
      `${this.API_URL}cotacoesrodadas/propostas/motivoDesclassificacao//${idCotacaoRodadaProposta}`,
    );
  }

  alterarProposta(proposta: CotacaoRodadaPropostaDto): Observable<CotacaoRodadaPropostaDto> {
    return this.httpClient.put<CotacaoRodadaPropostaDto>(
      `${this.API_URL}cotacoesrodadas/propostas`,
      proposta,
    );
  }

  enviarPropostas(
    idCotacaoRodada: number,
    propostas: Array<CotacaoRodadaPropostaDto>,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}cotacoesrodadas/${idCotacaoRodada}/propostas/enviadas`,
      propostas,
    );
  }

  marcarPropostaVencedora(idCotacaoRodadaProposta: number): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}cotacoesrodadas/propostas/${idCotacaoRodadaProposta}/vencedores`,
      null,
    );
  }

  marcarPropostaVencedoraPacote(idCotacaoRodadaProposta: number): Observable<any> {
    return this.httpClient.put(
      `${this.API_URL}cotacoesrodadas/propostas/${idCotacaoRodadaProposta}/vencedores/pacotes`,
      null,
    );
  }

  marcarPropostaDesclassificada(idCotacaoPropostaItem: number): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}cotacoesrodadas/propostas/${idCotacaoPropostaItem}/desclassificados`,
      null,
    );
  }

  excluirArquivo(idArquivo: number, idCotacaoRodadaProposta: number): Observable<Arquivo> {
    return this.httpClient.delete<Arquivo>(
      `${this.API_URL}cotacoesrodadas/${idArquivo}/${idCotacaoRodadaProposta}`,
    );
  }

  permitirReenviarProposta(
    idCotacaoRodada: number,
    listaParticipantes: Array<CotacaoParticipante>,
    isPermitirReenviarProposta: boolean,
  ): Observable<any> {
    return this.httpClient.put<any>(
      `${this.API_URL}cotacoesrodadas/permitirReenviarProposta/${idCotacaoRodada}/${isPermitirReenviarProposta}`,
      listaParticipantes,
    );
  }

  obterPermissaoReenvioProposta(
    idCotacaoRodada: number,
    idCotacaoParticipante: number,
  ): Observable<any> {
    return this.httpClient.get<any>(
      `${this.API_URL}cotacoesrodadas/obterPermissaoReenvioProposta/${idCotacaoRodada}/${idCotacaoParticipante}`,
    );
  }

  salvarTodasPropostas(proposta: Array<CotacaoRodadaProposta>): Observable<number> {
    return this.httpClient.post<any>(`${this.API_URL}cotacoesrodadas/propostas/salvarTodas`, proposta);
  }

  reenviarPropostas(
    idCotacaoRodada: number,
    propostas: Array<CotacaoRodadaPropostaDto>,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}cotacoesrodadas/${idCotacaoRodada}/propostas/reenviadas`,
      propostas,
    );
  }

  visualizarBtnPermitirAlterar(idCotacaoRodada: number): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.API_URL}cotacoesrodadas/verificarPermissaoVisualizarBtnPermitirAlterarProposta/${idCotacaoRodada}`,
    );
  }

  buscarParticipantesPropostaNaoAutoriazadosAlteracao(
    idCotacaoRodada: number,
  ): Observable<Array<CotacaoParticipante>> {
    return this.httpClient.get<Array<CotacaoParticipante>>(
      `${this.API_URL}cotacoesrodadas/proposta/participantesNaoAutoriazadosAlteracao/${idCotacaoRodada}`,
    );
  }
}
