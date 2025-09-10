import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Arquivo } from '@shared/models';
import { CampanhaFranquia } from '@shared/models/campanha-franquia';
import { ImportType } from '@shared/models/enums/ImportType.enum';
import {
  ArquivoService,
  FranchiseCampaignService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'upload-determinacao-verba',
  templateUrl: './upload-determinacao-verba.component.html',
  styleUrls: ['./upload-determinacao-verba.component.scss'],
})
export class UploadDeterminacaoVerbaComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  arquivo: Arquivo;
  idVerba: number;

  constructor(
    private franchiseService: FranchiseCampaignService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private arquivoService: ArquivoService,
    private router: Router,
  ) {
    super();
  }

  async ngOnInit() {
    // tslint:disable-next-line: radix
    this.idVerba = parseInt(this.route.parent.snapshot.params.id);
    if (this.idVerba) {
      this.obterArquivo();
    }
  }

  upload() {
    document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
  }

  async downloadModelo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const f = await this.franchiseService
      .downloadModeloDeterminacaoVerba(ImportType['Verbas de Campanha'])
      .toPromise();
    this.arquivoService.downloadFile(f.idArquivo, f.nome).pipe(takeUntil(this.unsubscribe)).subscribe();
    this.blockUI.stop();
  }

  handleFileInput(file: Array<Arquivo>, extention: string) {
    this.arquivo = file[0];
    this.arquivo.extensao = extention;
  }

  delectFile() {
    this.arquivo = null;
  }

  salvar() {
    if (this.arquivo && this.arquivo.url.search('base64') !== -1) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.franchiseService.uploadDeterminacaoVerba(this.idVerba, this.arquivo).subscribe(
        (res: Arquivo) => {
          this.arquivo = res;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.router.navigate([`campanhas-franquia/`]);
        },
        (error) => {
          if (error.error) {
            error.error.forEach((e) => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        },
      );
    } else {
      this.toastr.warning('Arquivo para upload não informado.');
    }
  }

  private async obterArquivo() {
    this.franchiseService
      .getFranchiseCampaignById(this.idVerba)
      .subscribe((res: CampanhaFranquia) => {
        if (res.idArquivoVerbas) {
          this.franchiseService
            .getBudgetDetermination(res.idArquivoVerbas)
            // tslint:disable-next-line: no-shadowed-variable
            .subscribe((res: Arquivo) => (this.arquivo = res));
        }
      });
  }
}
