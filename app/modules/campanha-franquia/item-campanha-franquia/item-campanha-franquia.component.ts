import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AuditoriaComponent,
  ConfirmacaoComponent,
  ModalConfirmacaoAtivacaoCampanhaFranquiaComponent,
  ModalConfirmacaoExclusao
} from '@shared/components';
import { CampanhaFranquia, SituacaoCampanha } from '@shared/models';
import { ArquivoService, FranchiseCampaignService, TranslationLibraryService } from '@shared/providers';
import { RelatoriosService } from '@shared/providers/relatorios.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'item-campanha-franquia',
  templateUrl: './item-campanha-franquia.component.html',
  styleUrls: ['./item-campanha-franquia.component.scss']
})
export class ItemCampanhaFranquiaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() franchiseCampaign: CampanhaFranquia;
  @Output() itemChange: EventEmitter<any> = new EventEmitter();

  public SituacaoCampanha = SituacaoCampanha;

  constructor(
    private franchiseCampaignService: FranchiseCampaignService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private relatorioService: RelatoriosService,
    private arquivoService: ArquivoService,
  ) {}

  ngOnInit() {}

  public cardClicked() {
    let routerString = `${this.franchiseCampaign.idCampanhaFranquia}/dados-gerais`;
    this.navigateFor(routerString);
  }

  public navigateFor(page: string) {
    this.router.navigate([`${this.router.url}/${page}`]);
  }

  public audit(franchiseCampaignId: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'CampanhaFranquia';
    modalRef.componentInstance.idEntidade = franchiseCampaignId;
  }

  public requestDeletion(franchiseCampaignId: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.delete(franchiseCampaignId),
        reason => {}
      );
  }

  private delete(franchiseCampaignId: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.franchiseCampaignService.deleteFranchiseCampaign(franchiseCampaignId).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.itemChange.emit();
      },
      error => {
        if (error.error && error.error.some(e => e.message.includes('respondeu os termos'))) {
          error.error.forEach(e => {
            this.toastr.warning(e.message);
          });
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  public requestActivation(franchiseCampaignId: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoAtivacaoCampanhaFranquiaComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'campanha-franquia-confirmacao'
    });
    modalRef.result.then(result => {
      if (result) this.updateStatus(franchiseCampaignId, SituacaoCampanha.Ativa);
    });
  }

  public requestInactivation(franchiseCampaignId: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja inativar a campanha?';
    modalRef.result.then(result => {
      if (result) this.updateStatus(franchiseCampaignId, SituacaoCampanha.Inativa);
    });
  }

  private updateStatus(franchiseCampaignId: number, status: SituacaoCampanha) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.franchiseCampaignService
      .updateFranchiseCampaignStatus(franchiseCampaignId, status)
      .subscribe(
        response => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.itemChange.emit();
        },
        error => {
          if (
            error.error &&
            (error.error.some(e => e.message.includes('informar o arquivo')) ||
              error.error.some(e => e.message.includes('A campanha')) ||
              error.error.some(e => e.message.includes('respondeu os termos')) ||
              error.error.some(e => e.message.includes('Já existe uma campanha ativa')))
          ) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }
      );
  }

  public exportDebitNoteReport(){
    this.blockUI.start();
      this.relatorioService.exportDebitNoteReport(this.franchiseCampaign.idCampanhaFranquia).subscribe(
        response => {
          if (response.size > 0) {
            this.arquivoService.createDownloadElement(response, "Relatório de Nota de Débito.xls");
            this.blockUI.stop();
          } else {
            this.toastr.warning("Nenhum registro encontrado.");
            this.blockUI.stop();
          }
        }, () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  getStatus(){
    if(this.franchiseCampaign.cicloEncerrado){
      return "Encerrado";
    }
    return SituacaoCampanha[this.franchiseCampaign.status];
  }
}
