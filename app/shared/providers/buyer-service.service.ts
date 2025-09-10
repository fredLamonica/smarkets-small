import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralDataDto } from '@shared/models/buyer/general-data-dto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class BuyerServiceService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public ObterDadosGeraisPorIdPessoaJuridica(idPessoaJuridica: number): Observable<GeneralDataDto> {
    return this.httpClient.get<GeneralDataDto>(`${this.API_URL}comprador/${idPessoaJuridica}`);
  }

  public AlterarDadosGeraisPessoaJuridica(
    generalDataDto: GeneralDataDto
  ): Observable<GeneralDataDto> {
    return this.httpClient.patch<GeneralDataDto>(`${this.API_URL}comprador/`, generalDataDto);
  }
}
