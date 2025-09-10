import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Autenticacao, Permissao, PessoaFisica, SituacaoUsuario, Usuario } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ConfirmacaoComponent } from '../../../shared/components/modals/confirmacao/confirmacao.component';
import { UsuarioService } from '../../../shared/providers/usuario.service';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-usuario',
  templateUrl: './manter-usuario.component.html',
  styleUrls: ['./manter-usuario.component.scss'],
})
export class ManterUsuarioComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('modalConfirmacaoTmp') modalConfirmacaoTmp: ElementRef;

  Situacao = SituacaoUsuario;
  maskTelefone = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  idUsuario: number;
  usuario: Usuario;
  form: FormGroup;
  email: string;
  permissoes: Array<Permissao>;
  slotMensagemConfirmacao1: string = '# mensagem1 #';
  slotMensagemConfirmacao2: string = '# mensagem2 #';
  empresaUtilizaMfa: boolean;

  // #region Permissoes
  exibirPermissoes: boolean;
  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private usuarioService: UsuarioService,
    private autenticacaoService: AutenticacaoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormulario();
    this.obterParametros();

    this.empresaUtilizaMfa = this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica.habilitarMFA;
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    super.ngOnDestroy();
  }

  permitirEdicao(): boolean {
    const usuarioAtual = this.autenticacaoService.usuario();
    const idTenantPermissao = usuarioAtual.permissaoAtual.idTenant;
    return idTenantPermissao === this.usuario.pessoaFisica.tenant.idTenant || idTenantPermissao === this.usuario.pessoaFisica.tenant.idTenantPai || usuarioAtual.idUsuario === this.usuario.idUsuario;
  }

  salvar() {

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      const form = this.form.value;
      form.idPais = 30;
      const usuario = this.criarUsuario(form);
      if (this.idUsuario) {
        this.alterar(usuario);
      } else {
        this.inserir(usuario);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  confirmarResetDeSenha(): void {
    this.confirmarAcao(() => this.resetarSenha(), 'Deseja realmente resetar a senha?', 'Um link para redefinição da senha será enviado para o e-mail cadastrado.');
  }

  confirmarResetDeMfa(): void {
    this.confirmarAcao(() => this.resetarMfa(), 'Deseja realmente resetar este usuário?', 'A configuração de autenticação em dois fatores será redefinida e precisará ser reconfigurada.');
  }

  permitirExibirPermissoes() {
    if (!this.exibirPermissoes) {
      this.exibirPermissoes = true;
    }
  }

  private confirmarAcao(acao: () => void, mensagem1: string, mensagem2: string): void {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true, backdrop: 'static' });

    modalRef.componentInstance.titulo = 'CONFIRMAR AÇÃO';
    modalRef.componentInstance.confirmarLabel = 'Confirmar';
    modalRef.componentInstance.html = true;
    modalRef.componentInstance.cancelarLabel = 'Cancelar';
    modalRef.componentInstance.cancelarBtnClass = 'btn-outline-primary';

    modalRef.componentInstance.confirmacao =
      this.modalConfirmacaoTmp.nativeElement.innerHTML.replace(this.slotMensagemConfirmacao1, mensagem1).replace(this.slotMensagemConfirmacao2, mensagem2);

    modalRef.result.then((result) => {
      if (result) {
        acao();
      }
    });
  }

  private resetarSenha(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.autenticacaoService.recuperarSenha(new Autenticacao(this.email, null, null)).pipe(takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.PAGES.AUTH.PASSWORD_RESET_SUCCESS);
        this.blockUI.stop();
      },
      (error) => {
        this.errorService.treatError(error);
        this.blockUI.stop();
      },
    );
  }

  private resetarMfa(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.usuarioService.redefinirTokensDoMfa(this.idUsuario).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => this.toastr.success(this.translationLibrary.translations.PAGES.AUTH.RESET_MFA_SUCCESS),
        (error) => {
          if (error && error.status === 400) {
            this.toastr.error(this.translationLibrary.translations.PAGES.AUTH.USER_NOT_FOUND);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        },
      );
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe(
      (params) => {
        this.idUsuario = +params['idUsuario'];

        if (this.idUsuario) {
          this.obterUsuario();
        } else {
          this.blockUI.stop();
        }
      },
    );
  }

  private obterUsuario() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService.obterPorId(this.idUsuario).pipe(takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        if (response) {
          this.preencherFormulario(response);
          this.email = response.email;
          if (response.permissoes) {
            this.permissoes = response.permissoes;
          } else {
            this.permissoes = new Array<Permissao>();
          }
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idUsuario: [0],
      codigoERP: [''],
      situacao: [SituacaoUsuario.Liberado, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataInclusao: [null],
      primeiroAcesso: [false],
      telefone: ['', Validators.maxLength(20)],
      ramal: ['', Validators.maxLength(30)],
      celular: ['', Validators.maxLength(20)],
      // pessoa fisica
      idPessoa: [0],
      codigoPessoa: [null],
      tipoPessoa: [1],
      cnd: [null],
      idTenant: [0],
      idPessoaFisica: [0],
      nome: ['', Validators.required],
    });
  }

  private preencherFormulario(usuario: Usuario) {
    this.usuario = usuario;
    this.form.patchValue({
      idUsuario: usuario.idUsuario,
      codigoERP: usuario.codigoERP,
      situacao: usuario.situacao,
      email: usuario.email,
      dataInclusao: usuario.dataInclusao,
      primeiroAcesso: usuario.primeiroAcesso,
      telefone: usuario.telefone,
      ramal: usuario.ramal,
      celular: usuario.celular,
    });
    this.form.patchValue({
      idPessoa: usuario.pessoaFisica.idPessoa,
      codigoPessoa: usuario.pessoaFisica.codigoPessoa,
      tipoPessoa: usuario.pessoaFisica.tipoPessoa,
      cnd: usuario.pessoaFisica.cnd,
      idTenant: usuario.pessoaFisica.idTenant,
      idPessoaFisica: usuario.pessoaFisica.idPessoaFisica,
      nome: usuario.pessoaFisica.nome,
    });
    if (!this.permitirEdicao()) {
      this.form.disable();
    }
  }

  private criarUsuario(form): Usuario {
    return new Usuario(form.idUsuario, form.idPessoaFisica, form.situacao, form.email, form.dataInclusao,
      form.primeiroAcesso, null, form.telefone, form.ramal, form.celular,
      new PessoaFisica(form.idPessoa, form.codigoPessoa, form.tipoPessoa, form.cnd, form.idTenant,
        form.idPessoaFisica, form.nome,
      ),
      new Array<Permissao>(), form.codigoERP,
    );
  }

  private inserir(usuario: Usuario) {
    this.usuarioService.inserir(usuario).pipe(takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        if (response) {
          this.router.navigate(['/usuarios/', response.idUsuario]);
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.toastr.success(this.translationLibrary.translations.ALERTS.USER_CREATION);
        this.blockUI.stop();
      },
      (error) => {
        if (error.error === 'Existe um usuário com o mesmo email') {
          this.toastr.error(this.translationLibrary.translations.ALERTS.EMAIL_ALREADY_IN_USE);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      },
    );
  }

  private alterar(usuario: Usuario) {
    this.usuarioService.alterar(usuario).pipe(takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      (error) => {

        if (error.error === 'Existe um usuário com o mesmo email') {
          this.toastr.error(this.translationLibrary.translations.ALERTS.EMAIL_ALREADY_IN_USE);
        } else if (error.status === 400) {
          this.toastr.warning(error.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      },
    );
  }
  // #endregion
}
