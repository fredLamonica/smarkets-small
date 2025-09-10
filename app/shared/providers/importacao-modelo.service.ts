import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo, Ordenacao, Paginacao } from '@shared/models';
import { ImportType } from '@shared/models/enums/ImportType.enum';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../../shared/utils/error.service';
import { ImportacaoModelo } from '../models/importacao-modelo';
import { ArquivoService } from './arquivo.service';

@Injectable({
  providedIn: 'root',
})
export class ImportacaoModeloService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient,
    private errorServie: ErrorService,
    private arquivoService: ArquivoService) {
  }

  filtrarImportacoes(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    termo: string,
    type: ImportType,
    idTenantBuyer?: number,
  ): Observable<Paginacao<ImportacaoModelo>> {
    const params = {
      itemOrdenar: itemOrdenar,
      ordenacao: ordenacao.toString(),
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      termo: termo,
      type: type ? type.toString() : '0',
      idTenantBuyer: idTenantBuyer ? idTenantBuyer.toString() : '',
    };

    return this.httpClient.get<Paginacao<ImportacaoModelo>>(`${this.API_URL}importacaoModelo/filtrar`, {
      params: params,
    });
  }
  getModelFile(type: ImportType): Observable<Arquivo> {
    return this.httpClient.get<Arquivo>(`${this.API_URL}importacaoModelo/models/${type}`);
  }
  uploadModelo(arquivo: Arquivo, importType: ImportType, motivo: string, idTenantBuyer: number) {
    const params = {
      Nome: arquivo.nome,
      TipoImportacao: importType,
      Versao: 0,
      Motivo: motivo,
      Url: arquivo.url,
      usuario: idTenantBuyer,
    };
    return this.httpClient.post(`${this.API_URL}importacaoModelo`, params);
  }

  ativarModelo(idModelo: number, tipoImportacao: ImportType) {
    const params = {
      IdModelo: idModelo,
      TipoImportacao: tipoImportacao,
    };
    return this.httpClient.put(`${this.API_URL}importacaoModelo/ativar`, params);
  }

  excluirModelo(idModelo: number) {
    return this.httpClient.delete(`${this.API_URL}importacaoModelo/deletar?idModelo=${idModelo}`);
  }

  baixarModelo(idModelo: number, nomeArquivo: string): Observable<void> {
    return this.baixar(idModelo).pipe(map((file) => this.arquivoService.createDownloadElement(file, nomeArquivo)));
  }

  baixar(idModelo: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}importacaoModelo/${idModelo}`, { responseType: 'blob' }).pipe(catchError(this.errorServie.parseErrorBlob));
  }

  baixarAtivoPorTipo(tipoImportacao: ImportType): Observable<any> {
    return this.httpClient.get(`${this.API_URL}importacaoModelo/baixarModelo/${tipoImportacao}`, { responseType: 'blob' }).pipe(catchError(this.errorServie.parseErrorBlob));
  }

  baixarModeloAtivoPorTipo(tipoImportacao: ImportType): Observable<void> {
    return this.baixarAtivoPorTipo(tipoImportacao).pipe(map((file) => this.arquivoService.createDownloadElement(file, this.getFileName(tipoImportacao))));
  }

  getFileName(tipoImportacao: ImportType): string {
    const indexOfS = Object.values(ImportType).indexOf(tipoImportacao as unknown as ImportType);
    const key = Object.keys(ImportType)[indexOfS];
    return `Carga de ${key}.xlsx`;
  }
}
