import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaFornecimento, CategoriaProduto, Fornecedor, FornecedorTermoPesquisa, Ordenacao, Paginacao, PessoaJuridica, Situacao } from '@shared/models';
import { Aceite } from '@shared/models/aceite';
import { DadosGeraisDto } from '@shared/models/dto/dados-gerais-dto';
import { FornecedorCategoriaFornecimentoDto } from '@shared/models/dto/fornecedor-categoria-fornecimento-dto';
import { InfosFornecedor } from '@shared/models/dto/infos-fornecedor';
import { SupplierBaseDto } from '@shared/models/dto/supplier-base-dto';
import { BaseFornecedores } from '@shared/models/enums/base-fornecedores';
import { GenericFilter } from '@shared/models/fltros/generic-filter';
import { SupplierBaseFilter } from '@shared/models/fltros/supplier-base-filter';
import { FornecedorInteressado } from '@shared/models/fornecedor-interessado';
import { HistoricoDeAceiteDeTermo } from '@shared/models/historico-de-aceite-de-termo';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FornecedorFilter } from '../models/fltros/fornecedor-filter';
import { PessoaJuridicaDto } from '../models/pessoa-juridica-dto';

@Injectable()
export class FornecedorService {
  private API_URL: string = environment.apiUrl;
  private documento: string;

  constructor(private httpClient: HttpClient) { }

  obterPorId(idFornecedor: number): Observable<FornecedorInteressado> {
    return this.httpClient.get<FornecedorInteressado>(
      `${this.API_URL}fornecedores/${idFornecedor}`,
    );
  }

  obterPorCnpj(cnpj: string): Observable<Array<FornecedorInteressado>> {
    return this.httpClient.get<Array<FornecedorInteressado>>(`${this.API_URL}fornecedores`, {
      params: { cnpj: cnpj },
    });
  }

  obterPorRazaoSocial(termo: string): Observable<Array<Fornecedor>> {
    return this.httpClient.get<Array<Fornecedor>>(`${this.API_URL}fornecedores/razao-social`, {
      params: { termo: termo },
    });
  }

  ObterFornecedorRedeLocalPorIdPessoaJuridica(
    idPessoaJuridica: number,
  ): Observable<FornecedorInteressado> {
    return this.httpClient.get<FornecedorInteressado>(
      `${this.API_URL}fornecedores/redes/local/pessoasJuridicas/${idPessoaJuridica}`,
    );
  }

  ObterFornecedorRedeLocalClientePorIdPessoaJuridica(
    idTenant: number,
    idPessoaJuridica: number,
  ): Observable<FornecedorInteressado> {
    return this.httpClient.get<FornecedorInteressado>(
      `${this.API_URL}fornecedores/redes/idTenant/${idTenant}/pessoasJuridicas/${idPessoaJuridica}`,
    );
  }

  inserir(fornecedorInteresado: FornecedorInteressado): Observable<FornecedorInteressado> {
    return this.httpClient.post<FornecedorInteressado>(
      `${this.API_URL}fornecedores/inserir`,
      fornecedorInteresado,
    );
  }

  alterar(fornecedorInteresado: FornecedorInteressado): Observable<FornecedorInteressado> {
    return this.httpClient.put<FornecedorInteressado>(
      `${this.API_URL}fornecedores/alterar`,
      fornecedorInteresado,
    );
  }

  inserirOld(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(`${this.API_URL}fornecedores`, fornecedor);
  }

  inserirFornecedorInteressado(
    fornecedor: FornecedorInteressado,
  ): Observable<FornecedorInteressado> {
    return this.httpClient.post<FornecedorInteressado>(`${this.API_URL}fornecedores`, fornecedor);
  }

  convidarFornecedor(fornecedor: FornecedorInteressado): Observable<FornecedorInteressado> {
    return this.httpClient.post<FornecedorInteressado>(
      `${this.API_URL}fornecedores/convidarFornecedor`,
      fornecedor,
    );
  }

  inserirAceite(aceite: Aceite): Observable<HistoricoDeAceiteDeTermo> {
    return this.httpClient.post<HistoricoDeAceiteDeTermo>(
      `${this.API_URL}fornecedores/termodeboapratica`,
      aceite,
    );
  }

