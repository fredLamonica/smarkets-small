import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Cnae, CategoriaProduto, Endereco, Usuario, PessoaJuridica } from '@shared/models';

@Injectable()
export class PessoaService {

  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public obterCnaes(): Observable<Array<Cnae>> {
    return this.httpClient.get<Array<Cnae>>(`${this.API_URL}pessoas/cnaes`);
  }

  public obterCategorias(): Observable<Array<CategoriaProduto>> {
    return this.httpClient.get<Array<CategoriaProduto>>(`${this.API_URL}pessoas/categorias`);
  }

  public obterEnderecos(): Observable<Array<Endereco>> {
    return this.httpClient.get<Array<Endereco>>(`${this.API_URL}pessoas/enderecos`);
  }

  // public obterContatos(): Observable<Array<Contato>> {
  //   return this.httpClient.get<Array<Contato>>(`${this.API_URL}pessoas/contatos`);
  // }

  public obterUsuarios(): Observable<Array<Usuario>> {
    return this.httpClient.get<Array<Usuario>>(`${this.API_URL}pessoas/usuarios`);
  }

  public obterFiliais(): Observable<Array<PessoaJuridica>> {
    return this.httpClient.get<Array<PessoaJuridica>>(`${this.API_URL}pessoas/filiais`);
  }

  // public obterDomiciliosBancarios(): Observable<Array<DomicilioBancario>> {
  //   return this.httpClient.get<Array<DomicilioBancario>>(`${this.API_URL}pessoas/domiciliosbancarios`);
  // }

  public associarCnae(idPessoa: number, idCnae: Number): Observable<Cnae> {
    return this.httpClient.get<Cnae>(`${this.API_URL}pessoas/${idPessoa}/cnaes/${idCnae}`);
  }

  public desassociarCnae(idPessoa: number, idCnae: number): Observable<Cnae> {
    return this.httpClient.delete<Cnae>(`${this.API_URL}pessoas/${idPessoa}/cnaes/${idCnae}`);
  }

  

}
