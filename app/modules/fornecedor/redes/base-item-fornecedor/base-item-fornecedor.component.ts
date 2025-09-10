import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StatusFornecedor, StatusFornecedorLabel } from '@shared/models';
import { SupplierBaseDto } from '@shared/models/dto/supplier-base-dto';
import {
  ArquivoService,
  SolicitacaoDocumentoFornecedorArquivoService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'base-item-fornecedor',
  templateUrl: './base-item-fornecedor.component.html',
  styleUrls: ['./base-item-fornecedor.component.scss']
})
export class BaseItemFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() supplier: SupplierBaseDto;
  @Input() selectionEnabled: boolean;
  @Input() isHoldingBase: boolean;

  @Output() checkedItemChanged = new EventEmitter<SupplierBaseDto>();

  public disabled: boolean = false;
  public statusFornecedorLabel = StatusFornecedorLabel;
  public statusFornecedor = StatusFornecedor;

  constructor(
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private translationLibrary: TranslationLibraryService,
    private arquivoService: ArquivoService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {}

  public cardClicked() {
    if (this.selectionEnabled) {
      this.checkedChanged();
    } else {
      let routerString = `${this.supplier.idPessoaJuridicaFornecedor}/dados-gerais/${this.supplier.idTenant}`;
      this.navigateFor(routerString);
    }
  }

  public navigateFor(page: string) {
    this.router.navigate([`${this.router.url}/${page}`]);
  }

  public downloadFile() {
    this.disabled = true;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoDocumentoFornecedorArquivoService
      .baixarZipDocumentos(this.supplier.idPessoaJuridicaFornecedor)
      .subscribe(
        response => {
          this.arquivoService.createDownloadElement(
            response,
            'Documentos_' +
              this.supplier.razaoSocial
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '_') +
              '.zip'
          );
          this.blockUI.stop();
          this.disabled = false;
        },
        error => {
          this.toastr.warning(error.error);
          this.blockUI.stop();
        }
      );
  }

  public checkedChanged() {
    this.supplier.selected = !this.supplier.selected;
    this.checkedItemChanged.emit(this.supplier);
  }
}
