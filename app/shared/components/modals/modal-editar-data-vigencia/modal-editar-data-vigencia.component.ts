import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitacaoDocumentoFornecedorArquivo } from '@shared/models';
import { ArquivoService, AutenticacaoService, SolicitacaoDocumentoFornecedorArquivoService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-editar-data-vigencia',
  templateUrl: './modal-editar-data-vigencia.component.html',
  styleUrls: ['./modal-editar-data-vigencia.component.scss']
})
export class ModalEditarDataVigenciaComponent implements OnInit {
  public currentDate = this.getCurrentDate();
  public form: FormGroup;  
  @Input() documento: SolicitacaoDocumentoFornecedorArquivo;
  @Output() reloadDoc: EventEmitter<any> = new EventEmitter();
  @BlockUI() blockUI: NgBlockUI;
  public dateDefault: string;

  constructor(private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private documentoService: SolicitacaoDocumentoFornecedorArquivoService,
    private activeModal: NgbActiveModal,
    ) { }

  ngOnInit() {
    this.construirFormulario(); 
    this.dateDefault = moment(this.documento.dataVencimento).format('YYYY-MM-DD');
  }    

  private construirFormulario() {    
    this.form = this.fb.group({
      dataVencimento: [null,Validators.required]      
    });    
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    } else {
      return true;
    }
  }

  private getCurrentDate(): string {
    return moment().format('YYYY-MM-DDTHH:mm');
  }

  private obterDataVencimento(): Date {
    return this.form.get('dataVencimento').value;
  } 

  private salvarDocumento() {
    this.blockUI.start();
    this.documentoService
      .alterarVigencia(this.documento)
      .subscribe(
        response => {
          if (response) {
            this.activeModal.close(response);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error('Falha ao alterar data. Por favor, tente novamente.');
          }                  
          this.blockUI.stop();          
        },
        error => {
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
              if (error.error.contains('não foi encontrado!')) this.toastr.warning(error.error);

              if (error.status == 400) this.toastr.error(error.error);
              else
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR
                );

              this.blockUI.stop();
          }
        }
      );
  }

  public alterarData(){
    if(this.formularioValido()){
      this.documento.antigaDataVencimento = this.documento.dataVencimento;
      this.documento.dataVencimento = this.obterDataVencimento();
      this.salvarDocumento();      
    }
    
  }

}
