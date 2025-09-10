import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarrinhoResumo, Pedido, PedidoItem } from '@shared/models';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EstadoAtendimento } from '../models/contrato-catalogo/estado-atendimento';
import { ArquivoService } from './arquivo.service';

@Injectable()
export class CarrinhoService {

  private API_URL: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private arquivoService: ArquivoService,
  ) { }

  obter(): Observable<Array<Pedido>> {
    return this.httpClient.get<Array<Pedido>>(`${this.API_URL}carrinho`);
  }

  obterResumo(): Observable<CarrinhoResumo> {
    return this.httpClient.get<CarrinhoResumo>(`${this.API_URL}carrinho/resumo`);
  }

  esvaziarCatalogo(): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}carrinho/catalogos`);
  }

  esvaziarRequisicao(): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}carrinho/requisicoes`);
  }

  esvaziarRegularizacao(): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}carrinho/regularizacao`);
  }

  valideEstadoDeAtendimentoObtendoDados(itensPedido: Array<PedidoItem>, idEstado: number): Observable<any> {
    return this.httpClient.post<EstadoAtendimento[]>(`${this.API_URL}carrinho/verificarAtendimento/estado/${idEstado}/contrato`, itensPedido);
  }

  gerarOrcamento(idPedido: number): Observable<any> {
    const descriptioFile = `Orçamento Pedido ${idPedido} - ${moment().format('YYYY_MM_DD-HH_mm')}.pdf`;
    return this.download(idPedido).pipe(map((file) => this.arquivoService.createDownloadElement(file, descriptioFile)));

  }

  download(idPedido: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}carrinho/gerar-orcamento/${idPedido}`,
      {
        responseType: 'blob',
      },
    );
  }
}
