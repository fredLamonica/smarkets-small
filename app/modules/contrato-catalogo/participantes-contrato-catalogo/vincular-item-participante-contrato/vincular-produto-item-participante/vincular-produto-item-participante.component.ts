import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaProduto, ContratoCatalogoParticipante, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, SituacaoContratoCatalogoItem } from '@shared/models';
import { CategoriaProdutoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ContratoCatalogoItemFiltro } from '../../../../../shared/models/fltros/contrato-catalogo-item-filtro';
import { ContratoCatalogoService } from '../../../../../shared/providers/contrato-catalogo.service';
import { ContratoCatalogoItem } from './../../../../../shared/models/contrato-catalogo/contrato-catalogo-item';
@Component({
  selector: 'smk-vincular-produto-item-participante',
  templateUrl: './vincular-produto-item-participante.component.html',
  styleUrls: ['./vincular-produto-item-participante.component.scss'],
})
export class VincularProdutoItemParticipanteComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input('id-contrato') idContrato: number;
  @Input('participante') participante: ContratoCatalogoParticipante;

  // #region Seleção modal
  form: FormGroup;
  settings: CustomTableSettings;
  categorias: Array<CategoriaProduto>;
  itens: Array<ContratoCatalogoItem>;

  modalRef: any;
  contratoCatalogoItemFiltro: ContratoCatalogoItemFiltro = new ContratoCatalogoItemFiltro();

  selecionado: Array<ContratoCatalogoItem>;
  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'idProduto';
  ordenacao: Ordenacao = Ordenacao.DESC;
  //#endregion

  constructor(
    private contratoService: ContratoCatalogoService,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private categoriaService: CategoriaProdutoService,
    public activeModal: NgbActiveModal,
  ) { }

  //#region FormControl Methods

  ngOnInit() {
    this.construirForm();
    this.construirTabela();
    this.obterItens();
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterItens();
  }

  // CALLBACK de ordenação
  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterItens();
  }

  selecao(itens: Array<ContratoCatalogoItem>) {
    this.selecionado = itens;
  }

  buscar() {
    this.pagina = 1;
    this.obterItens(this.form.value.descricao);
  }

  adicionar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoService
      .AdicioneItensParticipante(this.selecionado, this.participante.idContratoCatalogoParticipante)
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.activeModal.close(true);
          } else {
            this.itens = new Array<ContratoCatalogoItem>();
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

  cancelar() {
    this.activeModal.close();
  }

  private construirForm() {
    this.form = this.formBuilder.group({
      descricao: [''],
      codigo: [''],
      idCategoria: [0],
      idProduto: [''],
    });
  }

  private construirTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn(
          'ID',
          'idProduto',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'idProduto',
        ),
        new CustomTableColumn(
          'Código ERP',
          'produto.codigo',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'pt.codigo',
        ),
        new CustomTableColumn(
          'Produto',
          'produto.descricao',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'pt.descricao',
        ),
        new CustomTableColumn(
          'Un. Medida',
          'produto.unidadeMedida.descricao',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'um.descricao',
        ),
        new CustomTableColumn(
          'Categoria',
          'produto.categoria.nome',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'cp.nome',
        ),
        new CustomTableColumn(
          'Valor (R$)',
          'valor',
          CustomTableColumnType.text,
          'currency',
          'BRL:symbol:1.2:pt-BR',
          null,
          'valor',
        ),
        new CustomTableColumn(
          'Situação',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          SituacaoContratoCatalogoItem,
          'cci.situacao',
        ),
      ],
      'check',
      this.ordenarPor,
      this.ordenacao,
    );
  }

  private obterItens(termo: string = '') {

    this.contratoCatalogoItemFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoItemFiltro.itensPorPagina = this.registrosPorPagina;
    this.contratoCatalogoItemFiltro.pagina = this.pagina;
    this.contratoCatalogoItemFiltro.itemOrdenar = this.ordenarPor;
    this.contratoCatalogoItemFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoItemFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService
      .filtrarItensVinculoParticipante(this.contratoCatalogoItemFiltro, this.participante.idContratoCatalogoParticipante)
      .subscribe(
        (response) => {
          if (response) {
            this.itens = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.itens = new Array<ContratoCatalogoItem>();
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
  // #endregion
}
