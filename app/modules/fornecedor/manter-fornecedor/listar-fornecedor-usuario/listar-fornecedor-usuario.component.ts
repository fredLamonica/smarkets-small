import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { Ordenacao, PerfilUsuario, PessoaJuridica, SituacaoUsuario, Usuario } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../shared/providers/usuario.service';
import { ManterFornecedorUsuarioComponent } from '../../manter-fornecedor-usuario/manter-fornecedor-usuario.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'listar-fornecedor-usuario',
  templateUrl: './listar-fornecedor-usuario.component.html',
  styleUrls: ['./listar-fornecedor-usuario.component.scss'],
})
export class ListarFornecedorUsuarioComponent implements OnInit {

  get flagPermitirEdicaoUsuario() {
    return this._flagPermitirEdicaoUsuario;
  }

  get flagPermitirRemocaoVinculo() {
    return this._flagPermitirRemocaoVinculo;
  }
  @BlockUI() blockUI: NgBlockUI;

  usuarios: Array<Usuario>;

  // tslint:disable-next-line: no-input-rename
  @Input('id-pessoa-juridica') idPessoaJuridica: number;

  // tslint:disable-next-line: no-input-rename
  @Input('pessoa-juridica') pessoaJuridica: PessoaJuridica;

  PerfilUsuario = PerfilUsuario;
  SituacaoUsuario = SituacaoUsuario;

  registrosPorPagina: number = 10;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'pf.Nome';
  ordenacao: Ordenacao = Ordenacao.ASC;

  private _flagPermitirEdicaoUsuario: boolean;
  private _flagPermitirRemocaoVinculo: boolean;

  constructor(
    private usuarioService: UsuarioService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this._flagPermitirEdicaoUsuario = this.permitirEdicaoUsuario();
    this._flagPermitirRemocaoVinculo = this.permitirRemocaoVinculo();
    this.obterUsuarios();
  }

  incluirUsuario() {
    const idTenantFornecedor = this.pessoaJuridica.idTenant;

    const modalRef = this.modalService.open(ManterFornecedorUsuarioComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.idTenantFornecedor = idTenantFornecedor;

    modalRef.result.then((result) => {
      if (result) {
        this.obterUsuarios();
      }
    });
  }

  editar(usuario: Usuario) {
    const idTenantFornecedor = this.pessoaJuridica.idTenant;

    const modalRef = this.modalService.open(ManterFornecedorUsuarioComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.idTenantFornecedor = idTenantFornecedor;
    modalRef.componentInstance.usuario = usuario;

    modalRef.result.then((result) => {
      if (result) {
        this.obterUsuarios();
      }
    });
  }

  solicitarRemocaoVinculo(usuario: Usuario) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja desfazer o vínculo desse usuário?`;
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then((result) => {
      if (result) {
        this.removerVinculo(usuario);
      }
    });
  }

  permitirEdicaoUsuario(): boolean {
    const idTenantPermissao = this.authService.usuario().permissaoAtual.idTenant;
    if (idTenantPermissao == 1) {
      // IdTenant Master(Smarkets)
      return true;
    }

    return false;
  }

  permitirRemocaoVinculo(): boolean {
    const perfilUsuarioLogado = this.authService.usuario().permissaoAtual.perfil;
    const perfisComPermissao = [PerfilUsuario.Administrador, PerfilUsuario.Gestor];

    if (perfisComPermissao.includes(perfilUsuarioLogado)) {
      return true;
    }

    return false;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterUsuarios();
  }

  private obterUsuarios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService
      .obterPorPessoaJuridica(
        this.idPessoaJuridica,
        this.registrosPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.usuarios = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.usuarios = new Array<Usuario>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private removerVinculo(usuario: Usuario) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const idUsuario = usuario.idUsuario;
    const permissao = usuario.permissoes.filter(
      permissao => permissao.pessoaJuridica.idPessoaJuridica == this.idPessoaJuridica,
    );
    this.usuarioService.removerPermissoes(idUsuario, permissao).subscribe(
      (response) => {
        this.obterUsuarios();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
