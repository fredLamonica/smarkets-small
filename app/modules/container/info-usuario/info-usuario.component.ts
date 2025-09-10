import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilUsuario, PerfilUsuarioLabel, Permissao, Usuario } from '@shared/models';
import { AutenticacaoService, LocalStorageService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UtilitiesService } from '../../../shared/utils/utilities.service';
import { ResumoCarrinhoComponent } from '../resumo-carrinho/resumo-carrinho.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'info-usuario',
  templateUrl: './info-usuario.component.html',
  styleUrls: ['./info-usuario.component.scss'],
})
export class InfoUsuarioComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-output-rename
  @Output('troca-permissao') trocaPermissaoEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('open-nav') openNavEmitter = new EventEmitter();

  PerfilUsuario = PerfilUsuario;

  usuario: Usuario;

  permissoes: Array<Permissao>;

  form: FormGroup;

  constructor(
    private localStorage: LocalStorageService,
    private translationLibrary: TranslationLibraryService,
    private router: Router,
    private authService: AutenticacaoService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.contruirFormulario();
    this.usuario = this.authService.usuario();
  }

  signOut() {
    this.router.navigate(['/auth/login']).then((resolved: boolean) => {
      if (resolved) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.localStorage.remove('currentUser');
        this.localStorage.remove('accessToken');
      }
    });
  }

  trocarPermissao(permissao: Permissao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.authService.alterarPermissao(permissao.idTenant).subscribe(
      (response) => {
        if (response) {
          this.authService.atualizeTokenDeAcesso(response.token);
          this.usuario = response;
          this.trocaPermissaoEmitter.emit();

          ResumoCarrinhoComponent.atualizarCarrinho.next();

          this.router.navigate(['/'], { skipLocationChange: true, queryParams: { noinitialize: true } }).then(() => {
            this.authService.navegueParaHome();
          });
        }

        this.blockUI.stop();
      },
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
        } else { this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR); }
        this.blockUI.stop();
      },
    );
  }

  listarPermissoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.authService.listarPermissoes().subscribe(
      (response) => {
        if (response) { this.permissoes = response; }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  getProfileEnum(permissao: any) {
    return PerfilUsuarioLabel.get(permissao.perfil);
  }

  configurarPerfil() {
    this.router.navigate(['configuracao-usuario']);
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      termo: [null, Validators.required],
    });
  }

}
