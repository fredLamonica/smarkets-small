import { ChangeDetectorRef, Injector, OnDestroy, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { AutenticacaoService } from '../../../../shared/providers';
import { TranslationLibraryService } from '../../../../shared/providers/translation-library.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { DecodedToken } from '../../models/decoded-token';

export abstract class MfaCodeComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;

  protected token: string;
  protected decodedToken: DecodedToken;
  protected returnUrl: string;

  protected route: ActivatedRoute = this.injectorEngine.get(ActivatedRoute as Type<ActivatedRoute>);
  protected router: Router = this.injectorEngine.get(Router as Type<Router>);
  protected fb: FormBuilder = this.injectorEngine.get(FormBuilder as Type<FormBuilder>);
  protected authService: AutenticacaoService = this.injectorEngine.get(AutenticacaoService as Type<AutenticacaoService>);
  protected errorService: ErrorService = this.injectorEngine.get(ErrorService as Type<ErrorService>);
  protected translationLibrary: TranslationLibraryService = this.injectorEngine.get(TranslationLibraryService as Type<TranslationLibraryService>);
  protected cdr: ChangeDetectorRef = this.injectorEngine.get(ChangeDetectorRef as Type<ChangeDetectorRef>);

  constructor(private injectorEngine: Injector) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.token = this.route.snapshot.params.token;

    if (!this.token) {
      this.navigateToLogin();
    }

    try {
      this.decodedToken = this.authService.obtenhaTokenDecodificado(this.token);
    } catch (error) {
      this.navigateToLogin();
    }

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  protected navigate(route: Array<string>): void {
    this.router.navigate(route, { queryParamsHandling: 'merge' });
  }

  protected navigateToLogin(): void {
    this.navigate(['/auth/login']);
  }

  protected navigateToHome(): void {
    this.authService.navegueParaHome(this.returnUrl);
  }

}
