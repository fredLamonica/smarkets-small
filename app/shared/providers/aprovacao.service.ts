import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitacaoItemAnalise } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PedidoAprovacaoDto } from '../models/pedido/pedido-aprovacao-dto';

@Injectable()
export class AprovacaoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  inserir(pedidoAprovacaoDto: PedidoAprovacaoDto): Observable<Array<SolicitacaoItemAnalise>> {
    return this.httpClient.post<Array<SolicitacaoItemAnalise>>(`${this.API_URL}aprovacoes`, pedidoAprovacaoDto);
  }
}
