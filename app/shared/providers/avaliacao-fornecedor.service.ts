import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AvaliacaoFornecedor, DisparoAvaliacaoFornecedor, Paginacao, Usuario
} from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AvaliacaoFornecedorFiltro } from '../models/fltros/avaliacao-fornecedor-filtro';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obter(): Observable<Array<AvaliacaoFornecedor>> {
    return this.httpClient.get<Array<AvaliacaoFornecedor>>(`${this.API_URL}avaliacoesfornecedor`);
  }

  obterPorId(idAvaliacao: number): Observable<AvaliacaoFornecedor> {
    return this.httpClient.get<AvaliacaoFornecedor>(
      `${this.API_URL}avaliacoesfornecedor/${idAvaliacao}`,
    );
  }

  inserir(avaliacao: AvaliacaoFornecedor): Observable<AvaliacaoFornecedor> {
    return this.httpClient.post<AvaliacaoFornecedor>(
      `${this.API_URL}avaliacoesfornecedor`,
      avaliacao,
    );
  }

  alterar(idAvaliacao: AvaliacaoFornecedor): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}avaliacoesfornecedor`, idAvaliacao);
  }

  deletar(idAvaliacao: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}avaliacoesfornecedor/${idAvaliacao}`);
  }

  filtrar(
    avaliacaoFornecedorFiltro: AvaliacaoFornecedorFiltro,
  ): Observable<Paginacao<AvaliacaoFornecedor>> {
    return this.httpClient.post<Paginacao<AvaliacaoFornecedor>>(
      `${this.API_URL}avaliacoesfornecedor/filtro`,
      avaliacaoFornecedorFiltro,
    );
  }

  //#region disparos

  obterDisparos(idAvaliacao: number): Observable<Array<DisparoAvaliacaoFornecedor>> {
    return this.httpClient.get<Array<DisparoAvaliacaoFornecedor>>(
      `${this.API_URL}avaliacoesfornecedor/disparos/${idAvaliacao}`,
    );
  }

  disparar(disparo: DisparoAvaliacaoFornecedor): Observable<DisparoAvaliacaoFornecedor> {
    return this.httpClient.post<DisparoAvaliacaoFornecedor>(
      `${this.API_URL}avaliacoesfornecedor/disparos/`,
      disparo,
    );
  }

  obterUsuariosEmpresa(): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(
      `${this.API_URL}avaliacoesfornecedor/disparos/usuarios`,
    );
  }

  //#endregion
}
