import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent } from '@shared/components';
import { PerfilUsuario, Usuario } from '@shared/models';
import { StatusSolicitacaoFornecedor, StatusSolicitacaoFornecedorLabel } from '@shared/models/enums/status-solicitacao-fornecedor';
import { TranslationLibraryService } from '@shared/providers';
import { SlaSolicitacaoService } from '@shared/providers/sla-solicitacao.service';
import { SolicitacaoCadastroFornecedorService } from '@shared/providers/solicitacao-cadastro-fornecedor.service';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../../shared/components/base/unsubscriber';
import { AprovarSolicitacaoFornecedorDto } from '../../../../../shared/models/dto/aprovar-solicitacao-fornecedor-dto';
import { OrigemSolicitacao } from '../../../../../shared/models/enums/origem-solicitacao.enum';
import { ModalMotivoCancelamentoComponent } from './modal-motivo-cancelamento/modal-motivo-cancelamento.component';
import { ModalObservacoesComponent } from './modal-observacoes/modal-observacoes.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'item-solicitacao-cadastro-fornecedor',
  templateUrl: './item-solicitacao-cadastro-fornecedor.component.html',
  styleUrls: ['./item-solicitacao-cadastro-fornecedor.component.scss'],
})
export class ItemSolicitacaoCadastroFornecedorComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() solicitacaoCadastroFornecedor: any;
  @Input() user: Usuario;
  @Output() reloadList: EventEmitter<any> = new EventEmitter();
  disabled: boolean = false;
  statusLabel = StatusSolicitacaoFornecedorLabel;
  status = StatusSolicitacaoFornecedor;
  perfilUsuario = PerfilUsuario;

  constructor(
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private slaSolicitacaoService: SlaSolicitacaoService,
    private toastr: ToastrService,
    private solicitacaoCadastroFornecedorService: SolicitacaoCadastroFornecedorService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() { }

  auditar(idSolicitacao) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nomeClasse = 'SolicitacaoFornecedor';
    modalRef.componentInstance.idEntidade = idSolicitacao;
  }

  editar(idSolicitacao: number) {
    this.router.navigate([`fornecedores/manter-solicitacao-fornecedor/dados-gerais/${idSolicitacao}`], {

    });
  }

  observacao(idSolicitacao: number, status: number): void {
    const modalRef = this.modalService.open(ModalObservacoesComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.idSolicitacaoFornecedor = idSolicitacao;
    modalRef.componentInstance.statusItem = status;
    modalRef.componentInstance.quantidadeDeCaracteres = 450;
  }

  cancelar(idSolicitacao) {
    const modalRef = this.modalService.open(ModalMotivoCancelamentoComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.idSolicitacao = idSolicitacao;

    modalRef.result.then((result) => {
      if (result) {
        this.reloadList.emit();
      }
    });
  }

  assumir(idSolicitacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCadastroFornecedorService.assumeRequest(idSolicitacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.reloadList.emit();
        this.blockUI.stop();
      }, (error) => {
        if (error.error) {
          error.error.forEach((e) => {
            this.toastr.warning(e.message);
          });
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      });
  }

  enviarSolicitacao(idSolicitacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCadastroFornecedorService.sendRequest(idSolicitacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.reloadList.emit();
        this.blockUI.stop();
      },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }

  reprovar(idSolicitacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCadastroFornecedorService.disapproveRequest(idSolicitacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.reloadList.emit();
        this.blockUI.stop();
      }, (error) => {
        if (error.error) {
          error.error.forEach((e) => {
            this.toastr.warning(e.message);
          });
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      });
  }

  aprovar(idSolicitacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const aprovarSolicitacaoFornecedorDto: AprovarSolicitacaoFornecedorDto = new AprovarSolicitacaoFornecedorDto({ origem: OrigemSolicitacao.MarketPlace });

    this.solicitacaoCadastroFornecedorService.approveRequest(idSolicitacao, aprovarSolicitacaoFornecedorDto)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (res) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.reloadList.emit();
          this.blockUI.stop();
        }, (error) => {
          if (error.error) {
            error.error.forEach((e) => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        });
  }

  isSmarketsOrHolding() {
    return (this.user.permissaoAtual.isSmarkets || this.user.permissaoAtual.pessoaJuridica.holding);
  }

  statusIsRequested() {
    return (this.solicitacaoCadastroFornecedor.status === this.status.Solicitado);
  }

  statusIsInConfiguration() {
    return this.solicitacaoCadastroFornecedor.status === this.status.EmConfiguracao;
  }

  userIsManagerOrAdminOrRegistrar() {
    return this.user.permissaoAtual.perfil === this.perfilUsuario.Gestor ||
      this.user.permissaoAtual.perfil === this.perfilUsuario.Administrador ||
      this.user.permissaoAtual.perfil === this.perfilUsuario.Cadastrador;
  }

  responsibleUserIsLoggedInUser() {
    return (this.solicitacaoCadastroFornecedor.idUsuarioResponsavel === this.user.idUsuario);
  }

  requestingUserIsLoggedInUser() {
    return this.solicitacaoCadastroFornecedor.idUsuarioSolicitante === this.user.idUsuario;
  }

  companyIsRequesting() {
    if (this.solicitacaoCadastroFornecedor.solicitadoPor === 1 && (this.user.permissaoAtual.isSmarkets || this.user.permissaoAtual.pessoaJuridica.holding)) {
      return true;
    }

    if (this.solicitacaoCadastroFornecedor.solicitadoPor === 2 && this.user.permissaoAtual.pessoaJuridica.holding) {
      return true;
    }

    if (this.user.permissaoAtual.isSmarkets) {
      return true;
    }

    if (this.ehEstruturaConvencional()) {
      return true;
    }

    return false;
  }

  ehEstruturaConvencional() {
    return !this.user.permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai;
  }

  editionEnabled() {
    // Condição 1: o usuário for o solicitante, o perfil do usuário for de comprador ou requisitante, E o status do cadastro estiver como 'Reprovado'...
    if (((this.user.permissaoAtual.perfil === this.perfilUsuario.Comprador || this.user.permissaoAtual.perfil === this.perfilUsuario.Requisitante)
      && this.user.idUsuario === this.solicitacaoCadastroFornecedor.idUsuarioSolicitante
      && this.solicitacaoCadastroFornecedor.status === this.status.Reprovado)
      // OU condição 2 : se a empresa for a Smarkets ou uma holding E o usuário for um gestor, E o status do cadastro estiver como 'Solicitado' ou 'Reprovado'...
      || (this.isSmarketsOrHolding()
        && this.userIsManagerOrAdminOrRegistrar()
        && (this.solicitacaoCadastroFornecedor.status === this.status.Solicitado || this.solicitacaoCadastroFornecedor.status === this.status.Reprovado))
      // OU condição 3: o usuário for o solicitante E o status do cadastro estiver como 'Em Configuração'.
      || (this.user.idUsuario === this.solicitacaoCadastroFornecedor.idUsuarioSolicitante && this.solicitacaoCadastroFornecedor.status === this.status.EmConfiguracao)
    ) {
      return true;
    }

    return false;
  }

}
