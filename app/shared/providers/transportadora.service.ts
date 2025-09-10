import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ordenacao, Paginacao } from '@shared/models';
import { Transportadora } from '@shared/models/transportadora';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TransportadoraService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public listar(): Observable<Array<Transportadora>> {
    return this.httpClient.get<Array<Transportadora>>(`${this.API_URL}transportadoras`);
  }

  public obterPorId(idTransportadora: number): Observable<Transportadora> {
    return this.httpClient.get<Transportadora>(
      `${this.API_URL}transportadoras/${idTransportadora}`
    );
  }

  public filtrar(
    itensPorPagina: number,
    pagina: number,
    itemOrdenacao: string,
    ordenacao: Ordenacao,
    termo: string
  ): Observable<Paginacao<Transportadora>> {
    return this.httpClient.get<Paginacao<Transportadora>>(`${this.API_URL}transportadoras/filtro`, {
      params: {
        itensPorPagina: itensPorPagina.toString(),
        pagina: pagina.toString(),
        ordenarPor: itemOrdenacao,
        ordenacao: ordenacao.toString(),
        termo: termo
      }
    });
  }

  public inserir(transportadora: Transportadora): Observable<Transportadora> {
    return this.httpClient.post<Transportadora>(`${this.API_URL}transportadoras`, transportadora);
  }

  public alterar(transportadora: Transportadora): Observable<Transportadora> {
    return this.httpClient.put<Transportadora>(`${this.API_URL}transportadoras`, transportadora);
  }

  public excluir(idTransportadora: number, idPessoaJuridica: number): Observable<Transportadora> {
    return this.httpClient.delete<Transportadora>(
      `${this.API_URL}transportadoras/${idTransportadora}/${idPessoaJuridica}`
    );
  }
}
