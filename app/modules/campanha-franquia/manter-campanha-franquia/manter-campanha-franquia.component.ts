import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent } from '@shared/components';
import { IMenuItem } from '@shared/components/sdk-menu-item/menu-item';
import { CampanhaFranquia } from '@shared/models/campanha-franquia';
import { FranchiseCampaignService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'manter-campanha-franquia',
  templateUrl: './manter-campanha-franquia.component.html',
  styleUrls: ['./manter-campanha-franquia.component.scss']
})
export class ManterCampanhaFranquiaComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  public idCampanhaFranquia: number;
  public isCreate = false;
  public campanhaFranquia: CampanhaFranquia;

  private paramsSub: Subscription;

  public itens: Array<IMenuItem>;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private translationLibrary: TranslationLibraryService,
    private franchiseCampaignService: FranchiseCampaignService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.blockUI.start();
    await this.getParameters();
    this.loadMenu();
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private loadMenu() {
    this.itens = [
      <IMenuItem>{
        label: 'Dados Gerais',
        url: 'dados-gerais',
        locked: false
      },
      <IMenuItem>{
        label: 'Política da Campanha',
        url: 'politica-campanha',
        locked: !this.canAccessMenuItem()
      },
      <IMenuItem>{
        label: 'Determinação de Verba',
        url: 'determinacao-verba',
        locked: !this.canAccessMenuItem()
      }
    ];
  }

  private canAccessMenuItem(): boolean {
    return !this.isCreate;
  }

  private getParameters() {
    this.paramsSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.idCampanhaFranquia = +params['id'];
        this.getFranchiseCampaign();
      } else {
        this.isCreate = true;
      }
    });
  }

  rotaVoltar: string;
  public voltar() {
    this.router.navigate([this.rotaVoltar]);
  }

  public auditar() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'CampanhaFranquia';
    modalRef.componentInstance.idEntidade = this.idCampanhaFranquia;
  }

  private getFranchiseCampaign() {
    this.franchiseCampaignService.getFranchiseCampaignById(this.idCampanhaFranquia).subscribe(
      (res: CampanhaFranquia) => {
        this.campanhaFranquia = res;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }
}
