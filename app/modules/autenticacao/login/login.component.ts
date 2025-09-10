import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { Autenticacao } from '@shared/models';
import { AutenticacaoService, CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UniversalValidators } from 'ng2-validators';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { UsuarioService } from '../../../shared/providers/usuario.service';
import { ErrorService } from '../../../shared/utils/error.service';
import { PoliticaPrivacidadeComponent } from '../politica-privacidade/politica-privacidade.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  passwordInputType: string;

  private idTenant: number;
  private returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    private errorService: ErrorService,
  ) {
    super();
    this.passwordInputType = 'password';
  }

  ngOnInit(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.criarFormulario();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.idTenant = +this.route.snapshot.queryParams['idTenant'] || null;

    this.blockUI.stop();

    this.obterDestaques();
  }

  login(): void {
    this.cdr.detectChanges();

    if (this.form.valid) {
      this.autenticar();
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  modificarVisibilidadeSenha(): void {
    if (this.passwordInputType === 'password') {
      this.passwordInputType = 'text';
    } else {
      this.passwordInputType = 'password';
    }
  }

  private disponibilizarPoliticaDePrivacidadeParaAceite(token: string): void {
    const modalRef = this.modalService.open(PoliticaPrivacidadeComponent, { centered: true, backdrop: 'static', size: 'lg', keyboard: false });

    modalRef.result.then((result) => {
      if (result) {
        this.usuarioService.atualizarDataAceitePoliticaPrivacidade(token).pipe(
          takeUntil(this.unsubscribe),
          finalize(() => this.blockUI.stop()))
          .subscribe(
            (novoToken) => this.executeFluxosDeAutenticacao(novoToken));
      }
    });
  }

  private criarFormulario(): void {
    this.form = this.formBuilder.group({
      identificador: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
      senha: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
    });
  }

  private autenticar(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const form = this.form.value;
    const authentication = new Autenticacao(form.identificador, form.senha, this.idTenant);

    this.authService.autenticar(authentication).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (token) => this.executeFluxosDeAutenticacao(token),
        (error) => {
          if (error && error.status === 401) {
            switch (error.error) {
              case 'Usuário bloqueado':
                this.toastr.error(this.translationLibrary.translations.ALERTS.BLOCKED_USER);
                break;

              case 'Usuário sem permissão':
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.USER_WITHOUT_PERMISSION,
                );
                break;

              default:
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INCORRECT_PASSWORD_USERNAME,
                );
            }
          } else {
            this.errorService.treatError(error);
          }

          this.blockUI.stop();
        },
      );
  }

  private executeFluxosDeAutenticacao(token: string): void {
    if (token) {
      const tokenDecodificado = this.authService.obtenhaTokenDecodificado(token);

      if (!tokenDecodificado.politicaPrivacidadeAceita) {
        this.disponibilizarPoliticaDePrivacidadeParaAceite(token);
        return;
      }

      if (tokenDecodificado.primeiroAcesso) {
        this.navegarParaRedefinicaoDeSenha(token);
        this.blockUI.stop();
        return;
      }

      if (tokenDecodificado.algumaEmpresaUtilizaMfa) {
        this.router.navigate([`/auth/mfa/pin-code/${token}`], { queryParams: { returnUrl: this.returnUrl } });
        this.blockUI.stop();
        return;
      }

      if (tokenDecodificado.acessoAutorizado) {
        this.authService.atualizeTokenDeAcesso(token);
        this.authService.navegueParaHome(this.returnUrl);
        return;
      }

      this.router.navigate(['/auth/login'], { queryParamsHandling: 'merge' });
    }
  }

  private navegarParaRedefinicaoDeSenha(token: string): void {
    this.router.navigate(['/auth/redefinir-senha'], { queryParams: { token: token, returnUrl: this.returnUrl } });
  }

  private obterDestaques(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.catalogoService.obterLinkDestaqueLogin().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.exibirModalDestaque(response.url);
          }
        },
      );
  }

  private exibirModalDestaque(link: string): void {
    if (link !== '') {
      const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true, size: 'lg' });

      modalRef.componentInstance.html = true;
      modalRef.componentInstance.titulo = '';
      modalRef.componentInstance.confirmarLabel = 'none';
      modalRef.componentInstance.cancelarLabel = 'none';
      modalRef.componentInstance.confirmacao = `<img class="img-fluid" src="${link}" alt=""/>`;
    }
  }
}
