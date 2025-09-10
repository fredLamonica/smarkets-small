import { Component, Injector, OnInit } from '@angular/core';
import {
  Arquivo
} from '@shared/models';
import { ImportType } from '@shared/models/enums/ImportType.enum';
import { ListarCargaPorTipoComponent } from '../base/listar-carga-por-tipo.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-listar-carga-imagem',
  templateUrl: './listar-carga-imagem.component.html',
  styleUrls: ['./listar-carga-imagem.component.scss'],
})
export class ListarCargaImagemComponent extends ListarCargaPorTipoComponent implements OnInit {

  protected importType = ImportType['Imagens'];

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  selecionarArquivo(arquivo: Array<Arquivo>) {
    if (this.clientSelectedIdTenant) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.arquivoService.inserir(arquivo[0]).subscribe(
        (response) => {
          if (response) {
            response.url = arquivo[0].url;
            this.importacaoService.importImages(response, this.clientSelectedIdTenant).subscribe(
              // tslint:disable-next-line: no-shadowed-variable
              (response) => {
                this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                this.blockUI.stop();
                this.clientSelectedIdTenant = null;
                this.getImportations();
              },
              (error) => {
                switch (error.error) {
                  case 'O Arquivo carregado não contém uma planilha válida':
                    this.toastr.error(error.error);
                    break;
                  default:
                    this.toastr.error(
                      this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR,
                    );
                    break;
                }
                this.blockUI.stop();
                this.getImportations();
              },
            );
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.toastr.warning('Campo Empresa deve ser selecionado.');
    }
  }

}
