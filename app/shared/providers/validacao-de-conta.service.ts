import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CodigoVerificacaoDto } from '../models/dto/validacao-de-conta/codigo-verificacao-dto';
import { ValidacaoDeContaDto } from '../models/dto/validacao-de-conta/validacao-de-conta-dto';

@Injectable({
  providedIn: 'root',
})
export class ValidacaoDeContaService {

  private API_URL: string = `${environment.apiUrl}validacao-de-conta`;

  constructor(private httpClient: HttpClient) { }

  processeCodigoVerificacaoPorEmail(codigoVerificacaoDto: CodigoVerificacaoDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/processe-codigo-verificacao`, codigoVerificacaoDto);
  }

  valideContaPorEmail(validacaoDeContaDto: ValidacaoDeContaDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/valide-conta-email`, validacaoDeContaDto);
  }

  valideContaPorMfa(validacaoDeContaDto: ValidacaoDeContaDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/valide-conta-mfa`, validacaoDeContaDto);
  }

  valideContaPorCodigoRecuperacao(validacaoDeContaDto: ValidacaoDeContaDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/valide-conta-codigo-recuperacao`, validacaoDeContaDto);
  }

}
