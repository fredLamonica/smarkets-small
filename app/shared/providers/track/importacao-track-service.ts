import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Paginacao } from '../../models';
import { ImportacaoFiltroDto } from '../../models/fltros/track/importacao-filtro-dto';
import { ImportacaoDto } from '../../models/importacao-dto';
import { InserirImportacaoDto } from '../../models/pedido-track/inserir-importacao-dto';


@Injectable({
  providedIn: 'root'
})
export class ImportacaoTrackService {

  private API_URL = `${environment.apiUrl}importacoes-track`;

  constructor(private httpClient: HttpClient) { }

  importar(importacaoDto: InserirImportacaoDto): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}`, importacaoDto)
  }

  filtrarImportacaoPorTipo(importacaoFiltroDto: ImportacaoFiltroDto): Observable<Paginacao<ImportacaoDto>> {
    return this.httpClient.post<Paginacao<ImportacaoDto>>(`${this.API_URL}/filtrarPorTipo`, importacaoFiltroDto)
  }

  downloadArquivoErros(idImportacao: number, nomeArquivo: string): Observable<void> {
    return this.httpClient.get(`${this.API_URL}/arquivo-erro/${idImportacao}`,  { responseType: 'blob' })
      .pipe(map((file) => this.createDownloadElement(file, nomeArquivo)))
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

}
