import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  CatalogoItem,
  Requisicao,
  UnidadeMedidaTempo,
  TipoEndereco,
  CentroCusto,
  Endereco,
  CondicaoPagamento,
  SlaItem,
  TipoRequisicao,
  Marca,
  SituacaoRequisicao,
  RequisicaoItem,
  Usuario,
  Moeda,
  SituacaoRequisicaoItem,
  ItemSolicitacaoCompra,
  PessoaJuridica
} from '@shared/models';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import {
  AutenticacaoService,
  TranslationLibraryService,
  CentroCustoService,
  CondicaoPagamentoService,
  EnderecoService,
  MarcaService,
  MatrizResponsabilidadeService,
  TipoRequisicaoService,
  SolicitacaoCompraService,
  PessoaJuridicaService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import * as moment from 'moment';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent, CatalogoItemGradeComponent } from '@shared/components';
import { SubItemSolicitacaoCompraComponent } from '../../sub-item-solicitacao-compra/sub-item-solicitacao-compra.component';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-confirmar-vinculo-requisicao-item',
  templateUrl: './confirmar-vinculo-requisicao-item.component.html',
  styleUrls: ['./confirmar-vinculo-requisicao-item.component.scss']
})
export class ConfirmarVinculoRequisicaoItemComponent implements OnInit {
  @ViewChild(CatalogoItemGradeComponent) catalogoItemGrade: CatalogoItemGradeComponent;
  @BlockUI() blockUI: NgBlockUI;
  @Output('atualizar-situacao-item') atualizarSituacaoItemEmitter = new EventEmitter();

  public tipoDocumento: string;

  public idRequisicao: number;
  public idItemSolicitacaoCompra: number;

  public item: CatalogoItem;
  public itemSolicitacaoCompra: ItemSolicitacaoCompra;
  public requisicao: Requisicao;
  public UnidadeMedidaTempo = UnidadeMedidaTempo;
  public TipoEndereco = TipoEndereco;
  public tipoRequisicao?: TipoRequisicao;
  public usuario: Usuario;
  public quantidade: number;
  public filiais: Array<PessoaJuridica>;

