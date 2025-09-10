import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, Produto, SituacaoProduto } from '@shared/models';
import { CategoriaProdutoService, ProdutoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ProdutoSellerFiltro } from '../../../shared/models/fltros/produto-seller-filtro';
import { GereProdutoComponent } from './gere-produto/gere-produto.component';

@Component({
  selector: 'smk-liste-produtos',
  templateUrl: './liste-produtos.component.html',
  styleUrls: ['./liste-produtos.component.scss']
})
export class ListeProdutosComponent extends Unsubscriber  implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  idCategoriaProduto: number;
  idTenant: number;
  settings: CustomTableSettings;
  itens: Array<Produto>;
  itensSelecionados: Array<Produto>;
  filtro: ProdutoSellerFiltro = new ProdutoSellerFiltro();


  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenarPor: string = 'idProduto';
  ordenacao: Ordenacao = Ordenacao.DESC;
  form: FormGroup;
  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private router: Router,
    private modalService: NgbModal,
    private categoriaService: CategoriaProdutoService
  ) {
    super();
  }


  ngOnInit() {
    this.construirTabelas();
    this.construirFormulario();
    this.obterParametros()
  }

  buscar() {
    this.pagina = 1;
    this.obterProduto();
  }

  campoBuscaChanged() {
    const termo: string = this.form.value.termo;
    if (termo == null || termo.length === 0) {
      this.buscar();
    }
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn(
          'ID',
          'idProduto',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'IdProduto',
        ),
        new CustomTableColumn(
          'Produto',
          'descricao',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'Descricao',
        ),
        new CustomTableColumn(
          'Un. Medida',
          'unidadeMedida.descricao',
          CustomTableColumnType.text,
          null,
          null,
          null,
          null,
        ),
        new CustomTableColumn(
          'Situação',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          SituacaoProduto,
          'Situacao',
        )
      ],
      'check',
      this.ordenarPor,
      this.ordenacao,
    );
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idCategoriaProduto = params['idCategoriaProduto'];
        this.idTenant = params['idTenant'];

        if (this.idCategoriaProduto) {
          this.obterProduto();
          this.obterCategoria();
        } else {
          this.form.controls.situacao.disable();
          this.blockUI.stop();
        }
    });
  }

  voltar() {
    this.router.navigate(['./../../'], { relativeTo: this.route });
  }

  visualizar(){
    const modalRef = this.modalService.open(GereProdutoComponent, { centered: true, size: 'lg' })

    modalRef.componentInstance.idProduto = this.itensSelecionados[0].idProduto;
    modalRef.result.then((result) => {
      if (result) {
        this.pagina = 1;
        this.obterProduto();
      }
    });
  }


  // CALLBACK de ordenação
  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterProduto();
  }

  selecao(itens: Array<Produto>) {
    this.itensSelecionados = itens;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterProduto();
  }
  private construirFormulario() {
    this.form = this.fb.group({
      termo: [''],
      idCategoriaProduto: [null],
      nomeCategoria: [null],
      empresa: [null],
    });
  }

  private obterProduto() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.filtro.itemOrdenar = this.ordenarPor;
    this.filtro.itensPorPagina = this.itensPorPagina;
    this.filtro.ordenacao = this.ordenacao;
    this.filtro.pagina = this.pagina;
    this.filtro.termo = this.form.controls.termo.value;

    this.produtoService
      .obtenhaProdutosSeller(this.idCategoriaProduto, this.idTenant, this.filtro)
      .subscribe(
        (response) => {
          if (response) {
            this.itens = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.itens = new Array<Produto>();
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

  private obterCategoria() {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.categoriaService
        .obtenhaCategoriaSeller(this.idCategoriaProduto, this.idTenant)
        .subscribe(
          (response) => {
            if (response) {
              this.form.patchValue({
                idCategoriaProduto: response.idCategoriaProduto,
                nomeCategoria: response.descricaoCategoria,
                empresa: response.razaoSocial,
              })
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
