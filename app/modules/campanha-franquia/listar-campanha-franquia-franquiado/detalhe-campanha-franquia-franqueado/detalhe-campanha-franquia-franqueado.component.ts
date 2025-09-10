import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ParticipanteCampanhaFranquia } from '../../../../shared/models/participante-campanha-franquia';
import { ToastrService } from 'ngx-toastr';
import { FranchiseCampaignService, TranslationLibraryService } from '../../../../shared/providers';
import { ParticipanteCampanhaFranquiaService } from '@shared/providers/participante-campanha-franquia.service';
import { SituacaoCampanha } from '../../../../shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoAceiteCampanhaFranqueadoComponent } from '../../../../shared/components/modals/modal-confirmacao-aceite-campanha-franqueado/modal-confirmacao-aceite-campanha-franqueado.component';
import { ModalConfirmacaoRecusaCampanhaFranqueadoComponent } from '../../../../shared/components/modals/modal-confirmacao-recusa-campanha-franqueado/modal-confirmacao-recusa-campanha-franqueado.component';
import * as moment from 'moment';

@Component({
  selector: 'detalhe-campanha-franquia-franqueado',
  templateUrl: './detalhe-campanha-franquia-franqueado.component.html',
  styleUrls: ['./detalhe-campanha-franquia-franqueado.component.scss']
})
export class DetalheCampanhaFranquiaFranqueadoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public form: FormGroup;
  public paramId: Number;
  public participanteFranquia: ParticipanteCampanhaFranquia;
  public situacaoCampanha = SituacaoCampanha;
  public disableTermoAceite: Boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private participanteCampanhaFranquiaService: ParticipanteCampanhaFranquiaService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.paramId = params['id'])

    this.construirFormulario();

    if (this.paramId) {
      this.obterDetalhesFranquado(this.paramId);
    }

  }

  private construirFormulario() {
    this.form = this.fb.group({
      idParticipantesCampanhaFranquia: [0],
      idPessoaJuridica: [0],
      dataTermoAceite: [''],
      idCampanhaFranquia: [0],
      titulo: [''],
      dataInicio: [''],
      dataFim: [''],
      dataLimiteAceite: [''],
      status: [0],
      ano: [0],
      semestre: [0],
      dataLimiteComprovacao: [''],
      dataLimiteNotaDebito: [''],
      dataLimitePagamento: [''],
      vcpHolding: [0],
      vcpFranquia: [0],
      vcpTotal: [0],
      aceiteTermo: [0]
    });
  }

  public obterDetalhesFranquado(id: any){
    this.participanteCampanhaFranquiaService.GetParticipantesCampanhaFranquiaById(id).subscribe(
      response => {
        if (response) {
          this.participanteFranquia = response;
          this.disableTermoAceite = this.dislableTermoAceite();
          this.blockUI.stop();
        }
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public return(){
    this.router.navigate([`/campanhas-franquia/franqueado`]);
  }

  public download(url: string) {
    <any>window.open(url);
  }

  public changeAcceptedTerm(choice: number) {
    this.participanteFranquia.aceiteTermo = choice;
  }

  public dislableTermoAceite() : Boolean{
    if (this.participanteFranquia.aceiteTermo != 0 || moment(this.participanteFranquia.dataFim) < moment()) {
      return true;
    } else {
      return false;
    }
  }

  getClass(){
    switch(this.participanteFranquia.status){
      case "Aprovado":
        return 'status-active';
      case "Reprovado":
        return 'status-inactive';
      case "Aguardando Aceite":
        return 'status-in-configuration';
      case "Encerrado":
        return 'status-terminated';
    }
  }

  public requestActivation() {
    if (this.participanteFranquia.aceiteTermo == 1) {
      const modalRef = this.modalService.open(ModalConfirmacaoAceiteCampanhaFranqueadoComponent, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
        windowClass: 'termo-franqueado-confirmacao'
      });
      modalRef.result.then(result => {
        if (result) this.updateStatus(this.participanteFranquia);
      });
    } else if(this.participanteFranquia.aceiteTermo == 2){
      const modalRef = this.modalService.open(ModalConfirmacaoRecusaCampanhaFranqueadoComponent, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
        windowClass: 'termo-franqueado-confirmacao'
      });
      modalRef.result.then(result => {
        if (result) this.updateStatus(this.participanteFranquia);
      });
    }else{
      this.toastr.warning("Escolha uma das opções de aceite.");
    }
  }

  private updateStatus(model: ParticipanteCampanhaFranquia) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.participanteCampanhaFranquiaService
      .updateFranchiseCampaignTermsConditions(this.participanteFranquia)
      .subscribe(
        response => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.disableTermoAceite = true;
          this.blockUI.stop();
          this.router.navigate([`campanhas-franquia/franqueado`]);
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }
}
