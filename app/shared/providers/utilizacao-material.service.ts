import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Paginacao, UtilizacaoMaterial } from '@shared/models';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class UtilizacaoMaterialService {
    private API_URL: string = environment.apiUrl;
    
    constructor(private httpClient: HttpClient) { }

    public filtrar(itensPorPagina:number, pagina:number, termo: string): Observable<Paginacao<UtilizacaoMaterial>>{
        return this.httpClient.get<Paginacao<UtilizacaoMaterial>>(
            `${this.API_URL}UtilizacaoMateriais/filtrar`, { 
                params: {
                    "itensPorPagina": itensPorPagina.toString(), 
                    "pagina": pagina.toString(), 
                    "termo": termo 
                }
            }
        );
    }

    public obterPorId(idUtilizacaoMaterial: number): Observable<UtilizacaoMaterial> {
        return this.httpClient.get<UtilizacaoMaterial>(`${this.API_URL}UtilizacaoMateriais/${idUtilizacaoMaterial}`);
    }

    public inserir(utilizacaoMaterial: UtilizacaoMaterial): Observable<UtilizacaoMaterial> {
        return this.httpClient.post<UtilizacaoMaterial>(`${this.API_URL}UtilizacaoMateriais`, utilizacaoMaterial );
    }

    public alterar(utilizacaoMaterial: UtilizacaoMaterial): Observable<UtilizacaoMaterial> {
        return this.httpClient.put<UtilizacaoMaterial>(`${this.API_URL}UtilizacaoMateriais`, utilizacaoMaterial );
    }

    public excluir(idUtilizacaoMaterial: number): Observable<UtilizacaoMaterial> {
        return this.httpClient.delete<UtilizacaoMaterial>(`${this.API_URL}UtilizacaoMateriais/${idUtilizacaoMaterial}`);
    }

    public listar(): Observable<Array<UtilizacaoMaterial>> {
        return this.httpClient.get<Array<UtilizacaoMaterial>>(`${this.API_URL}UtilizacaoMateriais`);
    }
}