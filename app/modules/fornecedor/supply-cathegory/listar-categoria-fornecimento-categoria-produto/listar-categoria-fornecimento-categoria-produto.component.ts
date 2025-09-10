import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import {
  CategoriaFornecimentoCategoriaProduto, CategoriaProduto, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, Situacao
} from '@shared/models';
import {
  AutenticacaoService,
  CategoriaFornecimentoService, CategoriaProdutoService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CategoriaFornecimentoFiltro } from '../../../../shared/models/fltros/categoria-fornecimento-filtro';

@Component({
  selector: 'listar-categoria-fornecimento-categoria-produto',
  templateUrl: './listar-categoria-fornecimento-categoria-produto.component.html',
  styleUrls: ['./listar-categoria-fornecimento-categoria-produto.component.scss'],
})
export class ListarCategoriaFornecimentoCategoriaProdutoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input('idCategoriaFornecimento') idCategoriaFornecimento: number;

  form: FormGroup;
  categoriasProdutoSelecionaveis = new Array<CategoriaProduto>();
  categoriasProduto = new Array<CategoriaProduto>();
  selecionadas = new Array<CategoriaFornecimentoCategoriaProduto>();
  Situacao = Situacao;

  categoriaFornecimentoCategoriasProduto = new Array<
    CategoriaFornecimentoCategoriaProduto
  >();

  settings: CustomTableSettings;
  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;

  categoriaFornecimentoFiltro: CategoriaFornecimentoFiltro = new CategoriaFornecimentoFiltro();

  constructor(
    private formBuilder: FormBuilder,
    private categoriaProdutoService: CategoriaProdutoService,
    private modalService: NgbModal,
    private autenticacaoService: AutenticacaoService,
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.obterCategoriasProduto();
    this.construirTabelas();
    this.obterCategoriaFornecimentoCategoriasProduto();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Nome', 'categoriaProduto.nome', CustomTableColumnType.text),
        new CustomTableColumn(
          'Situação',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          Situacao,
        ),
      ],
      'check',
    );
  }

  obterCategoriasProduto() {
    const idTenant = this.autenticacaoService.usuario().permissaoAtual.idTenant;
    this.categoriaProdutoService.listarAtivasPorTenant(idTenant).subscribe((response) => {
      this.categoriasProduto = response;
    });
  }

  obterCategoriaFornecimentoCategoriasProduto() {

    this.categoriaFornecimentoFiltro.itensPorPagina = this.itensPorPagina;
    this.categoriaFornecimentoFiltro.pagina = this.pagina;
    this.categoriaFornecimentoFiltro.itemOrdenar = 'cfcp.IdCategoriaFornecimentoCategoriaProduto';
    this.categoriaFornecimentoFiltro.ordenacao = Ordenacao.ASC;
    this.categoriaFornecimentoFiltro.idCategoriaFornecimento = this.idCategoriaFornecimento;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaFornecimentoService
      .filtrarCategoriaProduto(
        this.categoriaFornecimentoFiltro,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.categoriaFornecimentoCategoriasProduto = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.categoriaFornecimentoCategoriasProduto = new Array<
              CategoriaFornecimentoCategoriaProduto
            >();
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

  construirFormulario() {
    this.form = this.formBuilder.group({
      idCategoriaProduto: [null, Validators.required],
    });
  }

  termoJaInserido() {
    return this.categoriaFornecimentoCategoriasProduto.find(
      (f) => f.idCategoriaProduto === this.form.value.idCategoriaProduto,
    );
  }

  incluir() {
    if (this.termoJaInserido()) {
      this.toastr.warning('Categoria de produto já registrada');
      return;
    }

    const categoriaFornecimentoCategoriaProduto = new CategoriaFornecimentoCategoriaProduto(
      this.idCategoriaFornecimento,
      this.form.value.idCategoriaProduto,
      Situacao.Ativo,
    );

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaFornecimentoService
      .inserirCategoriaProduto(categoriaFornecimentoCategoriaProduto)
      .subscribe(
        (response) => {
          this.categoriasProdutoSelecionaveis = this.categoriasProdutoSelecionaveis.filter(
            (categoriaProduto) =>
              categoriaProduto.idCategoriaProduto !==
              categoriaFornecimentoCategoriaProduto.idCategoriaProduto,
          );
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterCategoriaFornecimentoCategoriasProduto();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  solicitarExclusao() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(),
        (reason) => { },
      );
  }

  alterarSituacao(situacao: Situacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaFornecimentoService
      .alterarSituacaoCategoriaProdutoBatch(this.selecionadas, situacao)
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.pagina = 1;
          this.obterCategoriaFornecimentoCategoriasProduto();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  selecao(categoriasProduto: Array<CategoriaFornecimentoCategoriaProduto>) {
    this.selecionadas = categoriasProduto;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterCategoriaFornecimentoCategoriasProduto();
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaFornecimentoService
      .deletarCategoriaProdutoBatch(this.idCategoriaFornecimento, this.selecionadas)
      .subscribe(
        (resultado) => {
          if (resultado) {
            this.selecionadas.forEach((s) =>
              this.categoriasProdutoSelecionaveis.push(s.categoriaProduto),
            );
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.pagina = 1;
          this.obterCategoriaFornecimentoCategoriasProduto();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
}
