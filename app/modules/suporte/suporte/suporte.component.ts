import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionLike } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ModalConfirmacaoExclusao } from '../../../shared/components/modals/confirmacao-exclusao/confirmacao-exclusao.component';
import { Arquivo } from '../../../shared/models/arquivo';
import { SuporteService, TranslationLibraryService } from '../../../shared/providers';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  selector: 'smk-suporte',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.scss'],
})
export class SuporteComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  formAnexos: FormArray;

  private locationSubscription: SubscriptionLike;

  constructor(
    private activeModal: NgbActiveModal,
    private location: Location,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private suporteService: SuporteService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.locationSubscription = this.location.subscribe(() => this.cancelar());
    this.construaForm();
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
    super.ngOnDestroy();
  }

  definaAnexosSelecionados(arquivos: Array<Arquivo>): void {
    arquivos.map((arquivo: Arquivo) => this.formAnexos.push(this.fb.group({
      url: [arquivo.url],
      nome: [arquivo.nome],
      descricaoTamanho: [arquivo.descricaoTamanho],
    })));
  }

  solicitarExclusaoDeAnexo(indice: number) {
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      () => this.formAnexos.removeAt(indice),
      () => { },
    );
  }

  enviar(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.suporteService.envie(this.form.value).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success('Solicitação enviada com sucesso!').onShown.pipe(
              takeUntil(this.unsubscribe))
              .subscribe(() => this.activeModal.close());
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        },
        (error) => this.errorService.treatError(error));
  }

  cancelar(): void {
    this.activeModal.dismiss();
  }

  private construaForm(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      descricao: ['', Validators.required],
      anexos: this.fb.array([]),
    });

    this.formAnexos = this.form.get('anexos') as FormArray;
  }

}
