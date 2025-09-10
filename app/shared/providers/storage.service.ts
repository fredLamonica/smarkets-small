import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class StorageService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public get(key: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}storage/${key}`);
  }

  public set(key: string, value: any): Observable<any> {
    return this.httpClient.put<any>(`${this.API_URL}storage/${key}`, value);
  }

  public setBatch(itens: Array<any>): Observable<any> {
    return this.httpClient.put<any>(`${this.API_URL}storage/`, itens);
  }
}
