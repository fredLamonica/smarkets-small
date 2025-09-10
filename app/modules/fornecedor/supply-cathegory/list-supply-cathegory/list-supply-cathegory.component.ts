import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { CategoriaFornecimento, Ordenacao } from '@shared/models';
import { CategoriaFornecimentoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CategoriaFornecimentoFiltro } from '../../../../shared/models/fltros/categoria-fornecimento-filtro';

@Component({
  selector: 'list-supply-cathegory',
  templateUrl: './list-supply-cathegory.component.html',
  styleUrls: ['./list-supply-cathegory.component.scss'],
})
export class ListSupplyCathegoryComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  categoriasFornecimento = new Array<CategoriaFornecimento>();
  termo = '';
  registrosPorPagina: number = 16;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'idCategoriaFornecimento';
  ordenacao: Ordenacao = Ordenacao.ASC;
  categoriaFornecimentoFiltro: CategoriaFornecimentoFiltro = new CategoriaFornecimentoFiltro();

  constructor(
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private router: Router,
    private route: ActivatedRoute,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.obterCategoriasFornecimento();
  }

  CadastrarCategoria() {
    this.router.navigate(['./nova'], { relativeTo: this.route });
  }

  buscar(termo: string) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterCategoriasFornecimento();
  }

  onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterCategoriasFornecimento();
    }
  }

  resetPaginacao() {
    this.categoriasFornecimento = new Array<CategoriaFornecimento>();
    this.pagina = 1;
  }

  solicitarExclusao(categoriaFornecimento: CategoriaFornecimento) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.deletar(categoriaFornecimento.idCategoriaFornecimento),
        (reason) => { },
      );
  }

  deletar(id: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaFornecimentoService.deletar(id).subscribe(
      (response) => {
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.resetPaginacao();
        this.obterCategoriasFornecimento();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  limparFiltro() {
    this.buscar('');
  }

  editar(categoria) {
    this.router.navigate(['./', categoria.idCategoriaFornecimento], { relativeTo: this.route });
  }

  private obterCategoriasFornecimento() {

    this.categoriaFornecimentoFiltro.itensPorPagina = this.registrosPorPagina;
    this.categoriaFornecimentoFiltro.pagina = this.pagina;
    this.categoriaFornecimentoFiltro.itemOrdenar = this.ordenarPor;
    this.categoriaFornecimentoFiltro.ordenacao = this.ordenacao;
    this.categoriaFornecimentoFiltro.termo = this.termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaFornecimentoService
      .filtrar(this.categoriaFornecimentoFiltro)
      .subscribe(
        (response) => {
          if (response) {
            this.categoriasFornecimento = this.categoriasFornecimento.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.categoriasFornecimento = new Array<CategoriaFornecimento>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
}
