import { Component, Injector, OnInit } from '@angular/core';
import {
  Arquivo,
} from '@shared/models';
import { finalize, takeUntil } from 'rxjs/operators';
import { ImportType } from '../../../shared/models/enums/ImportType.enum';
import { ProdutoIAService } from '../../../shared/providers/produto-ia.service';
import { ListarCargaComponent } from '../base/listar-carga.component';
import { DownloadArquivosComponent } from './download-arquivos/download-arquivos.component';


@Component({
  selector: 'smk-listar-carga-produto-ia',
  templateUrl: './listar-carga-produto-ia.component.html',
  styleUrls: ['./listar-carga-produto-ia.component.scss']
})
export class ListarCargaProdutoIaComponent  extends ListarCargaComponent implements OnInit {

  protected importType = ImportType['ProdutosIA'];

  constructor(
    private injector: Injector,
    private produtoIAService: ProdutoIAService) {
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
            this.importacaoService
              .productIaImport(response)
              .subscribe(
                (response) => {
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


  downloadArquivos(event){
    if(event.indexColunaExtra != 0 && this.importations[event.indexItem].fileErrorsId == undefined){
      this.baixarArquivo(event);
    }
    else{
      if(event.indexColunaExtra == 0){
        const modalRef = this.modalService.open(DownloadArquivosComponent, {
          centered: true,
          size: 'sm',
        });

        modalRef.result.then((result) => {
          if (result == 'Importacao') {
            this.baixarArquivo(event)
          }
          if(result == 'Download'){
            this.downloadRetornoIA(event)
          }
        });
      }
      else{
        this.baixarArquivo(event)
      }
    }
  }

  downloadRetornoIA(event){
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.produtoIAService.downloadRetornoIA(this.importations[event.indexItem].importId).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe( response => {
           this.arquivoService.createDownloadElement(response,'Retorno Produto IA.xls');
        }
      );
    }
}
