import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Cidade } from '@shared/models';

@Injectable()
export class CidadeService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public obterCidades(idEstado: number): Observable<Array<Cidade>> {
    return this.httpClient.get<Array<Cidade>>(`${this.API_URL}cidades/estado/${idEstado}`);
  }
}
