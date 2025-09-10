import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FornecedorInteressado, SolicitacaoDocumentoFornecedorArquivo } from '@shared/models';
import { ArquivoService, SolicitacaoDocumentoFornecedorArquivoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'modal-documento',
  templateUrl: './modal-documento.component.html',
  styleUrls: ['./modal-documento.component.scss']
})
export class ModalDocumentoComponent implements OnInit {
  public solicitacaoDocumentosFornecedorArquivos: Array<SolicitacaoDocumentoFornecedorArquivo>;  
  @Input() fornecedor: FornecedorInteressado;  
  public form: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
 
  constructor(
    private translationLibrary: TranslationLibraryService,    
    private toastr: ToastrService,
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private arquivoService: ArquivoService,
    ) { }

 async ngOnInit() {
    await this.obterDocumentos();        
  }

  public obterDocumentos() {
    if (
      this.solicitacaoDocumentosFornecedorArquivos == undefined &&
      this.fornecedor.idPessoaJuridicaFornecedor
    ) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      if (this.fornecedor.idPessoaJuridicaFornecedor) {
        this.solicitacaoDocumentoFornecedorArquivoService
          .obterDocumentos(this.fornecedor.idPessoaJuridicaFornecedor)
          .subscribe(
            response => {
              this.solicitacaoDocumentosFornecedorArquivos = response;
              this.blockUI.stop();
            },
            error => {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              this.blockUI.stop();
            }
          );
      }
    }
  }

  public baixarZip(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoDocumentoFornecedorArquivoService
      .baixarZipDocumentos(this.fornecedor.idPessoaJuridicaFornecedor)
      .subscribe(
        response => {
          this.arquivoService.createDownloadElement(
            response,
            'Documentos_' +
              this.fornecedor.razaoSocial
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '_') +
              '.zip'
          );
          this.blockUI.stop();
        },
        error => {
          switch (error.error) {
            case 'Não há documentos a serem baixados':
            case 'O Fornecedor ainda não enviou todos os documentos':
            case 'O Fornecedor ainda não atualizou os documentos vencidos':
            case 'Os arquivos ainda não foram validados':
            case 'O Fornecedor ainda não atualizou os documentos invalidados':
              this.toastr.warning(error.error);
              break;
            default:
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              break;
          }
          this.blockUI.stop();
        }
      );
  }
 
}
