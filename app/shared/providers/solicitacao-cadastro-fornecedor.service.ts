import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitacaoCadastroFornecedorFiltro } from '@shared/models/fltros/solicitacao-cadastro-fornecedor-filtro';
import { SolicitacaoFornecedorUsuario } from '@shared/models/solicitacao-fornecedor-usuarios';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Endereco, Usuario } from '../models';
import { AprovarSolicitacaoFornecedorDto } from '../models/dto/aprovar-solicitacao-fornecedor-dto';
import { ObservacaoSolicitacaoFornecedor } from '../models/observacao-solicitacao-fornecedor';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoCadastroFornecedorService {
  private API_URL: string = environment.apiUrl;
  private solicitacaoCnpj = '';

  constructor(private httpClient: HttpClient) { }

  get cnpj() {
    return this.solicitacaoCnpj;
  }

  set cnpj(cnpj) {
    this.solicitacaoCnpj = cnpj;
  }

  filtrar(solicitacaoCadastroFornecedorFiltro: SolicitacaoCadastroFornecedorFiltro): any {
    return this.httpClient.get(
      `${this.API_URL}solicitacoesfornecedores/filtro`,
      {
        params: {
          itensPorPagina: solicitacaoCadastroFornecedorFiltro.itensPorPagina.toString(),
          pagina: solicitacaoCadastroFornecedorFiltro.pagina.toString(),
          cnpj: solicitacaoCadastroFornecedorFiltro.cnpj,
          razaoSocial: solicitacaoCadastroFornecedorFiltro.razaoSocial,
          status: solicitacaoCadastroFornecedorFiltro.status ? solicitacaoCadastroFornecedorFiltro.status.toString() : '0',
        },
      },
    );
  }

  cancel(idSolicitacao: number, motivo: string) {
    return this.httpClient.patch(`${this.API_URL}solicitacoesfornecedores/${idSolicitacao}/statuscancelar`, { idSolicitacaoFornecedor: idSolicitacao, motivoCancelamento: motivo });
  }

  insert(solicitacaoFornecedor: any): any {
    return this.httpClient.post(`${this.API_URL}solicitacoesfornecedores`, solicitacaoFornecedor);
  }

  upadate(solicitacaoCadastroFornecedor: any) {
    return this.httpClient.put(`${this.API_URL}solicitacoesfornecedores/${solicitacaoCadastroFornecedor.idSolicitacaoFornecedor}`, solicitacaoCadastroFornecedor);
  }

  obterSolicitacaoCadastroFornecedor(id: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}solicitacoesfornecedores/${id}`);
  }

  insertAdress(endereco: any, id: number) {
    return this.httpClient.post(`${this.API_URL}solicitacoesfornecedores/${id}/enderecos`, endereco);
  }

  getAdress(id: number): Observable<Array<Endereco>> {
    return this.httpClient.get<Array<Endereco>>(`${this.API_URL}solicitacoesfornecedores/${id}/enderecos`);
  }

  deleteAdress(id: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}solicitacoesfornecedores/enderecos/${id}`);
  }

  updateAdress(solicitacaoCadastroFornecedorEndereco: any) {
    return this.httpClient.put(`${this.API_URL}solicitacoesfornecedores/enderecos/${solicitacaoCadastroFornecedorEndereco.idSolicitacaoFornecedorEndereco}`, solicitacaoCadastroFornecedorEndereco);
  }

  getUsersFromPessoaJuridica(idSolicitacaoFornecedor: number): Observable<Array<SolicitacaoFornecedorUsuario>> {
    return this.httpClient.get<Array<SolicitacaoFornecedorUsuario>>(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/usuarios`);
  }

  insertUser(idSolicitacaoFornecedor: number, solicitacaoFornecedorUsuario: SolicitacaoFornecedorUsuario) {
    return this.httpClient.post(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/usuarios`, solicitacaoFornecedorUsuario);
  }

  editUser(idSolicitacaoFornecedor: number, solicitacaoFornecedorUsuario: SolicitacaoFornecedorUsuario) {
    return this.httpClient.put(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/usuarios/${solicitacaoFornecedorUsuario.idSolicitacaoFornecedorUsuarios}`, solicitacaoFornecedorUsuario);
  }

  deleteUser(solicitacaoFornecedorUsuario: SolicitacaoFornecedorUsuario) {
    return this.httpClient.delete(`${this.API_URL}solicitacoesfornecedores/usuarios/${solicitacaoFornecedorUsuario.idSolicitacaoFornecedorUsuarios}`);
  }

  assumeRequest(idSolicitacaoFornecedor: number): Observable<any> {
    return this.httpClient.patch<any>(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/usuarioresponsavel`, {});
  }

  sendRequest(idSolicitacaoFornecedor: number): Observable<number> {
    return this.httpClient.patch<any>(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/sendrequest`, {});
  }

  disapproveRequest(idSolicitacaoFornecedor: number): Observable<any> {
    return this.httpClient.patch<any>(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/statusreprovar`, {});
  }

  approveRequest(idSolicitacaoFornecedor: number, aprovarSolicitacaoFornecedorDto: AprovarSolicitacaoFornecedorDto): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/statusaprovar`, aprovarSolicitacaoFornecedorDto);
  }

  patchSlaSolicitacaoFornecedor(idSolicitacaoFornecedor: number, idSlaSolicitacao: number): Observable<any> {
    return this.httpClient.patch(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/sla`, { idSlaSolicitacao });
  }

  getObservacoes(idSolicitacaoFornecedor: number): Observable<Array<ObservacaoSolicitacaoFornecedor>> {
    return this.httpClient.get<Array<ObservacaoSolicitacaoFornecedor>>(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/observacoes`);
  }

  postObservacao(idSolicitacaoFornecedor: number, observacao: ObservacaoSolicitacaoFornecedor): Observable<ObservacaoSolicitacaoFornecedor> {
    return this.httpClient.post<ObservacaoSolicitacaoFornecedor>(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/observacoes`, observacao);
  }

  getUsuarioSolicitante(idSolicitacaoFornecedor: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.API_URL}solicitacoesfornecedores/${idSolicitacaoFornecedor}/requester`);
  }
}
