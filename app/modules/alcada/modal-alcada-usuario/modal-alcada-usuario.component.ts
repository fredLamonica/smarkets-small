import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionLike } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { Usuario } from '../../../shared/models';
import { AlcadaNivelUsuario } from '../../../shared/models/alcada-nivel-usuario';
import { TranslationLibraryService } from '../../../shared/providers';
import { UsuarioService } from '../../../shared/providers/usuario.service';

@Component({
  selector: 'app-modal-alcada-usuario',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  templateUrl: './modal-alcada-usuario.component.html',
  styleUrls: ['./modal-alcada-usuario.component.scss'],
})
export class ModalAlcadaUsuarioComponent extends Unsubscriber implements OnInit, OnDestroy {

  alcadaNivelUsuario: AlcadaNivelUsuario;
  form: FormGroup;
  ordemMaxima: number = 1;
  usuarios: Array<Usuario>;
  loadingUsuarios: boolean = true;
  locationSubscription: SubscriptionLike;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private usuarioService: UsuarioService,
    private location: Location,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormulario();
    this.obterUsuarios();
    this.preencherFormulario();

    this.locationSubscription = this.location.subscribe(() => this.activeModal.dismiss());
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
    super.ngOnDestroy();
  }

  cancelar() {
    this.activeModal.close();
  }

  salvar() {
    if (this.formularioValido()) {
      const nome = this.usuarios.filter((u) => u.idUsuario === this.form.get('idUsuario').value)[0].pessoaFisica.nome;
      this.form.controls.nome.setValue(nome);
      this.activeModal.close(this.form.getRawValue());
    }
  }

  usuarioSearchFn(term: string, item: Usuario) {
    term = term.toLowerCase();
    return item.pessoaFisica.nome.toLowerCase().indexOf(term) > -1;
  }

  private obterUsuarios() {
    this.usuarioService.listarAlcadaParticipantes().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.loadingUsuarios = false),
    ).subscribe((response) => this.usuarios = response);
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      idUsuario: [null, Validators.required],
      nome: [null],
      ordem: [this.ordemMaxima],
    });

    this.form.controls.ordem.setValidators(Validators.compose([Validators.required, Validators.min(1), Validators.max(this.ordemMaxima)]));
    this.form.controls.ordem.updateValueAndValidity();
  }

  private preencherFormulario() {
    if (this.alcadaNivelUsuario) {

      this.form.patchValue(this.alcadaNivelUsuario);
      this.form.controls.idUsuario.disable();
    }
  }

  private formularioValido(): boolean {

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

    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

}
