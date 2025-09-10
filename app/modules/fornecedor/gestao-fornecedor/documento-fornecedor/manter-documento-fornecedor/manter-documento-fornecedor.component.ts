import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PerfilUsuario, Usuario } from '@shared/models';
import {
  TranslationLibraryService,
  DocumentoFornecedorService,
  AutenticacaoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { DocumentoFornecedorDto } from '@shared/models/dto/documento-fornecedor-dto';

@Component({
  selector: 'app-manter-documento-fornecedor',
  templateUrl: './manter-documento-fornecedor.component.html',
  styleUrls: ['./manter-documento-fornecedor.component.scss']
})
export class ManterDocumentoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() documentoFornecedor: DocumentoFornecedorDto;

  public form: FormGroup;

  get podeAlterarDescricaoDocumento(): boolean {
    let usuario: Usuario = this.authService.usuario();
    return (
      usuario &&
      this.authService.usuario().permissaoAtual.isSmarkets &&
      (usuario.permissaoAtual.perfil == PerfilUsuario.Administrador ||
        usuario.permissaoAtual.perfil == PerfilUsuario.Gestor)
    );
  }

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private documentoFornecedorService: DocumentoFornecedorService,
    private authService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.construirFormulario();
    this.preencherFormulario();
  }

  public cancelar() {
    this.activeModal.close();
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      idDocumentoFornecedorTenant: [0],
      idDocumentoFornecedor: [0],
      descricaoDocumento: ['', Validators.required],
      documentoObrigatorio: [false],
      vencimentoObrigatorio: [false]
    });
  }

  public salvar() {
    let documentoFornecedor: DocumentoFornecedorDto = this.bindFormToDocumentoFornecedorDto();
    if (this.form.valid) {
      if (documentoFornecedor.idDocumentoFornecedor) {
        this.alterar(documentoFornecedor);
      } else {
        this.inserir(documentoFornecedor);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private alterar(documentoFornecedor: DocumentoFornecedorDto) {
    this.blockUI.start();
    this.documentoFornecedorService.alterarDocumentoTenant(documentoFornecedor).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success('Falha ao alterar dcumento fornecedor. Por favor, tente novamente.');
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  private inserir(documentoFornecedor: DocumentoFornecedorDto) {
    this.blockUI.start();
    this.documentoFornecedorService.inserirDocumentoTenant(documentoFornecedor).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success(
            'Falha ao inserir novo documento fornecedor. Por favor, tente novamente.'
          );
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();

        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  private preencherFormulario() {
    if (this.documentoFornecedor) {
      let form = this.form.controls;
      this.form.patchValue(this.documentoFornecedor);

      if (!this.podeAlterarDescricaoDocumento) {
        form.descricaoDocumento.disable();
      }
      if (
        this.documentoFornecedor &&
        this.documentoFornecedor.desabilitaTrocaDocumentoObrigatorio &&
        this.documentoFornecedor.idTenant != 1
      ) {
        form.documentoObrigatorio.disable();
      }

      if (
        this.documentoFornecedor &&
        this.documentoFornecedor.desabilitaTrocaVencimentoObrigatorio &&
        this.documentoFornecedor.idTenant != 1
      ) {
        form.vencimentoObrigatorio.disable();
      }
    }
  }

  private bindFormToDocumentoFornecedorDto(): DocumentoFornecedorDto {
    let form = this.form.controls;
    let documentoFornecedorDto: DocumentoFornecedorDto = this.form.value;

    documentoFornecedorDto.descricaoDocumento = form.descricaoDocumento.value;
    documentoFornecedorDto.documentoObrigatorio = form.documentoObrigatorio.value;
    documentoFornecedorDto.vencimentoObrigatorio = form.vencimentoObrigatorio.value;

    return documentoFornecedorDto;
  }
}
