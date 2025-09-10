import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import {
  PerfilUsuario,
  PerfilUsuarioLabel, SituacaoUsuario, Usuario
} from '@shared/models';
import { SolicitacaoFornecedorUsuario } from '@shared/models/solicitacao-fornecedor-usuarios';
import {
  AutenticacaoService, TranslationLibraryService
} from '@shared/providers';
import { SolicitacaoCadastroFornecedorService } from '@shared/providers/solicitacao-cadastro-fornecedor.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ModalUsuarioSolicitacaoFornecedorComponent } from './modal-usuario/modal-usuario.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() showFornecedor: boolean = true;

  idPessoaJuridica: number;
  users: Array<SolicitacaoFornecedorUsuario>;
  userProfile = PerfilUsuarioLabel;
  userSituation = SituacaoUsuario;
  disabled: boolean = false;
  usuarioSolicitante: boolean = true;

  private currentUser: Usuario;
  private idTenantFornecedor: number | null;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private authService: AutenticacaoService,
    private solicitacaoCadastroFornecedorService: SolicitacaoCadastroFornecedorService,
  ) {
    super();
  }

  ngOnInit() {
    this.currentUser = this.authService.usuario();
    this.idPessoaJuridica = this.route.snapshot.params.id;
    this.getUserFromCompany();
  }

  criarUsuario() {
    const modalRef = this.modalService.open(ModalUsuarioSolicitacaoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.componentInstance.criacao = true;
    modalRef.componentInstance.idPessoaJuridica = this.idPessoaJuridica;
    modalRef.result.then((result) => {
      if (result) {
        this.getUserFromCompany();
      }
    });
  }

  editaUsuarario(user: SolicitacaoFornecedorUsuario) {

    const modalRef = this.modalService.open(ModalUsuarioSolicitacaoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.componentInstance.idPessoaJuridica = this.idPessoaJuridica;
    modalRef.componentInstance.usuario = user;
    modalRef.componentInstance.idSolicitacaoFornecedorUsuarios = user.idSolicitacaoFornecedorUsuarios;
    modalRef.result.then((result) => {
      if (result) {
        this.getUserFromCompany();
      }
    });
  }

  canIncludUser() {
    const isSupplierProfile =
      !this.idTenantFornecedor &&
      this.currentUser.permissaoAtual.perfil === PerfilUsuario.Fornecedor;

    const isMineSupplier = this.idTenantFornecedor
      ? this.idTenantFornecedor === this.currentUser.permissaoAtual.idTenant
      : false;

    return isSupplierProfile || isMineSupplier;
  }

  solicitarRemocaoVinculo(user: SolicitacaoFornecedorUsuario) {
    this.disabled = true;
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      windowClass: 'modal-desvinculo',
    });
    modalRef.componentInstance.confirmacao = `<p>Deseja realmente desvincular o <strong>${user.nome.toUpperCase()}</strong>?</p>`;
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

  private getUserFromCompany() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoCadastroFornecedorService.getUsuarioSolicitante(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe),
      switchMap((usuario) => {
        const usuarioLogado: Usuario = this.authService.usuario();

        if (usuarioLogado && usuarioLogado.permissaoAtual && usuarioLogado.permissaoAtual.idUsuario !== usuario.idUsuario) {
          this.usuarioSolicitante = false;
        }

        return this.solicitacaoCadastroFornecedorService.getUsersFromPessoaJuridica(this.idPessoaJuridica);
      }))
      .subscribe(
        (response) => {
          if (response) {
            this.users = response;
          } else {
            this.users = new Array<SolicitacaoFornecedorUsuario>();
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private removerVinculo(user: SolicitacaoFornecedorUsuario) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoCadastroFornecedorService.deleteUser(user).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.getUserFromCompany();
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
}
