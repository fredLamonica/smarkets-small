import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Departamento, Nivel, NivelParticipante, Paginacao } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AprovacaoNivelFiltro } from '../models/fltros/aprovacao-nivel-filtro';

@Injectable()
export class DepartamentoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obterPorId(idDepartamento: number): Observable<Departamento> {
    return this.httpClient.get<Departamento>(`${this.API_URL}departamentos/${idDepartamento}`);
  }

  inserir(departamento: Departamento): Observable<Departamento> {
    return this.httpClient.post<Departamento>(`${this.API_URL}departamentos`, departamento);
  }

  alterar(departamento: Departamento): Observable<Departamento> {
    return this.httpClient.put<Departamento>(`${this.API_URL}departamentos`, departamento);
  }

  listar(): Observable<Array<Departamento>> {
    return this.httpClient.get<Array<Departamento>>(`${this.API_URL}departamentos`);
  }

  deletar(idDepartamento: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}departamentos/${idDepartamento}`);
  }

  listarPorEmpresa(idPessoaJuridica: number): Observable<Array<Departamento>> {
    return this.httpClient.get<Array<Departamento>>(`${this.API_URL}departamentos/empresas/${idPessoaJuridica}`);
  }

  // #region Níveis

  filtrarNiveis(
    aprovacaoNivelFiltro: AprovacaoNivelFiltro,
  ): Observable<Paginacao<Nivel>> {
    return this.httpClient.post<Paginacao<Nivel>>(
      `${this.API_URL}departamentos/niveis/filtro`,
      aprovacaoNivelFiltro,
    );
  }

  deletaNiveisBatch(idDepartamento: number, niveis: Array<Nivel>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}departamentos/niveis`, niveis);
  }

  obterNivelPorId(idNivel: number): Observable<Nivel> {
    return this.httpClient.get<Nivel>(`${this.API_URL}departamentos/niveis/${idNivel}`);
  }

  inserirNivel(nivel: Nivel): Observable<Nivel> {
    return this.httpClient.post<Nivel>(`${this.API_URL}departamentos/niveis`, nivel);
  }

  alterarNivel(nivel: Nivel): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}departamentos/niveis`, nivel);
  }

  // #endregion

  // #region NivelParticipante

  filtrarNiveisParticipantes(
    aprovacaoNivelFiltro: AprovacaoNivelFiltro,
  ): Observable<Paginacao<NivelParticipante>> {
    return this.httpClient.post<Paginacao<NivelParticipante>>(
      `${this.API_URL}departamentos/niveis-participantes/filtro`,
      aprovacaoNivelFiltro,
    );
  }

  deletaNiveisParticipantesBatch(idDepartamento: number, niveisParticipantes: Array<NivelParticipante>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}departamentos/niveis-participantes`, niveisParticipantes);
  }

  inserirNivelParticipante(nivelParticipante: NivelParticipante): Observable<NivelParticipante> {
    return this.httpClient.post<NivelParticipante>(`${this.API_URL}departamentos/niveis-participantes`, nivelParticipante);
  }

  alterarNivelParticipante(nivelParticipante: NivelParticipante): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}departamentos/niveis-participantes`, nivelParticipante);
  }

  obterNivelParticipantePorId(idNivelParticipante: number): Observable<NivelParticipante> {
    return this.httpClient.get<NivelParticipante>(`${this.API_URL}departamentos/niveis-participantes/${idNivelParticipante}`);
  }

  obterNivelParticipantePorNivel(idNivel: number): Observable<Array<NivelParticipante>> {
    return this.httpClient.get<Array<NivelParticipante>>(`${this.API_URL}departamentos/niveis-participantes/nivel/${idNivel}`);
  }

  // #endregion

}
