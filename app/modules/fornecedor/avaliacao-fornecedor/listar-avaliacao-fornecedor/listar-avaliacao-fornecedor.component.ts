import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { AvaliacaoFornecedor, Ordenacao } from '@shared/models';
import { AvaliacaoFornecedorService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AvaliacaoFornecedorFiltro } from '../../../../shared/models/fltros/avaliacao-fornecedor-filtro';

@Component({
  selector: 'app-listar-avaliacao-fornecedor',
  templateUrl: './listar-avaliacao-fornecedor.component.html',
  styleUrls: ['./listar-avaliacao-fornecedor.component.scss'],
})
export class ListarAvaliacaoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  avaliacoes: Array<AvaliacaoFornecedor>;
  termo = '';
  registrosPorPagina: number = 16;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'idAvaliacaoFornecedor';
  ordenacao: Ordenacao = Ordenacao.ASC;
  avaliacaoFornecedorFiltro: AvaliacaoFornecedorFiltro = new AvaliacaoFornecedorFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private avaliacaoFornecedorService: AvaliacaoFornecedorService,
  ) { }

  ngOnInit() {
    this.resetPaginacao();
    this.obterAvaliacoes();
  }

  incluirAvaliacao() {
    this.router.navigate(['/fornecedores/avaliacoes/nova'], { relativeTo: this.route });
  }

  editarAvaliacao(idAvaliacaoFornecedor) {
    this.router.navigate(['/fornecedores/avaliacoes/', idAvaliacaoFornecedor], {
      relativeTo: this.route,
    });
  }

  visualizarAvaliacao(idAvaliacaoFornecedor) {
    this.router.navigate([`/fornecedores/avaliacoes/${idAvaliacaoFornecedor}/respostas`], {
      relativeTo: this.route,
    });
  }

  dispararAvaliacao(idAvaliacaoFornecedor) {
    this.router.navigate([`/fornecedores/avaliacoes/${idAvaliacaoFornecedor}/disparos`], {
      relativeTo: this.route,
    });
  }

  solicitarExclusao(avaliacaoFornecedor: AvaliacaoFornecedor) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.deletar(avaliacaoFornecedor.idAvaliacaoFornecedor),
        (reason) => { },
      );
  }

  deletar(id: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.avaliacaoFornecedorService.deletar(id).subscribe(
      (response) => {
        this.tratarDelecao(id);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  buscar(termo: string) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterAvaliacoes();
  }

  onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterAvaliacoes();
    }
  }

  resetPaginacao() {
    this.avaliacoes = new Array<AvaliacaoFornecedor>();
    this.pagina = 1;
  }

  private obterAvaliacoes() {

    this.avaliacaoFornecedorFiltro.itensPorPagina = this.registrosPorPagina;
    this.avaliacaoFornecedorFiltro.pagina = this.pagina;
    this.avaliacaoFornecedorFiltro.itemOrdenar = this.ordenarPor;
    this.avaliacaoFornecedorFiltro.ordenacao = this.ordenacao;
    this.avaliacaoFornecedorFiltro.termo = this.termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.avaliacaoFornecedorService
      .filtrar(this.avaliacaoFornecedorFiltro)
      .subscribe(
        (response) => {
          if (response) {
            this.MontaStringsCategorias(response.itens);
            this.avaliacoes = this.avaliacoes.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.avaliacoes = new Array<AvaliacaoFornecedor>();
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

  private MontaStringsCategorias(avaliacoes: Array<AvaliacaoFornecedor>) {
    avaliacoes.forEach((avaliacao) => {
      const array = avaliacao.categoriasFornecimento;
      let categorias: string = '';
      if (array.length > 0) {
        for (let index = 0; index < array.length - 1; index++) {
          categorias = categorias + array[index].descricao + ', ';
        }
        categorias = categorias + array[array.length - 1].descricao;
      }
      avaliacao.stringCategorias = categorias;
    });
  }

  private tratarDelecao(id: number) {
    this.avaliacoes = this.avaliacoes.filter((c) => c.idAvaliacaoFornecedor !== id);
  }
}
