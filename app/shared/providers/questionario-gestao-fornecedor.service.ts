import { Injectable } from '@angular/core';
import { QuestionarioGestaoFornecedor } from '@shared/models/questionario-gestao-fornecedor';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  ResultadoQuestionarioFornecedor,
  Paginacao,
  Ordenacao,
  QuestionarioGestaoFornecedorCriterioAvaliacao,
  Situacao
} from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class QuestionarioGestaoFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public obter(): Observable<QuestionarioGestaoFornecedor[]> {
    return this.httpClient.get<QuestionarioGestaoFornecedor[]>(
      `${this.API_URL}questionariosgestaofornecedor`
    );
  }

  public obterPorId(idQuestionario: number): Observable<QuestionarioGestaoFornecedor> {
    return this.httpClient.get<QuestionarioGestaoFornecedor>(
      `${this.API_URL}questionariosgestaofornecedor/${idQuestionario}`
    );
  }

  public obterResultados(): Observable<ResultadoQuestionarioFornecedor[]> {
    return this.httpClient.get<ResultadoQuestionarioFornecedor[]>(
      `${this.API_URL}questionariosgestaofornecedor/resultados`
    );
  }

  public inserir(
    questionario: QuestionarioGestaoFornecedor
  ): Observable<QuestionarioGestaoFornecedor> {
    return this.httpClient.post<QuestionarioGestaoFornecedor>(
      `${this.API_URL}questionariosgestaofornecedor`,
      questionario
    );
  }

  public alterar(
    questionario: QuestionarioGestaoFornecedor
  ): Observable<QuestionarioGestaoFornecedor> {
    return this.httpClient.put<QuestionarioGestaoFornecedor>(
      `${this.API_URL}questionariosgestaofornecedor`,
      questionario
    );
  }

  public deletar(idQuestionario: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}questionariosgestaofornecedor/${idQuestionario}`
    );
  }

  public filtrar(
    itensPorPagina: number,
    pagina: number,
    itemOrdenacao: string,
    termo: string
  ): Observable<Paginacao<QuestionarioGestaoFornecedor>> {
    return this.httpClient.get<Paginacao<QuestionarioGestaoFornecedor>>(
      `${this.API_URL}questionariosgestaofornecedor/filtro`,
      {
        params: {
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          itemOrdenacao: itemOrdenacao,
          termo: termo
        }
      }
    );
  }

  public inserirCriterioAvaliacao(
    criterio: QuestionarioGestaoFornecedorCriterioAvaliacao
  ): Observable<QuestionarioGestaoFornecedorCriterioAvaliacao> {
    return this.httpClient.post<QuestionarioGestaoFornecedorCriterioAvaliacao>(
      `${this.API_URL}questionariosgestaofornecedor/criterioavaliacao`,
      criterio
    );
  }

  public filtrarCriterioAvaliacao(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    idQuestionarioGestaoFornecedor: number
  ): Observable<Paginacao<QuestionarioGestaoFornecedorCriterioAvaliacao>> {
    return this.httpClient.get<Paginacao<QuestionarioGestaoFornecedorCriterioAvaliacao>>(
      `${this.API_URL}questionariosgestaofornecedor/${idQuestionarioGestaoFornecedor}/criterioavaliacao/filtro`,
      {
        params: {
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          ordenarPor: ordenarPor,
          ordenacao: ordenacao.toString()
        }
      }
    );
  }

  public deletarCriterioAvaliacaoBatch(
    criterios: Array<QuestionarioGestaoFornecedorCriterioAvaliacao>
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}questionariosgestaofornecedor/criterioavaliacao`,
      criterios
    );
  }

  public alterarSituacaoCriterioAvaliacaoBatch(
    criterios: Array<QuestionarioGestaoFornecedorCriterioAvaliacao>,
    situacao: Situacao
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}questionariosgestaofornecedor/criterioavaliacao/situacao/${situacao}`,
      criterios
    );
  }
}
