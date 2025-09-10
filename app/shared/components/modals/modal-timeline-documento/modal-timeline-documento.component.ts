import { Component, Input, OnInit } from '@angular/core';
import { SolicitacaoDocumentoFornecedorArquivo } from '@shared/models';
import { SolicitacaoDocumentoFornecedorArquivoDTO } from '@shared/models/dto/solicitacao-documento-fornecedor-arquivo-dto';
import { ArquivoService, SolicitacaoDocumentoFornecedorArquivoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-modal-timeline-documento',
  templateUrl: './modal-timeline-documento.component.html',
  styleUrls: ['./modal-timeline-documento.component.scss'],
})
export class ModalTimelineDocumentoComponent extends Unsubscriber implements OnInit {
  @Input() documento: SolicitacaoDocumentoFornecedorArquivo;
  historicoSolicitacaoDocumento: SolicitacaoDocumentoFornecedorArquivoDTO;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private arquivoService: ArquivoService) {
    super();
  }

  ngOnInit() {
    this.obterHistorico();
  }

  obterHistorico() {
    const idPessoaJuridicaFornecedor = this.documento
      .idPessoaJuridicaFornecedor;
    const idDocumentoFornecedor = this.documento.documentoFornecedor
      .idDocumentoFornecedor;
    this.blockUI.start();
    this.solicitacaoDocumentoFornecedorArquivoService
      .obterHistoricoDto(idPessoaJuridicaFornecedor, idDocumentoFornecedor)
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

  baixarArquivosPorData(data: string) {

    this.historicoSolicitacaoDocumento.historico[data].forEach((arquivo) => {
      this.baixarArquivo(arquivo);
    });
  }

  baixarArquivo(solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo) {
    const nomeDoArquivo =
      solicitacaoDocumentoFornecedorArquivo.documentoFornecedor.descricaoDocumento +
      solicitacaoDocumentoFornecedorArquivo.arquivo.extensao;

    this.arquivoService.downloadFile(solicitacaoDocumentoFornecedorArquivo.arquivo.idArquivo, nomeDoArquivo).pipe(takeUntil(this.unsubscribe)).subscribe();
  }

  convertDate(str: string) {
    const ind = str.indexOf(' ');
    const date = str.substring(0, ind);
    return date;
  }

}
