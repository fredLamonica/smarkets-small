import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { TipoClassificacaoSla } from '../../../shared/models/enums/tipo-classificacao-sla';
import { TipoSlaSolicitacao } from '../../../shared/models/enums/tipo-sla-solicitacao';
import { UnidadeMedidaTempoSla } from '../../../shared/models/enums/unidade-medida-tempo-sla';
import { SlaSolicitacao } from '../../../shared/models/sla-solicitacao/sla-solicitacao';
import { TranslationLibraryService } from '../../../shared/providers';
import { SlaSolicitacaoService } from '../../../shared/providers/sla-solicitacao.service';

@Component({
  selector: 'modal-incluir-editar-sla',
  templateUrl: './modal-incluir-editar-sla.component.html',
  styleUrls: ['./modal-incluir-editar-sla.component.scss']
})
export class ModalIncluirEditarSlaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() SlaSolicitacao: SlaSolicitacao;

  public form: FormGroup;
  public enumUnidadeTempoSla = UnidadeMedidaTempoSla;
  public opcoesUnidadeTempoSla = Object.keys(this.enumUnidadeTempoSla).filter(Number);

  public enumTipoClassificacaoSla = TipoClassificacaoSla;
  public opcoesTipoTipoClassificacaoSla = Object.keys(this.enumTipoClassificacaoSla).filter(Number);

  public tipoSLA: string;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private slaSolicitacaoService: SlaSolicitacaoService) { }

  ngOnInit() {
    this.construirFormulario()

    if(this.SlaSolicitacao){
      this.form.patchValue(this.SlaSolicitacao);
      this.tipoSLA = this.SlaSolicitacao.tipoSlaSolicitacao == 1 ? "Produtos e Serviços" : "Fornecedores"
    }
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idSlaSolicitacao: [0],
      idTenant: [0],
      classificacao: [null],
      tempo: [null],
      tipoSlaSolicitacao: [null],
      unidadeMedidaTempo: [null],
      statusSla: [null]
    });
  }

  public close(){
    this.activeModal.close();
  }

  public save() {
    if (this.formIsValid()) {
      let item = this.form.value;

      if (this.SlaSolicitacao) this.alter(item);
      else{
        item.statusSla = 1;
        item.tipoSlaSolicitacao = this.tipoSLA == "Fornecedores" ? 2 : 1;
        item.dataInclusao = moment();
        this.insert(item);
      }
    }
  }

  private formIsValid(): boolean {
    if (this.form.invalid || this.form.controls.tempo.value < 1) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }

  private insert(item: SlaSolicitacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaSolicitacaoService.post(item).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      responseError => {
        if (responseError.status == 400) {
          responseError.error.forEach(element => {
            this.toastr.warning(element.message);
          });
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  private alter(item: SlaSolicitacao) {
    this.slaSolicitacaoService.put(this.SlaSolicitacao.idSlaSolicitacao, item).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(item);
      },
      responseError => {
        if (responseError.status == 400) {
          responseError.error.forEach(element => {
            this.toastr.warning(element.message);
          });
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }
}
