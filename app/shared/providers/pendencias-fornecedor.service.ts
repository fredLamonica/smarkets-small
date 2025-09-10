import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PendenciasFornecedor, Paginacao, Ordenacao } from '@shared/models';

@Injectable()
export class PendenciasFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public inserir(pendenciaFornecedor: PendenciasFornecedor): Observable<PendenciasFornecedor> {
    return this.httpClient.post<PendenciasFornecedor>(
      `${this.API_URL}pendencia-fornecedor`,
      pendenciaFornecedor
    );
  }

  public obterPorIdTenant() {
    return this.httpClient.get<Array<PendenciasFornecedor>>(`${this.API_URL}pendencia-fornecedor/`);
  }

  public obterPorIdPessoaJuridica(idPessoaJuridica: number) {
    return this.httpClient.get<Array<PendenciasFornecedor>>(
      `${this.API_URL}pendencia-fornecedor/idPessoaJuridica/${idPessoaJuridica}`
    );
  }

  public ObterPorIdFornecedor(idFornecedor: number) {
    return this.httpClient.get<Array<PendenciasFornecedor>>(
      `${this.API_URL}pendencia-fornecedor/${idFornecedor}`
    );
  }

  public deletar(idPendenciaFornecedor: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}pendencia-fornecedor/${idPendenciaFornecedor}`
    );
  }

  public alterar(pendenciaFornecedor: PendenciasFornecedor): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}pendencia-fornecedor/`, pendenciaFornecedor);
  }

  public obterFiltro(
    ordenarPor: string,
    ordenacao: Ordenacao,
    registrosPorPagina: number,
    pagina: number,
    termo: string
  ): Observable<Paginacao<PendenciasFornecedor>> {
    return this.httpClient.get<Paginacao<PendenciasFornecedor>>(
      `${this.API_URL}pendencia-fornecedor/filtro`,
      {
        params: {
          ordenarPor: ordenarPor,
          ordenacao: ordenacao.toString(),
          registrosPorPagina: registrosPorPagina.toString(),
          pagina: pagina.toString(),
          termo: termo
        }
      }
    );
  }

  public obterFiltroAvancado(
    ordenarPor: string,
    ordenacao: Ordenacao,
    registrosPorPagina: number,
    pagina: number,
    termoFornecedor: string,
    termoTipoPendencia: string,
    termoDescricao: string,
    termoDataCriacao: string,
    termoResponsavel: string,
    termoStatus: string
  ): Observable<Paginacao<PendenciasFornecedor>> {
    return this.httpClient.get<Paginacao<PendenciasFornecedor>>(
      `${this.API_URL}pendencia-fornecedor/filtroAvancado`,
      {
        params: {
          ordenarPor: ordenarPor,
          ordenacao: ordenacao.toString(),
          registrosPorPagina: registrosPorPagina.toString(),
          pagina: pagina.toString(),
          termoFornecedor: termoFornecedor,
          termoTipoPendencia: termoTipoPendencia,
          termoDescricao: termoDescricao,
          termoDataCriacao: termoDataCriacao,
          termoResponsavel: termoResponsavel,
          termoStatus: termoStatus
        }
      }
    );
  }
}
