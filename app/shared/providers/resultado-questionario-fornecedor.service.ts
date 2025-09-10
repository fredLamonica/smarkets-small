import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoQuestionarioFornecedor } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class ResultadoQuestionarioFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public obter(idPessoaJuridica): Observable<Array<ResultadoQuestionarioFornecedor>> {
    return this.httpClient.get<Array<ResultadoQuestionarioFornecedor>>(
      `${this.API_URL}resultadosquestionariosfornecedor/pj/${idPessoaJuridica}`
    );
  }

  public obterPorId(idResultado): Observable<ResultadoQuestionarioFornecedor> {
    return this.httpClient.get<ResultadoQuestionarioFornecedor>(
      `${this.API_URL}resultadosquestionariosfornecedor/${idResultado}`
    );
  }

  public inserir(
    resultado: ResultadoQuestionarioFornecedor
  ): Observable<ResultadoQuestionarioFornecedor> {
    return this.httpClient.post<ResultadoQuestionarioFornecedor>(
      `${this.API_URL}resultadosquestionariosfornecedor`,
      resultado
    );
  }

  public alterar(resultado: ResultadoQuestionarioFornecedor): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}resultadosquestionariosfornecedor`,
      resultado
    );
  }

  public deletar(idResultado): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}resultadosquestionariosfornecedor/${idResultado}`
    );
  }
}
