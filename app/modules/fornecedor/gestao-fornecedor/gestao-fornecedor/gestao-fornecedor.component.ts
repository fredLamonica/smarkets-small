import { Component, OnInit, ViewChild } from '@angular/core';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { ConfiguracoesFornecedorComponent } from '../configuracoes-fornecedor/configuracoes-fornecedor.component';
import { AutenticacaoService } from '@shared/providers';
import { Usuario, PerfilUsuario } from '@shared/models';
import { ListarDocumentoFornecedorComponent } from '../documento-fornecedor/listar-documento-fornecedor/listar-documento-fornecedor.component';
import { ListarQuestionariosFornecedorComponent } from '../questionarios-fornecedor/listar-questionarios-fornecedor/listar-questionarios-fornecedor.component';
import { ListDocumentRequestComponent } from '../document-request/list-document-request/list-document-request.component';

@Component({
  selector: 'app-gestao-fornecedor',
  templateUrl: './gestao-fornecedor.component.html',
  styleUrls: ['./gestao-fornecedor.component.scss']
})
export class GestaoFornecedorComponent implements OnInit {
  @ViewChild('configuracoesFornecedor')
  configuracoesFornecedorComponent: ConfiguracoesFornecedorComponent;
  @ViewChild('solicitacaoDocumentosFornecedor')
  solicitacaoDocumentosComponent: ListDocumentRequestComponent;
  @ViewChild('documentosFornecedor')
  documentosFornecedorComponent: ListarDocumentoFornecedorComponent;
  @ViewChild('questionariosFornecedor')
  questionariosFornecedorComponent: ListarQuestionariosFornecedorComponent;

  public termo: string = '';
  public tabAtiva: string;

  public habilitarDocumentosFornecedor: boolean = false;

  get componenteAtivo(): OperacoesFiltro {
    switch (this.tabAtiva) {
      case 'configuracoes-fornecedor': {
        return this.configuracoesFornecedorComponent;
      }
      case 'solicitacao-documentos-fornecedor': {
        return this.solicitacaoDocumentosComponent;
      }
      case 'documentos-fornecedor': {
        return this.documentosFornecedorComponent;
      }
      case 'questionarios-fornecedor': {
        return this.questionariosFornecedorComponent;
      }
    }
  }

  constructor(private authService: AutenticacaoService) {}

  ngOnInit() {
    let usuario: Usuario = this.authService.usuario();
    this.configurarPermissoes(usuario);
    this.selectTab();
  }

  private configurarPermissoes(usuario: Usuario) {
    if (
      usuario.permissaoAtual.perfil == PerfilUsuario.Administrador ||
      usuario.permissaoAtual.perfil == PerfilUsuario.Gestor ||
      usuario.permissaoAtual.perfil == PerfilUsuario.GestorDeFornecedores
    )
      this.habilitarDocumentosFornecedor = true;
  }

  public buscar(termo) {
    this.termo = termo;
    this.componenteAtivo.ResetPagination();
    this.componenteAtivo.Hydrate(this.termo);
  }

  public onScroll() {
    this.componenteAtivo.onScroll(this.termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.componenteAtivo.ResetPagination();
    this.componenteAtivo.Hydrate(this.termo);
  }

  public selectTab(aba?: string) {
    if (!aba) this.tabAtiva = 'configuracoes-fornecedor';
    else this.tabAtiva = aba;
  }
}
