import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Pais } from '@shared/models';

@Injectable()
export class PaisService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public obterPaises(): Observable<Array<Pais>> {
    return this.httpClient.get<Array<Pais>>(`${this.API_URL}paises`);
  }
}
