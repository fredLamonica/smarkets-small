import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Paginacao } from '../models';
import { EntregaProgramada } from '../models/entrega-programada';
import { EntregasProgramadasService } from '../models/interfaces/entregas-programadas-service';
import { UtilitiesService } from '../utils/utilities.service';

@Injectable({
  providedIn: 'root',
})
export class RequisicaoEntregasProgramadasService implements EntregasProgramadasService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private utilitiesService: UtilitiesService) { }

  get(idRequisicaoItem: number, itensPorPagina: number, pagina: number): Observable<Paginacao<EntregaProgramada>> {
    const params = this.utilitiesService.getHttpParamsFromObject({ itensPorPagina, pagina });

    return this.httpClient.get<Paginacao<EntregaProgramada>>(`${this.API_URL}requisicaoentregasprogramadas/${idRequisicaoItem}`, { params }).pipe(
      map((paginacao) => {
        paginacao.itens = paginacao.itens.map((entregaProgramada) => new EntregaProgramada({ ...entregaProgramada }));
        return paginacao;
      }));
  }

  post(entregaProgramada: EntregaProgramada): Observable<Array<EntregaProgramada>> {
    const entregaProgramadaObj = new EntregaProgramada({ ...entregaProgramada });
    return this.httpClient.post<Array<EntregaProgramada>>(`${this.API_URL}requisicaoentregasprogramadas`, [entregaProgramadaObj.flatOut()]);
  }

  put(entregaProgramada: EntregaProgramada): Observable<Array<EntregaProgramada>> {
    const entregaProgramadaObj = new EntregaProgramada({ ...entregaProgramada });
    return this.httpClient.put<Array<EntregaProgramada>>(`${this.API_URL}requisicaoentregasprogramadas`, [entregaProgramadaObj.flatOut()]);
  }

  delete(idsEntregasProgramadas: Array<number>): Observable<number> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: idsEntregasProgramadas,
    };

    return this.httpClient.delete<number>(`${this.API_URL}requisicaoentregasprogramadas`, httpOptions);
  }

}
