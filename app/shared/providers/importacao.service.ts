import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo, Ordenacao, Paginacao } from '@shared/models';
import { ImportType } from '@shared/models/enums/ImportType.enum';
import { ImportGeneric } from '@shared/models/importGeneric';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Importacao } from '../models/importacao';

@Injectable({
  providedIn: 'root',
})
export class ImportacaoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  filtrarImportacoesSolicitacaoCompra(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    termo: string,
  ): Observable<Paginacao<ImportGeneric>> {
    const params = {
      itemOrdenar: itemOrdenar,
      ordenacao: ordenacao.toString(),
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      termo: termo,
    };

    return this.httpClient.get<Paginacao<ImportGeneric>>(
      `${this.API_URL}importacao/solicitacao-compra/filtrar`,
      { params: params },
    );
  }

  filterImportations(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    termo: string,
    type: ImportType,
    idTenantBuyer?: number,
  ): Observable<Paginacao<ImportGeneric>> {
    const params = {
      itemOrdenar: itemOrdenar,
      ordenacao: ordenacao.toString(),
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      termo: termo,
      type: type.toString(),
      idTenantBuyer: idTenantBuyer ? idTenantBuyer.toString() : '',
    };

    return this.httpClient.get<Paginacao<ImportGeneric>>(`${this.API_URL}importacao/filter`, {
      params: params,
    });
  }

  filtrarImportacaoPorTipo(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    termo: string,
    type: ImportType,
    idTenantBuyer?: number,
  ): Observable<Paginacao<Importacao>> {
    const params = {
      itemOrdenar: itemOrdenar,
      ordenacao: ordenacao.toString(),
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      termo: termo,
      type: type.toString(),
      idTenantBuyer: idTenantBuyer ? idTenantBuyer.toString() : '',
    };

    return this.httpClient.get<Paginacao<Importacao>>(`${this.API_URL}importacao/filtrarPorTipo`, {
      params: params,
    });
  }

  customerAddressImports(arquivo: Arquivo) {
    return this.httpClient.post(`${this.API_URL}importacao/customers-address`, arquivo);
  }

  getModelFile(type: ImportType): Observable<Arquivo> {
    return this.httpClient.get<Arquivo>(`${this.API_URL}importacao/models/${type}`);
  }

  importarSolicitacaoCompra(arquivo: Arquivo) {
    return this.httpClient.post(`${this.API_URL}importacao/solicitacao-compra`, arquivo);
  }

  importUsers(arquivo: Arquivo, idTenantBuyer: number) {
    const params = {
      file: arquivo,
      idTenantBuyer: idTenantBuyer,
    };
    return this.httpClient.post(`${this.API_URL}importacao/users`, params);
  }

  paymentTermsImport(arquivo: Arquivo, idTenantBuyer: number) {
    const params = {
      file: arquivo,
      idTenantBuyer: idTenantBuyer,
    };
    return this.httpClient.post(`${this.API_URL}importacao/payment-terms`, params);
  }

  importSuppliers(file: Arquivo, idTenantBuyer: number) {
    return this.httpClient.post(`${this.API_URL}importacao/suppliers-address`, {
      file: file,
      idTenantBuyer: idTenantBuyer,
    });
  }

  productContractImport(arquivo: Arquivo, idTenantBuyer: number) {
    const params = {
      file: arquivo,
      idTenantBuyer: idTenantBuyer,
    };
    return this.httpClient.post(`${this.API_URL}importacao/products-contracts`, params);
  }

  productIaImport(arquivo: Arquivo) {
    return this.httpClient.post(`${this.API_URL}importacao/products-ia`, arquivo);
  }

  precificationProductIaImport(arquivo: Arquivo) {
    return this.httpClient.post(`${this.API_URL}importacao/precification-products-ia`, arquivo);
  }

  importContractsInfo(arquivo: Arquivo, idTenantBuyer: number) {
    const params = {
      file: arquivo,
      idTenantBuyer: idTenantBuyer,
    };
    return this.httpClient.post(`${this.API_URL}importacao/contract-information`, params);
  }

  obterTiposImportacao() {
    return this.httpClient.get<Array<object>>(`${this.API_URL}importacao/import-types`);
  }

  importImages(arquivo: Arquivo, idTenantBuyer: number) {
    const params = {
      file: arquivo,
      idTenantBuyer: idTenantBuyer,
    };
    return this.httpClient.post(`${this.API_URL}importacao/upload-file-carga-imagem`, params);
  }

  downloadFileErro(idFile: number, descriptioFile: string): Observable<void> {
    return this.download(idFile).pipe(map((file) => this.createDownloadElement(file, descriptioFile)));
  }

  download(idImportacao: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}importacao/ArquivoErro/${idImportacao}`, { responseType: 'blob' });
  }

  createDownloadElement(file: any, nomeArquivo: string) {
    const newBlob = new Blob([file]);
    const data = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', nomeArquivo);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importCompanies(arquivo: Arquivo, idTenantBuyer: number) {
    const params = {
      file: arquivo,
      idTenantBuyer: idTenantBuyer,
    };
    return this.httpClient.post(`${this.API_URL}importacao/empresas`, params);
  }

  importeCatalogosFornecedor(arquivo: Arquivo) {
    const params = {
      file: arquivo,
    };
    return this.httpClient.post(`${this.API_URL}importacao/contratos-fornecedor`, params);
  }
}
