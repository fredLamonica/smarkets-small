import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endereco, EnderecoDto, Paginacao, TipoEndereco } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnderecoFiltro } from '../models/fltros/endereco-filtro';
import { UtilitiesService } from '../utils/utilities.service';

@Injectable()
export class EnderecoService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private utilitiesService: UtilitiesService) { }

  obterPorId(idEndereco: number): Observable<Endereco> {
    return this.httpClient.get<Endereco>(`${this.API_URL}enderecos/${idEndereco}`);
  }

  inserir(endereco: EnderecoDto): Observable<Array<Endereco>> {
    return this.httpClient.post<Array<Endereco>>(`${this.API_URL}enderecos`, endereco);
  }

  alterar(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.put<Endereco>(`${this.API_URL}enderecos`, endereco);
  }

  listar(idPessoa: Number): Observable<Array<Endereco>> {
    return this.httpClient.get<Array<Endereco>>(`${this.API_URL}enderecos/pessoas/${idPessoa}`);
  }

  obterPorEmpresaUsuarioLogado(): Observable<Array<Endereco>> {
    return this.httpClient.get<Array<Endereco>>(`${this.API_URL}enderecos/pessoas/empresausuariologado`);
  }

  listarFiliais(idPessoa: Number): Observable<Array<Endereco>> {
    return this.httpClient.get<Array<Endereco>>(`${this.API_URL}enderecos/pessoas/${idPessoa}/filiais`);
  }

  deletar(idEndereco: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}enderecos/${idEndereco}`);
  }

  deletarBatch(enderecos: Array<Endereco>): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}enderecos/`, enderecos);
  }

  filtrar(
    enderecoFiltro: EnderecoFiltro,
  ): Observable<Paginacao<Endereco>> {
    return this.httpClient.post<Paginacao<Endereco>>(
      `${this.API_URL}enderecos/pessoas/filtro`,
      enderecoFiltro,
    );
  }

  filtrarPessoaJuridica(idPessoa: number, itensPorPagina: number, pagina: number, termo: string, tipo: TipoEndereco): Observable<Paginacao<Endereco>> {
    return this.httpClient.get<Paginacao<Endereco>>(`${this.API_URL}enderecos/pessoasJuridicas/${idPessoa}/filtro`, {
      params: { 'itensPorPagina': itensPorPagina.toString(), 'pagina': pagina.toString(), 'termo': termo, 'tipo': tipo.toString() },
    });
  }

  obterEnderecoPorPessoaJuridica(idPessoaJuridica: number) {
    return this.httpClient.get<Array<Endereco>>(`${this.API_URL}enderecos/obterEnderecosPorPessoaJuridica/${idPessoaJuridica}`);
  }

  filtrarPorPessoa(
    enderecoFiltro: EnderecoFiltro,
  ): Observable<Paginacao<Endereco>> {
    return this.httpClient.post<Paginacao<Endereco>>(
      `${this.API_URL}enderecos/pessoas/filtro`,
      enderecoFiltro,
    );
  }

}
