import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Paginacao, OrigemMaterial } from '@shared/models';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class OrigemMaterialService {
    private API_URL: string = environment.apiUrl;
    
    constructor(private httpClient: HttpClient) { }

    public filtrar(itensPorPagina:number, pagina:number, termo: string): Observable<Paginacao<OrigemMaterial>>{
        return this.httpClient.get<Paginacao<OrigemMaterial>>(
            `${this.API_URL}OrigensMaterial/filtrar`, { 
                params: {
                    "itensPorPagina": itensPorPagina.toString(), 
                    "pagina": pagina.toString(), 
                    "termo": termo 
                }
            }
        );
    }

    public obterPorId(idOrigemMaterial: number): Observable<OrigemMaterial> {
        return this.httpClient.get<OrigemMaterial>(`${this.API_URL}OrigensMaterial/${idOrigemMaterial}`);
    }

    public inserir(origemMaterial: OrigemMaterial): Observable<OrigemMaterial> {
        return this.httpClient.post<OrigemMaterial>(`${this.API_URL}OrigensMaterial`, origemMaterial );
    }

    public alterar(origemMaterial: OrigemMaterial): Observable<OrigemMaterial> {
        return this.httpClient.put<OrigemMaterial>(`${this.API_URL}OrigensMaterial`, origemMaterial );
    }

    public excluir(idOrigemMaterial: number): Observable<OrigemMaterial> {
        return this.httpClient.delete<OrigemMaterial>(`${this.API_URL}OrigensMaterial/${idOrigemMaterial}`);
    }

    public listar(): Observable<Array<OrigemMaterial>> {
        return this.httpClient.get<Array<OrigemMaterial>>(`${this.API_URL}OrigensMaterial`);
    }
}