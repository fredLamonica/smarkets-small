import { CategoriaQuestao } from '@shared/models/categoria-questao';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestaoGestaoFornecedor } from '@shared/models/questao-gestao-fornecedor';

@Injectable({
  providedIn: 'root'
})
export class QuestaoGestaoFornecedorService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public obter(): Observable<QuestaoGestaoFornecedor[]> {
    return this.httpClient.get<QuestaoGestaoFornecedor[]>(
      `${this.API_URL}questoesgestaofornecedor`
    );
  }

  public inserir(questao: QuestaoGestaoFornecedor): Observable<QuestaoGestaoFornecedor> {
    return this.httpClient.post<QuestaoGestaoFornecedor>(
      `${this.API_URL}questoesgestaofornecedor`,
      questao
    );
  }

  public obterCategoriaQuestao(): Observable<CategoriaQuestao[]> {
    return this.httpClient.get<CategoriaQuestao[]>(
      `${this.API_URL}questoesgestaofornecedor/categoriaQuestao`
    );
  }

  public alterarCategoriaQuestao(categoriaQuestao: CategoriaQuestao): Observable<number> {
    return this.httpClient.put<number>(
      `${this.API_URL}questoesgestaofornecedor/categoriaQuestao`,
      categoriaQuestao
    );
  }

  public inserirCategoriaQuestao(categoriaQuestao: CategoriaQuestao): Observable<CategoriaQuestao> {
    return this.httpClient.post<CategoriaQuestao>(
      `${this.API_URL}questoesgestaofornecedor/categoriaQuestao`,
      categoriaQuestao
    );
  }

  public deletarCategoriaQuestao(idCategoriaQuestao): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}questoesgestaofornecedor/categoriaQuestao/${idCategoriaQuestao}`
    );
  }

  public alterar(questao: QuestaoGestaoFornecedor): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}questoesgestaofornecedor`, questao);
  }

  public deletar(idQuestao): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}questoesgestaofornecedor/${idQuestao}`);
  }
}
