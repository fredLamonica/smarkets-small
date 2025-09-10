import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { PerfilUsuario, Permissao, PessoaFisica, PessoaJuridica, SituacaoUsuario } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../shared/providers/usuario.service';
import { Usuario } from './../../../shared/models/usuario';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mater-empresa-usuario',
  templateUrl: './mater-empresa-usuario.component.html',
  styleUrls: ['./mater-empresa-usuario.component.scss'],
})
export class MaterEmpresaUsuarioComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  SituacaoUsuario = SituacaoUsuario;
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
  idUsuario: number;
  usuario: Usuario;
  form: FormGroup;
  usuarioNaoExiste: boolean;
  buscaDeUsuarioRealizada: boolean;

  incluirPermisao: boolean;

  // tslint:disable-next-line: no-input-rename
  @Input('pessoa-juridica') pessoaJuridica: PessoaJuridica;

  PerfilUsuario = PerfilUsuario;
  perfis = new Array<PerfilUsuario>();

  // tslint:disable-next-line: no-input-rename
  @Input('usuarios') usuarios: Usuario[];

  camposObrigatorio: boolean; // Centro de Custo e Departamento
  private idTenantEmpresa: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
  ) { }

  changePerfil() {
    const perfil = this.form.value.perfil;
    this.usuario.permissoes[0].perfil = perfil;
  }

  ngOnInit() {
    this.construirFormulario();
    this.setPerfis();
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      const form = this.form.getRawValue();
      form.idPais = 30;
      const usuario = this.criarUsuario(form);
      if (this.idUsuario) { this.alterar(this.usuario); } else { this.inserir(usuario); }
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

      const usuarioHolding = this.usuarios.some((e) => e.email === email);
      if (usuarioHolding) {
        const holding = this.usuarios.filter((e) => e.email === email)[0].permissoes[0].pessoaJuridica;
        this.blockUI.stop();
        return this.toastr.warning('Email já cadastrado no cliente: ' + holding.razaoSocial);
      }

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

  isNullOrWhitespace(input) {
    return !input || !(input.trim());
  }

  private setPerfis() {
    this.perfis = new Array<PerfilUsuario>();
    const usuario = this.authService.usuario();
    if (this.pessoaJuridica && this.pessoaJuridica.atividades) {
      if (
        this.pessoaJuridica.atividades.administrador &&
        usuario.permissaoAtual.perfil == PerfilUsuario.Administrador
      ) {
        this.perfis.push(PerfilUsuario.Administrador);
      }
      if (this.pessoaJuridica.atividades.comprador) {
        this.perfis = this.perfis.concat([
          PerfilUsuario.Aprovador,
          PerfilUsuario.Cadastrador,
          PerfilUsuario.Comprador,
          PerfilUsuario.Gestor,
          PerfilUsuario.Recebimento,
          PerfilUsuario.Requisitante,
        ]);
      }

      if (this.pessoaJuridica.atividades.vendedor) {
        this.perfis.push(PerfilUsuario.Fornecedor);
      }

      if (
        this.pessoaJuridica.atividades.comprador &&
        this.pessoaJuridica.habilitarModuloFornecedores
      ) {
        this.perfis.push(PerfilUsuario['GestorDeFornecedores']);
      }
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
      perfil: [this.usuario ? this.usuario.permissoes[0].perfil : null, Validators.required],
    });

    if (this.usuario) {
      this.idUsuario = this.usuario.idUsuario;
      this.preencherFormulario(this.usuario);
    }
  }

  private preencherFormulario(usuario: Usuario) {
    this.form.patchValue(usuario);
    this.form.patchValue(usuario.pessoaFisica);
    this.form.controls.email.disable();
  }

  private criarUsuario(form): Usuario {
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

    if (!this.idUsuario) {
      this.obterPermissao(usuario);
    }

    return usuario;
  }

  private obterPermissao(usuario: Usuario): Usuario {
    const permissao = new Permissao(0, 0, this.idTenantEmpresa, this.form.value.perfil, null, null);
    usuario.permissoes.push(permissao);
    return usuario;
  }

  private inserir(usuario: Usuario) {
    this.usuarioService.inserirUsuarioComPermissao(usuario).subscribe(
      (response) => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.activeModal.close(true);
        }
      },
      (error) => {
        if (error.error == 'Já existe um usuário com o mesmo email vinculado ao CPF/CNPJ') {
          this.toastr.warning(error.error);
          this.usuario = null;
          this.incluirPermisao = false;
          this.usuarioNaoExiste = false;
          this.buscaDeUsuarioRealizada = false;
          this.construirFormulario();
          this.form.patchValue({
            email: usuario.email,
          });
        } else { this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR); }
        this.blockUI.stop();
      },
    );
  }

  private alterarUsuario() {
    const form = this.form.value;

    this.changePerfil();
    this.usuario.pessoaFisica.nome = form.nome;
    this.usuario.celular = form.celular;
    this.usuario.telefone = form.telefone;
    this.usuario.ramal = form.ramal;
    this.usuario.situacao = form.situacao;
  }

  private alterar(usuario: Usuario) {
    this.alterarUsuario();
    this.usuarioService.alterarUsuarioComPermissao(usuario).subscribe(
      (response) => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.activeModal.close(true);
        }
      },
      (error) => {
        if (error.error == 'Existe um usuário com o mesmo email') {
          this.toastr.warning(this.translationLibrary.translations.ALERTS.EMAIL_ALREADY_IN_USE);
        } else { this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR); }
        this.blockUI.stop();
      },
    );
  }

  private tratarUsuario(usuario: Usuario) {
    if (!usuario) {
      this.usuarioNaoExistente();
    } else {
      this.usuarioExistente(usuario);
    }
  }

  private usuarioNaoExistente() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Usuário não encontrado, deseja incluir novo?';
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then((result) => {
      if (result) {
        this.buscaDeUsuarioRealizada = true;
        this.usuarioNaoExiste = true;
        this.usuario = null;
        this.form.controls.email.disable();
      }
    });
  }

  private usuarioExistente(usuario: Usuario) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Já existe um usuário com esse endereço de e-mail, deseja realizar o vínculo com essa empresa?';
    modalRef.result.then((result) => {
      if (result) {
        this.buscaDeUsuarioRealizada = true;
        this.incluirPermisao = true;
        this.form.patchValue({
          email: usuario.email,
          nome: usuario.pessoaFisica.nome,
          celular: usuario.celular,
          telefone: usuario.telefone,
          ramal: usuario.ramal,
        });
      }
    });
  }
}
