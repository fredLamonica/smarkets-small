import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ExportacaoUsuario } from '@shared/models/exportacao-usuario';

@Injectable()
export class ExportacaoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public inserir(entity: ExportacaoUsuario): Observable<ExportacaoUsuario> {
    return this.httpClient.post<ExportacaoUsuario>(`${this.API_URL}exportacao/pessoa-juridica/usuarios`, entity);
  }

}