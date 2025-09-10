import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo } from '@shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable()
export class ArquivoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  inserir(arquivo: Arquivo): Observable<Arquivo> {
    return this.httpClient.post<Arquivo>(`${this.API_URL}arquivos`, arquivo);
  }

  excluir(idArquivo: number): Observable<Arquivo> {
    return this.httpClient.delete<Arquivo>(`${this.API_URL}arquivos/${idArquivo}`);
  }

  obter(idArquivo: number): Observable<Arquivo> {
    return this.httpClient.get<Arquivo>(`${this.API_URL}arquivos/${idArquivo}`);
  }

  obterPorIdFornecedor(idFornecedor: number): Observable<Arquivo> {
    return this.httpClient.get<Arquivo>(`${this.API_URL}arquivos/fornecedor/${idFornecedor}`);
  }

  obterBase64(idArquivo: number): Observable<string> {
    return this.httpClient.get<string>(`${this.API_URL}arquivos/base64/${idArquivo}`, {
      responseType: 'text' as 'json',
    });
  }

  obterBase64PoliticaPrivacidade(): Observable<string> {
    return this.httpClient.get<string>(`${this.API_URL}arquivos/base64/politica-privacidade`, {
      responseType: 'text' as 'json',
    });
  }

  obterBase64PorUrl(urlArquivo: string): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}arquivos/base64`, { url: urlArquivo });
  }

  downloadFile(idFile: number, descriptioFile: string): Observable<void> {
    return this.download(idFile).pipe(map((file) => this.createDownloadElement(file, descriptioFile)));
  }

  download(idArquivo: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}arquivos/${idArquivo}`, { responseType: 'blob' });
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
