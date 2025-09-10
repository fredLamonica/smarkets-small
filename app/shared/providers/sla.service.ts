import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Paginacao, Sla, TipoSla, SlaItem, Ordenacao, Classificacao } from '@shared/models';

@Injectable()
export class SlaService {

    private API_URL: string = environment.apiUrl;

    constructor(private httpClient: HttpClient) { }

    public filtrar(itensPorPagina: number, pagina: number, ordenarPor: string, ordenacao: Ordenacao, termo : string): Observable<Paginacao<Sla>> {
        return this.httpClient.get<Paginacao<Sla>>(`${this.API_URL}sla`, { params: { "itensPorPagina": itensPorPagina.toString(), "pagina": pagina.toString(), "ordenarPor": ordenarPor, "ordenacao": ordenacao.toString(), "termo": termo } });
    }

    public obterPorTipoSla(tipoSla: TipoSla): Observable<Array<Sla>> {
        return this.httpClient.get<Array<Sla>>(`${this.API_URL}sla/tipo/${tipoSla}`);
    }

    public obterPorId(idSla: number): Observable<Sla> {
        return this.httpClient.get<Sla>(`${this.API_URL}sla/${idSla}`);
    }

    public inserir(sla: Sla): Observable<Sla> {
        return this.httpClient.post<Sla>(`${this.API_URL}sla`, sla);
    }   

    public alterar(sla: Sla): Observable<Sla> {
        return this.httpClient.put<Sla>(`${this.API_URL}sla`, sla);
    }   

    public excluir(idSla: number): Observable<number> {
        return this.httpClient.delete<number>(`${this.API_URL}sla/${idSla}`);
    }

    //#region SlaItem
    public obterSlaItemPorId(idSlaItem: number): Observable<SlaItem> {
        return this.httpClient.get<SlaItem>(`${this.API_URL}sla/slaitem/${idSlaItem}`);
    }

    public inserirSlaItem(sLAItem: SlaItem): Observable<SlaItem> {
        return this.httpClient.post<SlaItem>(`${this.API_URL}sla/slaitem`, sLAItem);
    }

    public alterarSlaItem(sLAItem: SlaItem): Observable<SlaItem> {
        return this.httpClient.put<SlaItem>(`${this.API_URL}sla/slaitem`, sLAItem);
    }

    public filtrarSlaItem(itensPorPagina: number, pagina: number, ordenarPor: string, ordenacao: Ordenacao, termo: string): Observable<Paginacao<SlaItem>> {
        return this.httpClient.get<Paginacao<SlaItem>>(`${this.API_URL}sla/slaitem`, { params: { "itensPorPagina": itensPorPagina.toString(), "pagina": pagina.toString(), "ordenarPor": ordenarPor, "ordenacao": ordenacao.toString(), "termo": termo } });
    }  

    public excluirSlaItem(idSlaItem: number): Observable<number> {
        return this.httpClient.delete<number>(`${this.API_URL}sla/slaitem/${idSlaItem}`);
    }

    public ObterSlaPorTempoRequisicaoAprovadaPedido(): Observable<Array<SlaItem>> {
        return this.httpClient.get<Array<SlaItem>>(`${this.API_URL}sla/slaItem/matrizes`);
    }

    public ObterSlaItensPorMatrizCategoriasTiposRequisicao(idsCategoriaProduto: string, idsTipoRequisicao: string): Observable<Array<SlaItem>> {
        return this.httpClient.get<Array<SlaItem>>(`${this.API_URL}sla/slaItem/matrizresponsabilidade/categorias/tiposrequisicao`, {  
            params: {
                'idsCategoriaProduto': idsCategoriaProduto, 'idsTipoRequisicao': idsTipoRequisicao
            }
        });
    }
    //#endregion

    // #region Classificação
    public listarClassificacoes(): Observable<Array<Classificacao>> {
        return this.httpClient.get<Array<Classificacao>>(`${this.API_URL}sla/classificacoes/`);
    }

    public inserirClassificacao(classificacao: Classificacao): Observable<Classificacao> {
        return this.httpClient.post<Classificacao>(`${this.API_URL}sla/classificacoes/`, classificacao);
    }
    //#endregion
}