import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo, SituacaoCampanha } from '@shared/models';
import { ImportType } from '@shared/models/enums/ImportType.enum';
import { CampanhaFranquia, FranchiseCampaignFilter, Paginacao } from '@shared/models';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { ParticipanteCampanhaFranquia } from '@shared/models/participante-campanha-franquia';

@Injectable()
export class FranchiseCampaignService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public uploadPoliticaCampanha(id: number, file: Arquivo) {
    return this.httpClient.post(
      `${this.API_URL}franchisecampaigns/upload-usage-policy/${id}`,
      file
    );
  }

  public getUsagePolicy(id: number): Observable<Arquivo> {
    return this.httpClient.get<Arquivo>(`${this.API_URL}franchisecampaigns/usage-policy/${id}`);
  }

  public getFranchiseCampaignById(id: number): Observable<CampanhaFranquia> {
    return this.httpClient.get<CampanhaFranquia>(`${this.API_URL}franchisecampaigns/${id}`);
  }

  public uploadDeterminacaoVerba(id: number, file: Arquivo) {
    return this.httpClient.post(`${this.API_URL}franchisecampaigns/${id}/upload`, file);
  }

  public getBudgetDetermination(id: number): Observable<Arquivo> {
    return this.httpClient.get<Arquivo>(
      `${this.API_URL}franchisecampaigns/budget-determination/${id}`
    );
  }

  public downloadModeloDeterminacaoVerba(type: ImportType): Observable<Arquivo> {
    return this.httpClient.get<Arquivo>(`${this.API_URL}franchisecampaigns/models/${type}`);
  }

  public filterFranchiseCampaigns(
    franchiseCampaignFilter: FranchiseCampaignFilter
  ): Observable<Paginacao<CampanhaFranquia>> {
    return this.httpClient.post<Paginacao<CampanhaFranquia>>(
      `${this.API_URL}franchisecampaigns/filter`,
      franchiseCampaignFilter
    ); 
  }

  public filterFranchiseCampaignVisionFranchisee(
    franchiseCampaignFilter: FranchiseCampaignFilter
  ): Observable<Paginacao<ParticipanteCampanhaFranquia>> {
    return this.httpClient.get<Paginacao<ParticipanteCampanhaFranquia>>(
      `${this.API_URL}participantes-campanha-franquia`,
      {
        params: {
          idCampanhaFranquia:
            franchiseCampaignFilter.idCampanhaFranquia != null
              ? franchiseCampaignFilter.idCampanhaFranquia.toString()
              : '',
          titulo:
            franchiseCampaignFilter.titulo != null ? franchiseCampaignFilter.titulo.toString() : '',
          itemOrdenar:
            franchiseCampaignFilter.itemOrdenar != null
              ? franchiseCampaignFilter.itemOrdenar
              : 'idCampanhaFranquia',
          ordenacao:
            franchiseCampaignFilter.ordenacao != null
              ? franchiseCampaignFilter.ordenacao.toString()
              : '2',
          itensPorPagina:
            franchiseCampaignFilter.itensPorPagina != null
              ? franchiseCampaignFilter.itensPorPagina.toString()
              : '5',
          pagina:
            franchiseCampaignFilter.pagina != null
              ? franchiseCampaignFilter.pagina.toString()
              : '1',
          totalPaginas:
            franchiseCampaignFilter.totalPaginas != null
              ? franchiseCampaignFilter.totalPaginas.toString()
              : '0'
        }
      }
    );
  }

  public updateFranchiseCampaignStatus(
    franchiseCampaignId: number,
    status: SituacaoCampanha
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}franchisecampaigns/status/${franchiseCampaignId}`,
      status
    );
  }

  public deleteFranchiseCampaign(franchiseCampaignId: number) {
    return this.httpClient.delete<number>(
      `${this.API_URL}franchisecampaigns/${franchiseCampaignId}`
    );
  }

  public saveFranchiseCampain(data: CampanhaFranquia): Observable<CampanhaFranquia> {
    return this.httpClient.post<CampanhaFranquia>(`${this.API_URL}franchisecampaigns`, data);
  }

  public updateFranchiseCampain(data: CampanhaFranquia): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}franchisecampaigns`, data);
  }

  public getAcceptanceTerm(franchiseCampaignId): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.API_URL}franchisecampaigns/acceptance-term/${franchiseCampaignId}`
    );
  }

  public getFranchiseCampaignsToOrder(): Observable<CampanhaFranquia[]> {
    return this.httpClient.get<CampanhaFranquia[]>(`${this.API_URL}franchisecampaigns/orders`);
  }
}
