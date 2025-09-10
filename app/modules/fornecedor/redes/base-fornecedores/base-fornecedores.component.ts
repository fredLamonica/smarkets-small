import { BaseFornecedores } from './../../../../shared/models/enums/base-fornecedores';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paginacao, StatusFornecedor, StatusFornecedorLabel, Usuario } from '@shared/models';
import { SupplierBaseDto } from '@shared/models/dto/supplier-base-dto';
import { SupplierBaseFilter } from '@shared/models/fltros/supplier-base-filter';
import {
  AutenticacaoService,
  FornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { values } from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'base-fornecedores',
  templateUrl: './base-fornecedores.component.html',
  styleUrls: ['./base-fornecedores.component.scss']
})
export class BaseFornecedoresComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  private _mainChecked: boolean = false;
  private currentUser: Usuario;

  public itens: SupplierBaseDto[] = [];
  public supplierFilter: SupplierBaseFilter;
  public selectionEnabled: boolean = false;

  get mainChecked(): boolean {
    return this._mainChecked;
  }
  set mainChecked(value: boolean) {
    this.selectedSuppliers(value);
    this._mainChecked = value;
  }

  public statusOptions = Array.from(StatusFornecedorLabel.values()).map(p => {
    return { label: p };
  });

  constructor(
    private translationLibrary: TranslationLibraryService,
    private fornecedorService: FornecedorService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.usuario();
    this.buildFilter();
    this.getSuppliers();
  }

  public selectedSuppliers(action: boolean) {
    this.itens.forEach(value => (value.selected = action));
  }

  public selectedActiveSuppliers() {
    for (const supplier of this.itens.filter(p => p.status == StatusFornecedor.Ativo)) {
      supplier.selected = true;
    }

    this._mainChecked = true;
  }

  public selectionEnabledClicked() {
    if (this.selectionEnabled) {
      this.selectedSuppliers(false);
      this.mainChecked = false;
    }

    this.selectionEnabled = !this.selectionEnabled;
  }

  private buildFilter(): void {
    this.supplierFilter = new SupplierBaseFilter();
    this.supplierFilter.pagina = 1;
    this.supplierFilter.itensPorPagina = 5;
    this.supplierFilter.totalPaginas = 0;
  }

  public getSuppliers() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .getSupplierBase(this.supplierFilter, this.getBaseSupplierType())
      .subscribe(
        response => {
          if (response) {
            this.itens = response.itens;
            this.supplierFilter.totalPaginas = response.numeroPaginas;
          } else {
            this.supplierFilter.pagina = 1;
            this.supplierFilter.totalPaginas = 0;
          }

          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public cloneSuppliers(): void {
    if (this.hasSelectedSupplier()) {
      let getSelectedIds = this.getSelectedSuppliers().map(p => p.idPessoaJuridicaFornecedor);

      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.fornecedorService.CloneToLocal(getSelectedIds).subscribe(
        response => {
          this.getSuppliers();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  public allSelectedSupplier(): boolean {
    return this.itens.every(p => p.selected);
  }

  public getSelectedSuppliers(): SupplierBaseDto[] {
    return this.itens.filter(p => p.selected);
  }

  public hasSelectedSupplier(): boolean {
    return this.itens.some(p => p.selected);
  }

  public page(event) {
    this.supplierFilter.pagina = event.page;
    this.supplierFilter.itensPorPagina = event.recordsPerPage;

    this.getSuppliers();
  }

  public getSubTitle(): string {
    return this.getBaseSupplierType() == BaseFornecedores.Holding
      ? 'Fornecedores Holding'
      : 'Fornecedores Smarkets';
  }

  private getBaseSupplierType(): BaseFornecedores {
    let activeRoute = this.router.routerState.snapshot.url;
    return activeRoute.includes('holding') ? BaseFornecedores.Holding : BaseFornecedores.Smarkets;
  }

  public isHoldingBase(): boolean {
    let isHoldingListing = this.getBaseSupplierType() == BaseFornecedores.Holding;
    let currentUserIsFilial =
      this.currentUser.permissaoAtual.pessoaJuridica.idPessoaJuridicaMatriz != null;

    return isHoldingListing && currentUserIsFilial;
  }

  public checkedBaseItem() {
    this._mainChecked = this.allSelectedSupplier();
  }
}
