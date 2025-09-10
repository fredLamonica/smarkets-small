import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfiguracaoColunaDto } from '../models/configuracao-coluna-dto';
import { ConfiguracaoColunaUsuarioDto } from '../models/configuracao-coluna-usuario-dto';
import { FuncionalidadeConfiguracaoUsuario } from '../models/enums/funcionalidade-configuracao-usuario.enum';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoColunaUsuarioService {

  private API_URL: string = `${environment.apiUrl}configuracoesColunasUsuarios`;

  constructor(private httpClient: HttpClient) { }

  get(identificadorFuncionalidade: FuncionalidadeConfiguracaoUsuario): Observable<Array<ConfiguracaoColunaDto>> {
    return this.httpClient.get<Array<ConfiguracaoColunaDto>>(`${this.API_URL}/${identificadorFuncionalidade}`);
  }

  post(configuracaoColunaUsuario: ConfiguracaoColunaUsuarioDto): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}`, configuracaoColunaUsuario);
  }

  delete(identificadorFuncionalidade: FuncionalidadeConfiguracaoUsuario): Observable<any> {
    return this.httpClient.delete<any>(`${this.API_URL}/${identificadorFuncionalidade}`);
  }

}
