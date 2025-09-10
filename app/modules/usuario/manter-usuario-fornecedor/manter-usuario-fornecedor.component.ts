import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { PerfilUsuario, PerfilUsuarioLabel, PessoaJuridica, SituacaoUsuario, Usuario } from '@shared/models';
import { AutenticacaoService, PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../shared/providers/usuario.service';
import { ModalUsuarioComponent } from './modal-usuario/modal-usuario.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-usuario-fornecedor',
  templateUrl: './manter-usuario-fornecedor.component.html',
  styleUrls: ['./manter-usuario-fornecedor.component.scss'],
})
export class ManterUsuarioFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() showFornecedor: boolean = true;

  //#region Fields

  idPessoaJuridica: number;
  users: Array<Usuario>;
  userProfile = PerfilUsuarioLabel;
  userSituation = SituacaoUsuario;
  disabled: boolean = false;

  private currentUser: Usuario;
  private currentPessoaJuridica: PessoaJuridica;

  //#endregion

  private idTenantFornecedor: number | null;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private userService: UsuarioService,
    private authService: AutenticacaoService,
    private pessoaJuridicaService: PessoaJuridicaService,
  ) { }

  ngOnInit() {
    this.idTenantFornecedor = parseInt(this.route.snapshot.params.idTenantFornecedor) || null;
    this.currentUser = this.authService.usuario();
    this.idPessoaJuridica = this.route.parent.snapshot.params.id;
    this.getCurrentPessoaJuridicaFromPage();
    this.getUsers();
  }

  getUsers() {
    if (this.showFornecedor) {
      this.getUserFromCompany(PerfilUsuario.Fornecedor);
    } else {
      this.getUserFromCompany();
    }
  }

  getCurrentPessoaJuridicaFromPage() {
    this.pessoaJuridicaService.obterPorId(this.idPessoaJuridica).subscribe(
      (response) => {
        if (response) {
          this.currentPessoaJuridica = response;
        }
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      },
    );
  }

  criarUsuario() {
    const modalRef = this.modalService.open(ModalUsuarioComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.componentInstance.criacao = true;
    modalRef.componentInstance.idPessoaJuridica = this.idPessoaJuridica;
    modalRef.componentInstance.currentPessoaJuridica = this.currentPessoaJuridica;
    modalRef.componentInstance.isUserSupplier = this.showFornecedor;
    modalRef.result.then((result) => {
      if (result) {
        this.getUsers();
      }
    });
  }

  //#region Comprador

  editaUsuarario(user: Usuario) {
    if (!this.currentUser.permissaoAtual.isSmarkets) {
      return;
    }

    const modalRef = this.modalService.open(ModalUsuarioComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.componentInstance.idPessoaJuridica = this.idPessoaJuridica;
    modalRef.componentInstance.currentPessoaJuridica = this.currentPessoaJuridica;
    modalRef.componentInstance.usuario = user;
    modalRef.componentInstance.isUserSupplier = this.showFornecedor;
    modalRef.result.then((result) => {
      if (result) {
        this.getUsers();
      }
    });
  }

  canIncludUser() {
    const isSupplierProfile =
      !this.idTenantFornecedor &&
      this.currentUser.permissaoAtual.perfil == PerfilUsuario.Fornecedor;

    const isMineSupplier = this.idTenantFornecedor
      ? this.idTenantFornecedor == this.currentUser.permissaoAtual.idTenant
      : false;

    return isSupplierProfile || isMineSupplier;
  }

  solicitarRemocaoVinculo(user: Usuario) {
    this.disabled = true;
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      windowClass: 'modal-desvinculo',
    });
    modalRef.componentInstance.confirmacao = `<p>Deseja realmente desvincular o <strong>${user.pessoaFisica.nome.toUpperCase()}</strong>?</p>`;
    modalRef.componentInstance.confirmarLabel = 'Desvincular';
    modalRef.componentInstance.html = true;
    modalRef.componentInstance.cancelarLabel = 'Cancelar';
    modalRef.result.then((result) => {
      if (result) {
        this.removerVinculo(user);
      }
      this.disabled = false;
    });
  }

  getIconClass(situacaoUsuario: SituacaoUsuario): string {
    switch (situacaoUsuario) {
      case SituacaoUsuario.Liberado:
      case SituacaoUsuario.BloqueadoPorExcessoTentativas:
        return 'fas fa-user';

      case SituacaoUsuario.Bloqueado:
        return 'fas fa-user-slash';

      default:
        break;
    }
  }

  getStausLabel(situacaoUsuario: SituacaoUsuario): string {
    switch (situacaoUsuario) {
      case SituacaoUsuario.Liberado:
        return 'Ativo';

      case SituacaoUsuario.Bloqueado:
        return 'Bloqueado';

      case SituacaoUsuario.BloqueadoPorExcessoTentativas:
        return 'Trancado';
      default:
        break;
    }
  }

  getIconSpotColor(status: SituacaoUsuario): string {
    switch (status) {
      case SituacaoUsuario.Bloqueado:
        return '#f9a19a';
      case SituacaoUsuario.BloqueadoPorExcessoTentativas:
        return '#ffb74d';
      case SituacaoUsuario.Liberado:
        return '#aed580';
      default:
        return '';
    }
  }

  getColorOnHover(status: SituacaoUsuario): string {
    switch (status) {
      case SituacaoUsuario.Bloqueado:
        return '#F44336';
      case SituacaoUsuario.BloqueadoPorExcessoTentativas:
        return '#ff9800';
      case SituacaoUsuario.Liberado:
        return '#8BC34A';
      default:
        return '';
    }
  }

  private getUserFromCompany(perfil?: PerfilUsuario) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.userService.getUsersFromPessoaJuridica(this.idPessoaJuridica, perfil).subscribe(
      (response) => {
        if (response) {
          this.users = response;
        } else {
          this.users = new Array<Usuario>();
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private removerVinculo(user: Usuario) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const idUsuario = user.idUsuario;
    const permissao = user.permissoes.filter(
      permissao => permissao.pessoaJuridica.idPessoaJuridica == this.idPessoaJuridica,
    );
    this.userService.removerPermissoes(idUsuario, permissao).subscribe(
      (response) => {
        if (response) {
          this.getUsers();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        }
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  // #end region Comprador
}
