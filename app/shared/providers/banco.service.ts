import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Banco, Paginacao } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BancoFiltro } from '../models/fltros/banco-filtro';

@Injectable()
export class BancoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  listar(): Observable<Array<Banco>> {
    return this.httpClient.get<Array<Banco>>(`${this.API_URL}bancos`);
  }

  filtrar(bancoFiltro: BancoFiltro): Observable<Paginacao<Banco>> {
    return this.httpClient.post<Paginacao<Banco>>(
      `${this.API_URL}bancos/filtro`,
      bancoFiltro,
    );
  }

  obterPorId(idBanco: number): Observable<Banco> {
    return this.httpClient.get<Banco>(`${this.API_URL}bancos/${idBanco}`);
  }

  inserir(banco: Banco): Observable<Banco> {
    return this.httpClient.post<Banco>(`${this.API_URL}bancos`, banco);
  }

  alterar(banco: Banco): Observable<Banco> {
    return this.httpClient.put<Banco>(`${this.API_URL}bancos`, banco);
  }

  excluir(idBanco: number): Observable<Banco> {
    return this.httpClient.delete<Banco>(`${this.API_URL}bancos/${idBanco}`);
  }
}
