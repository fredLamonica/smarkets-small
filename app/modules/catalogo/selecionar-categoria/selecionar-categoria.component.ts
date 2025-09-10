import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GrupoCategoriaProdutoDto, TipoCatalogoItem } from '@shared/models';
import { CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-selecionar-categoria',
  templateUrl: './selecionar-categoria.component.html',
  styleUrls: ['./selecionar-categoria.component.scss'],
})
export class SelecionarCategoriaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  termo: string;
  idCategoria: Array<Number>;
  idEstado: Array<Number>;
  idFornecedor: Array<Number>;
  idMarca: Array<Number>;
  tipoCatalogoItem: TipoCatalogoItem;

  categorias: Array<GrupoCategoriaProdutoDto>;
  categoriasBusca: Array<GrupoCategoriaProdutoDto>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public catalogoService: CatalogoService,
  ) { }

  ngOnInit() {
    this.obterCategorias();
  }

  obterCategorias() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.catalogoService
      .obterCategorias(
        this.termo,
        this.idEstado,
        this.idCategoria,
        this.idFornecedor,
        this.idMarca,
        null,
        this.tipoCatalogoItem,
      )
      .subscribe(
        (response) => {
          this.categorias = response;
          this.categoriasBusca = response;
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  buscar(termo) {
    this.categoriasBusca = this.categorias.filter((categoria) =>
      categoria.nome.trim().toLowerCase().includes(termo.trim().toLowerCase()),
    );
  }

  selecionar(categoria: GrupoCategoriaProdutoDto) {
    this.activeModal.close(categoria);
  }

  cancelar() {
    this.activeModal.close();
  }
}
