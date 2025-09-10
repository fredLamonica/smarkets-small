import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { UniversalValidators } from 'ng2-validators';
import { finalize, takeUntil } from 'rxjs/operators';
import { MfaCodeComponent } from '../base/mfa-code.component';

@Component({
  selector: 'smk-recovery-code',
  templateUrl: './recovery-code.component.html',
  styleUrls: ['./recovery-code.component.scss'],
})
export class RecoveryCodeComponent extends MfaCodeComponent implements OnInit, AfterViewInit {

  @ViewChild('recoveryCode') recoveryCodeElement: ElementRef<HTMLInputElement>;

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.recoveryCodeElement.nativeElement.focus();
  }

  authenticate(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.authService.autentiquePeloCodigoDeRecuperacao(this.token, this.form.value.recoveryCode).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (token) => {
          const decodedAccessAuthorizedToken = this.authService.obtenhaTokenDecodificado(token);

          if (decodedAccessAuthorizedToken.acessoAutorizado) {
            this.authService.atualizeTokenDeAcesso(token);
            this.navigateToHome();
          } else {
            this.navigate(['/auth/login']);
          }
        },
        (error) => this.errorService.treatError(error));
  }

  navigateToPinCode(): void {
    this.navigate(['auth', 'mfa', 'pin-code', this.token]);
  }

  private buildForm(): void {
    this.form = this.fb.group({
      recoveryCode: [
        '',
        Validators.compose([
          Validators.required, UniversalValidators.noEmptyString,
          UniversalValidators.minLength(8),
          UniversalValidators.maxLength(8),
        ]),
      ],
    });
  }

}
