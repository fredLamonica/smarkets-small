import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ConfiguracoesDto,
  Ordenacao,
  Paginacao,
  PessoaJuridica,
  SituacaoPessoaJuridica
} from '@shared/models';
import { CompradorInformacaoDto } from '@shared/models/dto/comprador-informacao-dto';
import { ExistentCompanyDto } from '@shared/models/dto/existent-company-dto';
import { BuyerFilter } from '@shared/models/fltros/buyer-filter';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListaPessoaJuridica } from './../models/lista-pessoa-juridica';

@Injectable()
export class PessoaJuridicaService {
  private API_URL: string = environment.apiUrl;
  private documento: string;
  private logo: string;

  constructor(private httpClient: HttpClient) { }

  listar(): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(`${this.API_URL}pessoasjuridicas/`);
  }

  filtrar(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    termo: string,
    razaoSocial: string,
    cnpj: string,
    administrador: boolean = null,
    comprador: boolean = null,
    vendedor: boolean = null,
    transportadora: boolean = null,
  ): Observable<Paginacao<PessoaJuridica>> {
    const params = {
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      ordenarPor: ordenarPor,
      ordenacao: ordenacao.toString(),
      razaoSocial: razaoSocial,
      cnpj: cnpj,
      termo: termo,
    };

    if (administrador != null) { params['admistrador'] = administrador; }
    if (comprador != null) { params['comprador'] = comprador; }
    if (vendedor != null) { params['vendedor'] = vendedor; }
    if (transportadora != null) { params['transportadora'] = transportadora; }

    return this.httpClient.get<Paginacao<PessoaJuridica>>(
      `${this.API_URL}pessoasjuridicas/filtro`,
      { params: params },
    );
  }

  filtrarPaginado(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    termo: string,
    razaoSocial: string,
    cnpj: string,
    administrador: boolean = null,
    comprador: boolean = null,
    vendedor: boolean = null,
    transportadora: boolean = null,
  ): Observable<Paginacao<PessoaJuridica>> {
    const params = {
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      ordenarPor: ordenarPor,
      ordenacao: ordenacao.toString(),
      razaoSocial: razaoSocial,
      cnpj: cnpj,
      termo: termo,
    };

    if (administrador != null) { params['admistrador'] = administrador; }
    if (comprador != null) { params['comprador'] = comprador; }
    if (vendedor != null) { params['vendedor'] = vendedor; }
    if (transportadora != null) { params['transportadora'] = transportadora; }

    return this.httpClient.get<Paginacao<PessoaJuridica>>(
      `${this.API_URL}fornecedores/filtrarPaginado`,
      { params: params },
    );
  }

  filtrarCompradores(
    itensPorPagina: number,
    pagina: number,
    razaoSocial: string,
    cnpj: string,
  ): Observable<Paginacao<PessoaJuridica>> {
    const params = {
      itensPorPagina: itensPorPagina.toString(),
      pagina: pagina.toString(),
      razaoSocial: razaoSocial,
      cnpj: cnpj,
    };
    return this.httpClient.get<Paginacao<PessoaJuridica>>(
      `${this.API_URL}pessoasjuridicas/filtro/compradores`,
      { params: params },
    );
  }

  ObterCompradores(): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(
      `${this.API_URL}pessoasjuridicas/listar-compradores`,
    );
  }

  buscarPorRazaoSocial(
    termo: string,
    administrador: boolean = null,
    comprador: boolean = null,
    vendedor: boolean = null,
    transportadora: boolean = null,
  ): Observable<Array<PessoaJuridica>> {
    const params = {
      termo: termo,
    };

    if (administrador != null) { params['admistrador'] = administrador; }
    if (comprador != null) { params['comprador'] = comprador; }
    if (vendedor != null) { params['vendedor'] = vendedor; }
    if (transportadora != null) { params['transportadora'] = transportadora; }

    return this.httpClient.get<Array<PessoaJuridica>>(
      `${this.API_URL}pessoasjuridicas/buscaPorRazaoSocial`,
      { params: params },
    );
  }

  existePessoaJuridica(documento: string, isBuyer: boolean): Observable<ExistentCompanyDto> {
    return this.httpClient.get<ExistentCompanyDto>(
      `${this.API_URL}pessoasjuridicas/existe-pessoa-juridica/`,
      {
        params: { documento: documento, isBuyer: isBuyer.toString() },
      },
    );
  }

  obterPorId(idPessoaJuridica: number): Observable<PessoaJuridica> {
    return this.httpClient.get<PessoaJuridica>(
      `${this.API_URL}pessoasjuridicas/${idPessoaJuridica}`,
    );
  }

  obterPessoaId(idPessoaJuridica: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.API_URL}pessoasjuridicas/idPessoaPor/${idPessoaJuridica}`,
    );
  }

  obterIdTenant(idPessoaJuridica: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.API_URL}pessoasjuridicas/idTenantPor/${idPessoaJuridica}`,
    );
  }

  obterEmpresasPaiFilho(idPessoaJuridica: number): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(`${this.API_URL}catalogos/empresas/${idPessoaJuridica}`);
  }

  obterPorIdSemFiltroPermissao(idPessoaJuridica: number): Observable<PessoaJuridica> {
    return this.httpClient.get<PessoaJuridica>(
      `${this.API_URL}pessoasjuridicas/obterPorIdSemFiltroPermissao/${idPessoaJuridica}`,
    );
  }
  obterPorIdTenant(idTenant: number): Observable<PessoaJuridica> {
    return this.httpClient.get<PessoaJuridica>(
      `${this.API_URL}pessoasjuridicas/idTenant/${idTenant}`,
    );
  }

  inserir(pessoaJuridica: PessoaJuridica): Observable<PessoaJuridica> {
    return this.httpClient.post<PessoaJuridica>(`${this.API_URL}pessoasjuridicas`, pessoaJuridica);
  }

  alterar(pessoaJuridica: PessoaJuridica): Observable<PessoaJuridica> {
    return this.httpClient.put<PessoaJuridica>(`${this.API_URL}pessoasjuridicas`, pessoaJuridica);
  }

  excluir(idPessoaJuridica: number): Observable<PessoaJuridica> {
    return this.httpClient.delete<PessoaJuridica>(
      `${this.API_URL}pessoasjuridicas/${idPessoaJuridica}`,
    );
  }

  filtrarEmpresasPermissao(
    idUsuario: number,
    itensPorPagina: number,
    pagina: number,
    termo: string,
  ): Observable<Paginacao<PessoaJuridica>> {
    return this.httpClient.get<Paginacao<PessoaJuridica>>(
      `${this.API_URL}pessoasjuridicas/permissoes/filtro`,
      {
        params: {
          idUsuario: idUsuario.toString(),
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          termo: termo,
        },
      },
    );
  }

  ObterFiliais(): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(`${this.API_URL}pessoasjuridicas/filiais`);
  }

  obterFiliaisCompra(): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(`${this.API_URL}pessoasjuridicas/filiais/compras`);
  }

  alterarSituacao(
    idPessoaJuridica: number,
    situacao: SituacaoPessoaJuridica,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}pessoasjuridicas/alterar-situacao/${situacao}`,
      idPessoaJuridica,
    );
  }

  alterarSituacaoBatch(
    empresas: Array<PessoaJuridica>,
    situacao: SituacaoPessoaJuridica,
  ): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}pessoasjuridicas/situacao/${situacao}`,
      empresas,
    );
  }

  alterarControleAcoesStatusFornecedor(pessoaJuridica: PessoaJuridica): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}pessoasjuridicas/alterarControleAcoesStatusFornecedor`,
      pessoaJuridica,
    );
  }

  getLogo(idPessoaJuridica: number): Observable<any> {
    return this.httpClient.get<string>(`${this.API_URL}pessoasjuridicas/logo/${idPessoaJuridica}`);
  }

  updateLogo(idPessoaJuridica: number, logo: string): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}pessoasjuridicas/logo/${idPessoaJuridica}`, {
      logo: logo,
    });
  }

  obterPorCnpj(cnpj: string): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(`${this.API_URL}fornecedores`, {
      params: { cnpj: cnpj },
    });
  }

  obterDocumento() {
    return this.documento;
  }

  alterarDocumento(documento: string) {
    this.documento = documento;
  }

  obterLogo() {
    return this.logo;
  }

  alterarLogo(logo: string) {
    this.logo = logo;
  }

  // #region Configurações

  alterarConfiguracoes(configuracoes: ConfiguracoesDto): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}pessoasjuridicas/configuracoes`,
      configuracoes,
    );
  }

  obterConfiguracoes(idPessoaJuridica: number): Observable<ConfiguracoesDto> {
    return this.httpClient.get<ConfiguracoesDto>(
      `${this.API_URL}pessoasjuridicas/${idPessoaJuridica}/configuracoes`,
    );
  }

  listarCompradores_E_IntegracaoSap(
    integracaoSapHabilitada: boolean,
  ): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(
      `${this.API_URL}pessoasjuridicas/listar-compradores-integracao`,
      {
        params: {
          integracaoSapHabilitada: integracaoSapHabilitada.toString(),
        },
      },
    );
  }

  obterCompradoresExceto(idPessoaJuridica: number): Observable<ListaPessoaJuridica[]> {
    return this.httpClient.get<ListaPessoaJuridica[]>(
      `${this.API_URL}pessoasjuridicas/compradores/exceto/${idPessoaJuridica}`,
    );
  }

  getBuyerInformation(idPessoaJuridica: number): Observable<CompradorInformacaoDto> {
    return this.httpClient.get<CompradorInformacaoDto>(
      `${this.API_URL}pessoasjuridicas/buyer/information/${idPessoaJuridica}`,
    );
  }

  // #End region Configurações

  getBuyersFilter(buyerFilter: BuyerFilter): Observable<Paginacao<ListaPessoaJuridica>> {
    return this.httpClient.post<Paginacao<ListaPessoaJuridica>>(
      `${this.API_URL}pessoasjuridicas/buyers/filter`,
      buyerFilter,
    );
  }
}
