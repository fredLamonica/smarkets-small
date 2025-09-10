import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SuporteChamadoDto } from '../../modules/suporte/models/suporte-chamado-dto';

@Injectable()
export class SuporteService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  get email(): string {
    return 'suporte@smarkets.com.br';
  }

  get telefone(): string {
    return '(11) 3995-4909 – URA opção 4';
  }

  envie(suporteDto: SuporteChamadoDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}suporte`, suporteDto);
  }

}
