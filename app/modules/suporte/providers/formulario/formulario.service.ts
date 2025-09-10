import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AutenticacaoService } from '../../../../shared/providers';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  private API_URL: string = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AutenticacaoService) {}

  send(titulo: string, descricao: string, anexos: Array<File>): Observable<string> {
    const formData = this.mountFormData(titulo, descricao, anexos);
    return this.http.post<string>(`${this.API_URL}/suporte`, formData);
  }

  mountFormData(titulo: string, descricao: string, anexos: Array<File>) {
    const usuario = this.auth.usuario();

    const formData = new FormData();

    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('nome', usuario.pessoaFisica.nome);
    formData.append('email', usuario.email);
    formData.append('razaoSocial', usuario.permissaoAtual.pessoaJuridica.razaoSocial);
    formData.append('cnpj', usuario.permissaoAtual.pessoaJuridica.cnpj);

    anexos.forEach(anexo => {
      formData.append(anexo.name, anexo);
    });

    return formData;
  }
}
