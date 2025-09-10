import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginacao } from '@shared/models';
import { AcompanhamentosDto } from '@shared/models/dto/acompanhamentos-dto';
import { AcompanhamentoFiltro } from '@shared/models/fltros/acompanhamento-filtro';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AcompanhamentoSimplesFiltro } from '../models/fltros/acompanhamento-simples-filtro';

@Injectable()
export class AcompanhamentosService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obterFiltro(
    acompanhamentoSimplesFiltro: AcompanhamentoSimplesFiltro,
  ): Observable<Paginacao<AcompanhamentosDto>> {
    return this.httpClient.post<Paginacao<AcompanhamentosDto>>(
      `${this.API_URL}acompanhamentos/filtro`,
      acompanhamentoSimplesFiltro,
    );
  }

  obterFiltroAvancado(
    acompanhamentoFiltro: AcompanhamentoFiltro,
  ): Observable<Paginacao<AcompanhamentosDto>> {
    return this.httpClient.post<Paginacao<AcompanhamentosDto>>(
      `${this.API_URL}acompanhamentos/filtroAvancado`,
      acompanhamentoFiltro,
    );
  }
}
