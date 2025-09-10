import { PessoaJuridicaService } from './../../../shared/providers/pessoa-juridica.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListaPessoaJuridica } from '@shared/models/lista-pessoa-juridica';
import {
  AuditoriaComponent,
  ConfirmacaoComponent,
  ModalConfirmacaoExclusao
} from '@shared/components';
import { Router } from '@angular/router';
import { ModalExportarPermissaoComponent } from '../../usuario/permissoes/modal-exportar-permissao/modal-exportar-permissao.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SituacaoPessoaJuridica } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'item-pessoa-juridica',
  templateUrl: './item-pessoa-juridica.component.html',
  styleUrls: ['./item-pessoa-juridica.component.scss']
})
export class ItemPessoaJuridicaComponent implements OnInit {
  @Input() pessoaJuridica: ListaPessoaJuridica;
  @BlockUI() blockUI: NgBlockUI;
  @Output() itemChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private pessoaJuridicaService: PessoaJuridicaService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService
  ) {}

  public auditar(event: Event, idPessoaJuridica: number) {
    this.stopPropagation(event);
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'PessoaJuridica';
    modalRef.componentInstance.idEntidade = idPessoaJuridica;
  }

  public editar(event: Event, idPessoaJuridica) {
    this.stopPropagation(event);
    this.router.navigate([`empresas/${idPessoaJuridica}`]);
  }

  public exportUsers(idPessoaJuridica: number) {
    const modalRef = this.modalService.open(ModalExportarPermissaoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    
    modalRef.componentInstance.idPessoaJuridica = idPessoaJuridica;
  }

  private stopPropagation(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  ngOnInit() {}

  public solicitarExclusao(idPessoaJuridica: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.excluir(idPessoaJuridica),
        reason => {}
      );
  }

  private excluir(idPessoaJuridica: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.excluir(idPessoaJuridica).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.itemChange.emit();
      },
      error => {
        this.toastr.error(error.error);
        this.blockUI.stop();
      }
    );
  }

  public ativar(pessoaJuridicaId: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja ativar a empresa?';
    modalRef.result.then(result => {
      if (result) this.alterarSituacao(pessoaJuridicaId, SituacaoPessoaJuridica.Ativa);
    });
  }

  public inativar(pessoaJuridicaId: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja desativar a empresa?';
    modalRef.result.then(result => {
      if (result) this.alterarSituacao(pessoaJuridicaId, SituacaoPessoaJuridica.Inativa);
    });
  }

  private alterarSituacao(pessoaJuridicaId: number, situacao: SituacaoPessoaJuridica) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.alterarSituacao(pessoaJuridicaId, situacao).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.itemChange.emit();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
}
