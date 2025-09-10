import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracaoFornecedorInteressado } from '@shared/models';

@Injectable({
  providedIn: 'root'
})

export class ConfiguracaoFornecedorInteressadoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public obter(): Observable<ConfiguracaoFornecedorInteressado> {
    return this.httpClient.get<ConfiguracaoFornecedorInteressado>(`${this.API_URL}configuracoesfornecedorinteressado`);
  }

  public obterPorUrl(url: string): Observable<ConfiguracaoFornecedorInteressado> {
    return this.httpClient.get<ConfiguracaoFornecedorInteressado>(`${this.API_URL}configuracoesfornecedorinteressado/${url}`);
  }

  public inserir(configuracao: ConfiguracaoFornecedorInteressado): Observable<ConfiguracaoFornecedorInteressado> {
    return this.httpClient.post<ConfiguracaoFornecedorInteressado>(`${this.API_URL}configuracoesfornecedorinteressado`, configuracao);
  }

  public alterar(configuracao: ConfiguracaoFornecedorInteressado): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}configuracoesfornecedorinteressado`, configuracao);
  }
}
