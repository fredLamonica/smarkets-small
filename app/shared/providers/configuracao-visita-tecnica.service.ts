import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracaoVisitaTecnica } from '@shared/models/configuracao-visita-tecnica';

@Injectable({
    providedIn: 'root'
  })
  
  export class ConfiguracaoVisitaTecnicaService {
  
    private API_URL: string = environment.apiUrl;
  
    constructor(private httpClient: HttpClient) { }

    public obter(): Observable<ConfiguracaoVisitaTecnica[]> {
      return this.httpClient.get<ConfiguracaoVisitaTecnica[]>(`${this.API_URL}configuracoesvisitastecnicas`);
    }

    public inserir(configuracao: ConfiguracaoVisitaTecnica): Observable<ConfiguracaoVisitaTecnica> {
      return this.httpClient.post<ConfiguracaoVisitaTecnica>(`${this.API_URL}configuracoesvisitastecnicas`, configuracao);
    }
  
    public alterar(configuracao: ConfiguracaoVisitaTecnica): Observable<number> {
      return this.httpClient.put<number>(`${this.API_URL}configuracoesvisitastecnicas`, configuracao);
    }

    public deletar(idConfiguracao): Observable<number> {
      return this.httpClient.delete<number>(`${this.API_URL}configuracoesvisitastecnicas/${idConfiguracao}`);
    }

  }