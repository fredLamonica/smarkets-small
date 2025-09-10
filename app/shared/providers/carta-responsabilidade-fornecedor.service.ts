import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartaResponsabilidadeFornecedor, Paginacao, Usuario } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartaResponsabilidadeFornecedorFiltro } from '../models/fltros/carta-responsabilidade-fornecedor-filtro';

@Injectable({
  providedIn: 'root',
})
export class CartaResponsabilidadeFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obterPorId(idCartaResponsabilidadeFornecedor: number): Observable<CartaResponsabilidadeFornecedor> {
    return this.httpClient.get<CartaResponsabilidadeFornecedor>(`${this.API_URL}cartaresponsabilidadefornecedores/${idCartaResponsabilidadeFornecedor}`);
  }

  obterUsuariosGestoresParaDestinatario(idTenant: number): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}cartaresponsabilidadefornecedores/usuarios/destinatarios/${idTenant}`);
  }

  obterHistorico(cartaResponsabilidadeFornecedorFiltro: CartaResponsabilidadeFornecedorFiltro): Observable<Paginacao<CartaResponsabilidadeFornecedor>> {
    return this.httpClient.post<Paginacao<CartaResponsabilidadeFornecedor>>(
      `${this.API_URL}cartaresponsabilidadefornecedores/historico`,
      cartaResponsabilidadeFornecedorFiltro,
    );
  }

  inserir(cartaResponsabilidadeFornecedor: CartaResponsabilidadeFornecedor): Observable<CartaResponsabilidadeFornecedor> {
    return this.httpClient.post<CartaResponsabilidadeFornecedor>(`${this.API_URL}cartaresponsabilidadefornecedores`, cartaResponsabilidadeFornecedor);
  }

  alterar(cartaResponsabilidadeFornecedor: CartaResponsabilidadeFornecedor): Observable<CartaResponsabilidadeFornecedor> {
    return this.httpClient.put<CartaResponsabilidadeFornecedor>(`${this.API_URL}cartaresponsabilidadefornecedores`, cartaResponsabilidadeFornecedor);
  }

  excluir(idCartaResponsabilidadeFornecedor: number): Observable<CartaResponsabilidadeFornecedor> {
    return this.httpClient.delete<CartaResponsabilidadeFornecedor>(`${this.API_URL}cartaresponsabilidadefornecedores/${idCartaResponsabilidadeFornecedor}`);
  }
}
