import { Component, ElementRef, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UniversalValidators } from 'ng2-validators';
import { finalize, takeUntil } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { MfaCodeComponent } from '../base/mfa-code.component';
import { MfaSetup } from '../models/mfa-setup';

@Component({
  selector: 'smk-pin-code',
  templateUrl: './pin-code.component.html',
  styleUrls: ['./pin-code.component.scss'],
})
export class PinCodeComponent extends MfaCodeComponent implements OnInit {

  @ViewChild('modalRecoveryCodes') modalRecoveryCodes: TemplateRef<any>;

  @ViewChild('pinCode') set pinCodeElement(pinCodeElementRef: ElementRef<HTMLInputElement>) {
    if (pinCodeElementRef) {
      pinCodeElementRef.nativeElement.focus();
    }
  }

  setupMode: boolean;
  readQrcode: boolean;
  mfaSetup: MfaSetup;
  recoveryCodes: Array<string>;

  maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    allowDecimal: false,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 6,
  });

  constructor(private modalService: NgbModal, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.decodedToken) {
      this.setupMode = this.decodedToken.algumaEmpresaUtilizaMfa && !this.decodedToken.usuarioPossuiMfaConfigurado;
    }

    this.initialize();
  }

  authenticate(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.cdr.detectChanges();

    this.authService.autentiquePeloCodigoPin(this.token, this.form.value.pinCode).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (token) => {
          const decodedAccessAuthorizedToken = this.authService.obtenhaTokenDecodificado(token);

          if (decodedAccessAuthorizedToken.acessoAutorizado) {
            this.authService.atualizeTokenDeAcesso(token);

            if (this.setupMode) {
              this.authService.obtenhaCodigosDeRecuperacao().pipe(
                takeUntil(this.unsubscribe))
                .subscribe(
                  (recoveryCodes: Array<string>) => {
                    this.recoveryCodes = recoveryCodes;

                    this.modalService.open(this.modalRecoveryCodes, { centered: true, backdrop: 'static', keyboard: false }).result.then(
                      () => this.navigateToHome(),
                      () => this.navigateToHome());
                  },
                  () => this.navigateToLogin());
            } else {
              this.navigateToHome();
            }
          } else {
            this.navigateToLogin();
          }
        },
        (error) => this.errorService.treatError(error));
  }

  continue(): void {
    this.readQrcode = true;
  }

  navigateToRecoveryCode(): void {
    this.navigate(['auth', 'mfa', 'recovery-code', this.token]);
  }

  private initialize(): void {
    this.buildForm();

    if (this.setupMode) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.authService.obtenharSetupDaAutenticacaoMfa(this.token).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.blockUI.stop()))
        .subscribe(
          (mfaSetup: any) => this.mfaSetup = new MfaSetup(mfaSetup),
          () => this.navigateToLogin());
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      pinCode: [
        '',
        Validators.compose([
          Validators.required,
          UniversalValidators.noEmptyString,
          UniversalValidators.minLength(6),
          UniversalValidators.maxLength(6),
        ]),
      ],
    });
  }

}
