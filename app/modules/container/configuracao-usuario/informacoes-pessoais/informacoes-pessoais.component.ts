import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { SmkConfirmacaoComponent } from '../../../../shared/components/modals/smk-confirmacao/smk-confirmacao.component';
import { SmkModalValidacaoDeContaComponent } from '../../../../shared/components/modals/smk-modal-validacao-de-conta/smk-modal-validacao-de-conta.component';
import { ResultadoValidacaoDeConta } from '../../../../shared/components/smk-validacao-de-conta/models/resultado-validacao-de-conta.enum';
import { TipoValidacaoDeConta } from '../../../../shared/components/smk-validacao-de-conta/models/tipo-validacao-de-conta.enum';
import { InformacoesPessoaisDto } from '../../../../shared/models/dto/informacoes-pessoais-dto';
import { Usuario } from '../../../../shared/models/usuario';
import { AutenticacaoService } from '../../../../shared/providers/autenticacao.service';
import { UsuarioService } from '../../../../shared/providers/usuario.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { confirmValueValidator } from '../../../../shared/validators/confirm-value.validator';
import { passwordRulesValidator } from '../../../../shared/validators/password-rules.validator';
import { InformacaoDeAcessoAlterada } from './models/informacao-de-acesso-alterada.enum';

@Component({
  selector: 'smk-informacoes-pessoais',
  templateUrl: './informacoes-pessoais.component.html',
  styleUrls: ['./informacoes-pessoais.component.scss'],
})
export class InformacoesPessoaisComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('modalAlteracaoDeEmailTmp') modalAlteracaoDeEmailTmp: TemplateRef<any>;
  @ViewChild('modalAlteracaoDeSenhaTmp') modalAlteracaoDeSenhaTmp: TemplateRef<any>;

  form: FormGroup;
  formAlteracaoDeEmail: FormGroup;
  formAlteracaoDeSenha: FormGroup;
  usuarioLogado: Usuario;
  maskTelefone = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  novaSenhaInputType: string;

  private informacaoDeAcessoAlterada: InformacaoDeAcessoAlterada;

  constructor(
    private authService: AutenticacaoService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private usuarioService: UsuarioService,
  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  salvar(): void {
    this.blockUI.start();

    const informacoesPessoais = this.form.getRawValue() as InformacoesPessoaisDto;

    let dadosDeAcessoAlterados: string;

    if (this.informacaoDeAcessoAlterada) {
      switch (this.informacaoDeAcessoAlterada) {
        case InformacaoDeAcessoAlterada.email:
          informacoesPessoais.senha = null;
          dadosDeAcessoAlterados = 'o novo email';
          break;

        case InformacaoDeAcessoAlterada.senha:
          informacoesPessoais.email = null;
          dadosDeAcessoAlterados = 'a nova senha';
          break;

        case InformacaoDeAcessoAlterada.todas:
          dadosDeAcessoAlterados = 'o novo email e senha';
          break;
      }
    } else {
      informacoesPessoais.email = null;
      informacoesPessoais.senha = null;
    }

    this.usuarioService.salveInformacoesPessoais(informacoesPessoais).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (informacoesSalvas) => {
          if (informacoesSalvas) {
            this.toastr.success('Alterações salvas com sucesso!');

            if (this.informacaoDeAcessoAlterada) {
              this.abrirModalInformacaoDeAcessoAlterada(
                `Você será desconectado. Tente fazer o login novamente utilizando ${dadosDeAcessoAlterados} para acessar a plataforma.`,
                () => { },
                () => this.navegueParaLogin(),
                null,
                'Ok',
                true);
            }
          }
        },
        (error) => this.errorService.treatError(error),
      );
  }

  alterarEmail(): void {
    this.abrirModal<ResultadoValidacaoDeConta>(
      SmkModalValidacaoDeContaComponent,
      () => {
        this.toastr.success('Conta validada!');
        this.formAlteracaoDeEmail.reset();

        this.abrirModal<string>(
          this.modalAlteracaoDeEmailTmp,
          (novoEmail) => {
            this.abrirModal<ResultadoValidacaoDeConta>(
              SmkModalValidacaoDeContaComponent,
              () => {
                this.toastr.success('Processo de alteração de email finalizado. Agora é necessário salvar a alteração!');
                this.form.patchValue({ email: novoEmail });
              },
              this.callbackDeFalhaValidacaoDeConta,
              (modalRef) => {
                modalRef.componentInstance.tipo = TipoValidacaoDeConta.emailNovo;
                modalRef.componentInstance.novoEmail = novoEmail;
              },
            );
          },
          () => this.toastr.warning('Alteração de email cancelada!'),
        );
      },
      this.callbackDeFalhaValidacaoDeConta,
      (modalRef) => modalRef.componentInstance.tipo = TipoValidacaoDeConta.emailAtual,
    );
  }

  confirmarAlteracaoDeEmail(modal: NgbModalRef): void {
    this.blockUI.start();

    const novoEmail = this.formAlteracaoDeEmail.get('novoEmail').value;

    this.authService.valideEmail(novoEmail).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (novoEmailValido) => {
          if (novoEmailValido) {
            modal.close(novoEmail);
          }
        },
        (error) => this.errorService.treatError(error),
      );
  }

  alterarSenha(): void {
    this.abrirModal<ResultadoValidacaoDeConta>(
      SmkModalValidacaoDeContaComponent,
      () => {
        this.toastr.success('Conta validada!');
        this.formAlteracaoDeSenha.reset();

        this.abrirModal<string>(
          this.modalAlteracaoDeSenhaTmp,
          (novaSenha) => {
            this.toastr.success('Processo de alteração de senha finalizado. Agora é necessário salvar a alteração!');
            this.form.patchValue({ senha: novaSenha });
          },
          () => this.toastr.warning('Alteração de senha cancelada!'));
      },
      this.callbackDeFalhaValidacaoDeConta,
      (modalRef) => modalRef.componentInstance.tipo = TipoValidacaoDeConta.senhaNova,
    );
  }

  confirmarAlteracaoDeSenha(modal: NgbModalRef): void {
    this.blockUI.start();

    const novaSenha = this.formAlteracaoDeSenha.get('novaSenha').value;

    this.authService.valideSenha(novaSenha).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (novaSenhaValida) => {
          if (novaSenhaValida) {
            modal.close(novaSenha);
          }
        },
        (error) => this.errorService.treatError(error),
      );
  }

  modifiqueVisibilidadeSenha(): void {
    if (this.novaSenhaInputType === 'password') {
      this.novaSenhaInputType = 'text';
    } else {
      this.novaSenhaInputType = 'password';
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.informacaoDeAcessoAlterada) {
      const complementoConteudo = this.informacaoDeAcessoAlterada === InformacaoDeAcessoAlterada.todas
        ? 'Ao sair da tela estas informações serão perdidas pois não foram salvas. Deseja continuar?'
        : 'Ao sair da tela esta informação será perdida pois não foi salva. Deseja continuar?';

      return this.abrirModalInformacaoDeAcessoAlterada(complementoConteudo, () => true, () => false, 'Sim', 'Não', false);
    }

    return true;
  }

  private callbackDeFalhaValidacaoDeConta =
    (reason: ResultadoValidacaoDeConta) => reason === ResultadoValidacaoDeConta.contaNaoValidada
      ? this.toastr.error('Não foi possível validar a conta')
      : this.toastr.warning('Processo de validação de conta cancelado')

  private inicialize(): void {
    this.blockUI.start();

    this.novaSenhaInputType = 'password';

    this.usuarioService.obtenhaInformacoesPessoais().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (informacoesPessoais) => {
          if (informacoesPessoais) {
            this.construaForms(informacoesPessoais);
          } else {
            this.toastr.error('Problema ao obter as informações pessoais, tente novamente mais tarde');
          }
        },
        (error) => this.errorService.treatError(error),
      );
  }

  private abrirModal<T>(
    content: any,
    callbackDeSucesso: (result: T) => void,
    callbackDeFalha: (reason: T) => void,
    modifiquePropriedadesDaModal: (modalRef: NgbModalRef) => void = null,
  ): void {
    const modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });

    if (modifiquePropriedadesDaModal) {
      modifiquePropriedadesDaModal(modalRef);
    }

    modalRef.result.then(
      callbackDeSucesso,
      callbackDeFalha);
  }

  private abrirModalInformacaoDeAcessoAlterada<T>(
    complementoConteudo: string,
    callbackDeSucesso: (result: any) => T,
    callbackDeFalha: (reason: any) => T,
    labelBotaoConfirmar: string,
    labelBotaoCancelar: string,
    resetarIndicador: boolean,
  ): Observable<T> {
    const modalRef = this.modalService.open(SmkConfirmacaoComponent, { centered: true, backdrop: 'static' });

    modalRef.componentInstance.titulo = 'Informação de Acesso Alterada';
    modalRef.componentInstance.labelBotaoConfirmar = labelBotaoConfirmar ? labelBotaoConfirmar : '';
    modalRef.componentInstance.labelBotaoCancelar = labelBotaoCancelar ? labelBotaoCancelar : '';

    switch (this.informacaoDeAcessoAlterada) {
      case InformacaoDeAcessoAlterada.email:
        modalRef.componentInstance.conteudo = 'O email foi alterado.';
        break;

      case InformacaoDeAcessoAlterada.senha:
        modalRef.componentInstance.conteudo = 'A senha foi alterada.';
        break;

      case InformacaoDeAcessoAlterada.todas:
        modalRef.componentInstance.conteudo = 'O email e a senha foram alterados.';
        break;
    }

    modalRef.componentInstance.mensagemAdicional = complementoConteudo;

    if (resetarIndicador) {
      this.informacaoDeAcessoAlterada = undefined;
    }

    return from(modalRef.result.then(
      callbackDeSucesso,
      callbackDeFalha,
    ));
  }

  private construaForms(informacoesPessoais: InformacoesPessoaisDto): void {
    this.form = this.fb.group({
      nome: [informacoesPessoais.nome, Validators.required],
      email: [{ value: informacoesPessoais.email, disabled: true }],
      telefone: [informacoesPessoais.telefone],
      ramal: [informacoesPessoais.ramal],
      celular: [informacoesPessoais.celular],
      senha: [{ value: '0'.repeat(25), disabled: true }],
    });

    this.form.get('email').valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(() => this.processeIndicadorDeInformacaoDeAcessoAlterada(InformacaoDeAcessoAlterada.email));

    this.form.get('senha').valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(() => this.processeIndicadorDeInformacaoDeAcessoAlterada(InformacaoDeAcessoAlterada.senha));

    this.formAlteracaoDeEmail = this.fb.group(
      {
        novoEmail: ['', Validators.required],
        novoEmailConfirm: ['', Validators.required],
      },
      {
        validators: confirmValueValidator('novoEmail'),
      });

    this.formAlteracaoDeSenha = this.fb.group(
      {
        novaSenha: ['', passwordRulesValidator(8)],
        novaSenhaConfirm: ['', Validators.required],
      },
      {
        validators: confirmValueValidator('novaSenha'),
      });
  }

  private processeIndicadorDeInformacaoDeAcessoAlterada(informacaoDeAcessoAlterada: InformacaoDeAcessoAlterada): void {
    if (!this.informacaoDeAcessoAlterada) {
      this.informacaoDeAcessoAlterada = informacaoDeAcessoAlterada;
    } else {
      this.informacaoDeAcessoAlterada = InformacaoDeAcessoAlterada.todas;
    }
  }

  private navegueParaLogin(): void {
    this.router.navigate(['/auth/login'], { queryParamsHandling: 'merge' });
  }

}
