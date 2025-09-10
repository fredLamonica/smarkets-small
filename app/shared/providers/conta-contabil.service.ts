import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ContaContabil, Paginacao } from '@shared/models';
import { ContaContabilDto } from '../models/dto/conta-contabil-dto';
import { ContaContabilFiltro } from '../models/fltros/conta-contabil-filtro';
import { UtilitiesService } from '../utils/utilities.service';

@Injectable()
export class ContaContabilService {

  private API_URL: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private utilitiesService: UtilitiesService,
  ) { }

  filtrar(
    contaContabilFiltro: ContaContabilFiltro,
  ): Observable<Paginacao<ContaContabil>> {
    return this.httpClient.post<Paginacao<ContaContabil>>(
      `${this.API_URL}contascontabeis/filtro`,
      contaContabilFiltro,
    );
  }

  obterPorId(idContaContabil: number): Observable<ContaContabil> {
    return this.httpClient.get<ContaContabil>(`${this.API_URL}contascontabeis/${idContaContabil}`);
  }

  inserir(contaContabil: ContaContabil): Observable<ContaContabil> {
    return this.httpClient.post<ContaContabil>(`${this.API_URL}contascontabeis`, contaContabil);
  }

  alterar(contaContabil: ContaContabil): Observable<ContaContabil> {
    return this.httpClient.put<ContaContabil>(`${this.API_URL}contascontabeis`, contaContabil);
  }

  excluir(idContaContabil: number): Observable<ContaContabil> {
    return this.httpClient.delete<ContaContabil>(`${this.API_URL}contascontabeis/${idContaContabil}`);
  }

  listar(): Observable<Array<ContaContabil>> {
    return this.httpClient.get<Array<ContaContabil>>(`${this.API_URL}contascontabeis`);
  }

  listarContasPai(
    contaContabilFiltro: ContaContabilFiltro,
  ): Observable<Paginacao<ContaContabilDto>> {
    return this.httpClient.post<Paginacao<ContaContabilDto>>(
      `${this.API_URL}contascontabeis/lista/pai`,
      contaContabilFiltro,
    );
  }

  listarHolding(): Observable<Array<ContaContabil>> {
    return this.httpClient.get<Array<ContaContabil>>(`${this.API_URL}contascontabeis/holding`);
  }

  //#region Produto e Conta Contábil
  listarContasDisponiveisProduto(idProduto: number): Observable<Array<ContaContabil>> {
    return this.httpClient.get<Array<ContaContabil>>(`${this.API_URL}contascontabeis/${idProduto}/produtos`);
  }
  //#endregion
}
