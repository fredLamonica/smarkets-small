import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomicilioBancario, Paginacao } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DomicilioBancarioFiltro } from '../models/fltros/domicilio-bancario-filtro';

@Injectable()
export class DomicilioBancarioService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  obterPorId(idDomicilioBancario: number): Observable<DomicilioBancario> {
    return this.httpClient.get<DomicilioBancario>(
      `${this.API_URL}pessoasjuridicas/domiciliosbancarios/${idDomicilioBancario}`,
    );
  }

  inserir(
    idPessoa: number,
    domicilioBancario: DomicilioBancario,
  ): Observable<DomicilioBancario> {
    return this.httpClient.post<DomicilioBancario>(
      `${this.API_URL}pessoasjuridicas/${idPessoa}/domiciliosbancarios`,
      domicilioBancario,
    );
  }

  alterar(
    idPessoa: number,
    domicilioBancario: DomicilioBancario,
  ): Observable<DomicilioBancario> {
    return this.httpClient.put<DomicilioBancario>(
      `${this.API_URL}pessoasjuridicas/${idPessoa}/domiciliosbancarios`,
      domicilioBancario,
    );
  }

  listar(idPessoaJuridica: Number): Observable<Array<DomicilioBancario>> {
    return this.httpClient.get<Array<DomicilioBancario>>(
      `${this.API_URL}pessoasjuridicas/${idPessoaJuridica}/domiciliosbancarios`,
    );
  }

  deletar(idDomicilioBancario: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}pessoasjuridicas/domiciliosbancarios/${idDomicilioBancario}`,
    );
  }

  deletarBatch(idPessoa: number, domicilios: Array<DomicilioBancario>): Observable<number> {
    return this.httpClient.patch<number>(
      `${this.API_URL}pessoasjuridicas/${idPessoa}/domiciliosbancarios/`,
      domicilios,
    );
  }

  filtrar(
    domicilioBancarioFiltro: DomicilioBancarioFiltro,
  ): Observable<Paginacao<DomicilioBancario>> {
    return this.httpClient.post<Paginacao<DomicilioBancario>>(
      `${this.API_URL}pessoasjuridicas/domiciliosbancarios/filtro`,
      domicilioBancarioFiltro,
    );
  }
}
