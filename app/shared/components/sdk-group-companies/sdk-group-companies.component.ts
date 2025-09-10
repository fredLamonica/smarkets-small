import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SituacaoPessoaJuridica } from '@shared/models';
import { ListaPessoaJuridica } from '@shared/models/lista-pessoa-juridica';
import { PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ModalExportarPermissaoComponent } from 'src/app/modules/usuario/permissoes/modal-exportar-permissao/modal-exportar-permissao.component';
import { ErrorService } from '../../utils/error.service';
import { AuditoriaComponent } from '../auditoria/auditoria.component';
import { Unsubscriber } from '../base/unsubscriber';
import { ModalConfirmacaoExclusao } from '../modals/confirmacao-exclusao/confirmacao-exclusao.component';
import { ConfirmacaoComponent } from '../modals/confirmacao/confirmacao.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sdk-group-companies',
  templateUrl: './sdk-group-companies.component.html',
  styleUrls: ['./sdk-group-companies.component.scss'],
})
export class SdkGroupCompaniesComponent extends Unsubscriber implements OnInit {
  @Input() item: ListaPessoaJuridica;
  @BlockUI() blockUI: NgBlockUI;
  @Output() itemChange: EventEmitter<any> = new EventEmitter();
  situacaoItem = SituacaoPessoaJuridica;

  ultimo = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private pessoaJuridicaService: PessoaJuridicaService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private serviceError: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
  }

  exportUsers(idPessoaJuridica: number) {
    const modalRef = this.modalService.open(ModalExportarPermissaoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalRef.componentInstance.idPessoaJuridica = idPessoaJuridica;
  }

  solicitarExclusao(idPessoaJuridica: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(idPessoaJuridica),
        (reason) => { },
      );
  }

  editar(event: Event, idPessoaJuridica) {
    this.stopPropagation(event);
    this.router.navigate([idPessoaJuridica.toString().concat('/dados-gerais')], {
      relativeTo: this.route,
    });
  }

  auditar(event: Event, idPessoaJuridica: number) {
    this.stopPropagation(event);
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'PessoaJuridica';
    modalRef.componentInstance.idEntidade = idPessoaJuridica;
  }

  ativar(pessoaJuridicaId: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja ativar a empresa?';
    modalRef.result.then((result) => {
      if (result) { this.alterarSituacao(pessoaJuridicaId, SituacaoPessoaJuridica.Ativa); }
    });
  }

  inativar(pessoaJuridicaId: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja desativar a empresa?';
    modalRef.result.then((result) => {
      if (result) { this.alterarSituacao(pessoaJuridicaId, SituacaoPessoaJuridica.Inativa); }
    });
  }

  iconClass(item) {
    if (item.holding) {
      return 'fas fa-industry';
    }
    if (item.filial) {
      return 'fas fa-store-alt';
    }

    if (!item.holding && !item.filial && !item.franquia) {
      return 'fas fa-building';
    }

    if (!item.holding && !item.filial && item.franquia) {
      return 'fas fa-store';
    }
  }

  iconSpotColor(item) {
    if (item.holding) {
      return '#27ADE4';
    }
    if (item.filial) {
      return '#B8CAD1';
    }
    if (!item.holding && !item.filial) {
      return '#7DCEEF';
    }
  }

  statusColor(item) {
    switch (item.situacao) {
      case 1:
        return '#8BC34A';
      case 2:
        return '#F44336';
      case 3:
        return '#FF9800';
    }
  }

  statusLabel(item) {
    switch (item.situacao) {
      case 1:
        return 'Ativo';
      case 2:
        return 'Inativo';
      case 3:
        return 'Em Config.';
    }
  }

  private alterarSituacao(pessoaJuridicaId: number, situacao: SituacaoPessoaJuridica) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.alterarSituacao(pessoaJuridicaId, situacao).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.itemChange.emit();
      },
      (error) => {
        this.serviceError.treatError(error);
        this.blockUI.stop();
      },
    );
  }

  private stopPropagation(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private excluir(idPessoaJuridica: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.excluir(idPessoaJuridica).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.itemChange.emit();
      },
      (error) => {
        this.serviceError.treatError(error);
        this.blockUI.stop();
      },
    );
  }
}
