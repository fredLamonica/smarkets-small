import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Arquivo, SolicitacaoDocumentoFornecedorArquivo } from '@shared/models';
import {
  ArquivoService,
  AutenticacaoService,
  SolicitacaoDocumentoFornecedorArquivoService, TranslationLibraryService
} from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../../shared/components/base/unsubscriber';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-documentos-fornecedor',
  templateUrl: './manter-documentos-fornecedor.component.html',
  styleUrls: ['./manter-documentos-fornecedor.component.scss'],
})
export class ManterDocumentosFornecedorComponent extends Unsubscriber implements OnInit {
  currentDate = this.getCurrentDate();
  form: FormGroup;
  historicoSolicitacaoDocumento: Array<SolicitacaoDocumentoFornecedorArquivo>;

  @BlockUI() blockUI: NgBlockUI;
  @Input() solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService,
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private datePipe: DatePipe,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormulario();
    this.obterHistorico();
  }

  fechar() {
    this.activeModal.close();
  }

  incluir() {
    if (this.formularioValido()) {
      this.preencherSolicitacaoDocumentoArquivo();
      this.salvarDocumento();
    }
  }

  obterHistorico() {
    if (this.solicitacaoDocumentoFornecedorArquivo.idSolicitacaoDocumentoFornecedorArquivo) {
      const idPessoaJuridicaFornecedor = this.solicitacaoDocumentoFornecedorArquivo
        .idPessoaJuridicaFornecedor;
      const idDocumentoFornecedor = this.solicitacaoDocumentoFornecedorArquivo.documentoFornecedor
        .idDocumentoFornecedor;
      this.blockUI.start();
      this.solicitacaoDocumentoFornecedorArquivoService
        .obterHistorico(idPessoaJuridicaFornecedor, idDocumentoFornecedor)
        .subscribe(
          (response) => {
            this.historicoSolicitacaoDocumento = response;
            this.blockUI.stop();
          },
          (error) => {
            this.blockUI.stop();
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          },
        );
    }
  }

  formatarData(data: Date): string {
    if (data) {
      return this.datePipe.transform(data, 'dd/MM/yyyy');
    }

    return null;
  }

  // #region Arquivo
  async selecionarArquivo(arquivo: Arquivo) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      arquivo = await this.salvarArquivo(arquivo[0]);
      this.form.patchValue({ idArquivo: arquivo.idArquivo, arquivo: arquivo });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
    this.blockUI.stop();
  }

  excluirArquivo() {
    this.form.patchValue({ idArquivo: null, arquivo: null });
  }

  baixarArquivo(solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo) {
    const nomeDoArquivo =
      solicitacaoDocumentoFornecedorArquivo.documentoFornecedor.descricaoDocumento +
      solicitacaoDocumentoFornecedorArquivo.arquivo.extensao;

    this.arquivoService.downloadFile(solicitacaoDocumentoFornecedorArquivo.arquivo.idArquivo, nomeDoArquivo).pipe(takeUntil(this.unsubscribe)).subscribe();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      dataVencimento: [],
      idArquivo: [null, Validators.required],
      arquivo: [null, Validators.required],
    });

    this.configurarValidadores();
  }

  private configurarValidadores() {
    if (this.solicitacaoDocumentoFornecedorArquivo.documentoFornecedor.vencimentoObrigatorio) {
      this.form.controls.dataVencimento.setValidators([Validators.required]);
    }
  }

  private getCurrentDate(): string {
    return moment().format('YYYY-MM-DDTHH:mm');
  }

  private obterIdArquivo(): number {
    return this.form.get('idArquivo').value;
  }

  private obterDataVencimento(): Date {
    return this.form.get('dataVencimento').value;
  }

  private obterIdPessoaJuridicaFornecedor(): number {
    return this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoaJuridica;
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    } else {
      return true;
    }
  }

  private preencherSolicitacaoDocumentoArquivo() {
    this.solicitacaoDocumentoFornecedorArquivo.idArquivo = this.obterIdArquivo();
    this.solicitacaoDocumentoFornecedorArquivo.dataVencimento = this.obterDataVencimento();
    this.solicitacaoDocumentoFornecedorArquivo.idPessoaJuridicaFornecedor = this.obterIdPessoaJuridicaFornecedor();
  }

  private salvarDocumento() {
    this.blockUI.start();
    this.solicitacaoDocumentoFornecedorArquivoService
      .inserir(this.solicitacaoDocumentoFornecedorArquivo)
      .subscribe(
        (response) => {
          if (response) {
            this.activeModal.close(response);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error('Falha ao inserir documento. Por favor, tente novamente.');
          }
          this.blockUI.stop();
        },
        (error) => {
          switch (error.error) {
            case 'Este documento exige uma data de vencimento!':
              this.toastr.warning(error.error);
              this.blockUI.stop();
              break;
            case 'A data de vecimento não pode ser inferior a data atual!':
              this.toastr.warning(error.error);
              this.blockUI.stop();
              break;
            default:
              if (error.error.contains('não foi encontrado!')) { this.toastr.warning(error.error); }

              if (error.status === 400) { this.toastr.error(error.error); } else {
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR,
                );
              }

              this.blockUI.stop();
          }
        },
      );
  }

  private async salvarArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }
  // #endregion
}
