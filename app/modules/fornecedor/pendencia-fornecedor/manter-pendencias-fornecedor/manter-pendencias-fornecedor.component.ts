import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  TiposPendenciaFornecedor,
  Arquivo,
  PendenciasFornecedor,
  StatusPendenciaFornecedor
} from '@shared/models';
import {
  PendenciasFornecedorService,
  ArquivoService,
  TranslationLibraryService,
  AutenticacaoService,
  PendenciasFornecedorComentarioService
} from '@shared/providers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PendenciasFornecedorComentario } from '@shared/models/pendencia-fornecedor-comentario';

@Component({
  selector: 'app-manter-pendencias-fornecedor',
  templateUrl: './manter-pendencias-fornecedor.component.html',
  styleUrls: ['./manter-pendencias-fornecedor.component.scss']
})
export class ManterPendenciasFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public pendenciaForm: FormGroup = this.construirPendenciaForm();
  public comentarioForm: FormGroup = this.construirConmentarioForm();
  public TiposPendencia = TiposPendenciaFornecedor;
  public StatusPendencia = StatusPendenciaFornecedor;
  public pendencia: PendenciasFornecedor;
  public usuario = this.authService.usuario();

  public vizualizar: Boolean = false;
  public estaInserindoPendencia: Boolean = false;
  public estaEditandoPendencia: Boolean = false;
  public podeResolverPendencia: Boolean = false;

  constructor(
    private authService: AutenticacaoService,
    private arquivoService: ArquivoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private pendenciasFornecedorService: PendenciasFornecedorService,
    private pendenciasFornecedorComentarioService: PendenciasFornecedorComentarioService
  ) {}

  ngOnInit() {}

  private construirPendenciaForm() {
    return (this.pendenciaForm = this.fb.group({
      idPendenciaFornecedor: [0],
      idFornecedor: [0],
      idUsuario: [0],
      idTenant: [0],
      idPessoaJuridicaFornecedor: [0],
      dataCadastro: [''],
      tipo: ['', Validators.required],
      status: [''],
      descricao: ['', Validators.required],
      comentarios: [new Array<PendenciasFornecedorComentario>()],
      anexos: [new Array<Arquivo>()],
      fornecedor: [null],
      usuario: [null]
    }));
  }

  private construirConmentarioForm() {
    return (this.comentarioForm = this.fb.group({
      idPendenciaFornecedorComentario: [0],
      idPendenciaFornecedor: [0],
      idUsuario: [0],
      dataCadastro: [new Date()],
      descricao: [''],
      anexos: [new Array<Arquivo>()]
    }));
  }

  public salvar() {
    if (this.pendenciaForm.valid) {
      this.pendenciaForm.controls.status.setValue(StatusPendenciaFornecedor.Pendente);
      this.pendenciaForm.controls.dataCadastro.setValue(new Date());
      this.pendenciaForm.controls.idUsuario.setValue(this.usuario.idUsuario);
      this.inserir();
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private inserir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciasFornecedorService.inserir(this.pendenciaForm.value).subscribe(
      response => {
        this.activeModal.close(response);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public cancelar() {
    if (
      !this.pendenciaForm.controls.idPendenciaFornecedor.value &&
      this.pendenciaForm.controls.anexos.value.length > 0
    ) {
      for (const anexos of this.pendenciaForm.controls.anexos.value) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.arquivoService.excluir(anexos.idArquivo).subscribe(
          response => {
            this.blockUI.stop();
          },
          error => {
            this.blockUI.stop();
          }
        );
      }
    }
    if (
      !this.comentarioForm.controls.idPendenciaFornecedorComentario.value &&
      this.comentarioForm.controls.anexos.value.length > 0
    ) {
      for (const anexos of this.comentarioForm.controls.anexos.value) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.arquivoService.excluir(anexos.idArquivo).subscribe(
          response => {
            this.blockUI.stop();
          },
          error => {
            this.blockUI.stop();
          }
        );
      }
    }
    this.activeModal.close();
  }

  public alterar() {
    if (this.pendenciaForm.valid) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.pendenciasFornecedorService.alterar(this.pendenciaForm.value).subscribe(
        response => {
          this.activeModal.close(this.pendenciaForm.value);
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  public resolver() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciaForm.controls.status.setValue(2);
    this.pendenciasFornecedorService.alterar(this.pendenciaForm.value).subscribe(
      response => {
        this.activeModal.close(this.pendenciaForm.value);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        console.log(error);
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  // #region Comentarios
  public salvarComentario() {
    if (this.comentarioForm.valid) {
      if (this.isCamposComentariosPreenchidos()) {
        this.comentarioForm.controls.idPendenciaFornecedor.setValue(
          this.pendenciaForm.controls.idPendenciaFornecedor.value
        );
        this.comentarioForm.controls.idUsuario.setValue(this.usuario.idUsuario);
        this.inserirComentario();
      } else {
        this.toastr.error('É necessário informar a descrição ou adicionar um anexo ao comentário.');
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private isCamposComentariosPreenchidos(): boolean {
    const anexos = this.comentarioForm.controls.anexos.value;
    const descricao = this.comentarioForm.controls.descricao.value;
    return (anexos && anexos.length > 0) || (descricao && !this.isNullOrWhitespace(descricao));
  }

  private inserirComentario() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciasFornecedorComentarioService.inserir(this.comentarioForm.value).subscribe(
      response => {
        this.activeModal.close(response);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  // #endregion

  // #region Controle de Arquivos
  public async incluirArquivos(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      this.pendenciaForm.patchValue({
        anexos: this.pendenciaForm.controls.anexos.value.concat(arquivos)
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public async incluirArquivosComentario(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      this.comentarioForm.patchValue({
        anexos: this.comentarioForm.controls.anexos.value.concat(arquivos)
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public excluirArquivo(arquivo) {
    if (!this.pendenciaForm.controls.idPendenciaFornecedor.value) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.arquivoService
        .excluir(this.pendenciaForm.controls.anexos.value[arquivo.index].idArquivo)
        .subscribe(
          response => {
            let anexoss = this.pendenciaForm.controls.anexos.value;
            anexoss.splice(arquivo.index, 1);
            this.pendenciaForm.patchValue({
              anexos: anexoss
            });
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    } else {
      let anexoss = this.pendenciaForm.controls.anexos.value;
      anexoss.splice(arquivo.index, 1);
      this.pendenciaForm.patchValue({
        anexos: anexoss
      });
    }
  }

  public excluirArquivoComentario(arquivo) {
    if (!this.comentarioForm.controls.idPendenciaFornecedorComentario.value) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.arquivoService
        .excluir(this.comentarioForm.controls.anexos.value[arquivo.index].idArquivo)
        .subscribe(
          response => {
            let anexoss = this.comentarioForm.controls.anexos.value;
            anexoss.splice(arquivo.index, 1);
            this.comentarioForm.patchValue({
              anexos: anexoss
            });
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    } else {
      let anexoss = this.comentarioForm.controls.anexos.value;
      anexoss.splice(arquivo.index, 1);
      this.comentarioForm.patchValue({
        anexos: anexoss
      });
    }
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }
  // #endregion
}
