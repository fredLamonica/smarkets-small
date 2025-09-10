import { Component, Injector, OnInit } from '@angular/core';
import {
  Arquivo
} from '@shared/models';
import { ImportType } from '@shared/models/enums/ImportType.enum';
import { ListarCargaComponent } from '../base/listar-carga.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-listar-carga-empresas',
  templateUrl: './listar-carga-empresas.component.html',
  styleUrls: ['./listar-carga-empresas.component.scss'],
})
export class ListarCargaEmpresasComponent extends ListarCargaComponent implements OnInit {

  protected importType = ImportType.Empresas;

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  selecionarArquivo(arquivo: Array<Arquivo>) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.arquivoService.inserir(arquivo[0]).subscribe(

      (response) => {
        if (response) {
          response.url = arquivo[0].url;
          this.importacaoService.importCompanies(response, this.clientSelectedIdTenant).subscribe(
            () => {
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.blockUI.stop();
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
  }
}
