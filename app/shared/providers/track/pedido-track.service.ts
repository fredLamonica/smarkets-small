import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Paginacao } from '../../models';
import { ConfiguracaoColunaDto } from '../../models/configuracao-coluna-dto';
import { EmailUsuarioDto } from '../../models/dto/email-usuario-dto';
import { EmailUsuarioFiltroDto } from '../../models/dto/email-usuario-filtro-dto';
import { FuncionalidadeConfiguracaoUsuario } from '../../models/enums/funcionalidade-configuracao-usuario.enum';
import { FiltroBase } from '../../models/fltros/base/filtro-base';
import { AltereCamposParadaManutencaoDto as AltereCamposPedidoTrackDto } from '../../models/fltros/track/altere-campos-parada-manutencao-dto';
import { ParadaManutencaoAlterarDto as PedidoTrackAlterarDto } from '../../models/fltros/track/parada-manutencao-alterar-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../../models/paginacao-pesquisa-configurada-dto';
import { PedidoTrackDto } from '../../models/pedido-track/pedido-track-dto';
import { ErrorService } from '../../utils/error.service';


@Injectable({
  providedIn: 'root'
})
export class PedidoTrackService {
  public get httpClient(): HttpClient {
    return this._httpClient;
  }
  public set httpClient(value: HttpClient) {
    this._httpClient = value;
  }

  private API_URL = `${environment.apiUrl}pedidos-track`;

  constructor(private _httpClient: HttpClient, private errorService: ErrorService) { }

  filtreOperacoes(identificadorFuncionalidade: FuncionalidadeConfiguracaoUsuario, filtro: FiltroBase): Observable<PaginacaoPesquisaConfiguradaDto<any>> {
    return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<any>>(`${this.API_URL}/filtro/${identificadorFuncionalidade}`, filtro);
  }

  exporte(identificadorFuncionalidade: FuncionalidadeConfiguracaoUsuario, filtro: FiltroBase): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/filtro/relatorio/${identificadorFuncionalidade}`, filtro, { responseType: 'blob' })
      .pipe(catchError(this.errorService.parseErrorBlob));
  }

  obtenhaColunasDisponiveis(identificadorFuncionalidade: FuncionalidadeConfiguracaoUsuario): Observable<ConfiguracaoColunaDto[]> {
    return this.httpClient.get<ConfiguracaoColunaDto[]>(`${this.API_URL}/colunas-disponiveis/${identificadorFuncionalidade}`);
  }

  obtenhaFiltroSalvo(
    identificadorFuncionalidade: FuncionalidadeConfiguracaoUsuario,
    idTenant: number): Observable<FiltroBase> {
    return this.httpClient.get<FiltroBase>(`${this.API_URL}/${idTenant}/filtro-salvo/${identificadorFuncionalidade}`);
  }

  avanceCampos(paradasManutencao: AltereCamposPedidoTrackDto): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}/avance-campos`, paradasManutencao);
  }

  reenvieNotificacao(idsParadaManutencao: number[]): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}/reenvie-notificacao`, idsParadaManutencao);
  }

  altere(paradaManutencaoDto: PedidoTrackAlterarDto): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}`, paradaManutencaoDto);
  }

  obtenhaPorId(idParadaManutencao: number): Observable<PedidoTrackDto> {
    return this.httpClient.get<PedidoTrackDto>(`${this.API_URL}/${idParadaManutencao}`);
  }

  filtrarPorTipoOperacao(emailUsuarioFiltroDto: EmailUsuarioFiltroDto): Observable<Paginacao<EmailUsuarioDto>> {
    return this.httpClient.post<Paginacao<EmailUsuarioDto>>(`${this.API_URL}/filtre-email`, emailUsuarioFiltroDto)
  }

}
