import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TipoPedido } from '@shared/models/tipo-pedido';
import { Paginacao } from '@shared/models';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class TipoPedidoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public filtrar(
    itensPorPagina: number,
    pagina: number,
    termo: string
  ): Observable<Paginacao<TipoPedido>> {
    return this.httpClient.get<Paginacao<TipoPedido>>(`${this.API_URL}tipospedido/filtro`, {
      params: {
        itensPorPagina: itensPorPagina.toString(),
        pagina: pagina.toString(),
        termo: termo
      }
    });
  }

  public obterPorId(idTipoPedido: number): Observable<TipoPedido> {
    return this.httpClient.get<TipoPedido>(`${this.API_URL}tipospedido/${idTipoPedido}`);
  }

  public inserir(tipoPedido: TipoPedido): Observable<TipoPedido> {
    return this.httpClient.post<TipoPedido>(`${this.API_URL}tipospedido`, tipoPedido);
  }

  public alterar(tipoPedido: TipoPedido): Observable<TipoPedido> {
    return this.httpClient.put<TipoPedido>(`${this.API_URL}tipospedido`, tipoPedido);
  }

  public excluir(idTipoPedido: number): Observable<TipoPedido> {
    return this.httpClient.delete<TipoPedido>(`${this.API_URL}tipospedido/${idTipoPedido}`);
  }

  public listar(): Observable<Array<TipoPedido>> {
    return this.httpClient.get<Array<TipoPedido>>(`${this.API_URL}tipospedido`);
  }
}
