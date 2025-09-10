import { Component, Injector, OnInit } from '@angular/core';
import {
  Arquivo
} from '@shared/models';
import { ImportType } from '@shared/models/enums/ImportType.enum';
import { finalize, takeUntil } from 'rxjs/operators';
import { ListarCargaPorTipoComponent } from '../base/listar-carga-por-tipo.component';

@Component({
  selector: 'app-listar-carga-informacao-contratos',
  templateUrl: './listar-carga-informacao-contratos.component.html',
  styleUrls: ['./listar-carga-informacao-contratos.component.scss'],
})
export class ListarCargaInformacaoContratosComponent extends ListarCargaPorTipoComponent implements OnInit {

  protected importType = ImportType['Informações de Contratos'];

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
            this.importacaoService.importContractsInfo(response, this.clientSelectedIdTenant).pipe(
              takeUntil(this.unsubscribe), finalize(() => { this.blockUI.stop(); this.getImportations(); })).subscribe(
                // tslint:disable-next-line: no-shadowed-variable
                () => {
                  this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                  this.clientSelectedIdTenant = null;
                },
                (error) => {
                  this.errorService.treatError(error);
                },
              );
          }
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.toastr.warning('Campo Empresa deve ser selecionado.');
    }
  }
}
