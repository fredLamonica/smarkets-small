import { Component, Injector, OnInit } from '@angular/core';
import {
  Arquivo
} from '@shared/models';
import { ImportType } from '../../../shared/models/enums/ImportType.enum';
import { ListarCargaComponent } from '../base/listar-carga.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-listar-importacao-solicitacao-compra',
  templateUrl: './listar-importacao-solicitacao-compra.component.html',
  styleUrls: ['./listar-importacao-solicitacao-compra.component.scss'],
})
export class ListarImportacaoSolicitacaoCompraComponent extends ListarCargaComponent implements OnInit {

  protected importType = ImportType['Solicitação de Compras'];

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.settings.columns.pop();
  }

  selecionarArquivo(arquivo: Array<Arquivo>) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.arquivoService.inserir(arquivo[0]).subscribe(
      (response) => {
        if (response) {
          response.url = arquivo[0].url;
          this.importacaoService.importarSolicitacaoCompra(response).subscribe(
            // tslint:disable-next-line: no-shadowed-variable
            (response) => {
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.blockUI.stop();
              this.getImportations();
            },
            (error) => {
              switch (error.error) {
                case 'O arquivo importado não está idêntico ao modelo atual.':
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
