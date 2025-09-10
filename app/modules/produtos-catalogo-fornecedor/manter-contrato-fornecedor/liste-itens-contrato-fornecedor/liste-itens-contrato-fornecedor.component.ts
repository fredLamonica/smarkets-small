import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratoCatalogoItem, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, SituacaoContratoCatalogoItem } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { IconeCustomTable } from '../../../../shared/models/coluna-custom-table/coluna-com-icone';
import { ContratoCatalogoItemFiltro } from '../../../../shared/models/fltros/contrato-catalogo-item-filtro';
import { EnumToArrayPipe } from '../../../../shared/pipes';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { EditeProdutosCatalogoComponent } from '../../edite-produtos-catalogo/edite-produtos-catalogo.component';
import { ManterPrazoEntregaItemComponent } from './manter-prazo-entrega-item/manter-prazo-entrega-item.component';

@Component({
  selector: 'smk-liste-itens-contrato-fornecedor',
  templateUrl: './liste-itens-contrato-fornecedor.component.html',
  styleUrls: ['./liste-itens-contrato-fornecedor.component.scss'],
})
export class ListeItensContratoFornecedorComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input('id-contrato') idContrato: number;
  @Input('id-fornecedor') idFornecedor: number;


  Situacao = SituacaoContratoCatalogoItem;
  @Output() possuiEdicao: EventEmitter<boolean> = new EventEmitter<boolean>();

  buscaAvancada: boolean = false;
  settings: CustomTableSettings;
  itens: Array<ContratoCatalogoItem>;
  itensSelecionados: Array<ContratoCatalogoItem>;
  public colunasComIcone = new Array<IconeCustomTable>();

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenarPor: string = 'IdContratoCatalogoItem';
  ordenacao: Ordenacao = Ordenacao.DESC;
  form: FormGroup;
  opcoesSituacaoProduto: Array<{ index: number, name: string }>;

  contratoCatalogoItemFiltro: ContratoCatalogoItemFiltro = new ContratoCatalogoItemFiltro();
  situacaoItem = SituacaoContratoCatalogoItem;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.construirTabelas();
    this.obterColunaIcone();
    this.obterItens();
    this.populeSituacoes();
    this.construirFormulario();
  }

  buscar(termo: string = null) {
    let termoPesquisa = termo != null? termo : this.form.value.termo;
    this.pagina = 1;
    this.obterItens(termoPesquisa);
  }

  campoBuscaChanged() {
    const termo: string = this.form.value.termo;
    if (termo == null || termo.length === 0) {
      this.buscar();
    }
  }

  exibirBuscaAvancada(event) {
    event ? this.buscaAvancada = true : this.buscaAvancada = false;
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
          'Marca',
          'marca.nome',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'm.nome',
        ),
        new CustomTableColumn(
          'Lote Mín.',
          'loteMinimo',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'loteMinimo',
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
        )
      ],
      'check',
      this.ordenarPor,
      this.ordenacao,
    );
  }

  private populeSituacoes(): void {
    let situacoes = new EnumToArrayPipe().transform(SituacaoContratoCatalogoItem) as Array<any>;
    let filtroProduto: (contratoSituacao: { index: number, name: string }) => boolean;

    filtroProduto = (produtoSituacao: { index: number, name: string }) => {
      return produtoSituacao.index != SituacaoContratoCatalogoItem.Aprovado &&
              produtoSituacao.index != SituacaoContratoCatalogoItem['Aguardando Exclusão'] &&
              produtoSituacao.index != SituacaoContratoCatalogoItem['Aguardando Inclusão'] &&
              produtoSituacao.index != SituacaoContratoCatalogoItem.Recusado
    };

    situacoes = situacoes.filter((situacao) => filtroProduto(situacao));

    if (situacoes) {
      this.opcoesSituacaoProduto = situacoes.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
    }
  }

  filtroAvancado(){
    this.contratoCatalogoItemFiltro.filtroAvancado = true;
    this.contratoCatalogoItemFiltro.codigo = this.form.controls.codigo.value;
    this.contratoCatalogoItemFiltro.situacao = this.form.controls.situacao.value;
    this.contratoCatalogoItemFiltro.marca = this.form.controls.marca.value;

    this.obterItens(this.form.value.termo);
  }

  // CALLBACK de ordenação
  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterItens(this.form.value.termo);
  }

  selecao(itens: Array<ContratoCatalogoItem>) {
    this.itensSelecionados = itens;
  }

  situacoesSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterItens(this.form.value.termo);
  }

  edite() {
    const modalRef = this.modalService.open(EditeProdutosCatalogoComponent, { centered: true, size: 'lg' })
    modalRef.componentInstance.idContratoCatalogoItem = this.itensSelecionados[0].idContratoCatalogoItem;

    modalRef.result.then(result => {
      if (result) {
        this.obterItens();
      }
    });
  }

  prazoEntrega() {
    const modalRef = this.modalService.open(ManterPrazoEntregaItemComponent, { centered: true, size: 'lg' })

    modalRef.componentInstance.idContrato = this.itensSelecionados[0].idContratoCatalogo;
    modalRef.componentInstance.idContratoItem = this.itensSelecionados[0].idContratoCatalogoItem;

    modalRef.result.then(result => {
      if (result) {
        this.obterItens();
      }
    });
  }


  private obterColunaIcone() {
    let colunaIcone = new IconeCustomTable();
    colunaIcone.title = 'Justificativa';
    colunaIcone.icone = 'fas fa-comment-dots'
    colunaIcone.textoTooltip = 'justificativaReprovacao'
    colunaIcone.tooltipClass = 'tooltip-light'

    this.colunasComIcone.push(colunaIcone);
  }

  private construirFormulario() {
    this.form = this.fb.group({
      termo: [''],
      situacao: [null],
      codigo: [null],
      marca: [null],
    });
  }

  private obterItens(termo: string = '') {

    this.contratoCatalogoItemFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoItemFiltro.itensPorPagina = this.itensPorPagina;
    this.contratoCatalogoItemFiltro.pagina = this.pagina;
    this.contratoCatalogoItemFiltro.itemOrdenar = this.ordenarPor;
    this.contratoCatalogoItemFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoItemFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService
      .filtrarItensContrato(this.contratoCatalogoItemFiltro)
      .subscribe(
        (response) => {
          if (response) {
            this.altereSituacao(response.itens);
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

  altereSituacao(itens: ContratoCatalogoItem[]){
    itens.forEach(x => {
        if(x.aprovacaoContratoCatalogoItem != null && x.aprovacaoContratoCatalogoItem.confirmado == false){
          x.situacao = SituacaoContratoCatalogoItem['Em edição'];
          this.possuiEdicao.emit(true);
        }
    })

    this.itens = itens;
  }
}
