import {
  SolicitacaoDocumentoFornecedorArquivo,
  SolicitacaoDocumentoFornecedorValidacao,
} from '@shared/models';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SolicitacaoDocumentoFornecedorValidacaoDto } from '@shared/models/dto/solicitacao-documento-fornecedor-validacao-dto';
import { SolicitacaoDocumentoFornecedorArquivoDTO } from '@shared/models/dto/solicitacao-documento-fornecedor-arquivo-dto';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoDocumentoFornecedorArquivoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public listar(): Observable<Array<SolicitacaoDocumentoFornecedorArquivo>> {
    return this.httpClient.get<Array<SolicitacaoDocumentoFornecedorArquivo>>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo`
    );
  }

  public obterPorId(
    idSolicitacaoDocumentoFornecedorArquivo: number
  ): Observable<SolicitacaoDocumentoFornecedorArquivo> {
    return this.httpClient.get<SolicitacaoDocumentoFornecedorArquivo>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo/${idSolicitacaoDocumentoFornecedorArquivo}`
    );
  } 

  public obterDocumentos(
    idPessoaJuridicaFornecedor: number
  ): Observable<Array<SolicitacaoDocumentoFornecedorArquivo>>{
    return this.httpClient.get<Array<SolicitacaoDocumentoFornecedorArquivo>>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo/fornecedor/${idPessoaJuridicaFornecedor}`
    );
  }

  public obterHistorico(
    idPessoaJuridicaFornecedor: number,
    idDocumentoFornecedor: number
  ): Observable<Array<SolicitacaoDocumentoFornecedorArquivo>> {
    return this.httpClient.get<Array<SolicitacaoDocumentoFornecedorArquivo>>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo/pessoajuridicafornecedor/${idPessoaJuridicaFornecedor}/historico/solicitacaoDocumento/${idDocumentoFornecedor}`
    );
  }

  public obterHistoricoDto(
    idPessoaJuridicaFornecedor: number,
    idDocumentoFornecedor: number
  ): Observable<SolicitacaoDocumentoFornecedorArquivoDTO> {
    return this.httpClient.get<SolicitacaoDocumentoFornecedorArquivoDTO>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo/pessoajuridicafornecedor/${idPessoaJuridicaFornecedor}/historico/solicitacaoDocumentoDto/${idDocumentoFornecedor}`
    );
  }

  public inserir(
    solicitacaoDocumentoArquivo: SolicitacaoDocumentoFornecedorArquivo
  ): Observable<SolicitacaoDocumentoFornecedorArquivo> {
    return this.httpClient.post<SolicitacaoDocumentoFornecedorArquivo>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo`,
      solicitacaoDocumentoArquivo
    );
  }

  public alterarVigencia(
    solicitacaoDocumentoArquivo: SolicitacaoDocumentoFornecedorArquivo
  ): Observable<SolicitacaoDocumentoFornecedorArquivo> {
    return this.httpClient.put<SolicitacaoDocumentoFornecedorArquivo>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo/alterarVigencia`,
      solicitacaoDocumentoArquivo
    );
  }

  public excluir(
    idSolicitacaoDocumentoFornecedorArquivo: number
  ): Observable<SolicitacaoDocumentoFornecedorArquivo> {
    return this.httpClient.delete<SolicitacaoDocumentoFornecedorArquivo>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo/${idSolicitacaoDocumentoFornecedorArquivo}`
    );
  }

  public inserirValidacao(
    solicitacaoDocumentoFornecedorValidacaoDto: SolicitacaoDocumentoFornecedorValidacaoDto
  ): Observable<SolicitacaoDocumentoFornecedorValidacao> {
    return this.httpClient.post<SolicitacaoDocumentoFornecedorValidacao>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo/validacao`,
      solicitacaoDocumentoFornecedorValidacaoDto
    );
  }

  public alterarValidacao(
    solicitacaoDocumentoFornecedorValidacao: SolicitacaoDocumentoFornecedorValidacao
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}solicitacaodocumentofornecedorarquivo/validacao`,
      solicitacaoDocumentoFornecedorValidacao
    );
  }

  public baixarZipDocumentos(idPessoaJuridicaFornecedor: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.API_URL}solicitacaodocumentofornecedorarquivo/zipdocumentos/${idPessoaJuridicaFornecedor}`,
        {
          responseType: 'blob'
        }
      )
      .pipe(catchError(this.parseErrorBlob));
  }

  public parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    const reader: FileReader = new FileReader();
    const obs = new Observable((observer: any) => {
      reader.onloadend = e => {
        const messageObject = reader.result as string;
        observer.error({
          error: messageObject
        });
        observer.complete();
      };
    });
    reader.readAsText(err.error);
    return obs;
  }
}
