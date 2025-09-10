import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Estado } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class EstadoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obterEstados(idPais: number): Observable<Array<Estado>> {
    return this.httpClient.get<Array<Estado>>(`${this.API_URL}estados/pais/${idPais}`);
  }
}
