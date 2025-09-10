import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Arquivo, SolicitacaoDocumentoFornecedorArquivo } from '@shared/models';
import {
  ArquivoService,
  AutenticacaoService,
  SolicitacaoDocumentoFornecedorArquivoService,
  TranslationLibraryService
} from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-enviar-documento',
  templateUrl: './modal-enviar-documento.component.html',
  styleUrls: ['./modal-enviar-documento.component.scss']
})
export class ModalEnviarDocumentoComponent implements OnInit {
  public currentDate = this.getCurrentDate();
  public form: FormGroup;
  @Input() documento: SolicitacaoDocumentoFornecedorArquivo;
  @Output() reloadDoc: EventEmitter<any> = new EventEmitter();
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService,
    private documentoService: SolicitacaoDocumentoFornecedorArquivoService
  ) {}

  ngOnInit() {
    this.construirFormulario();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      dataVencimento: [],
      idArquivo: [null, Validators.required],
      arquivo: [null, Validators.required]
    });

    this.configurarValidadores();
  }

  private configurarValidadores() {
    if (this.documento.documentoFornecedor.vencimentoObrigatorio) {
      this.form.controls.dataVencimento.setValidators([Validators.required]);
    }
  }

  public incluir() {
    if (this.formularioValido()) {
      this.preencherSolicitacaoDocumentoArquivo();
      this.salvarDocumento();
    }
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
    this.documento.idArquivo = this.obterIdArquivo();
    this.documento.dataVencimento = this.obterDataVencimento();    
    this.documento.idPessoaJuridicaFornecedor = this.documento.idPessoaJuridicaFornecedor || this.obterIdPessoaJuridicaFornecedor();    
  }

  private salvarDocumento() {
    this.blockUI.start();
    this.documentoService.inserir(this.documento).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error('Falha ao inserir documento. Por favor, tente novamente.');
        }
        this.blockUI.stop();
      },
      error => {
        if (error.status == 400) this.toastr.warning(error.error);
        else this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);

        this.blockUI.stop();
      }
    );
  }

  public async selecionarArquivo(arquivo: Arquivo) {
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

  private async salvarArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }

  public excluirArquivo() {
    this.form.patchValue({ idArquivo: null, arquivo: null });
  }

  private getCurrentDate(): string {
    return moment().format('YYYY-MM-DDTHH:mm');
  }

  private obterIdArquivo(): number {
    return this.form.get('idArquivo').value;
  }

  private obterIdSolicitacaoDocumentoFornecedor(): number {
    return this.form.get('idSolicitacaoDocumentoFornecedor').value;
  }

  private obterDataVencimento(): Date {
    return this.form.get('dataVencimento').value;
  }

  private obterIdPessoaJuridicaFornecedor(): number {
    return this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoaJuridica;
  }
}
