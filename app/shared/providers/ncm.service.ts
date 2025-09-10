import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Paginacao } from '../models';
import { NcmFiltro } from '../models/fltros/ncm-filtro';
import { Ncm } from '../models/ncm';

@Injectable()
export class NcmService{
    private API_URL: string = environment.apiUrl;

    constructor( private httpClient: HttpClient ) { }

    public listarNcm(termo: NcmFiltro): Observable<Paginacao<Ncm>>{
      return this.httpClient.post<Paginacao<Ncm>>(`${this.API_URL}ncm/lista`,termo)
    }
}
