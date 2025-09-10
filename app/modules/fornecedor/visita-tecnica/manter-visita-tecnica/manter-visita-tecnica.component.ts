import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Arquivo, PerfilUsuario, PessoaFisica, Usuario } from '@shared/models';
import { ArquivoService, AutenticacaoService, TranslationLibraryService, VisitaTecnicaService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-visita-tecnica',
  templateUrl: './manter-visita-tecnica.component.html',
  styleUrls: ['./manter-visita-tecnica.component.scss'],
})
export class ManterVisitaTecnicaComponent implements OnInit {
  form: FormGroup = this.contruirFormulario();
  mostrarCadastroDeUsuario: boolean;
  nome: string;
  email: string;
  fornecedores: Array<Usuario>;
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private visitaTecnicaService: VisitaTecnicaService,
    private arquivoService: ArquivoService,
    private usuarioService: UsuarioService,
    private authService: AutenticacaoService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.obterPerfisFornecedor();
  }

  cancelar() {
    if (!this.form.controls.idVisitaTecnica.value && this.form.controls.anexos.value.length > 0) {
      for (const anexo of this.form.controls.anexos.value) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.arquivoService.excluir(anexo.idArquivo).subscribe(
          (response) => {
            this.blockUI.stop();
          },
          (error) => {
            this.blockUI.stop();
          },
        );
      }
    }
    this.activeModal.close();
  }

  salvar() {
    if (this.mostrarCadastroDeUsuario) {
      if (this.isNullOrWhitespace(this.nome) || this.isNullOrWhitespace(this.email)) {
        this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      } else {
        const usuario = {} as Usuario;
        usuario.pessoaFisica = {} as PessoaFisica;
        usuario.email = this.email;
        usuario.pessoaFisica.nome = this.nome;
        this.form.controls.representante.setValue(usuario);
      }
    }
    if (
      !this.mostrarCadastroDeUsuario ||
      (!this.isNullOrWhitespace(this.nome) && !this.isNullOrWhitespace(this.email))
    ) {
      if (this.form.controls.idVisitaTecnica.value) {
        this.alterar();
      } else {
        this.adicionar();
      }
    }
  }

  adicionar() {
    if (this.form.valid) {
      if (this.isNullOrWhitespace(this.form.controls.data.value)) {
        this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      } else {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.visitaTecnicaService.inserir(this.form.value).subscribe(
          (response) => {
            this.activeModal.close(response);
            this.blockUI.stop();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  alterar() {
    if (this.form.valid) {
      if (
        this.isNullOrWhitespace(this.form.controls.data.value) ||
        this.isNullOrWhitespace(this.form.controls.representante.value)
      ) {
        this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      } else {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.visitaTecnicaService.alterar(this.form.value).subscribe(
          (response) => {
            this.form.controls.gestorFornecedor.setValue(this.authService.usuario());
            this.activeModal.close(this.form.value);
            this.blockUI.stop();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  isNullOrWhitespace(input) {
    return !input || !(input.trim());
  }

  // #region Controle de Arquivos
  async incluirArquivos(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      this.form.patchValue({
        anexos: this.form.controls.anexos.value.concat(arquivos),
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  excluirArquivo(arquivo) {
    if (!this.form.controls.idVisitaTecnica.value) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.arquivoService
        .excluir(this.form.controls.anexos.value[arquivo.index].idArquivo)
        .subscribe(
          (response) => {
            const anexos = this.form.controls.anexos.value;
            anexos.splice(arquivo.index, 1);
            this.form.patchValue({
              anexos: anexos,
            });
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    } else {
      const anexos = this.form.controls.anexos.value;
      anexos.splice(arquivo.index, 1);
      this.form.patchValue({
        anexos: anexos,
      });
    }
  }
  // #endregion

  verificaSeEscolheuOutro() {
    if (this.form.controls.representante.value.pessoaFisica.nome == 'Outro') {
      this.mostrarCadastroDeUsuario = true;
      this.form.controls.representante.clearValidators();
    }
  }

  private contruirFormulario() {
    return this.fb.group({
      idVisitaTecnica: [0],
      idFornecedorRepresentante: [0],
      idGestorFornecedor: [0],
      idFornecedorVisitaTecnica: [0],
      data: ['', Validators.required],
      representante: ['', Validators.required],
      gestorFornecedor: [''],
      status: [0],
      anexos: [new Array<Arquivo>()],
      idTenant: [this.authService.usuario().permissaoAtual.idTenant],
    });
  }

  private obterPerfisFornecedor() {
    this.usuarioService.obterPorPerfil(PerfilUsuario.Fornecedor).subscribe(
      (response) => {
        if (response) {
          this.fornecedores = response;
          const outroUsuario = {} as Usuario;
          outroUsuario.pessoaFisica = {} as PessoaFisica;
          outroUsuario.pessoaFisica.nome = 'Outro';
          this.fornecedores.push(outroUsuario);
        }
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
