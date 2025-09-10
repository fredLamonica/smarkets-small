import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Permissao, PessoaFisica, SituacaoUsuario, Usuario } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-usuario-modal',
  templateUrl: './manter-usuario-modal.component.html',
  styleUrls: ['./manter-usuario-modal.component.scss'],
})
export class ManterUsuarioModalComponent implements OnInit {
  @Input() idPessoaJuridica: number;
  @BlockUI() blockUI: NgBlockUI;

  Situacao = SituacaoUsuario;
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
  email: string = '';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.construirFormulario();
  }

  save() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      const form = this.form.getRawValue();
      form.idPais = 30;
      const usuario = this.instanceUser(form);
      this.insertUser(usuario);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idUsuario: [0],
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

  private instanceUser(form): Usuario {
    const usuario = new Usuario(
      form.idUsuario,
      form.idPessoaFisica,
      form.situacao,
      form.email,
      form.dataInclusao,
      form.primeiroAcesso,
      null,
      form.telefone,
      form.ramal,
      form.celular,
      new PessoaFisica(
        form.idPessoa,
        form.codigoPessoa,
        form.tipoPessoa,
        form.cnd,
        form.idTenant,
        form.idPessoaFisica,
        form.nome,
      ),
      new Array<Permissao>(),
    );

    return usuario;
  }

  private insertUser(usuario: Usuario) {
    this.usuarioService.inserirUsuarioFornecedor(usuario).subscribe(
      (response) => {
        if (response) {
          if (response.mensagem) {
            this.toastr.info(response.mensagem);
          } else {
            this.toastr.success(this.translationLibrary.translations.INFO.SUCCESS);
          }
          this.blockUI.stop();
          this.activeModal.close(response.usuario);
        }
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
}
