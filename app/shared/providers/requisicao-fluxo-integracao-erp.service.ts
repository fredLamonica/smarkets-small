import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Paginacao } from '../models';
import { FluxoIntegracaoErp } from '../models/fluxo-integracao-erp';
import { FluxoIntegracaoErpService } from '../models/interfaces/fluxo-integracao-erp-service';
import { UtilitiesService } from '../utils/utilities.service';

@Injectable({
  providedIn: 'root',
})
export class RequisicaoFluxoIntegracaoErpService implements FluxoIntegracaoErpService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private utilitiesService: UtilitiesService) { }

  get(idRequisicaoItem: number, itensPorPagina: number, pagina: number): Observable<Paginacao<FluxoIntegracaoErp>> {
    const params = this.utilitiesService.getHttpParamsFromObject({ itensPorPagina, pagina });

    return this.httpClient.get<Paginacao<FluxoIntegracaoErp>>(`${this.API_URL}requisicaofluxosintegracao/${idRequisicaoItem}`, { params }).pipe(
      map((paginacao) => {
        paginacao.itens = paginacao.itens.map((fluxoIntegracaoErp) => new FluxoIntegracaoErp({ ...fluxoIntegracaoErp }));
        return paginacao;
      }));
  }

  resend(idRequisicaoItem: number, idRequisicaoFluxoIntegracao: number): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}requisicoes/${idRequisicaoItem}/resendrequesterp/${idRequisicaoFluxoIntegracao}`, {});
  }
}
