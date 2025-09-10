import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NivelParticipante, Usuario } from '@shared/models';
import { DepartamentoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-nivel-participante',
  templateUrl: './manter-nivel-participante.component.html',
  styleUrls: ['./manter-nivel-participante.component.scss'],
})
export class ManterNivelParticipanteComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('id-nivel') idNivel: number;

  // tslint:disable-next-line: no-input-rename
  @Input('id-nivel-participante') idNivelParticipante: number;

  @Input() niveisParticipantes: Array<NivelParticipante>;

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  usuarios: Array<Usuario>;
  ordemMaxima: number;
  idUsuario: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private departamentoService: DepartamentoService,
    private usuarioService: UsuarioService,
  ) { }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    await this.obterUsuarios();

    this.obterOrdemMaximaPermitida();

    if (this.idNivelParticipante) {
      this.obterNivelParticipante();
    } else {
      this.blockUI.stop();
    }
  }

  async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      const nivelParticipante: NivelParticipante = this.form.value;
      if (this.idNivelParticipante) {
        this.alterar(nivelParticipante);
      } else {
        this.inserir(nivelParticipante);
      }
    } else {
      this.blockUI.stop();
    }
  }

  cancelar() {
    this.activeModal.close();
  }

  private async obterUsuarios() {
    this.usuarios = await this.usuarioService.listar().toPromise();
  }

  private obterOrdemMaximaPermitida() {
    if (this.niveisParticipantes == null) {
      this.ordemMaxima = 1;
    } else if (this.idNivelParticipante) {
      this.ordemMaxima = this.niveisParticipantes.length;
    } else {
      this.ordemMaxima = this.niveisParticipantes.length + 1;
    }

    this.form.controls.ordem.setValidators(Validators.compose([Validators.required, Validators.min(1), Validators.max(this.ordemMaxima)]));
    this.form.controls.ordem.updateValueAndValidity();

    if (!this.idNivelParticipante) {
      this.form.patchValue({ ordem: this.ordemMaxima });
    }
  }

  private obterNivelParticipante() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.departamentoService.obterNivelParticipantePorId(this.idNivelParticipante).subscribe(
      (response) => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idUsuario: [null, Validators.required],
      ordem: [null],
    });
  }

  private preencherFormulario(nivelParticipante: NivelParticipante) {
    this.form.patchValue(nivelParticipante);

    if (this.form.value.idUsuario != null) {
      this.idUsuario = this.form.value.idUsuario;
      this.form.controls.idUsuario.disable();
    }
  }

  private formularioValido(): boolean {
    // ordem
    if (this.form.controls.ordem.invalid) {
      if (this.form.controls.ordem.errors.min) {
        this.toastr.warning('Menor valor permitido para "Ordem" é 1');
      } else if (this.form.controls.ordem.errors.max) {
        this.toastr.warning('Maior valor permitido para lote mínimo é ' + this.ordemMaxima);
      } else {
        this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      }
      return false;
    }

    // required
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (!this.idNivelParticipante && !this.isUsuarioValido(this.form.value.idUsuario)) {
      this.toastr.warning('O usuário selecionado já é um participante.');
      return false;
    }

    return true;
  }

  private isUsuarioValido(idUsuario: number): boolean {
    if (this.niveisParticipantes) {
      const index = this.niveisParticipantes.findIndex((participante) => participante.usuario.idUsuario == idUsuario);
      if (index != -1) {
        return false;
      }
    }

    return true;
  }

  private inserir(nivelParticipante: NivelParticipante) {
    nivelParticipante.idNivel = this.idNivel;
    this.departamentoService.inserirNivelParticipante(nivelParticipante).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(response);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private alterar(nivelParticipante: NivelParticipante) {
    nivelParticipante.idNivelParticipante = this.idNivelParticipante;
    nivelParticipante.idNivel = this.idNivel;
    nivelParticipante.idUsuario = this.idUsuario;
    this.departamentoService.alterarNivelParticipante(nivelParticipante).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(nivelParticipante);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
