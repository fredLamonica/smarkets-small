import { HistoricoDeAceiteDeTermo } from './../models/historico-de-aceite-de-termo';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracaoTermosBoasPraticas } from '@shared/models';

@Injectable({
  providedIn: 'root'
})

export class ConfiguracaoTermosBoasPraticasService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public obter(): Observable<ConfiguracaoTermosBoasPraticas> {
    return this.httpClient.get<ConfiguracaoTermosBoasPraticas>(`${this.API_URL}configuracoestermosboaspraticas`);
  }

  public inserir(configuracaoTermosBoasPraticas: ConfiguracaoTermosBoasPraticas): Observable<ConfiguracaoTermosBoasPraticas> {
    return this.httpClient.post<ConfiguracaoTermosBoasPraticas>(`${this.API_URL}configuracoestermosboaspraticas`, configuracaoTermosBoasPraticas);
  }

  public alterar(configuracaoTermosBoasPraticas: ConfiguracaoTermosBoasPraticas): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}configuracoestermosboaspraticas`, configuracaoTermosBoasPraticas);
  }

  public obterHistoricoDeAceitesParaCliente(idFornecedor: number, idTenant: number): Observable<Array<HistoricoDeAceiteDeTermo>>{
    return this.httpClient.get<Array<HistoricoDeAceiteDeTermo>>(`${this.API_URL}configuracoestermosboaspraticas/historico/fornecedor/${idFornecedor}/idTenant/${idTenant}`);
  }

  public obterHistoricoDeAceitesParaFornecedor(idPessoaJuridicaFornecedor: number, idTenant: number): Observable<Array<HistoricoDeAceiteDeTermo>>{
    return this.httpClient.get<Array<HistoricoDeAceiteDeTermo>>(`${this.API_URL}configuracoestermosboaspraticas/historico/idPessoaJuridicaFornecedor/${idPessoaJuridicaFornecedor}/idTenant/${idTenant}`);
  }
  
}
