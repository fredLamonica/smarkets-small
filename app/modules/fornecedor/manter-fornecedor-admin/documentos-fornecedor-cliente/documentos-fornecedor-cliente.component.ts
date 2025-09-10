import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SolicitacaoDocumentoFornecedorArquivo } from '@shared/models';
import { AutenticacaoService, SolicitacaoDocumentoFornecedorArquivoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-documentos-fornecedor-cliente',
  templateUrl: './documentos-fornecedor-cliente.component.html',
  styleUrls: ['./documentos-fornecedor-cliente.component.scss']
})
export class DocumentosFornecedorClienteComponent implements OnInit {
  public idPessoaJuridicaFornecedor: number;
  public solicitacaoDocumentosFornecedorArquivos: Array<SolicitacaoDocumentoFornecedorArquivo>;  
  public form: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
 
  constructor(
    private translationLibrary: TranslationLibraryService,    
    private toastr: ToastrService,
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private auth: AutenticacaoService,
    private route: ActivatedRoute,   
    ) {      
      this.idPessoaJuridicaFornecedor = this.route.parent.snapshot.params.id
     }

  ngOnInit() {   
    this.obterDocumentos();        
  }

  public obterDocumentos() {
   
      this.blockUI.start(this.translationLibrary.translations.LOADING);     
        this.solicitacaoDocumentoFornecedorArquivoService
          .obterDocumentos(this.idPessoaJuridicaFornecedor)
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

  public recarregaDocumentosFornecedor(){   
      this.obterDocumentos();
  }
}
