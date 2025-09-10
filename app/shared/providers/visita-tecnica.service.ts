import { VisitaTecnica } from '../models/visita-tecnica';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitaTecnicaService {

    private API_URL: string = environment.apiUrl;

    constructor( private httpClient: HttpClient ) { }

    public obter(idFornecedor: number) {
      return this.httpClient.get<Array<VisitaTecnica>>(`${this.API_URL}visitastecnicas/${idFornecedor}`);
    }

    public obterPorId(idFornecedor: number) {
      return this.httpClient.get<VisitaTecnica>(`${this.API_URL}visitastecnicas/porid/${idFornecedor}`);
    }

    public inserir(visitaTecnica: VisitaTecnica): Observable<VisitaTecnica> {
        return this.httpClient.post<VisitaTecnica>(`${this.API_URL}visitastecnicas`, visitaTecnica);
    }

    public alterar(visitaTecnica: VisitaTecnica): Observable<number> {
        return this.httpClient.put<number>(`${this.API_URL}visitastecnicas`, visitaTecnica);
    }

    public deletar(idVisitaTecnica: number): Observable<number> {
        return this.httpClient.delete<number>(`${this.API_URL}visitastecnicas/${idVisitaTecnica}`);
    }

}
