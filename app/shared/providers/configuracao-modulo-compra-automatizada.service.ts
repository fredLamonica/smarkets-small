import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfiguracoesCompraAutomatizadaDto } from '../models/dto/configuracoes-compra-automatizada-dto';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoModuloCompraAutomatizadaService {
  private API_URL: string = environment.apiUrl;
  private CONTROLLER: string = 'configuracoes-modulos-compras-automatizadas';

  constructor(private httpClient: HttpClient) { }

  obter(idPessoaJuridica: number): Observable<ConfiguracoesCompraAutomatizadaDto> {
    return this.httpClient.get<ConfiguracoesCompraAutomatizadaDto>(`${this.API_URL}${this.CONTROLLER}/${idPessoaJuridica}`);
  }

  inserir(configuracao: ConfiguracoesCompraAutomatizadaDto, gerarCodigoUnicoAutomatico: boolean = true): Observable<ConfiguracoesCompraAutomatizadaDto> {
    return this.httpClient.post<ConfiguracoesCompraAutomatizadaDto>(`${this.API_URL}${this.CONTROLLER}`, configuracao, { params: { gerarCodigoUnicoAutomatico: gerarCodigoUnicoAutomatico.toString() } });
  }

  alterar(configuracao: ConfiguracoesCompraAutomatizadaDto): Observable<ConfiguracoesCompraAutomatizadaDto> {
    return this.httpClient.put<ConfiguracoesCompraAutomatizadaDto>(`${this.API_URL}${this.CONTROLLER}`, configuracao);
  }

  excluir(idConfiguracaoModuloCompraAutomatizada: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}${this.CONTROLLER}/${idConfiguracaoModuloCompraAutomatizada}`);
  }
}
