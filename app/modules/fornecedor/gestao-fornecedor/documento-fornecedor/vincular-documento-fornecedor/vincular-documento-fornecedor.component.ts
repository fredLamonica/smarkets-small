import { debounce } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { DocumentoFornecedorDto } from '@shared/models/dto/documento-fornecedor-dto';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import {
  AutenticacaoService,
  DocumentoFornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs/internal/observable/of';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'vincular-documento-fornecedor',
  templateUrl: './vincular-documento-fornecedor.component.html',
  styleUrls: ['./vincular-documento-fornecedor.component.scss']
})
export class VincularDocumentoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public documentos: Array<DocumentoFornecedorDto>;
  public documentosLoading: boolean;
  public documentosSelecionados: Array<number>;

  get hasDocumentos(): boolean {
    return this.documentos && this.documentos.length && !this.documentosLoading;
  }

  constructor(
    private documentoFornecedorService: DocumentoFornecedorService,
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.obterDocumentosParaVinculo();
  }

  private obterDocumentosParaVinculo() {
    this.documentosLoading = true;
    this.documentoFornecedorService.obterDocumentosParaVinculo().subscribe(
      response => {
        if (response) {
          this.documentos = response;
        }
        this.documentosLoading = false;
      },
      responseError => {
        this.documentosLoading = false;
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  public customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.descricaoDocumento.toLocaleLowerCase().indexOf(term) > -1;
  }

  public vincular() {
    if (this.documentosSelecionados) {
      this.blockUI.start();
      this.documentoFornecedorService
        .inserirDocumentoVinculo(this.documentosSelecionados)
        .subscribe(
          response => {
            if (response) {
              this.blockUI.stop();
              this.activeModal.close(response);
            }
          },
          responseError => {
            this.blockUI.stop();
            if (responseError.status == 400) {
              this.toastr.warning(responseError.error);
            } else {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            }
          }
        );
    }
  }
}
