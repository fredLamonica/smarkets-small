import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { PerfilUsuario, PerfilUsuarioLabel, Permissao, PessoaFisica, PessoaJuridica, SituacaoUsuario, Usuario } from '@shared/models';
import { AutenticacaoService, PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss'],
})
export class ModalUsuarioComponent implements OnInit, OnDestroy {
  @Input() isUserSupplier: boolean = true;
  @Input() criacao: boolean = false;
  @Input() idPessoaJuridica: number;
  @Input() usuario: Usuario;
  @Input() currentPessoaJuridica: PessoaJuridica;
  @Output() obterUsuarios: EventEmitter<Usuario> = new EventEmitter<Usuario>();
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
  permissoes: Array<Permissao>;
  showEmail: boolean;
  showInputs: boolean;
  idTenantFornecedor: number;

  perfilList = new Array<PerfilUsuario>();
  currentUserIsAdmin = false;

  perfilUsuarioLabel = PerfilUsuarioLabel;
  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private pessoaJuridicaService: PessoaJuridicaService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.currentUserIsAdmin =
      this.authService.usuario().permissaoAtual.perfil == PerfilUsuario.Administrador;
    this.setPerfis();
    this.getIdTenant();
    this.construirFormulario();
    if (!this.criacao) {
      this.preencherFormulario(this.usuario);
    }
    this.showInputs = !this.criacao;
    this.showEmail = this.criacao;
  }

  ngOnDestroy() {
    if (this.paramsSub) { this.paramsSub.unsubscribe(); }
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      const form = this.form.getRawValue();
      form.idPais = 30;
      const usuario = this.criarUsuario(form);
      if (!this.criacao) {
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
    this.activeModal.close();
  }

  buscar() {
    if (this.form.controls.email.valid) {
      this.email = this.form.controls.email.value;
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.usuarioService.obterPorEmail(this.email).subscribe(
        (response) => {
          this.tratarUsuario(response);

          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private setPerfis() {
    if (this.isUserSupplier) { return; }

    this.perfilList = new Array<PerfilUsuario>();

    if (
      this.currentUserIsAdmin &&
      this.currentPessoaJuridica.atividades &&
      this.currentPessoaJuridica.atividades.administrador
    ) {
      this.perfilList.push(PerfilUsuario.Administrador);
    }

    this.perfilList = this.perfilList.concat([
      PerfilUsuario.Aprovador,
      PerfilUsuario.Cadastrador,
      PerfilUsuario.Comprador,
      PerfilUsuario.Gestor,
      PerfilUsuario.Recebimento,
      PerfilUsuario.Requisitante,
    ]);

    if (this.currentPessoaJuridica.atividades.vendedor) {
      this.perfilList.push(PerfilUsuario.Fornecedor);
    }

    if (
      this.currentPessoaJuridica.atividades &&
      this.currentPessoaJuridica.atividades.comprador &&
      this.currentPessoaJuridica.habilitarModuloFornecedores
    ) {
      this.perfilList.push(PerfilUsuario.GestorDeFornecedores);
    }
  }

  private getIdTenant() {
    this.pessoaJuridicaService.obterIdTenant(this.idPessoaJuridica).subscribe(
      (response) => {
        if (response) {
          this.idTenantFornecedor = response;
        }
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      },
    );
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
      perfil: [null, this.isUserSupplier ? null : Validators.required],
    });
  }

  private preencherFormulario(usuario: Usuario) {
    this.usuario = usuario;

    const permissao =
      usuario.permissoes && usuario.permissoes.length > 0 ? usuario.permissoes[0] : null;
    if (permissao) {
      this.form.patchValue(permissao);
    }

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

    if (this.criacao) {
      const permissao = new Permissao(
        0,
        0,
        this.idTenantFornecedor,
        this.isUserSupplier ? PerfilUsuario.Fornecedor : form.perfil,
        null,
        null,
      );
      usuario.permissoes.push(permissao);
    } else {
      const permissao = <Permissao>{
        idPermissao: this.usuario.permissoes[0].idPermissao,
        idDepartamento: this.usuario.permissoes[0].idDepartamento,
        idCentroCusto: this.usuario.permissoes[0].idCentroCusto,
        perfil: this.isUserSupplier ? PerfilUsuario.Fornecedor : form.perfil,
      };
      usuario.permissoes.push(permissao);
    }

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
          this.construirFormulario();
          this.form.patchValue({
            email: usuario.email,
          });
          this.activeModal.close(true);
        } else { this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR); }
        this.blockUI.stop();
      },
    );
  }

  private alterar(usuario: Usuario) {
    this.usuarioService.alterarUsuarioComPermissao(usuario).subscribe(
      (response) => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.activeModal.close(true);
        }
      },
      (error) => {
        if (error.status == 400 || error.status == 304) { this.toastr.warning(error.error); } else { this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR); }
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
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.confirmacao = 'Usuário não encontrado, deseja incluir novo?';
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then((result) => {
      if (result) {
        this.showEmail = false;
        this.showInputs = true;
      }
    });
  }

  private usuarioExistente(usuario: Usuario) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.confirmacao =
      'Já existe um usuário com esse endereço de e-mail, deseja realizar o vínculo com esse fornecedor?';
    modalRef.result.then((result) => {
      if (result) {
        this.preencherFormulario(usuario);
        this.showEmail = false;
        this.showInputs = true;
      }
    });
  }
}
