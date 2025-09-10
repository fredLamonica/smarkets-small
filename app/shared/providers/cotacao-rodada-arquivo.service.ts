import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CotacaoRodadaArquivo } from '@shared/models/cotacao/cotacao-rodada-arquivo';
import { CotacaoRodadaArquivoDto } from '@shared/models/dto/cotacao-rodada-arquivo-dto';

@Injectable()
export class CotacaoRodadaArquivoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public inserir(
    cotacaoRodadaArquivos: Array<CotacaoRodadaArquivo>
  ): Observable<CotacaoRodadaArquivo> {
    return this.httpClient.post<CotacaoRodadaArquivo>(
      `${this.API_URL}cotacoaorodadasarquivo`,
      cotacaoRodadaArquivos
    );
  }

  public deletar(idArquivo: number, idCotacaoRodada: number): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.API_URL}cotacoaorodadasarquivo/${idArquivo}/${idCotacaoRodada}`
    );
  }

  public ObterArquivosParticipante(
    idCotacao: number,
    idTenant: number
  ): Observable<Array<CotacaoRodadaArquivoDto>> {
    return this.httpClient.get<Array<CotacaoRodadaArquivoDto>>(
      `${this.API_URL}cotacoaorodadasarquivo/participante/${idCotacao}/${idTenant}`
    );
  }
}
