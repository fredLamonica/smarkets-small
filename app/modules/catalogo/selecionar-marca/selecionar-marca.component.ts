import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GrupoMarcaDto } from '@shared/models';
import { CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-selecionar-marca',
  templateUrl: './selecionar-marca.component.html',
  styleUrls: ['./selecionar-marca.component.scss'],
})
export class SelecionarMarcaComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  termo: string;
  idCategorias: Array<Number>;
  idFornecedores: Array<Number>;
  idMarcas: Array<Number>;
  idEstados: Array<Number>;

  marcas: Array<GrupoMarcaDto>;
  marcasBusca: Array<GrupoMarcaDto>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public catalogoService: CatalogoService,
  ) { }

  ngOnInit() {
    this.obterMarcas();
  }

  obterMarcas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.catalogoService.obterMarcas(this.termo, this.idEstados, this.idCategorias, this.idFornecedores, this.idMarcas).subscribe(
      (response) => {
        this.marcas = response;
        this.marcasBusca = response;
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  buscar(termo) {
    this.marcasBusca = this.marcas.filter((marca) => marca.nome.trim().toLowerCase().includes(termo.trim().toLowerCase()));
  }

  selecionar(marca: GrupoMarcaDto) {
    this.activeModal.close(marca);
  }

  cancelar() {
    this.activeModal.close();
  }
}
