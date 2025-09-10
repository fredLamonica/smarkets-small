import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfiguracaoDeModuloIntegracao } from '../models/configuracao-de-modulo-integracao';
import { ConfiguracoesIntegracaoDto } from '../models/dto/configuracoes-integracao-dto';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoDeModuloIntegracaoService {

  private API_URL: string = `${environment.apiUrl}configuracao-modulo-integracao`;

  constructor(private httpClient: HttpClient) { }

  get(idPessoaJuridica: number): Observable<ConfiguracaoDeModuloIntegracao> {
    return this.httpClient.get<ConfiguracaoDeModuloIntegracao>(`${this.API_URL}/${idPessoaJuridica}`);
  }

  getDto(idPessoaJuridica: number): Observable<ConfiguracoesIntegracaoDto> {
    return this.httpClient.get<ConfiguracoesIntegracaoDto>(`${this.API_URL}/dto/${idPessoaJuridica}`);
  }

  post(configuracaoDeModuloIntegracao: ConfiguracaoDeModuloIntegracao): Observable<ConfiguracaoDeModuloIntegracao> {
    return this.httpClient.post<ConfiguracaoDeModuloIntegracao>(`${this.API_URL}`, configuracaoDeModuloIntegracao);
  }

  put(configuracaoDeModuloIntegracao: ConfiguracaoDeModuloIntegracao): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}`, configuracaoDeModuloIntegracao);
  }

  delete(idPessoaJuridica: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}/${idPessoaJuridica}`);
  }
}
