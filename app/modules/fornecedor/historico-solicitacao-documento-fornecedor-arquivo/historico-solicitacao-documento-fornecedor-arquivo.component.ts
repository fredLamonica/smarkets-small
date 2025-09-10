import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SituacaoValidacaoDocumentoFornecedor, SolicitacaoDocumentoFornecedorArquivo
} from '@shared/models';
import {
  ArquivoService, SolicitacaoDocumentoFornecedorArquivoService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'historico-solicitacao-documento-fornecedor-arquivo',
  templateUrl: './historico-solicitacao-documento-fornecedor-arquivo.component.html',
  styleUrls: ['./historico-solicitacao-documento-fornecedor-arquivo.component.scss'],
})
export class HistoricoSolicitacaoDocumentoFornecedorArquivoComponent extends Unsubscriber implements OnInit {
  solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo;
  historicoSolicitacaoDocumentoFornecedor: Array<SolicitacaoDocumentoFornecedorArquivo>;
  enumSituacaoValidacao = SituacaoValidacaoDocumentoFornecedor;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private activeModal: NgbActiveModal,
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private arquivoService: ArquivoService,
  ) {
    super();
  }

  ngOnInit() {
    this.obterHistorico();
  }

  fechar() {
    this.activeModal.close();
  }

  obterHistorico() {
    const idPessoaJuridicaFornecedor = this.solicitacaoDocumentoFornecedorArquivo
      .idPessoaJuridicaFornecedor;
    const idDocumentoFornecedor = this.solicitacaoDocumentoFornecedorArquivo.documentoFornecedor
      .idDocumentoFornecedor;
    this.blockUI.start();
    this.solicitacaoDocumentoFornecedorArquivoService
      .obterHistorico(idPessoaJuridicaFornecedor, idDocumentoFornecedor)
      .subscribe(
        (response) => {
          this.historicoSolicitacaoDocumentoFornecedor = response;
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  baixarArquivo(solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo) {
    const nomeDoArquivo =
      solicitacaoDocumentoFornecedorArquivo.documentoFornecedor.descricaoDocumento +
      solicitacaoDocumentoFornecedorArquivo.arquivo.extensao;

    this.arquivoService.downloadFile(solicitacaoDocumentoFornecedorArquivo.arquivo.idArquivo, nomeDoArquivo).pipe(takeUntil(this.unsubscribe)).subscribe();
  }

  formatarData(data: Date): string {
    if (data) {
      return this.datePipe.transform(data, 'dd/MM/yyyy');
    }

    return null;
  }
}