  // #region Clientes
  obterClientes(idPessoa: number): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(
      `${this.API_URL}fornecedores/${idPessoa}/clientes`,
    );
  }

  FiltrarClientes(
    idPessoaJuridicaFornecedor: number,
    itensPorPagina: number,
    pagina: number,
    termo: string,
  ): Observable<Paginacao<PessoaJuridica>> {
    return this.httpClient.get<Paginacao<PessoaJuridica>>(
      `${this.API_URL}fornecedores/${idPessoaJuridicaFornecedor}/clientes/filtro`,
      {
        params: {
          idPessoaJuridicaFornecedor: idPessoaJuridicaFornecedor.toString(),
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          termo: termo,
        },
      },
    );
  }

  obterClientePorId(idPessoa: number, idPessoaJuridica): Observable<PessoaJuridica> {
    return this.httpClient.get<PessoaJuridica>(
      `${this.API_URL}fornecedores/${idPessoa}/clientes/${idPessoaJuridica}`,
    );
  }

  getSupplierBase(
    supplierFilter: SupplierBaseFilter,
    baseFornecedores: BaseFornecedores,
  ): Observable<Paginacao<SupplierBaseDto>> {
    return this.httpClient.post<Paginacao<SupplierBaseDto>>(
      `${this.API_URL}fornecedores/redes/base/${baseFornecedores}`,
      supplierFilter,
    );
  }

  filtrar(
    tipo: string,
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    termo: string,
  ): Observable<Paginacao<FornecedorInteressado>> {
    return this.httpClient.get<Paginacao<FornecedorInteressado>>(
      `${this.API_URL}fornecedores/redes/${tipo}`,
      {
        params: {
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          ordenarPor: ordenarPor,
          ordenacao: ordenacao.toString(),
          termo: termo,
        },
      },
    );
  }

  filtrarAvancadoGenerico(
    genericFilter: GenericFilter,
  ): Observable<Paginacao<FornecedorInteressado>> {
    return this.httpClient.post<Paginacao<FornecedorInteressado>>(
      `${this.API_URL}fornecedores/filtro-avancado-generic`,
      genericFilter,
    );
  }

  filtrarAvancado(
    tipoRede: string,
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    termoCnpj: string,
    termoRazaoSocial: string,
    termoCodigoErp: string,
    termoGrupoContas: string,
    termoCategoriaFornecimento: string,
    termoTermoPesquisa: string,
    termoDocumentosVencidos: string,
    termoDocumentosVencendo: string,
    termoQuestionariosVencidos: string,
    termoQuestionariosVencendo: string,
    termoQuestionario: string,
    termoNotaMaior: string,
    termoNotaMenor: string,
    termoStatusHomologacao: string,
    termoCategoriaFornecimentoSelecionada: string,
  ): Observable<Paginacao<FornecedorInteressado>> {
    return this.httpClient.get<Paginacao<FornecedorInteressado>>(
      `${this.API_URL}fornecedores/filtro-avancado`,
      {
        params: {
          tipo: tipoRede,
          itemOrdenar: itemOrdenar,
          ordenacao: ordenacao.toString(),
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          termoCnpj: termoCnpj ? termoCnpj : '',
          termoRazaoSocial: termoRazaoSocial ? termoRazaoSocial : '',
          termoCodigoErp: termoCodigoErp ? termoCodigoErp : '',
          termoGrupoContas: termoGrupoContas ? termoGrupoContas : '',
          termoCategoriaFornecimento: termoCategoriaFornecimento ? termoCategoriaFornecimento : '',
          termoTermoPesquisa: termoTermoPesquisa ? termoTermoPesquisa : '',
          termoDocumentosVencidos: termoDocumentosVencidos ? termoDocumentosVencidos : '',
          termoDocumentosVencendo: termoDocumentosVencendo ? termoDocumentosVencendo : '',
          termoQuestionariosVencidos: termoQuestionariosVencidos ? termoQuestionariosVencidos : '',
          termoQuestionariosVencendo: termoQuestionariosVencendo ? termoQuestionariosVencendo : '',
          termoQuestionario: termoQuestionario ? termoQuestionario : '',
          termoNotaMaior: termoNotaMaior ? termoNotaMaior : '',
          termoNotaMenor: termoNotaMenor ? termoNotaMenor : '',
          termoStatusHomologacao: termoStatusHomologacao
            ? termoStatusHomologacao !== 'null'
              ? termoStatusHomologacao
              : ''
            : '',
          termoCategoriaFornecimentoSelecionada: termoCategoriaFornecimentoSelecionada
            ? termoCategoriaFornecimentoSelecionada !== 'null'
              ? termoCategoriaFornecimentoSelecionada
              : ''
            : '',
        },
      },
    );
  }

  filtrarExcetoCategorias(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    termo: string,
    idsExcluidos: Array<number>,
  ): Observable<Paginacao<PessoaJuridica>> {
    return this.httpClient.post<Paginacao<PessoaJuridica>>(
      `${this.API_URL}fornecedores/filtrarexcetocategorias/`,
      {
        itensPorPagina: itensPorPagina,
        pagina: pagina,
        ordenarPor: ordenarPor,
        ordenacao: ordenacao,
        termo: termo,
        idsExcluidos: idsExcluidos,
      },
    );
  }

  adicionarRedeLocal(fornecedores: Array<FornecedorInteressado>) {
    return this.httpClient.post<Array<FornecedorInteressado>>(
      `${this.API_URL}fornecedores/redes/local`,
      fornecedores,
    );
  }

  CloneToLocal(idPessoaJuridicaFornecedores: number[]) {
    return this.httpClient.post<Array<FornecedorInteressado>>(
      `${this.API_URL}fornecedores/redes/clone/base`,
      idPessoaJuridicaFornecedores,
    );
  }

  removerRedeLocal(fornecedores: Array<FornecedorInteressado>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}fornecedores/redes/local`, fornecedores);
  }

  inserirCategorias(
    idPessoa: number,
    categorias: Array<CategoriaProduto>,
  ): Observable<Array<CategoriaProduto>> {
    return this.httpClient.post<Array<CategoriaProduto>>(
      `${this.API_URL}fornecedores/${idPessoa}/categorias-produtos`,
      categorias,
    );
  }

  atualizarCategoriasFornecimento(
    idFornecedor: number,
    categorias: Array<CategoriaFornecimento>,
    categoriaOutrasRemovida: boolean,
  ): Observable<Array<CategoriaFornecimento>> {
    return this.httpClient.post<Array<CategoriaFornecimento>>(
      `${this.API_URL}fornecedores/${idFornecedor}/atualizar-categorias-fornecimento/${categoriaOutrasRemovida}`,
      categorias,
    );
  }

  deletarCategorias(
    idPessoa: number,
    categorias: Array<CategoriaProduto>,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}fornecedores/${idPessoa}/categorias-produtos`,
      categorias,
    );
  }

  FiltrarCategoriaFornecimento(
    idFornecedor: number,
    filtro: GenericFilter,
  ): Observable<Paginacao<FornecedorCategoriaFornecimentoDto>> {
    return this.httpClient.post<Paginacao<FornecedorCategoriaFornecimentoDto>>(
      `${this.API_URL}fornecedores/${idFornecedor}/categorias-fornecimento/filtrar`,
      filtro,
    );
  }

  obterCategorias(idPessoa): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(
      `${this.API_URL}fornecedores/${idPessoa}/categorias-fornecimento`,
    );
  }

  obterCategoriasPorCliente(idPessoaJuridicaCliente: number) {
    return this.httpClient.get<Array<CategoriaFornecimento>>(
      `${this.API_URL}fornecedores/cliente/${idPessoaJuridicaCliente}/categorias-fornecimento`,
    );
  }

  obterEmpresasFornecedorasPorRazaoSocial(termo: string): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(
      `${this.API_URL}fornecedores/pessoasjuridicas/razao-social`,
      { params: { termo: termo } },
    );
  }

  obterEmpresasFornecedorasPorCategorias(idsCategoriaProduto: string) {
    return this.httpClient.get<Array<PessoaJuridica>>(
      `${this.API_URL}fornecedores/pessoasjuridicas/categorias-produtos`,
      { params: { idsCategoriaProduto: idsCategoriaProduto } },
    );
  }

  obterEmpresasFornecedorasFiltrarExcetoCategorias(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    termo: string,
    idsExcluidos: Array<number>,
    termoEstado: number,
  ): Observable<Paginacao<PessoaJuridica>> {
    return this.httpClient.post<Paginacao<PessoaJuridica>>(
      `${this.API_URL}fornecedores/pessoasjuridicas/filtrarexcetocategorias/`,
      {
        itensPorPagina: itensPorPagina,
        pagina: pagina,
        ordenarPor: ordenarPor,
        ordenacao: ordenacao,
        termo: termo,
        idsExcluidos: idsExcluidos,
        termoEstado: termoEstado ? termoEstado.toString() : null,
      },
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
  updateSupplierData(
    idPessoaJuridicaFornecedor: number,
    generalData: DadosGeraisDto,
  ): Observable<PessoaJuridica> {
    return this.httpClient.put<PessoaJuridica>(
      `${this.API_URL}fornecedores/${idPessoaJuridicaFornecedor}/update`,
      generalData,
    );
  }

  obterInfosFornecedor(
    idPessoaJuridicaFornecedor: number,
    idTenantFornecedor?: number,
  ): Observable<InfosFornecedor> {
    const url =
      idTenantFornecedor === undefined
        ? `${this.API_URL}pessoasjuridicas/fornecedor/${idPessoaJuridicaFornecedor}`
        : `${this.API_URL}pessoasjuridicas/fornecedor/${idPessoaJuridicaFornecedor}/${idTenantFornecedor}`;
    return this.httpClient.get<InfosFornecedor>(url);
  }

  obterFornecedoresQualificados(
    idAvaliacaoFornecedor: number,
  ): Observable<Array<FornecedorInteressado>> {
    return this.httpClient.get<Array<FornecedorInteressado>>(
      `${this.API_URL}avaliacoesfornecedor/disparos/fornecedores/${idAvaliacaoFornecedor}`,
    );
  }

  alterarCodigoFornecedor(idFornecedor: number, fornecedor: FornecedorInteressado) {
    return this.httpClient.put<number>(
      `${this.API_URL}fornecedores/${idFornecedor}/codigofornecedor`,
      fornecedor,
    );
  }

  alterarFornecedorGrupoContas(idFornecedor: number, idGrupoContas: number) {
    return this.httpClient.put<number>(
      `${this.API_URL}fornecedores/${idFornecedor}/grupoContas`,
      idGrupoContas,
    );
  }

  filtrarTermoPesquisa(
    itensPorPagina: number,
    pagina: number,
    ordenarPor: string,
    ordenacao: Ordenacao,
    idFornecedor: number,
  ): Observable<Paginacao<FornecedorTermoPesquisa>> {
    return this.httpClient.get<Paginacao<FornecedorTermoPesquisa>>(
      `${this.API_URL}fornecedores/${idFornecedor}/termopesquisa/filtro`,
      {
        params: {
          itensPorPagina: itensPorPagina.toString(),
          pagina: pagina.toString(),
          ordenarPor: ordenarPor,
          ordenacao: ordenacao.toString(),
          idCategoriaFornecimento: idFornecedor.toString(),
        },
      },
    );
  }

  inserirTermoPesquisa(
    fornecedorTermoPesquisa: FornecedorTermoPesquisa,
  ): Observable<FornecedorTermoPesquisa> {
    return this.httpClient.post<FornecedorTermoPesquisa>(
      `${this.API_URL}fornecedores/termopesquisa`,
      fornecedorTermoPesquisa,
    );
  }

  deletarTermoPesquisaBatch(
    idFornecedor: number,
    fornecedorTermosPesquisa: Array<FornecedorTermoPesquisa>,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}fornecedores/${idFornecedor}/termopesquisa`,
      fornecedorTermosPesquisa,
    );
  }

  alterarSituacaoTermoPesquisaBatch(
    fornecedorTermosPesquisa: Array<FornecedorTermoPesquisa>,
    situacao: Situacao,
  ): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}fornecedores/termopesquisa/situacao/${situacao}`,
      fornecedorTermosPesquisa,
    );
  }

  enviarDocumentosParaEmail(
    fornecedorInteresado: FornecedorInteressado,
  ): Promise<FornecedorInteressado> {
    return this.httpClient
      .post<FornecedorInteressado>(
        `${this.API_URL}fornecedores/enviardocumentosemail`,
        fornecedorInteresado,
      )
      .toPromise();
  }

  obterDadosGerais(
    idPessoaJuridica: number,
    idTenantFornecedor?: number,
  ): Observable<DadosGeraisDto> {
    const url =
      idTenantFornecedor === null
        ? `${this.API_URL}fornecedores/obterDadosGerais/${idPessoaJuridica}`
        : `${this.API_URL}fornecedores/obterDadosGerais/${idPessoaJuridica}/${idTenantFornecedor}`;

    return this.httpClient.get<DadosGeraisDto>(url);
  }

  atualizarStatus(status: number, idPessoaJuridicaFornecedor: number): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}fornecedores/atualizarStatus/${idPessoaJuridicaFornecedor}`,
      status,
    );
  }

  obterDocumento() {
    return this.documento;
  }

  alterarDocumento(documento: string) {
    this.documento = documento;
  }

  filtro(fornecedorFiltro: FornecedorFilter): Observable<Paginacao<PessoaJuridicaDto>> {
    return this.httpClient.post<Paginacao<PessoaJuridicaDto>>(`${this.API_URL}fornecedores/filtro`, fornecedorFiltro);
  }

}
