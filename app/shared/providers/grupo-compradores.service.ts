import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GrupoCompradores } from '@shared/models/grupo-compradores';
import { Paginacao } from '@shared/models';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class GrupoCompradoresService {
    private API_URL: string = environment.apiUrl;
    
    constructor(private httpClient: HttpClient) { }

    public filtrar(itensPorPagina:number, pagina:number, termo: string): Observable<Paginacao<GrupoCompradores>>{
        return this.httpClient.get<Paginacao<GrupoCompradores>>(
            `${this.API_URL}grupocompradores/filtro`, { 
                params: {
                    "itensPorPagina": itensPorPagina.toString(), 
                    "pagina": pagina.toString(), 
                    "termo": termo 
                }
            }
        );
    }

    public obterPorId(idGrupoCompradores: number): Observable<GrupoCompradores> {
        return this.httpClient.get<GrupoCompradores>(`${this.API_URL}grupocompradores/${idGrupoCompradores}`);
    }

    public inserir(grupoCompradores: GrupoCompradores): Observable<GrupoCompradores> {
        return this.httpClient.post<GrupoCompradores>(`${this.API_URL}grupocompradores`, grupoCompradores );
    }

    public alterar(grupoCompradores: GrupoCompradores): Observable<GrupoCompradores> {
        return this.httpClient.put<GrupoCompradores>(`${this.API_URL}grupocompradores`, grupoCompradores );
    }

    public excluir(idGrupoCompradores: number): Observable<GrupoCompradores> {
        return this.httpClient.delete<GrupoCompradores>(`${this.API_URL}grupocompradores/${idGrupoCompradores}`);
    }

    public listar(): Observable<Array<GrupoCompradores>> {
        return this.httpClient.get<Array<GrupoCompradores>>(`${this.API_URL}grupocompradores`);
    }
}