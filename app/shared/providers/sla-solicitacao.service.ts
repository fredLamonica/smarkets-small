import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitacaoCadastroSlaFiltro } from '@shared/models/fltros/solicitacao-cadastro-sla-filtro';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoSlaSolicitacao } from '../models/enums/tipo-sla-solicitacao';
import { SlaSolicitacao } from '../models/sla-solicitacao/sla-solicitacao';

@Injectable({
  providedIn: 'root'
})
export class SlaSolicitacaoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public slaSolicitacaoFiltro(filtro: SolicitacaoCadastroSlaFiltro): any {
    return this.httpClient.get(
      `${this.API_URL}slasolicitacao/filtro`,
      {
        params: {
          itensPorPagina: filtro.itensPorPagina.toString(),
          pagina: filtro.pagina.toString(),
          classificacao: filtro.classificacao ? filtro.classificacao.toString() : '0',
          status: filtro.status ? filtro.status.toString() : '0',
          tipo: filtro.tipo ? filtro.tipo.toString() : '0'
        }
      }
    );
  }

  public post(slaSolicitacao: SlaSolicitacao): Observable<SlaSolicitacao> {
    return this.httpClient.post<SlaSolicitacao>(`${this.API_URL}slasolicitacao`, slaSolicitacao);
  }

  public put(idSlaSolicitacao: number, slaSolicitacao: SlaSolicitacao): Observable<SlaSolicitacao> {
    return this.httpClient.put<SlaSolicitacao>(`${this.API_URL}slasolicitacao/${idSlaSolicitacao}`, slaSolicitacao);
  }

  public ativaOuInativaSlaSolicitacao(slaSolicitacao: any): any {
    return this.httpClient.put(`${this.API_URL}slasolicitacao/${slaSolicitacao.idSlaSolicitacao}/status`, slaSolicitacao);
  }

  public excluirSlaSolicitacao(idSlaSolicitacao): any {
    return this.httpClient.delete(`${this.API_URL}slasolicitacao/${idSlaSolicitacao}`)
  }

  getPorTipo(tipo: TipoSlaSolicitacao): Observable<Array<SlaSolicitacao>> {
    return this.httpClient.get<Array<SlaSolicitacao>>(`${this.API_URL}slasolicitacao/filtroportipo?tipoSlaSolicitacao=${tipo}`);
  }

  get(idSlaSolicitacao: number): Observable<SlaSolicitacao> {
    return this.httpClient.get<SlaSolicitacao>(`${this.API_URL}slasolicitacao/${idSlaSolicitacao}`);
  }
}
