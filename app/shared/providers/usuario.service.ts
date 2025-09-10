import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ordenacao, Paginacao, PerfilUsuario, Permissao, SituacaoUsuario, Usuario } from '@shared/models';
import { UsuarioDto } from '@shared/models/dto/usuario-dto';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfiguracaoColunaDto } from '../models/configuracao-coluna-dto';
import { InformacoesPessoaisDto } from '../models/dto/informacoes-pessoais-dto';
import { NotificacaoDto } from '../models/dto/notificacao-dto';
import { UsuarioFornecedorDto } from '../models/dto/usuario-fornecedor-dto';
import { NotificacaoUsuarioFiltroDto } from '../models/notificacoes/notificacao-usuario-filtro-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../models/paginacao-pesquisa-configurada-dto';
import { ErrorService } from '../utils/error.service';

@Injectable()
export class UsuarioService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private errorService: ErrorService) { }

  filtrar(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    termo: string,
  ): Observable<Paginacao<Usuario>> {
    return this.httpClient.get<Paginacao<Usuario>>(`${this.API_URL}usuarios/filtro`, {
      params: {
        itensPorPagina: itensPorPagina.toString(),
        pagina: pagina.toString(),
        ordenarPor: ordenarPor,
        ordenacao: ordenacao.toString(),
        termo: termo,
      },
    });
  }

  listar(): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}usuarios`);
  }

  listarUsuarioReponsavelRequisicao(): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}usuarios/requisicoes/responsaveis`);
  }

  listarAlcadaParticipantes(): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}usuarios/alcada-participantes`);
  }

  obterPorPerfil(perfil: PerfilUsuario): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}usuarios/perfil/${perfil}`);
  }

  getUsersFromPessoaJuridica(
    idPessoaJuridica: number,
    perfil?: PerfilUsuario,
  ): Observable<Array<Usuario>> {
    let parameters;

    if (perfil) { parameters = { perfil: perfil.toString() }; }

    return this.httpClient.get<Array<Usuario>>(
      `${this.API_URL}usuarios/${idPessoaJuridica}/users`,
      { params: parameters },
    );
  }

  listarAprovadores(): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}usuarios/aprovadores`);
  }

  listeCompradores(): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}usuarios/compradores`);
  }

  obterPorId(idUsuario: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.API_URL}usuarios/${idUsuario}`);
  }
  ObterPorIdSemPermissao(idUsuario: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.API_URL}usuarios/semFiltro/${idUsuario}`);
  }

  obterPorEmail(email: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.API_URL}usuarios/email`, {
      params: { email: email },
    });
  }

  inserir(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(`${this.API_URL}usuarios`, usuario);
  }

  inserirUsuarioFornecedor(usuario: Usuario): Observable<UsuarioFornecedorDto> {
    return this.httpClient.post<UsuarioFornecedorDto>(`${this.API_URL}usuarios/usuario-fornecedor`, usuario);
  }

  alterar(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.API_URL}usuarios`, usuario);
  }

  alterarUsuarioComPermissao(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.API_URL}usuarios/usuariopermissao`, usuario);
  }

  excluir(idUsuario: number): Observable<Usuario> {
    return this.httpClient.delete<Usuario>(`${this.API_URL}usuarios/${idUsuario}`);
  }

  obterOpcoesResponsaveisCentroCusto(): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}usuarios/opcoes-centro-custo`);
  }

  obterGestoresDisponiveis(perfis: Array<number> = null): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}usuarios/gestores/disponiveis`);
  }

  alterarSituacaoBatch(
    usuario: Array<Usuario>,
    situacao: SituacaoUsuario,
  ): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.API_URL}usuarios/situacao/${situacao}`, usuario);
  }

  atualizarDataAceitePoliticaPrivacidade(token: string): Observable<string> {
    return this.httpClient.put(`${this.API_URL}usuarios/politica-privacidade`, {}, { responseType: 'text', headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) });
  }

  obterPorPessoaJuridica(
    idPessoaJuridica: number,
    registrosPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
  ): Observable<Paginacao<Usuario>> {
    return this.httpClient.get<Paginacao<Usuario>>(
      `${this.API_URL}usuarios/pessoa-juridica/${idPessoaJuridica}`,
      {
        params: {
          registrosPorPagina: registrosPorPagina.toString(),
          pagina: pagina.toString(),
          ordenarPor: ordenarPor,
          ordenacao: ordenacao.toString(),
        },
      },
    );
  }

  inserirUsuarioComPermissao(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(`${this.API_URL}usuarios/pessoa-juridica`, usuario);
  }

  getUsersFilter(termo: string): Observable<UsuarioDto[]> {
    return this.httpClient.get<UsuarioDto[]>(`${this.API_URL}usuarios/filter`, {
      params: {
        termo: termo,
      },
    });
  }

  redefinirTokensDoMfa(idUsuario: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}usuarios/${idUsuario}/reset-tokens`);
  }

  //#region Permissionamento
  filtrarPermissoes(
    idUsuario: number,
    itensPorPagina: number,
    pagina: number,
    termo: string,
  ): Observable<Paginacao<Permissao>> {
    return this.httpClient.get<Paginacao<Permissao>>(
      `${this.API_URL}usuarios/${idUsuario}/permissoes/filtro`,
      {
        params: {
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          termo: termo,
        },
      },
    );
  }

  obterPermissaoPorId(idUsuario: number, idPermissao: number): Observable<Permissao> {
    return this.httpClient.get<Permissao>(
      `${this.API_URL}usuarios/${idUsuario}/permissoes/${idPermissao}`,
    );
  }

  inserirPermissao(permissao: Permissao): Observable<Permissao> {
    return this.httpClient.post<Permissao>(
      `${this.API_URL}usuarios/${permissao.idUsuario}/permissoes`,
      permissao,
    );
  }

  alterarPermissao(permissao: Permissao): Observable<Permissao> {
    return this.httpClient.put<Permissao>(
      `${this.API_URL}usuarios/${permissao.idUsuario}/permissoes`,
      permissao,
    );
  }

  removerPermissoes(
    idUsuario: number,
    permissoes: Array<Permissao>,
  ): Observable<Array<Permissao>> {
    return this.httpClient.patch<Array<Permissao>>(
      `${this.API_URL}usuarios/${idUsuario}/permissoes`,
      permissoes,
    );
  }

  exporteNotificacoes(notificacoesFiltroDto: NotificacaoUsuarioFiltroDto): Observable<any> {
    return this.httpClient
      .post(
        `${this.API_URL}usuarios/filtro-notificacoes/relatorio`,
        notificacoesFiltroDto,
        { responseType: 'blob' })
      .pipe(catchError(this.errorService.parseErrorBlob));
  }

  obtenhaFiltroSalvoNotificacao(): Observable<NotificacaoUsuarioFiltroDto> {
    return this.httpClient.get<NotificacaoUsuarioFiltroDto>(`${this.API_URL}usuarios/filtro-salvo/notificacoes`);
  }

  filtreNotificacoes(filtroNotificacao: NotificacaoUsuarioFiltroDto): Observable<PaginacaoPesquisaConfiguradaDto<NotificacaoDto>> {
    return this.httpClient.post<PaginacaoPesquisaConfiguradaDto<NotificacaoDto>>(`${this.API_URL}usuarios/filtro/notificacoes`, filtroNotificacao);
  }

  salveInformacoesPessoais(informacoesPessoais: InformacoesPessoaisDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}usuarios/salve-informacoes-pessoais`, informacoesPessoais);
  }

  obtenhaInformacoesPessoais(): Observable<InformacoesPessoaisDto> {
    return this.httpClient.get<InformacoesPessoaisDto>(`${this.API_URL}usuarios/obtenha-informacoes-pessoais`);
  }

    obtenhaColunasDiponiveis(): Observable<Array<ConfiguracaoColunaDto>> {
    return this.httpClient.get<Array<ConfiguracaoColunaDto>>(`${this.API_URL}usuarios/colunasDisponiveis`);
  }
}