  public maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 12
  });

  constructor(
    private authService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private centroCustoService: CentroCustoService,
    private marcaService: MarcaService,
    private enderecoService: EnderecoService,
    private toastr: ToastrService,
    private matrizService: MatrizResponsabilidadeService,
    private tipoRequisicaoService: TipoRequisicaoService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private pessoaJuridicaService: PessoaJuridicaService
  ) {}

  public min(requisicaoItem: RequisicaoItem): number {
    if (
      requisicaoItem &&
      requisicaoItem.produto &&
      requisicaoItem.produto.unidadeMedida &&
      requisicaoItem.produto.unidadeMedida.permiteQuantidadeFracionada
    ) {
      return 1;
    } else {
      return 0.0001;
    }
  }

  public max(requisicaoItem: RequisicaoItem): number {
    if (
      requisicaoItem &&
      requisicaoItem.produto &&
      requisicaoItem.produto.unidadeMedida &&
      requisicaoItem.produto.unidadeMedida.permiteQuantidadeFracionada
    ) {
      return 999999999;
    } else {
      return 999999999.9999;
    }
  }

  ngOnInit() {
    this.usuario = this.authService.usuario();
    this.subListas();
    this.instanciarRequisicao();
  }

  private instanciarRequisicao() {
    this.requisicao = new Requisicao();
    this.requisicao.idRequisicao = 0;
    this.requisicao.idUsuarioSolicitante = this.usuario.idUsuario;
    this.requisicao.idTenant = this.usuario.permissaoAtual.idTenant;
    this.requisicao.situacao = SituacaoRequisicao.PreRequisicao;
    this.requisicao.moeda = this.item.produto.moeda ? this.item.produto.moeda : Moeda.Real;
    this.requisicao.itens = [this.instanciarRequisicaoItem()];

    this.preLoadEndereco();
    this.preLoadTipoRequisicao();
    this.preLoadCentroCusto();
  }

  private instanciarRequisicaoItem(): RequisicaoItem {
    let requisicaoItem = new RequisicaoItem(
      0,
      0,
      null,
      null,
      this.item.produto.idProduto,
      this.item.produto,
      null,
      this.tipoRequisicao,
      this.usuario.idUsuario,
      this.usuario,
      this.item.produto.moeda ? this.item.produto.moeda : Moeda.Real,
      this.item.produto.valorReferencia,
      null,
      null,
      null,
      null,
      moment(this.itemSolicitacaoCompra.dataRemessa).format('YYYY-MM-DD'),
      null,
      SituacaoRequisicaoItem['Aguardando Pacote'],
      this.quantidade,
      null,
      null,
      null
    );

    if (this.itemSolicitacaoCompra.quantidade) {
      requisicaoItem.quantidade = this.itemSolicitacaoCompra.quantidade;
    }

    if (!requisicaoItem.valorReferencia)
      requisicaoItem.valorReferencia = this.itemSolicitacaoCompra.valorReferencia;

    requisicaoItem.auxValorReferencia = this.adicionarMascaras(requisicaoItem.valorReferencia);
    requisicaoItem.idItemSolicitacaoCompra = this.idItemSolicitacaoCompra;

    if (requisicaoItem.dataEntrega) {
      requisicaoItem.minDataEntrega = requisicaoItem.dataEntrega;
    } else {
      requisicaoItem.minDataEntrega = moment().format('YYYY-MM-DD');
    }

    return requisicaoItem;
  }

  private adicionarMascaras(valor: number) {
    let valorComMascara: string = this.currencyPipe
      .transform(valor, undefined, '', '1.2-4', 'pt-BR')
      .trim();
    return valorComMascara;
  }

  public onModelChange(valor: string, index: number) {
    this.requisicao.itens[index].auxValorReferencia = valor;
    this.requisicao.itens[index].valorReferencia = Number(
      valor.replace(/\./g, '').replace(',', '.')
    );
  }

  public OnQuantidadeChange(valor: string, index: number) {
    if (valor && valor.toString().includes(',')) {
      this.requisicao.itens[index].quantidade = Number(valor.replace(/\./g, '').replace(',', '.'));
    }
  }

  public confirmar() {
    if (this.isRequisicaoValido()) {
      this.requisicao.idEnderecoEntrega = this.requisicao.itens[0].idEnderecoEntrega;
      this.requisicao.idSlaItem = this.requisicao.itens[0].idSlaItem;
      this.requisicao.idCentroCusto = this.requisicao.itens[0].idCentroCusto;
      this.requisicao.idTipoRequisicao = this.requisicao.itens[0].idTipoRequisicao;
      this.requisicao.idCondicaoPagamento = this.requisicao.itens[0].idCondicaoPagamento;
      this.activeModal.close(this.requisicao);
    }
  }

  public fechar() {
    this.activeModal.close();
  }

  public excluirItemRequisicao(index: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true
    });
    modalRef.componentInstance.confirmacao = `Deseja excluir o item da requisição?`;
    modalRef.componentInstance.confirmarLabel = 'Excluir';
    modalRef.result.then(result => {
      if (result) {
        this.solicitacaoCompraService
          .desvincularSubItemRequisicaoItem(
            this.idItemSolicitacaoCompra,
            this.requisicao.itens[index].idSubItemSolicitacaoCompra,
            this.requisicao.itens[index]
          )
          .subscribe(
            response => {
              SubItemSolicitacaoCompraComponent.desvincularSubItem.next(
                this.requisicao.itens[index].idSubItemSolicitacaoCompra
              );
              this.requisicao.itens.splice(index, 1);
              if (this.requisicao.itens.length == 1) {
                this.requisicao.idRequisicao = 0;
                this.requisicao.itens[0].idRequisicao = 0;
              }
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.blockUI.stop();
            },
            error => {}
          );
      }
    });
  }

  public isRequisicaoValido(): boolean {
    for (var itemRequisicao of this.requisicao.itens.filter(x => !x.idRequisicaoItem)) {
      if (!itemRequisicao.idCentroCusto) {
        var mensagemErro = 'É obrigatório selecionar um centro de custo no item "';
        mensagemErro += itemRequisicao.produto.descricao + '" na requisição.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!itemRequisicao.idTipoRequisicao) {
        var mensagemErro = 'É obrigatório selecionar um tipo de requisição no item "';
        mensagemErro += itemRequisicao.produto.descricao + '" na requisição.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!itemRequisicao.idSlaItem) {
        var mensagemErro = 'É obrigatório selecionar uma classificação no item "';
        mensagemErro += itemRequisicao.produto.descricao + '" na requisição.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!itemRequisicao.idEnderecoEntrega) {
        var mensagemErro = 'É obrigatório selecionar um endereço no item "';
        mensagemErro += itemRequisicao.produto.descricao + '" na requisição.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!this.isDataEntregaValida(itemRequisicao)) {
        return false;
      }
    }
    return true;
  }

  private isDataEntregaValida(itemRequisicao: RequisicaoItem): boolean {
    if (!itemRequisicao.dataEntrega) {
      var mensagemErro = 'É obrigatório informar a data de entrega no item "';
      mensagemErro += itemRequisicao.produto.descricao + '" na requisição.';
      this.toastr.warning(mensagemErro);
      return false;
    }

    var dataEntrega = moment(itemRequisicao.dataEntrega);

    if (!dataEntrega.isSameOrAfter(itemRequisicao.minDataEntrega)) {
      var mensagemErro = 'A data de entrega no item "';
      mensagemErro += itemRequisicao.produto.descricao + '" deve ser igual ou posterior a ';
      mensagemErro += this.datePipe.transform(itemRequisicao.minDataEntrega, 'dd/MM/yyyy') + '.';
      this.toastr.warning(mensagemErro);

      return false;
    }

    return true;
  }

  public itemDesabilitado(requisicaoItem: RequisicaoItem): boolean {
    return (
      this.idItemSolicitacaoCompra &&
      requisicaoItem.idItemSolicitacaoCompra != this.idItemSolicitacaoCompra
    );
  }

  public itemDesabilitadoClassificacao(requisicaoItem: RequisicaoItem): boolean {
    return (
      (this.idItemSolicitacaoCompra &&
        requisicaoItem.idItemSolicitacaoCompra != this.idItemSolicitacaoCompra) ||
      !requisicaoItem.idTipoRequisicao
    );
  }

  // #region Listas
  private subListas() {
    this.pessoaJuridicaService.ObterFiliais().subscribe(
      response => {
        if (response) this.filiais = response;
        this.subEnderecos();
      },
      error => {}
    );
    this.subCentrosCusto();
    this.subTiposRequisicao();
    this.subCondicoesPagamento();
  }

  public marcas$: Observable<Array<Marca>>;
  public marcasLoading: boolean;

  public openMarcas() {
    if (this.marcas$ == null) {
      this.subMarcas();
    }
  }

  private subMarcas() {
    this.marcasLoading = true;
    this.marcas$ = this.marcaService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.marcasLoading = false)),
      shareReplay()
    );
  }

  public enderecos$: Observable<Array<Endereco>>;
  public enderecos: Array<Endereco>;
  public enderecosLoading: boolean;

  private subEnderecos() {
    let empresaFilial: PessoaJuridica;
    let idPessoa: number;
    if (this.itemSolicitacaoCompra && this.filiais && this.filiais.length) {
      empresaFilial = this.filiais.find(
        filial => filial.codigoFilialEmpresa == this.itemSolicitacaoCompra.codigoFilialEmpresa
      );
    }
    if (empresaFilial) {
      idPessoa = empresaFilial.idPessoa;
    } else {
      idPessoa = this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoa;
    }
    this.enderecosLoading = true;
    this.enderecos$ = this.enderecoService.listar(idPessoa).pipe(
      catchError(() => of([])),
      tap(enderecos => {
        this.enderecos = enderecos;
        this.preLoadEndereco();
        this.enderecosLoading = false;
      }),
      shareReplay()
    );
  }

  private preLoadEndereco() {
    if (this.enderecos && this.enderecos.length) {
      if (this.requisicao && this.requisicao.itens) {
        this.requisicao.itens.forEach(item => {
          if (this.enderecos && this.enderecos.length) {
            let enderecosEntrega: Array<Endereco> = this.enderecos.filter(
              endereco => endereco.tipo == TipoEndereco.Entrega
            );

            if (enderecosEntrega && enderecosEntrega.length) {
              item.idEnderecoEntrega = enderecosEntrega[0].idEndereco;
            } else {
              item.idEnderecoEntrega = this.enderecos[0].idEndereco;
            }
          }
        });
      }
    }
  }

  public centrosCusto$: Observable<Array<CentroCusto>>;
  public centrosCusto: Array<CentroCusto>;
  public centrosCustoLoading: boolean;

  private subCentrosCusto() {
    this.centrosCustoLoading = true;
    this.centrosCusto$ = this.centroCustoService.listarAtivos().pipe(
      catchError(() => of([])),
      tap(centrosCusto => {
        this.centrosCusto = centrosCusto;
        this.preLoadCentroCusto();
        this.centrosCustoLoading = false;
      }),
      shareReplay()
    );
  }

  private preLoadCentroCusto() {
    if (this.centrosCusto && this.centrosCusto.length) {
      if (this.requisicao && this.requisicao.itens) {
        this.requisicao.itens.forEach((item, index) => {
          if (this.itemSolicitacaoCompra.rateios && this.itemSolicitacaoCompra.rateios.length) {
            let codigosCentroCusto = this.itemSolicitacaoCompra.rateios.map(rateio => {
              return rateio.codigoCentroCusto;
            });
            if (codigosCentroCusto && codigosCentroCusto.length) {
              let centroCusto = this.centrosCusto.find(cc =>
                codigosCentroCusto.includes(cc.codigo)
              );

              if (centroCusto) {
                item.idCentroCusto = centroCusto.idCentroCusto;
              }
            }
          } else {
            let centroCustoDefault = this.centrosCusto.filter(p => p.codigoDefault);
            if (centroCustoDefault.length) item.idCentroCusto = centroCustoDefault[0].idCentroCusto;
            else if (this.centrosCusto.length == 1)
              item.idCentroCusto = this.centrosCusto[0].idCentroCusto;
          }
        });
      }
    }
  }

  public tiposRequisicao$: Observable<Array<TipoRequisicao>>;
  public tiposRequisicaoLoading: boolean;
  public tiposRequisicao: Array<TipoRequisicao>;

  private subTiposRequisicao() {
    this.tiposRequisicaoLoading = true;
    this.tiposRequisicao$ = this.tipoRequisicaoService.obterTodos().pipe(
      catchError(() => of([])),
      tap(tiposRequisicao => {
        this.tiposRequisicao = tiposRequisicao;
        this.preLoadTipoRequisicao();
        this.tiposRequisicaoLoading = false;
      }),
      shareReplay()
    );
  }

  private preLoadTipoRequisicao() {
    if (this.tiposRequisicao && this.tiposRequisicao.length) {
      if (this.requisicao && this.requisicao.itens) {
        this.requisicao.itens.forEach((item, index) => {
          let tipoRequisicao = this.tiposRequisicao.find(
            tr => tr.tipoDocumento == this.tipoDocumento
          );

          if (tipoRequisicao) {
            item.idTipoRequisicao = tipoRequisicao.idTipoRequisicao;
            this.onChangeTipoRequisicao(tipoRequisicao.idTipoRequisicao, index);
          }
        });
      }
    }
  }

  public slaItens: Array<SlaItem>;
  private obterSlaItens(idTipoRequisicao: number, requisicaoItem: RequisicaoItem) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.matrizService
      .obterPorCategoriaTipoRequisicao(requisicaoItem.produto.idCategoriaProduto, idTipoRequisicao)
      .subscribe(
        response => {
          if (response) {
            this.slaItens = response.slaItens;
            this.preLoadSla();
          } else {
            this.slaItens = null;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private preLoadSla() {
    if (this.slaItens && this.slaItens.length == 1) {
      if (this.requisicao && this.requisicao.itens) {
        this.requisicao.itens.forEach((item, index) => {
          item.idSlaItem = this.slaItens[0].idSlaItem;
        });
      }
    }
  }

  public onChangeTipoRequisicao(idTipoRequisicao: number, index: number) {
    this.requisicao.itens[index].idTipoRequisicao = idTipoRequisicao;
    this.requisicao.itens[index].idSlaItem = null;
    this.slaItens = null;
    if (idTipoRequisicao) {
      this.obterSlaItens(idTipoRequisicao, this.requisicao.itens[index]);
    } else {
      this.slaItens = new Array<SlaItem>();
    }
  }

  public condicoesPagamento$: Observable<Array<CondicaoPagamento>>;
  public condicoesPagamentoLoading: boolean;

  private subCondicoesPagamento() {
    this.condicoesPagamentoLoading = true;
    this.condicoesPagamento$ = this.condicaoPagamentoService.listarAtivos().pipe(
      catchError(() => of([])),
      tap(() => (this.condicoesPagamentoLoading = false)),
      shareReplay()
    );
  }
  // #endregion

  public mudarMoeda(event, requisicao) {
    requisicao.moeda = (<any>Moeda)[event];
    requisicao.itens.map(p => (p.moeda = (<any>Moeda)[event]));
  }
}
