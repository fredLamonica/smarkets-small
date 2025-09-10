import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Autenticacao } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UniversalValidators } from 'ng2-validators';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
})
export class RecuperarSenhaComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.criarFormulario();
  }

  recuperarSenha() {
    if (this.form.valid) {
      this.solicitarRecuperarSenha();
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  voltar() {
    this.router.navigate(['/auth/login']);
  }

  private criarFormulario() {
    this.form = this.formBuilder.group({
      identificador: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
    });
  }

  private solicitarRecuperarSenha() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const form = this.form.value;
    this.authService.recuperarSenha(new Autenticacao(form.identificador, null, null)).pipe(
      takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.PAGES.AUTH.PASSWORD_RESET_SUCCESS, null, {
          timeOut: 25000,
        });
        this.blockUI.stop();
      },
      (error) => {
        this.errorService.treatError(error);
        this.blockUI.stop();
      },
    );
  }
}
