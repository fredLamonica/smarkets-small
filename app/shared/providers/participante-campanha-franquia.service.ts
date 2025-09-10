import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralDataDto } from '@shared/models/buyer/general-data-dto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParticipanteCampanhaFranquia } from '../models/participante-campanha-franquia';

@Injectable()
export class ParticipanteCampanhaFranquiaService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public GetParticipantesCampanhaFranquiaById(IdParticipanteCampanhaFranquia: number): Observable<ParticipanteCampanhaFranquia> {
    return this.httpClient.get<ParticipanteCampanhaFranquia>(`${this.API_URL}participantes-campanha-franquia/${IdParticipanteCampanhaFranquia}`);
  }

  public updateFranchiseCampaignTermsConditions(data: ParticipanteCampanhaFranquia) {
    return this.httpClient.patch(`${this.API_URL}participantes-campanha-franquia/${data.idParticipantesCampanhaFranquia}/terms-conditions/${data.aceiteTermo}`, {});
  }
}
