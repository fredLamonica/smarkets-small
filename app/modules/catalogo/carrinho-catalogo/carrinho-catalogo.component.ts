import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent, DetalhesPedidoComponent, ModalConfirmacaoExclusao, ObservacaoPedidoComponent } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CampanhaFranquia, CentroCusto, CondicaoPagamento, Endereco, GrupoCompradores, Iva, OrganizacaoCompra, Paginacao, Pedido, PedidoItem, PessoaJuridica, SituacaoPedido, SituacaoSolicitacaoItemCompra, TipoAprovacao, TipoEndereco, TipoFrete, TipoPedido, Usuario } from '@shared/models';
import { EstadoAtendimento } from '@shared/models/contrato-catalogo/estado-atendimento';
import { EntregaProgramada } from '@shared/models/entrega-programada';
import { OrigemProgramacaoDeEntrega } from '@shared/models/enums/origem-programacao-de-entrega.enum';
import { AutenticacaoService, CentroCustoService, CondicaoPagamentoService, ContaContabilService, EnderecoService, FranchiseCampaignService, GrupoCompradoresService, IvaService, OrganizacaoCompraService, PessoaJuridicaService, TipoPedidoService, TranslationLibraryService } from '@shared/providers';
import { PedidoEntregasProgramadasService } from '@shared/providers/pedido-entregas-programadas.service';
import { ErrorService } from '@shared/utils/error.service';
import { UtilitiesService } from '@shared/utils/utilities.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { concat, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { SmkConfirmacaoComponent } from '../../../shared/components/modals/smk-confirmacao/smk-confirmacao.component';
import { Alcada } from '../../../shared/models/alcada';
import { ConfiguracoesEntregasProgramadas } from '../../../shared/models/configuracoes-entregas-programadas';
import { ContratoCatalogoFaturamento } from '../../../shared/models/contrato-catalogo/contrato-catalogo-faturamento';
import { ContaContabilDto } from '../../../shared/models/dto/conta-contabil-dto';
import { TipoAlcadaAprovacao } from '../../../shared/models/enums/tipo-alcada-aprovacao';
import { TipoCatalogo } from '../../../shared/models/enums/tipo-catalogo';
import { ContaContabilFiltro } from '../../../shared/models/fltros/conta-contabil-filtro';
import { EnderecoFiltro } from '../../../shared/models/fltros/endereco-filtro';
import { AlcadaService } from '../../../shared/providers/alcada.service';
import { CarrinhoService } from '../../../shared/providers/carrinho.service';
import { ContratoCatalogoService } from '../../../shared/providers/contrato-catalogo.service';
import { PedidoService } from '../../../shared/providers/pedido.service';
import { ResumoCarrinhoComponent } from '../../container/resumo-carrinho/resumo-carrinho.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'carrinho-catalogo',
  templateUrl: './carrinho-catalogo.component.html',
  styleUrls: ['./carrinho-catalogo.component.scss'],
})
export class CarrinhoCatalogoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() textoNgSelectLoading: string;
  @Input() textoNgSelectLimpar: string;
  @Input() textoNgSelectPlaceholder: string;
  // tslint:disable-next-line: no-output-rename
  @Output('atualizar-carrinho') atualizarCarrinho = new EventEmitter();

  idEinstein: number = 39;
  max = 999999999;

  Frete = TipoFrete;
  TipoEndereco = TipoEndereco;

  prePedidos: Array<Pedido>;

  parametrosIntegracaoSapHabilitado: boolean = false;
  exibirFlagSapEm: boolean = false;
  exibirFlagSapEmNaoAvaliada: boolean = false;
  exibirFlagSapEntrFaturas: boolean = false;
  exibirFlagSapRevFatEm: boolean = false;
  isFranchise: boolean = false;

  origemMaterialObrigatorio: boolean;
  utilizacaoMaterialObrigatorio: boolean;
  categoriaMaterialObrigatorio: boolean;
  usuarioAtual: Usuario;
  idPedidoDestaque: number;

  maskPositiveInteger = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: null,
    allowDecimal: false,
    decimalSymbol: ',',
    decimalLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 9,
  });

  centrosCusto$: Observable<Array<CentroCusto>>;
  centrosCustoLoading: boolean;
  centroDeCustoUnico: boolean;

  contaContabilSelecionada: ContaContabilDto;
  contasContabeis$: Observable<Array<ContaContabilDto>>;
  contasContabeisLoading: boolean;
  contaContabilUnica: boolean;
  contasContabeisInput$ = new Subject<string>();
  contaContabilFiltro: ContaContabilFiltro = new ContaContabilFiltro();

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;
  alcadas$: Observable<Array<Alcada>>;
  alcadasLoading: boolean;
  alcadaUnica: boolean;

  condicoesPagamento: Array<CondicaoPagamento>;

  enderecos: Array<Endereco>;
  enderecos$: Array<Observable<Array<Endereco>>> = new Array<Observable<Array<Endereco>>>();
  enderecosLoadings: Array<boolean> = new Array<boolean>();
  enderecosInputs$: Array<Subject<string>> = new Array<Subject<string>>();
  enderecosSelecionados: Array<Endereco> = new Array<Endereco>();
  enderecosUnicos: Array<boolean> = new Array<boolean>();

  ivas$: Observable<Array<Iva>>;
  ivasLoading: boolean;
  ivaUnico: boolean;

  gruposCompradores$: Observable<Array<GrupoCompradores>>;
  gruposCompradoresLoading: boolean;
  grupoDeCompradoresUnico: boolean;

  organizacoesCompra$: Observable<Array<OrganizacaoCompra>>;
  organizacoesCompraLoading: boolean;
  organizacaoCompraUnica: boolean;

  tiposPedido$: Observable<Array<TipoPedido>>;
  tiposPedido: Array<TipoPedido>;
  tiposPedidoLoading: boolean;
  tipoPedidoUnico: boolean;

  filiais$: Observable<Array<PessoaJuridica>>;
  filiais: Array<PessoaJuridica>;
  filiaisLoading: boolean;

  franchiseCampaigns$: Observable<Array<CampanhaFranquia>>;
  franchiseCampaignsLoading: boolean;

  origemProgramacaoDeEntrega = OrigemProgramacaoDeEntrega;

  formComentario: FormGroup = this.fb.group({
    observacao: [''],
  });

  modalRef: any;

  enderecoFiltro: EnderecoFiltro = new EnderecoFiltro();
  TipoCatalogo = TipoCatalogo;
  idTenantLogado: number;

  private indexPedido: number;
  private indexItem: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private pedidoService: PedidoService,
    private carrinhoService: CarrinhoService,
    private datePipe: DatePipe,
    private centroCustoService: CentroCustoService,
    private alcadaService: AlcadaService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private tipoPedidoService: TipoPedidoService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private enderecoService: EnderecoService,
    private authService: AutenticacaoService,
    private ivaService: IvaService,
    private grupoCompradoresService: GrupoCompradoresService,
    private organizacaoComprasService: OrganizacaoCompraService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private contratoCatalogoService: ContratoCatalogoService,
    private franchiseCampaignService: FranchiseCampaignService,
    private utilitiesService: UtilitiesService,
    private errorService: ErrorService,
    private pedidoEntregasProgramadasService: PedidoEntregasProgramadasService,
    private contaContabilService: ContaContabilService,
  ) {
    super();
  }

  ngOnInit() {
    this.obterParametrosIntegracaoSapHabilitado();
    this.getIsFranchisedUser();
    this.subListas();
    this.obterPrePedidos();
    this.idPedidoDestaque = +this.route.snapshot.queryParams['idPrePedido'] || null;
    this.usuarioAtual = this.authService.usuario();
    this.tipoAlcadaAprovacao = this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao;
    this.idTenantLogado = this.usuarioAtual.permissaoAtual.idTenant;
  }

  //#endregion

  // #region Condicoes Pagamentos

  obterCondicoesPagamentos() {
    this.prePedidos.forEach((pedido) => {
      this.condicaoPagamentoService.listarPorContratoCatalogo(pedido.idContratoCatalogo).pipe(
        takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.condicoesPagamento = pedido.condicoesPagamentos = response;
          }
          this.preenchaCondicaoDePagamentoSeForUnica(pedido);
        });
    });
  }

  preLoadContratoCatalogoEndereco() {
    this.prePedidos.forEach((prePed) => {
      this.enderecos.forEach((end) => {
        if (end.idEndereco === prePed.idEnderecoEntrega) {
          this.contratoCatalogoService.obterFaturamentoPorIdEstado(prePed.idContratoCatalogo, end.idEstado).pipe(
            takeUntil(this.unsubscribe))
            .subscribe((response) => {
              prePed.contratoCatalogoFaturamento = response;
            });
        }
      });
    });
  }
  // #endregion

  // #region Pedidos

  visualizarPrePedido(index: number) {
    const modalRef = this.modalService.open(DetalhesPedidoComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.pedido = this.prePedidos[index];
    modalRef.result.then((result) => {
      if (!this.prePedidos[index].itens.length) {
        this.removaPrePedido(index);
        ResumoCarrinhoComponent.atualizarCarrinho.next();
        this.atualizarCarrinho.emit();
      }
      if (result === SituacaoPedido['Aguardando aprovação']) { this.confirmarPedido(index); }
    });
  }

  gerarOrcamento(index: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const pedido = this.prePedidos[index];
    pedido.valor = this.subTotalPrePedido(index);
    this.carrinhoService.gerarOrcamento(pedido.idPedido).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
        () => {
        },
        (error) => {
          this.errorService.treatError(error);
        },
      );

  }

  subTotalPrePedido(index: number): number {
    const valores = this.prePedidos[index].itens.map((item) => {
      if (item.entregaProgramada) {
        let valorTotal = 0;

        if (item.datasDasEntregasProgramadas) {
          for (const entrega of item.datasDasEntregasProgramadas) {
            valorTotal += entrega.quantidade * entrega.valor;
          }
        }

        return valorTotal;
      } else {
        return item.quantidade * item.valor;
      }
    });

    if (valores && valores.length) {
      return valores.reduce((prev, cur) => prev + cur, 0);
    } else {
      return 0;
    }
  }

  tratarDataEntrega(pedidos: Array<Pedido>): Array<Pedido> {
    pedidos.forEach((pedido) => {
      pedido.itens = pedido.itens.map((item) => {
        item.minDataEntrega = item.dataEntrega;
        return item;
      });
    });
    return pedidos;
  }

  solicitarCancelarPedido(idPedido: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.cancelarPedido(idPedido),
        (reason) => { },
      );
  }

  esvaziarCarrinho() {
    this.removaTodosOsPrePedidos();
  }

  salvarAlteracaoPedido(index: number) {
    if (!this.exibirFlagSapEm) {
      this.prePedidos[index].itens.forEach((item) => (item.sapEm = null));
    }

    if (!this.exibirFlagSapEmNaoAvaliada) {
      this.prePedidos[index].itens.forEach((item) => (item.sapEmNaoAvaliada = null));
    }

    if (!this.exibirFlagSapEntrFaturas) {
      this.prePedidos[index].itens.forEach((item) => (item.sapEntrFaturas = null));
    }

    if (!this.exibirFlagSapRevFatEm) {
      this.prePedidos[index].itens.forEach((item) => (item.sapRevFatEm = null));
    }

    this.prePedidos[index].ultimaAlteracao = 'salvando';

    this.pedidoService.alterar(this.prePedidos[index]).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.prePedidos[index].itens.forEach((item) => {
              item.idEnderecoEntrega = this.prePedidos[index].idEnderecoEntrega;
              item.idIva = this.prePedidos[index].idIva;
              item.idCentroCusto = this.prePedidos[index].idCentroCusto;

              this.pedidoService.alterarItem(this.prePedidos[index].idPedido, item).pipe(
                takeUntil(this.unsubscribe))
                .subscribe();
            });

            this.prePedidos[index].condicaoPagamento = this.condicoesPagamento
              ? this.condicoesPagamento.find((cp) => cp.idCondicaoPagamento === this.prePedidos[index].idCondicaoPagamento)
              : null;

            this.prePedidos[index].ultimaAlteracao = moment().format();
            ResumoCarrinhoComponent.atualizarCarrinho.next();
          }
        },
        (error) => {
          this.prePedidos[index].ultimaAlteracao = 'erro';
        },
      );
  }

  enderecoSearchFn(term: string, item: Endereco) {
    term = term.toLowerCase();
    return (
      item.logradouro.toLowerCase().indexOf(term) > -1 ||
      item.bairro.toLowerCase().indexOf(term) > -1 ||
      item.cidade.nome.toLowerCase().indexOf(term) > -1 ||
      item.cidade.estado.nome.toLowerCase().indexOf(term) > -1 ||
      item.cidade.estado.abreviacao.toLowerCase().indexOf(term) > -1 ||
      item.cep.toLowerCase().indexOf(term) > -1
    );
  }

  enderecoChange(index: number, enderecoSelecionado: Endereco) {
    const pedido = this.prePedidos[index];

    if (pedido) {
      if (enderecoSelecionado) {
        pedido.idEnderecoEntrega = enderecoSelecionado.idEndereco;
        pedido.enderecoEntrega = enderecoSelecionado;
      } else {
        pedido.idEnderecoEntrega = null;
        pedido.enderecoEntrega = null;
      }
    }
  }

  valideEnderecoSalvando(index: number, enderecoSelecionado: any, prePedido: Pedido = null): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const pedido = prePedido ? prePedido : this.prePedidos[index];

    if (enderecoSelecionado) {
      this.carrinhoService.valideEstadoDeAtendimentoObtendoDados(pedido.itens, enderecoSelecionado.idEstado).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.blockUI.stop();
        }))
        .subscribe(
          (estadoAtendimento) => {
            this.definaDadosRelacionadosComEstadoDeAtendimento(pedido, estadoAtendimento);
            this.enderecoChange(index, enderecoSelecionado);
            this.salvarAlteracaoPedido(index);
          },
          (error) => {
            if(error)
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          });
    } else {
      this.definaDadosRelacionadosComEstadoDeAtendimento(pedido, null);
      this.salvarAlteracaoPedido(index);

      this.blockUI.stop();
    }
  }

  solicitarConfirmarPedido(index: number) {
    if (this.isPedidoValido(this.prePedidos[index], index)) {
      this.verificarValorMinimo(index);
    }
  }

  verificarValorMinimo(index: number) {
    const pedido = this.prePedidos[index];
    this.obterValorMinimo(index, pedido.idContratoCatalogo, pedido.enderecoEntrega.idEstado);
  }

  takeOrder(idPedido: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.takeOrder(idPedido).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.obterPrePedidos();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  canEditOrder(order: Pedido): boolean {
    return order.idUsuario && order.idUsuario > 0;
  }

  empresaCompradoraPossuiIntegracaoErp(pedido: Pedido): boolean {
    return pedido.comprador.habilitarIntegracaoERP;
  }

  // #endregion

  // #region Itens
  solicitarRemoverItem(idPedido: number, idPedidoItem: number) {
    this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.removerItem(idPedido, idPedidoItem),
        (reason) => { },
      );
  }

  alterarItem(prePedidoIndex: number, itemIndex: number, atualizarComEntregaProgramada: boolean = false) {
    const order = this.prePedidos[prePedidoIndex];

    if (this.canEditOrder(order)) {
      this.prePedidos[prePedidoIndex].ultimaAlteracao = 'salvando';

      const callbackSucesso: () => void = () => {
        this.prePedidos[prePedidoIndex].ultimaAlteracao = moment().format();
        ResumoCarrinhoComponent.atualizarCarrinho.next();
      };

      if (atualizarComEntregaProgramada) {
        this.pedidoService.alterarEntregaProgramada(this.prePedidos[prePedidoIndex].itens[itemIndex]).pipe(
          takeUntil(this.unsubscribe))
          .subscribe(
            (response) => {
              if (response) {
                this.prePedidos[prePedidoIndex].itens[itemIndex].dataEntrega = response.dataEntrega;
                this.prePedidos[prePedidoIndex].itens[itemIndex].quantidade = response.quantidade;
                callbackSucesso();
              }
            },
            (error) => {
              this.prePedidos[prePedidoIndex].ultimaAlteracao = 'erro';
            },
          );
      } else {
        this.pedidoService.alterarItem(this.prePedidos[prePedidoIndex].idPedido, this.prePedidos[prePedidoIndex].itens[itemIndex]).pipe(
          takeUntil(this.unsubscribe))
          .subscribe(
            (response) => {
              if (response) {
                callbackSucesso();
              }
            },
            (error) => {
              this.prePedidos[prePedidoIndex].ultimaAlteracao = 'erro';
            },
          );
      }
    }
  }

  inserirComentario(content: any, indexPedido: number, indexItem: number) {
    this.indexPedido = indexPedido;
    this.indexItem = indexItem;
    this.formComentario.patchValue({
      observacao: this.prePedidos[indexPedido].itens[indexItem].observacao,
    });
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  inserirObservacaoNoPedido(indexPedido: number) {
    const modalObservacaoPedido = this.modalService.open(ObservacaoPedidoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalObservacaoPedido.componentInstance.pedido = this.prePedidos[indexPedido];

    modalObservacaoPedido.result.then((result) => {
      if (result) {
        this.obterPrePedidos();
      }
    });
  }

  solicitarSalvarComentario() {
    const anteriorVazio = this.prePedidos[this.indexPedido].itens[this.indexItem].observacao
      ? this.prePedidos[this.indexPedido].itens[this.indexItem].observacao.trim() === ''
      : true;
    const posteriorVazio = this.formComentario.value.observacao
      ? this.formComentario.value.observacao.trim() === ''
      : true;
    if (!anteriorVazio && posteriorVazio) {
      const confirmacaoRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
      confirmacaoRef.componentInstance.confirmacao =
        'Você removeu o comentário, tem certeza que deseja salvar a alteração?';
      confirmacaoRef.result.then((result) => {
        if (result) {
          this.salvarComentario();
        }
      });
    } else {
      this.salvarComentario();
    }
  }

  salvarComentario() {
    this.prePedidos[this.indexPedido].itens[this.indexItem].observacao = this.formComentario.value.observacao;

    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.alterarItem(this.prePedidos[this.indexPedido].idPedido, this.prePedidos[this.indexPedido].itens[this.indexItem]).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.modalRef.close();
          this.formComentario.reset();
          this.prePedidos[this.indexPedido].ultimaAlteracao = moment().format();
          this.indexItem = null;
          this.indexPedido = null;
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
  // #endregion

  trateEnderecoPrePedido(index: number, prePedido: Pedido) {
    if (prePedido.comprador.listaExtensaEnderecos) {
      this.enderecosSelecionados[index] = prePedido.enderecoEntrega ? prePedido.enderecoEntrega : null;
      this.enderecosInputs$[index] = new Subject<string>();

      return this.obtenhaListaExtensaEnderecos(index, prePedido);
    } else {
      return this.obtenhaListaSimplesEnderecos(index, prePedido);
    }
  }

  atualizeProgramacaoDeEntregas(entregasProgramadas: Array<EntregaProgramada>, prePedidoIndex: number, itemIndex: number) {
    const pedidoItem = this.prePedidos[prePedidoIndex].itens[itemIndex];

    pedidoItem.datasDasEntregasProgramadas = entregasProgramadas;
    this.alterarItem(prePedidoIndex, itemIndex, true);

    this.pedidoEntregasProgramadasService.getUltimaDataProgramada(pedidoItem.idPedidoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((entregaProgramadaUltimaData) => pedidoItem.entregaProgramadaUltimaDataDto = entregaProgramadaUltimaData);
  }

  configEntregaProgramada(
    itemIndex: number,
    origem,
    idItem,
    quantidadeMinima,
    quantidadeMaxima,
    quantidadeMinimaDoLote,
    permiteQuantidadeFracionada,
    valorFixo,
    dataEntregaMinima: string,
  ) {
    return new ConfiguracoesEntregasProgramadas({
      index: itemIndex,
      origem: origem,
      idItem: idItem,
      quantidadeMinima: quantidadeMinima,
      quantidadeMaxima: quantidadeMaxima,
      quantidadeMinimaDoLote: quantidadeMinimaDoLote,
      permiteQuantidadeFracionada: permiteQuantidadeFracionada,
      valorFixo: valorFixo,
      dataEntregaMinima: dataEntregaMinima,
    });
  }

  ItemSemProgramacaoDeEntrega(PedidoItem: PedidoItem) {
    return  PedidoItem ? !PedidoItem.entregaProgramada : true;
  }

  removerPedidos(itens) {
    const selecionados = itens.filter((p) => p.selecionado);
    if (selecionados.length > 0) {

      const modalRef = this.modalService.open(SmkConfirmacaoComponent, { centered: true });
      modalRef.componentInstance.conteudo = 'Deseja Excluir os itens selecionados ? ';
      modalRef.componentInstance.titulo = 'Atenção';

      modalRef.result.then(
        (result) => {
          if (result) {
            this.removerItens(selecionados[0].idPedido, selecionados);
          }
        },
        (reason) => { },
      );
    }
  }

  selecionarTodos(event, pedido: Pedido) {
    pedido.habilitarBtnRemover = event.target.checked;
    pedido.itens.forEach((p) => {
      return p.selecionado = event.target.checked;
    });
  }

  atualizaSelecionados(pedido: Pedido) {
    pedido.selecionarTodos = false;
    const selecionados = pedido.itens.filter((p) => p.selecionado);
    pedido.habilitarBtnRemover = selecionados.length > 0;

    if (selecionados.length === pedido.itens.length) {
      pedido.selecionarTodos = true;
    }

  }

  private valideEnderecosInformados(pedidos: Array<Pedido>): Observable<Array<void>> {
    const observables = new Array<Observable<void>>();

    let user = pedidos.map(x => x.idUsuario == null)
      for (const pedido of pedidos) {
        if (pedido.idEnderecoEntrega && pedido.enderecoEntrega && pedido.idUsuario) {
          const observableDeConfiguracoes = this.carrinhoService.valideEstadoDeAtendimentoObtendoDados(   pedido.itens, pedido.enderecoEntrega.idEstado)
            .pipe(
              takeUntil(this.unsubscribe),
              map(estadoAtendimento => {
                this.definaDadosRelacionadosComEstadoDeAtendimento(pedido, estadoAtendimento);
              }),
              catchError((error) => {
                let mensagem: string;

                if (error.status === 400 && error.error && error.error instanceof Array && error.error.length > 0) {
                  mensagem = error.error[0].message;
                }

                this.definaDadosRelacionadosComEstadoDeAtendimento(pedido, null);

                return this.utilitiesService.getObservable(null);
              }),
              finalize(() => {
                this.blockUI.stop();
              })
            );

          observables.push(observableDeConfiguracoes);
        } else {
          this.definaDadosRelacionadosComEstadoDeAtendimento(pedido, null);
        }
      }



    if (observables.length === 0) {
      observables.push(this.utilitiesService.getObservable(null));
    }

    return forkJoin(observables).pipe(
      map((results) => results)
    );
}


  private definaDadosRelacionadosComEstadoDeAtendimento(pedido: Pedido, estadoAtendimento: EstadoAtendimento[] = null): void {
    if (pedido && pedido.itens && pedido.itens.length > 0) {

      const valorMinimo = estadoAtendimento ? estadoAtendimento.filter(y => y.idContratoCatalogo == pedido.idContratoCatalogo).map(x => x.faturamentoMinimo) : 0;
      const idEstado = pedido.enderecoEntrega ? pedido.enderecoEntrega.idEstado : 0;
      pedido.contratoCatalogoFaturamento = new ContratoCatalogoFaturamento(pedido.idContratoCatalogo, 1, idEstado, valorMinimo[0]);

      const arrayBool = new Array<boolean>();

      for (const itemPedido of pedido.itens) {

        let prazo = estadoAtendimento ? estadoAtendimento.filter(y => y.idContratoCatalogoItem == itemPedido.idContratoCatalogoItem) : null;

        let invalid = prazo ? prazo[0].estadoDeAtendimentoInvalido : false;
        arrayBool.push(invalid);

        itemPedido.prazoDeEntregaEmDias = prazo ? prazo[0].prazoDeEntregaEmDias : 0;
        itemPedido.dataEntrega = prazo ? prazo[0].dataPrevistaDeEntrega : null;
        itemPedido.minDataEntrega = itemPedido.dataEntrega;
        itemPedido.estadoDeAtendimentoInvalido = prazo ?  prazo[0].estadoDeAtendimentoInvalido : false;
        itemPedido.estadoDeAtendimentoMensagemDeErro = prazo ?  prazo[0].estadoDeAtendimentoMensagemDeErro : null;
      }

      pedido.estadoDeAtendimentoInvalido = arrayBool.some(x => x === true);

    }
  }

  private obterPrePedidos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.carrinhoService.obter().pipe(
      takeUntil(this.unsubscribe),
      switchMap((pedidos) => {
        if (pedidos && pedidos.length > 0) {
          return this.valideEnderecosInformados(pedidos).pipe(
            map(() => pedidos));
        }

        return this.utilitiesService.getObservable(pedidos);
      }))
      .subscribe(
        (response) => {
          if (response) {
            this.prePedidos = this.tratarDataEntrega(response);

            this.prePedidos.forEach((prePedido, index) => {
              if (prePedido.itens.some((item) => item.idItemSolicitacaoCompra != null)) {
                prePedido.origem = 'Requisição SAP';
              }

              this.trateEnderecoPrePedido(index, prePedido);
            });

            this.obterCondicoesPagamentos();

            if (!this.gruposCompradores$ && this.prePedidos.find((x) => x.comprador.habilitarIntegracaoERP)) {
              this.subGruposCompradores();
            }

            const pedidosComEnderecoUnico = this.prePedidos.filter((x) => x.idEnderecoEntrega && !x.prazoDeEntregaEmDias && !x.estadoDeAtendimentoInvalido);

            if (pedidosComEnderecoUnico && pedidosComEnderecoUnico.length > 0) {
              this.valideEnderecosInformados(pedidosComEnderecoUnico).pipe(
                takeUntil(this.unsubscribe))
                .subscribe();
            }
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obtenhaListaSimplesEnderecos(index: number, prePedido: Pedido): void {
    this.enderecosLoadings[index] = true;

    const idPessoa = prePedido.comprador.idPessoa;

    const enderecosEmpresaCompradora$ = this.enderecoService.listar(idPessoa).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.enderecosLoadings[index] = false),
      map((enderecos) => enderecos.filter((t) => t.tipo === TipoEndereco.Entrega)),
      tap((enderecos) => {
        if (enderecos && enderecos.length === 1) {
          const endereco = enderecos[0];

          if (prePedido.idEnderecoEntrega !== endereco.idEndereco) {
            this.valideEnderecoSalvando(0, endereco, prePedido);
          }

          prePedido.idEnderecoEntrega = endereco.idEndereco;
          prePedido.enderecoEntrega = endereco;
          this.enderecosUnicos[index] = true;
        }
      }));

    this.enderecos$.push(enderecosEmpresaCompradora$);
  }

  private obtenhaListaExtensaEnderecos(index: number, prePedido: Pedido): void {
    const enderecosEmpresaCompradora$ = concat(
      this.utilitiesService.getObservable(new Array<Endereco>()),
      this.enderecosInputs$[index].pipe(
        takeUntil(this.unsubscribe),
        filter((termoDeBusca) => termoDeBusca !== null && termoDeBusca.length >= 3),
        debounceTime(750),
        distinctUntilChanged(),
        tap(() => (this.enderecosLoadings[index] = true)),
        switchMap((termoDeBusca: string) => {
          this.enderecoFiltro.idPessoa = prePedido.comprador.idPessoa;
          this.enderecoFiltro.itensPorPagina = 20;
          this.enderecoFiltro.pagina = 1;
          this.enderecoFiltro.termo = termoDeBusca;
          this.enderecoFiltro.tipoEndereco = TipoEndereco.Entrega;
          return this.enderecoService.filtrarPorPessoa(this.enderecoFiltro).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => (this.enderecosLoadings[index] = false)),
            map((paginacao: Paginacao<Endereco>) => paginacao ? paginacao.itens : new Array<Endereco>()),
            catchError(() => this.utilitiesService.getObservable(new Array<Endereco>())),
          );
        }),
      ),
    );

    this.enderecos$.push(enderecosEmpresaCompradora$);
  }

  //#region Obter Dados Padrao

  private preenchaTipoDePedidoSeForUnico() {
    if (this.tiposPedido && this.tiposPedido.length === 1) {
      for (const pedido of this.prePedidos) {
        pedido.idTipoPedido = this.tiposPedido[0].idTipoPedido;
        pedido.tipoPedido = this.tiposPedido[0];
      }
      this.tipoPedidoUnico = true;
    }
  }

  private preenchaCondicaoDePagamentoSeForUnica(pedido: Pedido): void {
    if (pedido.condicoesPagamentos && pedido.condicoesPagamentos.length === 1) {
      pedido.condicaoDePagamentoUnica = true;
      pedido.condicaoPagamento = this.condicoesPagamento[0];
      pedido.idCondicaoPagamento = this.condicoesPagamento[0].idCondicaoPagamento;
    }
  }

  // #endregion

  // #region Listas
  private subListas() {
    this.subCentrosCusto();
    this.subFiliais();
    this.subTiposPedido();
    this.subAlcadas();
    this.assineEventoDePesquisaDeContasContabeis();

    if (this.isFranchise) { this.subFranchiseCampaigns(); }

    if (this.parametrosIntegracaoSapHabilitado) {
      this.subIvas();
      this.subGruposCompradores();
      this.subOrganizacoesCompra();
    }
  }

  private assineEventoDePesquisaDeContasContabeis() {
    const ITENS_POR_PAGINA: number = 100;
    const PAGINA: number = 1;
    this.contasContabeis$ = concat(
      this.utilitiesService.getObservable(new Array<ContaContabilDto>()),
      this.contasContabeisInput$.pipe(
        takeUntil(this.unsubscribe),
        filter((termoDeBusca) => termoDeBusca !== null && termoDeBusca.length >= 3),
        debounceTime(750),
        distinctUntilChanged(),
        tap(() => (this.contasContabeisLoading = true)),
        switchMap((termoDeBusca: string) => {
          this.contaContabilFiltro.itensPorPagina = ITENS_POR_PAGINA;
          this.contaContabilFiltro.pagina = PAGINA;
          this.contaContabilFiltro.termo = termoDeBusca;
          return this.contaContabilService.listarContasPai(this.contaContabilFiltro).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => (this.contasContabeisLoading = false)),
            map((paginacao: Paginacao<ContaContabilDto>) => paginacao ? paginacao.itens : new Array<ContaContabilDto>()),
            catchError(() => this.utilitiesService.getObservable(new Array<ContaContabilDto>())),
          );
        }),
      ),
    );
  }

  private subCentrosCusto() {
    this.centrosCustoLoading = true;

    this.centrosCusto$ = this.centroCustoService.listarAtivos().pipe(
      catchError(() => of([])),
      tap((centrosCusto) => {
        if (centrosCusto) {
          if (centrosCusto.length === 1) {
            this.centroDeCustoUnico = true;

            for (const pedido of this.prePedidos) {
              pedido.idCentroCusto = centrosCusto[0].idCentroCusto;
              pedido.centroCusto = centrosCusto[0];
            }
          } else {
            const ccDefault = centrosCusto.find((cc) => cc.codigoDefault);

            if (ccDefault) {
              this.prePedidos.forEach((pedido) => (pedido.idCentroCusto = ccDefault.idCentroCusto));
            }
          }
        }

        this.centrosCustoLoading = false;
      }),
      shareReplay(),
    );
  }

  private subAlcadas() {
    this.alcadasLoading = true;

    this.alcadas$ = this.alcadaService.listar().pipe(
      catchError(() => of([])),
      tap((alcadas) => {
        if (alcadas) {
          if (alcadas.length === 1) {
            this.alcadaUnica = true;

            for (const pedido of this.prePedidos) {
              pedido.idAlcada = alcadas[0].idAlcada;
            }
          }
        }

        this.alcadasLoading = false;
      }),
      shareReplay(),
    );
  }

  private preLoadEndereco() {
    if (this.enderecos && this.enderecos.length) {
      this.preLoadContratoCatalogoEndereco();
      if (this.filiais && this.filiais.length) {
        if (this.prePedidos && this.prePedidos.length) {
          this.prePedidos.forEach((pedido) => {
            pedido.itens.forEach((item) => {
              if (!item.idEnderecoEntrega && pedido.idComprador) {
                const filial = this.filiais.find(
                  (x) => x.idPessoaJuridica === pedido.idComprador,
                );
                if (filial) {
                  const enderecosFilial = this.enderecos.filter(
                    (endereco) => endereco.idPessoa === filial.idPessoa,
                  );
                  if (enderecosFilial && enderecosFilial.length) {
                    const enderecosEntregaFilial = enderecosFilial.filter(
                      (endereco) => endereco.tipo === TipoEndereco.Entrega,
                    );
                    if (enderecosEntregaFilial && enderecosEntregaFilial.length) {
                      item.idEnderecoEntrega = enderecosEntregaFilial[0].idEndereco;
                    } else {
                      item.idEnderecoEntrega = enderecosFilial[0].idEndereco;
                    }
                  } else {
                    item.idEnderecoEntrega = this.enderecos[0].idEndereco;
                  }
                }
              }
            });
          });
        }
      }
    }
  }

  private subIvas() {
    this.ivasLoading = true;
    this.ivas$ = this.ivaService.listar().pipe(
      catchError(() => of([])),
      tap((ivaList) => {
        this.preenchaIvaSeForUnico(ivaList);
        (this.ivasLoading = false);
      }),
      shareReplay(),

    );
  }

  private preenchaIvaSeForUnico(ivaList: Array<Iva>) {
    if (ivaList && ivaList.length === 1) {
      this.ivaUnico = true;
      for (const pedido of this.prePedidos) {
        pedido.idIva = ivaList[0].idIva;
      }
    }
  }

  private subGruposCompradores() {
    this.gruposCompradoresLoading = true;
    this.gruposCompradores$ = this.grupoCompradoresService.listar().pipe(
      catchError(() => of([])),
      tap((gruposCompradores) => {
        if (gruposCompradores) {
          if (gruposCompradores.length === 1) {
            this.grupoDeCompradoresUnico = true;

            for (const pedido of this.prePedidos) {
              pedido.idGrupoCompradores = gruposCompradores[0].idGrupoCompradores;
              pedido.grupoCompradores = gruposCompradores[0];
            }
          } else {
            const grpDefault = gruposCompradores.find((grp) => grp.codigoDefault);

            if (grpDefault) {
              this.prePedidos.forEach((pedido) => (pedido.idGrupoCompradores = grpDefault.idGrupoCompradores));
            }
          }
        }
        this.gruposCompradoresLoading = false;
      }),
      shareReplay(),
    );
  }

  private subOrganizacoesCompra() {
    this.organizacoesCompraLoading = true;
    this.organizacoesCompra$ = this.organizacaoComprasService.listar().pipe(
      catchError(() => of([])),
      tap((organizacoesCompra) => {
        if (organizacoesCompra) {
          if (organizacoesCompra.length === 1) {
            this.organizacaoCompraUnica = true;

            for (const pedido of this.prePedidos) {
              pedido.idOrganizacaoCompra = organizacoesCompra[0].idOrganizacaoCompra;
              pedido.organizacaoCompra = organizacoesCompra[0];
            }
          } else {
            const orgDefault = organizacoesCompra.find((org) => org.codigoDefault);

            if (orgDefault) {
              this.prePedidos.forEach((pedido) => (pedido.idOrganizacaoCompra = orgDefault.idOrganizacaoCompra));
            }
          }
        }
        this.organizacoesCompraLoading = false;
      }),
      shareReplay(),
    );
  }

  private subTiposPedido() {
    this.tiposPedidoLoading = true;
    this.tiposPedido$ = this.tipoPedidoService.listar().pipe(
      catchError(() => of([])),
      tap((tiposPedido) => {
        this.tiposPedidoLoading = false;
        this.tiposPedido = tiposPedido;
        this.preenchaTipoDePedidoSeForUnico();
      }),
      shareReplay(),
    );
  }

  private subFiliais() {
    this.filiaisLoading = true;
    this.filiais$ = this.pessoaJuridicaService.obterFiliaisCompra().pipe(
      catchError(() => of([])),
      tap((filiais) => {
        this.filiais = filiais;
        this.preLoadEndereco();
        this.filiaisLoading = false;
      }),
      shareReplay(),
    );
  }

  private subFranchiseCampaigns() {
    this.franchiseCampaignsLoading = true;
    this.franchiseCampaigns$ = this.franchiseCampaignService.getFranchiseCampaignsToOrder().pipe(
      catchError(() => of([])),
      tap(() => (this.franchiseCampaignsLoading = false)),
      shareReplay(),
    );
  }

  private cancelarPedido(idPedido: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.excluir(idPedido).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.prePedidos = this.prePedidos.filter((prePedido) => prePedido.idPedido !== idPedido);
            ResumoCarrinhoComponent.atualizarCarrinho.next();
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obterValorMinimo(index: number, idContratoCatalogo: number, idEstado: number) {
    this.contratoCatalogoService.obterFaturamentoPorIdEstado(idContratoCatalogo, idEstado).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.validarValorMinimo(index, response.valorMinimoPedido);
        } else {
          this.confirmarPedido(index);
        }
      });
  }

  private validarValorMinimo(index: number, valorMinimoPedido: number) {
    const pedido = this.prePedidos[index];
    pedido.valor = this.subTotalPrePedido(index);
    if (pedido.valor < valorMinimoPedido) {
      this.mostrarMensagemDeAvisoValorMinimo(index, valorMinimoPedido);
    } else {
      this.confirmarPedido(index);
    }
  }

  private mostrarMensagemDeAvisoValorMinimo(index: number, valorMinimoPedido: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = `O valor mínimo para esse pedido é de R$${valorMinimoPedido}, deseja continuar?`;

    modalRef.result.then((result) => {
      if (result) {
        this.confirmarPedido(index);
      }
    });
  }

  private confirmarPedido(index: number) {
    const usuario = this.authService.usuario();
    if (usuario.permissaoAtual.pessoaJuridica.bloquearRequisicaoPedido) {
      return this.toastr.warning(
        this.translationLibrary.translations.ALERTS.COMPANY_BLOCKED_TO_GENERATE_ORDERS_AND_REQUESTS,
      );
    }

    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.confirmarPedido(this.prePedidos[index]).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.removaPrePedido(index);
            ResumoCarrinhoComponent.atualizarCarrinho.next();
            this.atualizarCarrinho.emit();
          }

          this.toastr.success(
            this.translationLibrary.translations.ALERTS.REQUEST_CONFIRMED_WAIT_FOR_APPROVAL,
          );

          this.blockUI.stop();

          if (!this.prePedidos.length) { this.router.navigate(['/marketplace']); }
        },
        (error) => {
          if (error && error.status === 400) {
            switch (error.error) {
              case 'Pedido inválido':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_MARKETPLACE,
                );
                break;

              case 'Pedido inapto à aprovação': {
                switch (this.prePedidos[index].comprador.tipoAprovacao) {
                  case TipoAprovacao.Departamento:
                    this.toastr.warning(
                      this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_DEPARTMENT,
                    );
                    break;

                  case TipoAprovacao.CentroCusto:
                    this.toastr.warning(
                      this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_COST_CENTER,
                    );
                    break;

                  default:
                    this.toastr.warning(
                      this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_APPROVAL_TYPE,
                    );
                    break;
                }

                break;
              }

              case 'Tipo aprovação não informado':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_APPROVAL_TYPE,
                );
                break;

              case 'Usuário não vinculado a departamento':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_USER_WITHOUT_DEPARTMENT,
                );
                break;

              case 'Usuário não vinculado a centro de custo':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_USER_WITHOUT_COST_CENTER,
                );
                break;

              case 'Fornecedor está com status homologação declinado':
                this.toastr.warning(this.translationLibrary.translations.ALERTS.DECLINED_SUPPLIER);
                break;

              case 'Fornecedor não está homologado':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.NON_APPROVED_SUPPLIER,
                );
                break;

              case 'Fornecedor em análise':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.SUPPLIER_UNDER_REVIEW,
                );
                break;

              case 'O pedido não pode ser concluído pois possui itens bloqueados':
                this.toastr.warning(error.error);
                break;

              default:
                this.errorService.treatError(error);
                break;
            }
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.blockUI.stop();
        },
      );
  }

  private isPedidoValido(pedido: Pedido, index: number): boolean {
    if (!this.prePedidos[index].idEnderecoEntrega) {
      this.toastr.warning('É obrigatório selecionar um endereço de entrega');
      return false;
    }

    if (this.tipoAlcadaAprovacao === this.tipoAlcadaAprovacaoEnum.desmembrada) {
      if (!this.prePedidos[index].idCentroCusto) {
        this.toastr.warning('É obrigatório selecionar um centro de custo');
        return false;
      }
    }

    if (!this.prePedidos[index].idCondicaoPagamento) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.INVALID_ORDER_INVALID_PAYMENT_METHOD,
      );
      return false;
    }

    if (!this.prePedidos[index].idComprador) {
      this.toastr.warning('É obrigatório selecionar uma empresa');
      return false;
    }

    if (!this.prePedidos[index].idTipoPedido) {
      this.toastr.warning('É obrigatório selecionar um tipo de pedido');
      return false;
    }

    if (!this.prePedidos[index].idGrupoCompradores && (this.parametrosIntegracaoSapHabilitado || this.empresaCompradoraPossuiIntegracaoErp(this.prePedidos[index]))) {
      this.toastr.warning('É obrigatório selecionar um grupo de compradores');
      return false;
    }

    if (this.parametrosIntegracaoSapHabilitado && !this.empresaCompradoraPossuiIntegracaoErp(this.prePedidos[index])) {
      if (!this.prePedidos[index].idOrganizacaoCompra) {
        this.toastr.warning('É obrigatório selecionar uma organização de compras');
        return false;
      }

      if (!this.prePedidos[index].idIva) {
        this.toastr.warning('É obrigatório selecionar um IVA');
        return false;
      }
    }

    if (this.prePedidos[index].itens.findIndex((item) => item.quantidade > this.max) !== -1) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.INVALID_ORDER_EXCEEDS_MAX_QUANTITY,
      );
      return false;
    }

    if (
      this.prePedidos[index].fornecedor.faturamentoMinimo &&
      this.subTotalPrePedido(index) < this.prePedidos[index].fornecedor.faturamentoMinimo.valor
    ) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.INVALID_ORDER_MINIMUM_BILLING,
      );
      return false;
    }

    for (const pedidoItem of pedido.itens) {
      if (pedidoItem.entregaProgramada) {
        if (pedidoItem.datasDasEntregasProgramadas) {
          for (const entregaProgramada of pedidoItem.datasDasEntregasProgramadas) {
            if (!moment(entregaProgramada.dataEntrega).isSameOrAfter(moment(pedidoItem.minDataEntrega))) {
              this.toastr.warning(`Todas as datas de entrega devem ser superiores à data '${this.datePipe.transform(moment(pedidoItem.minDataEntrega).subtract(1, 'days'), 'dd/MM/yyyy')}'`);
              return false;
            }
          }
        }
      } else if (!pedidoItem.dataEntrega || !moment(pedidoItem.dataEntrega).isAfter(moment(pedidoItem.minDataEntrega).subtract(1, 'days'))) {
        let mensagemErro = `É obrigatório selecionar uma data de entrega posterior a ${this.datePipe.transform(
          moment(pedidoItem.minDataEntrega).subtract(1, 'days'),
          'dd/MM/yyyy',
        )} para o item \"`;

        mensagemErro += pedidoItem.produto.descricao + '" no pré-pedido.';

        this.toastr.warning(mensagemErro);

        return false;
      }

      if (this.parametrosIntegracaoSapHabilitado) {
        const camposObrigatorios: Array<string> = new Array<string>();
        if (this.origemMaterialObrigatorio && !pedidoItem.produto.idOrigemMaterial) {
          camposObrigatorios.push('Origem do Material');
        }
        if (this.utilizacaoMaterialObrigatorio && !pedidoItem.produto.idUtilizacaoMaterial) {
          camposObrigatorios.push('Utilização do Material');
        }
        if (this.categoriaMaterialObrigatorio && !pedidoItem.produto.idCategoriaMaterial) {
          camposObrigatorios.push('Categoria do Material');
        }

        if (camposObrigatorios.length) {
          let mensagemErro: string;
          if (camposObrigatorios.length > 1) {
            mensagemErro = `<p>O pedido não pode ser concluído pois os campos <span class="font-weight-bold">${camposObrigatorios.join(
              ', ',
            )}</span> são obrigatorios no cadastro do produto. Favor solicitar a revisão do cadastro do produto <span class="font-weight-bold">${pedidoItem.produto.descricao
              }</span><p>`;
          } else {
            // tslint:disable-next-line: max-line-length
            mensagemErro = `<p>O pedido não pode ser concluído pois o campo <span class="font-weight-bold">${camposObrigatorios[0]}</span> é obrigatorio no cadastro do produto. Favor solicitar a revisão do cadastro do produto <span class="font-weight-bold">${pedidoItem.produto.descricao}</span><p>`;
          }
          this.toastr.warning(mensagemErro, null, { enableHtml: true, timeOut: 15000 });
          return false;
        }
      }

      if (
        pedidoItem.itemSolicitacaoCompra &&
        pedidoItem.itemSolicitacaoCompra.situacao === SituacaoSolicitacaoItemCompra.Bloqueada
      ) {
        let mensagemErro = 'O pedido não pode ser concluído pois o item"';
        mensagemErro += pedidoItem.produto.descricao + '" está bloqueado ';
        this.toastr.warning(mensagemErro);
        return false;
      }
    }

    return true;
  }

  private obterParametrosIntegracaoSapHabilitado() {
    const usuarioAtual = this.authService.usuario();

    if (usuarioAtual.permissaoAtual.pessoaJuridica.integracaoSapHabilitada) {
      this.parametrosIntegracaoSapHabilitado =
        usuarioAtual.permissaoAtual.pessoaJuridica.parametrosIntegracaoSapHabilitado;

      if (this.parametrosIntegracaoSapHabilitado) {
        this.origemMaterialObrigatorio =
          usuarioAtual.permissaoAtual.pessoaJuridica.origemMaterialObrigatorio;
        this.utilizacaoMaterialObrigatorio =
          usuarioAtual.permissaoAtual.pessoaJuridica.utilizacaoMaterialObrigatorio;
        this.categoriaMaterialObrigatorio =
          usuarioAtual.permissaoAtual.pessoaJuridica.categoriaMaterialObrigatorio;
      }

      this.exibirFlagSapEm = usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEm;
      this.exibirFlagSapEmNaoAvaliada =
        usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEmNaoAvaliada;
      this.exibirFlagSapEntrFaturas =
        usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEntrFaturas;
      this.exibirFlagSapRevFatEm = usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapRevFatEm;
    }
  }

  private getIsFranchisedUser() {
    const currentPermission = this.authService.usuario().permissaoAtual;
    this.isFranchise = currentPermission.pessoaJuridica.franquia;
  }

  private removerItem(idPedido: number, idPedidoItem: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.excluirItem(idPedido, idPedidoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.tratarRemocaoItem(idPedido, idPedidoItem);
            ResumoCarrinhoComponent.atualizarCarrinho.next();
            this.atualizarCarrinho.emit();
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private removerItens(idPedido: number, itens: Array<PedidoItem>) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.excluirItens(idPedido, itens).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            itens.forEach((item) => { this.tratarRemocaoItem(idPedido, item.idPedidoItem); });
            ResumoCarrinhoComponent.atualizarCarrinho.next();
            this.atualizarCarrinho.emit();
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private tratarRemocaoItem(idPedido: number, idPedidoItem: number) {
    const prePedidoIndex = this.prePedidos.findIndex((prePedido) => prePedido.idPedido === idPedido);

    if (prePedidoIndex !== -1) {
      this.prePedidos[prePedidoIndex].itens = this.prePedidos[prePedidoIndex].itens.filter(
        (item) => item.idPedidoItem !== idPedidoItem,
      );

      if (!this.prePedidos[prePedidoIndex].itens.length) {
        this.removaPrePedido(prePedidoIndex);
      }
    }

  }

  private removaTodosOsPrePedidos(): void {
    this.prePedidos = new Array<Pedido>();
    this.processeInfraestruraDeEndereco();
  }

  private removaPrePedido(index: number): void {
    this.prePedidos.splice(index, 1);
    this.processeInfraestruraDeEndereco(index);
  }

  private processeInfraestruraDeEndereco(prePedidoIndex: number = null): void {
    const limpar: boolean = prePedidoIndex === null;
    const index: number = limpar ? 0 : prePedidoIndex;

    this.processeArrayDeInfraestruturaDeEndereco(this.enderecosUnicos, limpar, index);
    this.processeArrayDeInfraestruturaDeEndereco(this.enderecosSelecionados, limpar, index);
    this.processeArrayDeInfraestruturaDeEndereco(this.enderecosInputs$, limpar, index);
    this.processeArrayDeInfraestruturaDeEndereco(this.enderecosLoadings, limpar, index);
    this.processeArrayDeInfraestruturaDeEndereco(this.enderecos$, limpar, index);
  }

  private processeArrayDeInfraestruturaDeEndereco<TArray>(array: Array<TArray>, limpar: boolean, index: number): void {
    array.splice(index, limpar ? array.length : 1);
  }
}
