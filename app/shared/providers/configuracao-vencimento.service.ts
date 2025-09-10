import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfiguracaoVencimento } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoVencimentoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public obter(): Observable<ConfiguracaoVencimento> {
    return this.httpClient.get<ConfiguracaoVencimento>(`${this.API_URL}configuracoesvencimento`);
  }

  public inserir(configuracao: ConfiguracaoVencimento): Observable<ConfiguracaoVencimento> {
    return this.httpClient.post<ConfiguracaoVencimento>(
      `${this.API_URL}configuracoesvencimento`,
      configuracao
    );
  }

  public alterar(configuracao: ConfiguracaoVencimento): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}configuracoesvencimento`, configuracao);
  }

  public deletar(idConfiguracao): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}configuracoesvencimento/${idConfiguracao}`
    );
  }
}
