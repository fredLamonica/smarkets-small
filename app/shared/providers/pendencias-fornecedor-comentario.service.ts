import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PendenciasFornecedorComentario } from '@shared/models/pendencia-fornecedor-comentario';

@Injectable()
export class PendenciasFornecedorComentarioService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public inserir(pendenciaFornecedorComentario: PendenciasFornecedorComentario): Observable<PendenciasFornecedorComentario> {
    return this.httpClient.post<PendenciasFornecedorComentario>(`${this.API_URL}pendencia-fornecedor-comentario`, pendenciaFornecedorComentario);
  }

  public obter(idPendenciaFornecedor: number) {
    return this.httpClient.get<Array<PendenciasFornecedorComentario>>(`${this.API_URL}pendencia-fornecedor-comentario/${idPendenciaFornecedor}`);
  }
}