import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalTimelineDocumentoComponent } from '@shared/components';
import {
  SituacaoValidacaoDocumentoFornecedor,
  SolicitacaoDocumentoFornecedorArquivo
} from '@shared/models';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ModalEnviarDocumentoComponent } from './modal-enviar-documento/modal-enviar-documento.component';

@Component({
  selector: 'app-item-documento',
  templateUrl: './item-documento.component.html',
  styleUrls: ['./item-documento.component.scss']
})
export class ItemDocumentoEnviarComponent implements OnInit {
  @Input() documento: SolicitacaoDocumentoFornecedorArquivo;
  @Output() recarregaDocumentos: EventEmitter<any> = new EventEmitter();
  public enumSituacaoValidacao = SituacaoValidacaoDocumentoFornecedor;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {}

  get docAVencer() {
    const hoje = moment(moment().format('L')); // L : 'MM/DD/YYYY'
    const dias = -hoje.diff(this.documento.dataVencimento, 'days');
    return (
      this.documento.arquivo.idArquivo &&
      (this.documento.validacaoArquivo.situacaoValidacaoArquivo !=
        this.enumSituacaoValidacao.Invalido ||
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == null) &&
      dias >= 1 &&
      dias <= 29
    );
  }

  get dias() {
    const hoje = moment();
    const dias = -hoje.diff(this.documento.dataVencimento, 'days') + 1;
    if (dias < 0) {
      return -dias;
    }
    return dias;
  }

  get docVencido() {
    const hoje = moment();
    const dataVencimento = moment(this.documento.dataVencimento);
    return (
      hoje > dataVencimento &&
      (this.documento.validacaoArquivo.situacaoValidacaoArquivo !=
        this.enumSituacaoValidacao.Invalido ||
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == null)
    );
  }

  get labelSituacao() {
    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
      this.docVencido
    ) {
      return 'VENCIDO:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
      this.docAVencer
    ) {
      return 'À VENCER:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2
    ) {
      return 'APROVADO:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo == 3
    ) {
      return 'RECUSADO:';
    }

    if (this.documento.arquivo && !this.documento.validacaoArquivo) {
      return 'NOVO:';
    }

    return 'NÃO ENVIADO';
  }

  public showModalEnviarDocumento() {
    let currenteDate = this.getCurrentDate();

    if (
      (this.documento.validacaoArquivo &&
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
        this.documento.dataVencimento != null &&
        this.documento.dataVencimento.toString() >= currenteDate) ||
      (this.documento.validacaoArquivo &&
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
        !this.documento.dataVencimento)
    ) {
      this.toastr.warning(
        'Não é possível enviar um novo arquivo para documentos que estejam validados ou vigentes'
      );
    } else {
      const modalRef = this.modalService.open(ModalEnviarDocumentoComponent, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      });

      modalRef.componentInstance.documento = this.documento;

      modalRef.result.then(result => {
        if (result) {
          this.recarregaDocumentos.emit();
        }
      });
    }
  }

  public showModalTimeLineDocumento() {
    const modalRef = this.modalService.open(ModalTimelineDocumentoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.documento = this.documento;
  }

  public alert() {
    this.toastr.warning('O documento não possui histórico.');
  }

  private getCurrentDate() {
    let date = new Date();
    let currenteDate = this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    return currenteDate;
  }

  get validateDocument() {
    let currenteDate = this.getCurrentDate();
    return (
      (this.documento.validacaoArquivo &&
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
        this.documento.dataVencimento != null &&
        this.documento.dataVencimento.toString() >= currenteDate) ||
      (this.documento.validacaoArquivo &&
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
        !this.documento.dataVencimento)
    );
  }
}
