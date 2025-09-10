import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Log } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class LogService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obterLogs<T>(nomeClasse: string, idEntidade: number): Observable<Log<T>[]> {
    return this.httpClient.get<Log<T>[]>(`${this.API_URL}logs/${nomeClasse}/${idEntidade}`);
  }

  obterLogsPorTenant<T>(nomeClasse: string, idEntidade: number, idTenant: number): Observable<Log<T>[]> {
    return this.httpClient.get<Log<T>[]>(`${this.API_URL}logs/${nomeClasse}/${idEntidade}/${idTenant}`);
  }

  obterLogsV2<T>(nomeClasse: string, idEntidade: number): Observable<Log<T>[]> {
    return this.httpClient.get<Log<T>[]>(`${this.API_URL}logs/v2/${nomeClasse}/${idEntidade}`);
  }
}
