import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Cnae, Paginacao } from '@shared/models';
import { CnaeFiltro } from '../models/fltros/cnae-filtro';

@Injectable()
export class CnaeService {
  z;
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  inserir(cnae: Cnae): Observable<Cnae> {
    return this.httpClient.post<Cnae>(`${this.API_URL}cnaes`, cnae);
  }

  obterPorId(idCnae: number): Observable<Cnae> {
    return this.httpClient.get<Cnae>(`${this.API_URL}cnaes/${idCnae}`);
  }

  listar(): Observable<Array<Cnae>> {
    return this.httpClient.get<Array<Cnae>>(`${this.API_URL}cnaes`);
  }

  filtrar(
    cnaeFiltro: CnaeFiltro,
  ): Observable<Paginacao<Cnae>> {
    return this.httpClient.post<Paginacao<Cnae>>(
      `${this.API_URL}cnaes/filtro`,
      cnaeFiltro,
    );
  }

  inserirCnaePessoa(idCnae: Number, idPessoa: Number): Observable<Cnae> {
    return this.httpClient.post<Cnae>(`${this.API_URL}cnaes/pessoa/${idPessoa}/${idCnae}`, {});
  }

  obterCnaesPessoa(idPessoaJuridica: Number): Observable<Array<Cnae>> {
    return this.httpClient.get<Array<Cnae>>(`${this.API_URL}cnaes/pessoa/${idPessoaJuridica}`);
  }

  deletarCnae(idCnae: Number): Observable<Cnae> {
    return this.httpClient.delete<Cnae>(`${this.API_URL}cnaes/pessoa/${idCnae}`);
  }
}
