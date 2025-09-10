import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ConfirmacaoComponent, ModalConfirmacaoExclusao } from '../../../../shared/components';
import { Situacao } from '../../../../shared/models';
import { Alcada } from '../../../../shared/models/alcada';
import { TipoAlcada } from '../../../../shared/models/enums/tipo-alcada';
import { AlcadaService } from '../../../../shared/providers/alcada.service';

@Component({
  selector: 'app-item-alcada',
  templateUrl: './item-alcada.component.html',
  styleUrls: ['./item-alcada.component.scss'],
})

export class ItemAlcadaComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() alcada: Alcada;
  @Output() reloadList: EventEmitter<any> = new EventEmitter();

  disabled: boolean;
  status = Situacao;

  statusLabel = new Map<number, string>([
    [this.status.Ativo, 'Ativa'],
    [this.status.Inativo, 'Inativa'],
  ]);

  tipo = TipoAlcada;

  constructor(
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private alcadaService: AlcadaService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() { }

  editar(idAlcada: number) {
    this.router.navigate([`alcada/${idAlcada}`], {});
  }

  solicitarAtivacao(idAlcada: number): void {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja ativar a alçada?`;
    modalRef.componentInstance.confirmarLabel = 'Ativar';
    modalRef.result.then(
      (result) => this.ativar(idAlcada),
      (reason) => { },
    );
  }

  solicitarInativacao(idAlcada: number): void {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja inativar a alçada?`;
    modalRef.componentInstance.confirmarLabel = 'Inativar';
    modalRef.result.then(
      (result) => this.inativar(idAlcada),
      (reason) => { },
    );
  }

  solicitarExclusao(idAlcada: number): void {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(idAlcada),
      (reason) => { },
    );
  }

  private ativar(idAlcada: number): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.alcadaService.alterarStatus(idAlcada, Situacao.Ativo)
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
            this.errorService.treatError(error);
          }
          this.blockUI.stop();
        });
  }

  private inativar(idAlcada: number): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.alcadaService.alterarStatus(idAlcada, Situacao.Inativo).pipe(
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
          this.errorService.treatError(error);
        }
        this.blockUI.stop();
      });
  }

  private excluir(idAlcada: number): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.alcadaService.excluir(idAlcada).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.reloadList.emit();
      }, (error) => {
        this.toastr.error(error.error);
        this.blockUI.stop();
      },
      );
  }
}
