import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Arquivo } from '@shared/models';
import { CampanhaFranquia } from '@shared/models/campanha-franquia';
import { FranchiseCampaignService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'upload-politica-campanha',
  templateUrl: './upload-politica-campanha.component.html',
  styleUrls: ['./upload-politica-campanha.component.scss']
})
export class UploadPoliticaCampanhaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  arquivo: Arquivo;
  idCampanha: number;

  constructor(
    private franchiseService: FranchiseCampaignService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.idCampanha = parseInt(this.route.parent.snapshot.params.id);
    if (this.idCampanha) {
      this.obterArquivo();
    }
  }

  private async obterArquivo() {
    this.franchiseService
      .getFranchiseCampaignById(this.idCampanha)
      .subscribe((res: CampanhaFranquia) => {
        this.idCampanha = res.idCampanhaFranquia;
        if (res.idArquivoPolitica) {
          this.franchiseService
            .getUsagePolicy(res.idArquivoPolitica)
            .subscribe((res: Arquivo) => (this.arquivo = res));
        }
      });
  }

  upload() {
    document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
  }

  handleFileInput(file: Array<Arquivo>, extention: string) {
    this.arquivo = file[0];
    this.arquivo.extensao = extention;
  }

  public delectFile() {
    this.arquivo = null;
  }

  salvar() {
    if (this.arquivo && this.arquivo.url.search('base64') != -1) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.franchiseService.uploadPoliticaCampanha(this.idCampanha, this.arquivo).subscribe(
        (res: Arquivo) => {
          this.arquivo = res;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.router.navigate([`campanhas-franquia/${this.idCampanha}/determinacao-verba`]);
        },
        error => {
          if (error.error) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }
      );
    } else {
      this.toastr.warning('Arquivo para upload não informado.');
    }
  }
}
