import { Component, OnInit } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  SolicitacaoDocumentoFornecedor,
  CategoriaProduto,
  Usuario,
  DocumentoFornecedor,
  CategoriaFornecimento
} from '@shared/models';
import {
  TranslationLibraryService,
  SolicitacaoDocumentoFornecedorService,
  CategoriaProdutoService,
  AutenticacaoService,
  DocumentoFornecedorService,
  CategoriaFornecimentoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'keep-document-request',
  templateUrl: './keep-document-request.component.html',
  styleUrls: ['./keep-document-request.component.scss']
})
export class ManterSolicitacaoDocumentosFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  public solicitacaoDocumentoFornecedor: SolicitacaoDocumentoFornecedor;
  public categorias: Array<CategoriaFornecimento>;
  public usuarioAtual: Usuario;
  public idTenantSmarkets: number = 1; //IdTenantMaster

  public documentosFornecedor: Array<DocumentoFornecedor>;

  constructor(
    private solicitacaoDocumentoFornecedorService: SolicitacaoDocumentoFornecedorService,
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authService: AutenticacaoService,
    private documentoFornecedorService: DocumentoFornecedorService
  ) {}

  async ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
    this.usuarioAtual.permissaoAtual.idTenant;

    this.construirFormulario();
    this.obterDocumentosFornecedor();

    await this.obterListas();

    if (this.solicitacaoDocumentoFornecedor) {
      this.solicitacaoDocumentoFornecedor.idDocumentoFornecedor = this.solicitacaoDocumentoFornecedor.documentoFornecedor.idDocumentoFornecedor;
      this.preencherFormulario(this.solicitacaoDocumentoFornecedor);
    }
  }

  private obterDocumentosFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.documentoFornecedorService.listar().subscribe(
      response => {
        if (response) {
          this.documentosFornecedor = response;
        }
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idSolicitacaoDocumentoFornecedor: [0],
      idTenant: [0],
      idDocumentoFornecedor: [null, Validators.required],
      categoriasFornecimento: [new Array<CategoriaFornecimento>(), Validators.required]
    });
  }

  private preencherFormulario(solicitacaoDocumentoFornecedor: SolicitacaoDocumentoFornecedor) {
    this.form.patchValue(solicitacaoDocumentoFornecedor);
  }

  public async obterListas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.categorias = await this.categoriaFornecimentoService.obter().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    let solicitacaoDocumentoFornecedor: SolicitacaoDocumentoFornecedor = this.form.value;
    if (this.form.valid) {
      if (solicitacaoDocumentoFornecedor.idSolicitacaoDocumentoFornecedor) {
        this.alterar(solicitacaoDocumentoFornecedor);
      } else {
        this.inserir(solicitacaoDocumentoFornecedor);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(solicitacaoDocumentoFornecedor: SolicitacaoDocumentoFornecedor) {
    this.blockUI.start();
    this.solicitacaoDocumentoFornecedorService.inserir(solicitacaoDocumentoFornecedor).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success(
            'Falha ao inserir nova solicitação de documento. Por favor, tente novamente.'
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

  private alterar(solicitacaoDocumentoFornecedor: SolicitacaoDocumentoFornecedor) {
    this.blockUI.start();
    this.solicitacaoDocumentoFornecedorService.alterar(solicitacaoDocumentoFornecedor).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success(
            'Falha ao alterar solicitação de documento. Por favor, tente novamente.'
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

  // #region Categorias de produto

  public compareFn(a, b): boolean {
    return a.idCategoriaFornecimento == b.idCategoriaFornecimento;
  }

  public onSelectAll() {
    this.form.get('categoriasFornecimento').patchValue(this.categorias);
  }

  // #endregion
}
