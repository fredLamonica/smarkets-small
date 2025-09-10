import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Paginacao,
  Ordenacao,
  AcaoFornecedor,
  PlanoAcaoFornecedor,
  AcaoFornecedorComentario
} from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class PlanoAcaoFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public obterPorId(idPlanoAcao: number): Observable<PlanoAcaoFornecedor> {
    return this.httpClient.get<PlanoAcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/${idPlanoAcao}`
    );
  }

  public listarPorIdFornecedor(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    idFornecedor: number
  ): Observable<Paginacao<PlanoAcaoFornecedor>> {
    return this.httpClient.get<Paginacao<PlanoAcaoFornecedor>>(
      `${this.API_URL}planosacoesfornecedores/fornecedores`,
      {
        params: {
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          ordenarPor: ordenarPor,
          ordenacao: ordenacao.toString(),
          idFornecedor: idFornecedor.toString()
        }
      }
    );
  }

  public listarPorIdPessoaJuridica(idPessoaJuridica): Observable<Array<PlanoAcaoFornecedor>> {
    return this.httpClient.get<Array<PlanoAcaoFornecedor>>(
      `${this.API_URL}planosacoesfornecedores/pessoasjuridicas/${idPessoaJuridica}`
    );
  }

  public obterPorIdComComentariosAnexos(idPlanoAcaoFornecedor): Observable<PlanoAcaoFornecedor> {
    return this.httpClient.get<PlanoAcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/anexos/${idPlanoAcaoFornecedor}`
    );
  }

  public obterMetaPorId(idAcao: number): Observable<AcaoFornecedor> {
    return this.httpClient.get<AcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/acoes/${idAcao}`
    );
  }

  public inserir(planoAcaoFornecedor: PlanoAcaoFornecedor): Observable<PlanoAcaoFornecedor> {
    return this.httpClient.post<PlanoAcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores`,
      planoAcaoFornecedor
    );
  }

  public inserirAcao(acao: AcaoFornecedor): Observable<AcaoFornecedor> {
    return this.httpClient.post<AcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/acoes`,
      acao
    );
  }

  public alterar(planoAcaoFornecedor: PlanoAcaoFornecedor): Observable<PlanoAcaoFornecedor> {
    return this.httpClient.put<PlanoAcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores`,
      planoAcaoFornecedor
    );
  }

  public alterarAcao(acao: AcaoFornecedor): Observable<AcaoFornecedor> {
    return this.httpClient.put<AcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/acoes`,
      acao
    );
  }

  public excluir(idPlanoAcao: number): Observable<PlanoAcaoFornecedor> {
    return this.httpClient.delete<PlanoAcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/${idPlanoAcao}`
    );
  }

  public excluirAcao(idMeta: number): Observable<AcaoFornecedor> {
    return this.httpClient.delete<AcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/acoes/${idMeta}`
    );
  }

  public comentarAcao(
    idAcaoFornecedor: number,
    comentario: AcaoFornecedorComentario
  ): Observable<AcaoFornecedorComentario> {
    return this.httpClient.post<AcaoFornecedorComentario>(
      `${this.API_URL}planosacoesfornecedores/acao/comentar`,
      comentario
    );
  }

  public alterarComentario(
    idComentario: number,
    comentario: string
  ): Observable<AcaoFornecedorComentario> {
    return this.httpClient.put<AcaoFornecedorComentario>(
      `${this.API_URL}planosacoesfornecedores/comentarios/${idComentario}`,
      { comentario: comentario }
    );
  }

  public deletarComentario(
    acaoFornecedorComentario: AcaoFornecedorComentario
  ): Observable<AcaoFornecedorComentario> {
    return this.httpClient.post<AcaoFornecedorComentario>(
      `${this.API_URL}planosacoesfornecedores/comentarios/deletar`,
      acaoFornecedorComentario
    );
  }

  public obterComentariosPorIdAcaoFornecedor(
    idAcaoFornecedor: number
  ): Observable<Array<AcaoFornecedorComentario>> {
    return this.httpClient.get<Array<AcaoFornecedorComentario>>(
      `${this.API_URL}planosacoesfornecedores/acoes/${idAcaoFornecedor}/comentarios`
    );
  }

  public atualizarAnexos(
    planoAcaoFornecedor: PlanoAcaoFornecedor
  ): Observable<PlanoAcaoFornecedor> {
    return this.httpClient.put<PlanoAcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/anexos`,
      planoAcaoFornecedor
    );
  }
  public obterPorIdTenant(): Observable<Array<PlanoAcaoFornecedor>> {
    return this.httpClient.get<Array<PlanoAcaoFornecedor>>(
      `${this.API_URL}planosacoesfornecedores/tenant`
    );
  }

  public avaliarAcao(acaoFornecedor: AcaoFornecedor): Observable<AcaoFornecedor> {
    return this.httpClient.put<AcaoFornecedor>(
      `${this.API_URL}planosacoesfornecedores/notasacoes`,
      acaoFornecedor
    );
  }

  public obterFiltro(termo: string): Observable<Array<PlanoAcaoFornecedor>> {
    return this.httpClient.get<Array<PlanoAcaoFornecedor>>(
      `${this.API_URL}planosacoesfornecedores/filtro`,
      {
        params: {
          termo: termo
        }
      }
    );
  }

  public obterFiltroAvancado(
    termoFornecedor: string,
    termoPlanodeAcao: string,
    termoStatus: string,
    termoPrazo: string
  ): Observable<Array<PlanoAcaoFornecedor>> {
    return this.httpClient.get<Array<PlanoAcaoFornecedor>>(
      `${this.API_URL}planosacoesfornecedores/filtroAvancado`,
      {
        params: {
          termoFornecedor: termoFornecedor,
          termoPlanodeAcao: termoPlanodeAcao,
          termoStatus: termoStatus,
          termoPrazo: termoPrazo
        }
      }
    );
  }
}
