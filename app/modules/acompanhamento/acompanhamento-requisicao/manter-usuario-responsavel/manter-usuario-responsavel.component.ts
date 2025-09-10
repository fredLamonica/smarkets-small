import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequisicaoItem, Usuario } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { RequisicaoService } from '../../../../shared/providers/requisicao.service';
import { UsuarioService } from '../../../../shared/providers/usuario.service';
import { ErrorService } from '../../../../shared/utils/error.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-usuario-responsavel',
  templateUrl: './manter-usuario-responsavel.component.html',
  styleUrls: ['./manter-usuario-responsavel.component.scss'],
})
export class ManterUsuarioResponsavelComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  requisicaoItem: RequisicaoItem;
  form: FormGroup;
  usuarios: Array<Usuario>;
  modoId: boolean;
  idRequisicaoItem: number;
  idUsuarioResponsavel: number;

  constructor(
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public requisicaoService: RequisicaoService,
    private usuarioService: UsuarioService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idUsuarioResponsavel: [this.modoId ? this.idUsuarioResponsavel : this.requisicaoItem.idUsuarioResponsavel, Validators.required],
    });

    this.obterUsuarios();
  }

  alterarResponsavel() {
    if (this.form.valid) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.service().pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.blockUI.stop()))
        .subscribe(
          () => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.activeModal.close(this.requisicaoItem);
          },
          (error) => this.errorService.treatError(error));
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  obterUsuarios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.usuarioService.listarUsuarioReponsavelRequisicao().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.usuarios = response;
          }
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  cancelar() {
    this.activeModal.close();
  }

  private service(): Observable<number> {
    if (this.modoId) {
      return this.requisicaoService.alterarResponsavelPorId(this.idRequisicaoItem, this.form.value.idUsuarioResponsavel);
    } else {
      this.requisicaoItem.idUsuarioResponsavel = this.form.value.idUsuarioResponsavel;
      this.requisicaoItem.usuarioResponsavel = this.usuarios.find((usuario) => usuario.idUsuario === this.requisicaoItem.idUsuarioResponsavel);

      return this.requisicaoService.alterarResponsavel(this.requisicaoItem);
    }
  }

}
