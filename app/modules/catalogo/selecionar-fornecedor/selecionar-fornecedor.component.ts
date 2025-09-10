import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GrupoFornecedorDto } from '@shared/models';
import { CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-selecionar-fornecedor',
  templateUrl: './selecionar-fornecedor.component.html',
  styleUrls: ['./selecionar-fornecedor.component.scss'],
})
export class SelecionarFornecedorComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  termo: string;
  idCategorias: Array<Number>;
  idEstados: Array<Number>;
  idFornecedores: Array<Number>;
  idMarcas: Array<Number>;

  fornecedores: Array<GrupoFornecedorDto>;
  fornecedoresBusca: Array<GrupoFornecedorDto>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public catalogoService: CatalogoService,
  ) { }

  ngOnInit() {
    this.obterFornecedores();
  }

  obterFornecedores() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.catalogoService.obterFornecedores(this.termo, this.idEstados, this.idCategorias, this.idFornecedores, this.idMarcas).subscribe(
      (response) => {
        this.fornecedores = response;
        this.fornecedoresBusca = response;
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  buscar(termo) {
    this.fornecedoresBusca = this.fornecedores.filter((fornecedor) => fornecedor.razaoSocial.trim().toLowerCase().includes(termo.trim().toLowerCase()));
  }

  selecionar(fornecedor: GrupoFornecedorDto) {
    this.activeModal.close(fornecedor);
  }

  cancelar() {
    this.activeModal.close();
  }

}
