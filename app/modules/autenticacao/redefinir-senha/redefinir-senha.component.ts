import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Autenticacao } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UniversalValidators } from 'ng2-validators';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.scss'],
})
export class RedefinirSenhaComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  senhaContemLetraMaiuscula: boolean = true;
  senhaContemLetraMinuscula: boolean = true;
  senhaContemNumero: boolean = true;
  senhaContemCaracterEspecial: boolean = true;
  senhaMaiorOitoCaracter: boolean = true;
  senhaIguais: boolean = true;
  returnUrl: string;
  idTenant: number;

  private identificador: string;
  private changePasswordToken: string;
  private paramsSubs: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.criarFormulario();
    this.getParameters();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.idTenant = +this.route.snapshot.queryParams['idTenant'] || null;

    this.blockUI.stop();
  }

  redefinirSenha() {
    if (this.validForm()) { this.solicitarRedefinicaoSenha(); }
  }

  validarSenha() {
    const senha = this.form.value.novaSenha;
    this.senhaMaiorOitoCaracter = senha.length >= 8;
    this.senhaContemLetraMinuscula = /[a-z]/.test(senha);
    this.senhaContemLetraMaiuscula = /[A-Z]/.test(senha);
    this.senhaContemNumero = /\d/.test(senha);
    this.senhaContemCaracterEspecial = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
  }

  validarSenhasIguais() {
    this.senhaIguais = this.form.value.novaSenha === this.form.value.confirmacaoNovaSenha;
  }

  private criarFormulario() {
    this.form = this.formBuilder.group({
      novaSenha: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
      confirmacaoNovaSenha: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
    });
  }

  private getParameters() {
    this.paramsSubs = this.route.queryParams.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (params) => {
          this.changePasswordToken = params['token'];

          if (!this.changePasswordToken) {
            this.navegueParaLogin();
          }

          try {
            const tokenDecodificado = this.authService.obtenhaTokenDecodificado(this.changePasswordToken);

            if (!tokenDecodificado.primeiroAcesso && !tokenDecodificado.recuperacaoDeSenha) {
              this.navegueParaLogin();
            }
          } catch (error) {
            this.navegueParaLogin();
          }
        });
  }

  private solicitarRedefinicaoSenha() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const form = this.form.value;
    const autenticacao = new Autenticacao(this.identificador, form.novaSenha, this.idTenant);

    this.authService.redefinirSenha(autenticacao, this.changePasswordToken).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(
              this.translationLibrary.translations.PAGES.AUTH.PASSWORD_CHANGED_SUCCESSFULLY,
            );

            this.navegueParaLogin();
          }
        },
        (error) => {
          if (error && error.status === 401) {
            this.toastr.error(this.translationLibrary.translations.ALERTS.UNAUTHORIZED);
          } else {
            this.errorService.treatError(error);
          }
          this.blockUI.stop();
        },
      );
  }

  private navegueParaLogin() {
    this.router.navigate(['/auth/login']);
  }

  private validForm(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (
      !this.senhaMaiorOitoCaracter ||
      !this.senhaContemLetraMinuscula ||
      !this.senhaContemLetraMaiuscula ||
      !this.senhaContemNumero ||
      !this.senhaContemCaracterEspecial
    ) {
      this.toastr.warning(this.translationLibrary.translations.PAGES.AUTH.PASSWORD_INVALID);
      return false;
    }

    if (!this.senhaIguais) {
      this.toastr.warning(this.translationLibrary.translations.PAGES.AUTH.PASSWORD_CONFIRMATION_NOT_MATCH);
      return false;
    }

    return true;
  }
}
