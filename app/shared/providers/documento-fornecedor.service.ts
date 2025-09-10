import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentoFornecedor, Paginacao } from '@shared/models';
import { DocumentoFornecedorDto } from '@shared/models/dto/documento-fornecedor-dto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentoFornecedorFiltro } from '../models/fltros/documento-fornecedor-filtro';

@Injectable({
  providedIn: 'root',
})
export class DocumentoFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  inserir(documentoFornecedor: DocumentoFornecedor): Observable<DocumentoFornecedor> {
    return this.httpClient.post<DocumentoFornecedor>(
      `${this.API_URL}documentosfornecedor`,
      documentoFornecedor,
    );
  }

  inserirDocumentoTenant(
    documentoFornecedorDto: DocumentoFornecedorDto,
  ): Observable<DocumentoFornecedorDto> {
    return this.httpClient.post<DocumentoFornecedorDto>(
      `${this.API_URL}documentosfornecedor/documentostenant`,
      documentoFornecedorDto,
    );
  }

  inserirDocumentoVinculo(
    idsDocumentosFornecedor: Array<number>,
  ): Observable<DocumentoFornecedorDto> {
    return this.httpClient.post<DocumentoFornecedorDto>(
      `${this.API_URL}documentosfornecedor/documentostenant/vinculo`,
      idsDocumentosFornecedor,
    );
  }

  alterar(documentoFornecedor: DocumentoFornecedor): Observable<DocumentoFornecedor> {
    return this.httpClient.put<DocumentoFornecedor>(
      `${this.API_URL}documentosfornecedor`,
      documentoFornecedor,
    );
  }

  alterarDocumentoTenant(
    documentoFornecedorDto: DocumentoFornecedorDto,
  ): Observable<DocumentoFornecedorDto> {
    return this.httpClient.put<DocumentoFornecedorDto>(
      `${this.API_URL}documentosfornecedor/documentostenant`,
      documentoFornecedorDto,
    );
  }

  deletarDocumentoTenant(idDocumentoFornecedorTenant: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}documentosfornecedor/documentostenant/${idDocumentoFornecedorTenant}`,
    );
  }

  deletar(idDocumentoFornecedor: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}documentosfornecedor/${idDocumentoFornecedor}`,
    );
  }

  listar(): Observable<Array<DocumentoFornecedor>> {
    return this.httpClient.get<Array<DocumentoFornecedor>>(`${this.API_URL}documentosfornecedor`);
  }

  listarDocumentosTenant(): Observable<Array<DocumentoFornecedorDto>> {
    return this.httpClient.get<Array<DocumentoFornecedorDto>>(
      `${this.API_URL}documentosfornecedor/documentostenant`,
    );
  }

  obterDocumentosParaVinculo(): Observable<Array<DocumentoFornecedorDto>> {
    return this.httpClient.get<Array<DocumentoFornecedorDto>>(
      `${this.API_URL}documentosfornecedor/documentostenant/vinculo`,
    );
  }

  listarDocumentosTenantFiltro(
    documentoFornecedorFiltro: DocumentoFornecedorFiltro,
  ): Observable<Paginacao<DocumentoFornecedorDto>> {
    return this.httpClient.post<Paginacao<DocumentoFornecedorDto>>(
      `${this.API_URL}documentosfornecedor/documentostenant-filter`,
      documentoFornecedorFiltro,
    );
  }

  filtrar(
    documentoFornecedorFiltro: DocumentoFornecedorFiltro,
  ): Observable<Paginacao<DocumentoFornecedorDto>> {
    return this.httpClient.post<Paginacao<DocumentoFornecedorDto>>(
      `${this.API_URL}documentosfornecedor/filtro`,
      documentoFornecedorFiltro,
    );
  }
}
