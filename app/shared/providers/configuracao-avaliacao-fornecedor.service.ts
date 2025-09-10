import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracaoAvaliacaoFornecedor } from '@shared/models/configuracao-avaliacao-fornecedor';

@Injectable({
    providedIn: 'root'
  })
  
  export class ConfiguracaoAvaliacaoFornecedorService {
  
    private API_URL: string = environment.apiUrl;
  
    constructor(private httpClient: HttpClient) { }

    public obter(): Observable<ConfiguracaoAvaliacaoFornecedor> {
      return this.httpClient.get<ConfiguracaoAvaliacaoFornecedor>(`${this.API_URL}configuracoesavaliacaofornecedor`);
    }

    public inserir(configuracao: ConfiguracaoAvaliacaoFornecedor): Observable<ConfiguracaoAvaliacaoFornecedor> {
      return this.httpClient.post<ConfiguracaoAvaliacaoFornecedor>(`${this.API_URL}configuracoesavaliacaofornecedor`, configuracao);
    }
  
    public alterar(configuracao: ConfiguracaoAvaliacaoFornecedor): Observable<number> {
      return this.httpClient.put<number>(`${this.API_URL}configuracoesavaliacaofornecedor`, configuracao);
    }

  }