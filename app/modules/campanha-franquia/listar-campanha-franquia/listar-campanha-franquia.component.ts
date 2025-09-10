import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampanhaFranquia, FranchiseCampaignFilter, SituacaoCampanha, SituacaoCampanhaLabel } from '@shared/models';
import { FranchiseCampaignService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'listar-campanha-franquia',
  templateUrl: './listar-campanha-franquia.component.html',
  styleUrls: ['./listar-campanha-franquia.component.scss']
})
export class ListarCampanhaFranquiaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public itens: CampanhaFranquia[] = [];
  public franchiseCampaignFilter: FranchiseCampaignFilter;
  public SituacaoCampanha = SituacaoCampanha;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private franchiseCampaignService: FranchiseCampaignService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildFilter();
    this.getFranchiseCampaigns();
  }

  public statusOptions = Array.from(SituacaoCampanhaLabel.values()).map(p => {
    return { label: p };
  });

  private buildFilter(): void {
    this.franchiseCampaignFilter = new FranchiseCampaignFilter();
    this.franchiseCampaignFilter.pagina = 1;
    this.franchiseCampaignFilter.itensPorPagina = 5;
    this.franchiseCampaignFilter.totalPaginas = 0;
  }

  public getFranchiseCampaigns() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.franchiseCampaignService.filterFranchiseCampaigns(this.franchiseCampaignFilter).subscribe(
      response => {
        if (response) {
          this.itens = response.itens;
          this.franchiseCampaignFilter.totalPaginas = response.numeroPaginas;
        } else {
          this.franchiseCampaignFilter.pagina = 1;
          this.franchiseCampaignFilter.totalPaginas = 0;
        }

        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public page(event) {
    this.franchiseCampaignFilter.pagina = event.page;
    this.franchiseCampaignFilter.itensPorPagina = event.recordsPerPage;

    this.getFranchiseCampaigns();
  }

  public search() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.franchiseCampaignService.filterFranchiseCampaigns(this.franchiseCampaignFilter).subscribe(
      result => {
        if (result) {
          this.itens = result.itens;
        } else {
          this.itens = [];
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public novaCampanha() {
    this.router.navigate(['campanhas-franquia/novo/dados-gerais']);
  }

  public setStatusFilter(event) {
    const label: string = event.label;
    this.franchiseCampaignFilter.status = SituacaoCampanha[label];
  }
}
