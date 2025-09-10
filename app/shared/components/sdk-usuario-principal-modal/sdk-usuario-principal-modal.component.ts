import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PessoaFisica, SituacaoUsuario, Usuario } from '../../models';
import { TranslationLibraryService } from '../../providers';
import { UsuarioService } from '../../providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sdk-usuario-principal-modal',
  templateUrl: './sdk-usuario-principal-modal.component.html',
  styleUrls: ['./sdk-usuario-principal-modal.component.scss'],
})
export class SdkUsuarioPrincipalModalComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  maskTelefone = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  maskCelular = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  form: FormGroup;
  exibirCadastro: boolean;
  SituacaoUsuario = SituacaoUsuario;
  email: string;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.construirFormulario();
    if (this.email) {
      this.form.patchValue({ email: this.email });
    }
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const usuario = this.criarUsuario(formValue);
      this.activeModal.close(usuario);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  cancelar() {
    this.activeModal.close();
  }

  buscarUsuario() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (
      this.form.controls.email.valid &&
      !this.isNullOrWhitespace(this.form.controls.email.value)
    ) {
      const email = this.form.value.email;

      this.usuarioService.obterPorEmail(email).subscribe(
        (response) => {
          this.blockUI.stop();
          this.tratarUsuario(response);
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.blockUI.stop();
      this.toastr.warning('Verifique o campo Email');
    }
  }

  private construirFormulario() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      situacao: [SituacaoUsuario.Liberado, Validators.required],
      nome: ['', Validators.required],
      telefone: ['', Validators.maxLength(20)],
      ramal: ['', Validators.maxLength(30)],
      celular: ['', Validators.maxLength(20)],
    });
  }

  private criarUsuario(formValue): Usuario {
    const usuario = new Usuario(
      0,
      0,
      formValue.situacao,
      formValue.email,
      null,
      null,
      null,
      formValue.telefone,
      formValue.ramal,
      formValue.celular,
      new PessoaFisica(),
      null,
    );
    usuario.pessoaFisica.nome = formValue.nome;

    return usuario;
  }

  private tratarUsuario(usuario: Usuario) {
    if (!usuario) {
      this.usuarioNaoExistente();
    } else {
      this.usuarioExistente(usuario);
    }
  }

  private usuarioNaoExistente() {
    this.activeModal.close({ usuarioExistente: false, email: this.form.getRawValue().email });
  }

  private usuarioExistente(usuario: Usuario) {
    this.activeModal.close({ usuarioExistente: true, usuario: usuario });
  }

  private isNullOrWhitespace(input) {
    return !input || !input.trim();
  }
}
