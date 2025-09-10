import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { ContratoCatalogoItem, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, SituacaoContratoCatalogoItem } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { RecusaAprovacaoContratoFornecedorComponent } from '../../../../shared/components/modals/recusa-aprovacao-contrato-fornecedor/recusa-aprovacao-contrato-fornecedor.component';
import { IconeCustomTable } from '../../../../shared/models/coluna-custom-table/coluna-com-icone';
import { AnaliseAprovacaoCatalogo } from '../../../../shared/models/enums/analise-aprovacao-catalogo';
import { ContratoCatalogoItemFiltro } from '../../../../shared/models/fltros/contrato-catalogo-item-filtro';
import { EnumToArrayPipe } from '../../../../shared/pipes';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { ReajusteItemContratoComponent } from '../reajuste-item-contrato/reajuste-item-contrato.component';
import { ManterItemContratoComponent } from './../manter-item-contrato/manter-item-contrato.component';

@Component({
  selector: 'listar-itens-contrato',
  templateUrl: './listar-itens-contrato.component.html',
  styleUrls: ['./listar-itens-contrato.component.scss'],
})
export class ListarItensContratoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-contrato') idContrato: number;
  @Input('id-fornecedor') idFornecedor: number;

  @Output() atualizacao = new EventEmitter<any>();

  buscaAvancada: boolean = false;
  Situacao = SituacaoContratoCatalogoItem;

  settings: CustomTableSettings;
  itens: Array<ContratoCatalogoItem>;
  itensSelecionados: Array<ContratoCatalogoItem>;
  public colunasComIcone = new Array<IconeCustomTable>();
  @Output() possuiAprovacao: EventEmitter<boolean> = new EventEmitter();
  analiseAprovacao = AnaliseAprovacaoCatalogo;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenarPor: string = 'IdContratoCatalogoItem';
  ordenacao: Ordenacao = Ordenacao.DESC;
  form: FormGroup;

  contratoCatalogoItemFiltro: ContratoCatalogoItemFiltro = new ContratoCatalogoItemFiltro();
  situacaoItem = SituacaoContratoCatalogoItem;
  opcoesSituacaoProduto: Array<{ index: number, name: string }>;


  constructor(
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private errorService: ErrorService,
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
    this.contratoCatalogoItemFiltro.filtroAvancado = false;
    this.obterItens(termoPesquisa);
  }

  exibirBuscaAvancada(event) {
    event ? this.buscaAvancada = true : this.buscaAvancada = false;
  }

  filtroAvancado(){
    this.contratoCatalogoItemFiltro.filtroAvancado = true;
    this.contratoCatalogoItemFiltro.codigo = this.form.controls.codigo.value;
    this.contratoCatalogoItemFiltro.situacao = this.form.controls.situacao.value;
    this.contratoCatalogoItemFiltro.marca = this.form.controls.marca.value;

    this.obterItens(this.form.value.termo);
  }

  campoBuscaChanged() {
    const termo: string = this.form.value.termo;
    if (termo == null || termo.length === 0) {
      this.buscar();
    }
  }

   private populeSituacoes(): void {
    let situacoes = new EnumToArrayPipe().transform(SituacaoContratoCatalogoItem) as Array<any>;
    let filtroProduto: (contratoSituacao: { index: number, name: string }) => boolean;

    filtroProduto = (produtoSituacao: { index: number, name: string }) => {
      return produtoSituacao.index != SituacaoContratoCatalogoItem['Em edição'] &&
              produtoSituacao.index != SituacaoContratoCatalogoItem['Aguardando Exclusão'] &&
              produtoSituacao.index != SituacaoContratoCatalogoItem['Aguardando Inclusão']
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

  situacoesSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
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

  private obterColunaIcone() {
    let colunaIcone = new IconeCustomTable();
    colunaIcone.title = 'Justificativa';
    colunaIcone.icone = 'fas fa-comment-dots'
    colunaIcone.textoTooltip = 'justificativaReprovacao'
    colunaIcone.tooltipClass = 'tooltip-light'

    this.colunasComIcone.push(colunaIcone);
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

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterItens(this.form.value.termo);
  }

  // #region Deleção
  solicitarExclusao() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(),
        (reason) => { },
      );
  }
  // #endregion

  // #region Alterar situacao
  alterarSituacao(situacao: SituacaoContratoCatalogoItem) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService
      .alterarSituacaoItemContratoBatch(this.idContrato, this.itensSelecionados, situacao)
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterItens();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }
  // #endregion

  //#region  Modal Manter Item
  incluirItem() {
    const modalRef = this.modalService.open(ManterItemContratoComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.idContrato = this.idContrato;
    modalRef.componentInstance.idFornecedor = this.idFornecedor;
    modalRef.result.then((result) => {
      if (result) {
        this.atualizacao.emit({ length: 1 });
        this.pagina = 1;
        this.obterItens();
      }
    });
  }

  editarItem() {
    const modalRef = this.modalService.open(ManterItemContratoComponent, {
      centered: true,
      size: 'lg',
    });
    if (this.itensSelecionados && this.itensSelecionados.length) {
      modalRef.componentInstance.idItem = this.itensSelecionados[0].idContratoCatalogoItem;
    }
    modalRef.componentInstance.idContrato = this.idContrato;
    modalRef.componentInstance.idFornecedor = this.idFornecedor;
    modalRef.result.then((result) => {
      if (result) {
        this.atualizacao.emit({ length: 1 });
        this.obterItens();
      }
    });
  }

  reajusteItem() {
    const modalRef = this.modalService.open(ReajusteItemContratoComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.idContratoCatalogoItem = this.itensSelecionados[0].idContratoCatalogoItem;

    modalRef.result.then((result) => {
      if (result) {
        this.atualizacao.emit({ length: 1 });
        this.obterItens();
      }
    });
  }

  possuiItensEmAprovacao(){
    let itensEmAprovacao = this.itens.filter(x => (x.situacao == SituacaoContratoCatalogoItem['Aguardando Aprovação']));

    this.itens.forEach(x => {
      if(x.aprovacaoContratoCatalogoItem && x.aprovacaoContratoCatalogoItem.aprovado == AnaliseAprovacaoCatalogo.aprovado){
        x.situacao = SituacaoContratoCatalogoItem.Aprovado
      }

      if(x.aprovacaoContratoCatalogoItem && x.aprovacaoContratoCatalogoItem.aprovado == AnaliseAprovacaoCatalogo.reprovado){
        x.situacao = SituacaoContratoCatalogoItem.Recusado
      }
    })

    if(itensEmAprovacao.length == 0){
      this.possuiAprovacao.emit(false)
    }
  }

  private construirFormulario() {
    this.form = this.fb.group({
      termo: [''],
      situacao: [null],
      codigo: [null],
      marca: [null],
    });
  }

  get desabiliteBotaoQuandoAprovacao(){
    return this.itensSelecionados
           && this.itensSelecionados.length > 0
           && this.itensSelecionados.filter(x =>
            [SituacaoContratoCatalogoItem['Aguardando Aprovação'], SituacaoContratoCatalogoItem.Aprovado, SituacaoContratoCatalogoItem.Recusado]
            .includes(x.situacao)).length == 0 ? true : false;
  }

  get exibeBotaoAprovacao(){
    return this.itens && this.itens.filter(x => x.situacao == SituacaoContratoCatalogoItem['Aguardando Aprovação']).length ? false : true;
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
            this.itens = response.itens;
            this.totalPaginas = response.numeroPaginas;
            this.possuiItensEmAprovacao();
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

  analiseItens(aprovacao: AnaliseAprovacaoCatalogo){
    let itens = this.itens.filter(x => x.situacao == SituacaoContratoCatalogoItem['Aguardando Aprovação']);

    if(aprovacao == AnaliseAprovacaoCatalogo.aprovado)
      this.analiseAprovacaoItens(aprovacao, itens)
    else
      this.recuseAprovacaoItem(itens)
  }

  recuseAprovacaoItem(itens: ContratoCatalogoItem[]) {
    const modalMotivoRecusa = this.modalService.open(RecusaAprovacaoContratoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalMotivoRecusa.result.then(
      (result) => {
        if (result) {
          itens.forEach(x => {
            x.aprovacaoContratoCatalogoItem.justificativa =  result.value
          });

          this.analiseAprovacaoItens(AnaliseAprovacaoCatalogo.reprovado, itens)
        }
      },
      (error) => {
        this.errorService.treatError(error);
      }
    );
  }


  analiseAprovacaoItens(aprovacao: AnaliseAprovacaoCatalogo, itens: ContratoCatalogoItem[]){
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoService.analiseAprovacaoItens(aprovacao, itens)
      .subscribe(
        (resultado) => {
          this.obterItens();
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService
      .deletarItensContratoBatch(this.idContrato, this.itensSelecionados)
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.atualizacao.emit({ length: this.itensSelecionados.length * -1 });
          this.pagina = 1;
          this.obterItens();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }
  //#endregion
}
