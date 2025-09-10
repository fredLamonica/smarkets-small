import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CentroCusto,
  CondicaoPagamento,
  Endereco,
  GrupoCompradores,
  ItemSolicitacaoCompra,
  Iva,
  Moeda,
  OrganizacaoCompra,
  OrigemPedido,
  Pedido,
  PedidoGeradoDto,
  PedidoItem,
  PessoaJuridica,
  Produto,
  SituacaoPedido,
  SituacaoPedidoItem,
  SituacaoSolicitacaoItemCompra,
  SolicitacaoCompra,
  TipoAprovacao,
  TipoEndereco,
  TipoFrete,
  TipoPedido,
  TipoRequisicao,
  Usuario
} from '@shared/models';
import {
  AutenticacaoService,
  CentroCustoService,
  CondicaoPagamentoService,
  EnderecoService,
  FornecedorService,
  GrupoCompradoresService,
  IvaService,
  MaskService,
  OrganizacaoCompraService,
  PessoaJuridicaService,
  ProdutoService,
  SolicitacaoCompraService,
  TipoPedidoService,
  TipoRequisicaoService,
  TranslationLibraryService
} from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Alcada } from '../../../shared/models/alcada';
import { TipoAlcadaAprovacao } from '../../../shared/models/enums/tipo-alcada-aprovacao';
import { AlcadaService } from '../../../shared/providers/alcada.service';

@Component({
  selector: 'app-manter-pedido-regularizacao',
  templateUrl: './manter-pedido-regularizacao.component.html',
  styleUrls: ['./manter-pedido-regularizacao.component.scss'],
})
export class ManterPedidoRegularizacaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  Frete = TipoFrete;
  TipoEndereco = TipoEndereco;

  @Input() solicitacaoCompra: SolicitacaoCompra;
  @Input() codigosProdutos: string[];

  idSolicitacaoCompra: number;
  itensSolicitacaoCompra: Array<ItemSolicitacaoCompra>;
  idUsuarioRequisitante: number;
  pedidos: Array<Pedido>;

  parametrosIntegracaoSapHabilitado: boolean;
  exibirFlagSapEm: boolean = false;
  exibirFlagSapEmNaoAvaliada: boolean = false;
  exibirFlagSapEntrFaturas: boolean = false;
  exibirFlagSapRevFatEm: boolean = false;

  max: 999999999.9999;
  min: 0.0001;

  centrosCusto: Array<CentroCusto>;
  gruposCompradores: Array<GrupoCompradores>;
  organizacoesCompras: Array<OrganizacaoCompra>;
  tiposRequisicao: Array<TipoRequisicao>;
  usuarioAtual: Usuario;
  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;

  TipoFrete = TipoFrete;

  moedaKeys = [];

  centroCustoDefault: CentroCusto;
  centrosCusto$: Observable<Array<CentroCusto>>;
  alcadas$: Observable<Array<Alcada>>;
  centrosCustoLoading = false;
  alcadasLoading = false;

  condicoesPagamento$: Observable<Array<CondicaoPagamento>>;
  condicoesPagamentoLoading = false;

  tiposPedido$: Observable<Array<TipoPedido>>;
  tiposPedido: Array<TipoPedido>;
  tiposPedidoLoading = false;

  enderecos$: Observable<Array<Endereco>>;
  enderecos: Array<Endereco>;
  enderecosLoading: boolean;

  ivas$: Observable<Array<Iva>>;
  ivasLoading = false;

  gruposCompradores$: Observable<Array<GrupoCompradores>>;
  gruposCompradoresLoading = false;

  organizacoesCompras$: Observable<Array<OrganizacaoCompra>>;
  organizacoesComprasLoading = false;

  filiais$: Observable<Array<PessoaJuridica>>;
  filiais: Array<PessoaJuridica>;
  filiaisLoading: boolean;

  fornecedores: Array<PessoaJuridica>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private centroCustoService: CentroCustoService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private tipoPedidoService: TipoPedidoService,
    private enderecoService: EnderecoService,
    private authService: AutenticacaoService,
    private grupoCompradoresService: GrupoCompradoresService,
    private organizacaoCompraService: OrganizacaoCompraService,
    private ivaService: IvaService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private fornecedoresService: FornecedorService,
    private tipoRequisicaoService: TipoRequisicaoService,
    private maskService: MaskService,
    private alcadaService: AlcadaService,
    private produtoService: ProdutoService,
    private errorService: ErrorService,
  ) {
    this.moedaKeys = Object.keys(Moeda).filter((type) => isNaN(<any>type) && type !== 'values');
  }

  async ngOnInit() {
    this.obterParametrosIntegracaoSapHabilitado();
    await this.obterListas();
    this.obtenhaProdutosPorCodigo();
    this.instanciarPedidos();
    this.subListas();
    this.usuarioAtual = this.authService.usuario();
    this.tipoAlcadaAprovacao = this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao;
  }

  obtemValorTotal(pedidoItem: PedidoItem) {
    const valorCorrigido = this.maskService.maskedValueToNumber(pedidoItem.valor);
    const quantidadeCorrigido = this.maskService.maskedValueToNumber(pedidoItem.quantidade);
    const valorTotal = valorCorrigido * quantidadeCorrigido;

    pedidoItem.valorLiquido = valorTotal;
    pedidoItem.valorBruto = valorTotal;

    return valorTotal;
  }

  //#region Listas Complementares

  async subListas() {
    this.subFornecedores();
    this.subFiliais();
    // this.subEnderecos();
    const idPessoa = this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoa;
    this.enderecos = await this.enderecoService
      .listar(idPessoa).pipe(
        map((enderecos) => enderecos.filter((t) => t.tipo === TipoEndereco.Entrega)))
      .toPromise();
    this.subEnderecos();
    this.subCentrosCusto();
    this.subTiposPedido();
    this.subAlcadas();

    if (this.parametrosIntegracaoSapHabilitado) {
      this.subGruposCompradores();
      this.subOrganizacoesCompras();
    }
  }

  openCondicoesPagamento() {
    if (!this.condicoesPagamento$) {
      this.subCondicoesPagamento();
    }
  }

  openIvas() {
    if (!this.ivas$) {
      this.subIvas();
    }
  }

  confirmar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pedidos.forEach((pedido) => {
      // Validando info de propriedades SAP
      if (!this.exibirFlagSapEm) {
        pedido.itens.forEach((item) => (item.sapEm = null));
      }

      if (!this.exibirFlagSapEmNaoAvaliada) {
        pedido.itens.forEach((item) => (item.sapEmNaoAvaliada = null));
      }

      if (!this.exibirFlagSapEntrFaturas) {
        pedido.itens.forEach((item) => (item.sapEntrFaturas = null));
      }

      if (!this.exibirFlagSapRevFatEm) {
        pedido.itens.forEach((item) => (item.sapRevFatEm = null));
      }

      pedido.fornecedor = this.fornecedores.find(
        (fornecedor) => fornecedor.idPessoaJuridica === pedido.idFornecedor,
      );

      pedido.itens.forEach((item) => {
        item.frete = pedido.frete;
        item.idFornecedor = pedido.idFornecedor;
      });
    });

    if (this.pedidosValidos()) {
      this.solicitacaoCompraService
        .gerarPedidosSemNegociacao(this.idSolicitacaoCompra, this.pedidos)
        .subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.itensSolicitacaoCompra.forEach((item) => {
              item.situacao = SituacaoSolicitacaoItemCompra.Concluida;
            });
            this.blockUI.stop();
            this.activeModal.close(response);
          },
          (error) => {
            this.confirmarPedidosErrorHandler(error);
          },
        );
    } else {
      this.blockUI.stop();
    }
  }

  pedidosValidos(): boolean {
    for (const pedido of this.pedidos) {
      if (!this.isPedidoValido(pedido)) { return false; }
    }

    return true;
  }

  subTotalPedido(pedido): number {
    let subTotal = 0;

    pedido.itens.forEach((item) => {
      subTotal +=
        this.maskService.maskedValueToNumber(item.quantidade) *
        this.maskService.maskedValueToNumber(item.valor);
    });
    return subTotal;
  }

  fechar() {
    this.activeModal.close();
  }

  async changedValueFilial(idPessoaJuridica: number) {
    const idPessoaComprador = this.filiais.find((x) => x.idPessoaJuridica === idPessoaJuridica).idPessoa;
    this.enderecos = await this.enderecoService
      .listar(idPessoaComprador).pipe(
        map((enderecos) => enderecos.filter((t) => t.tipo === TipoEndereco.Entrega)))
      .toPromise();
    // this.enderecos$ = Observable.of(this.enderecos.filter(t=> t.tipo === TipoEndereco.Entrega).filter(f => f.idPessoa === idPessoaComprador));
    this.preLoadEndereco();
  }

  mudarMoeda(event, pedido) {
    pedido.moeda = (<any>Moeda)[event];
    pedido.itens.map((p) => (p.moeda = (<any>Moeda)[event]));
  }

  private async obterListas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.centrosCusto = await this.centroCustoService.listarAtivos().toPromise();
      this.gruposCompradores = await this.grupoCompradoresService.listar().toPromise();
      this.organizacoesCompras = await this.organizacaoCompraService.listar().toPromise();
      this.tiposPedido = await this.tipoPedidoService.listar().toPromise();
      this.tiposRequisicao = await this.tipoRequisicaoService.obterTodos().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  private obterParametrosIntegracaoSapHabilitado() {
    const usuarioAtual = this.authService.usuario();

    if (usuarioAtual.permissaoAtual.pessoaJuridica.integracaoSapHabilitada) {
      this.parametrosIntegracaoSapHabilitado =
        usuarioAtual.permissaoAtual.pessoaJuridica.parametrosIntegracaoSapHabilitado;
      this.exibirFlagSapEm = usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEm;
      this.exibirFlagSapEmNaoAvaliada =
        usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEmNaoAvaliada;
      this.exibirFlagSapEntrFaturas =
        usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEntrFaturas;
      this.exibirFlagSapRevFatEm = usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapRevFatEm;
    }
  }

  private subCentrosCusto() {
    this.centrosCustoLoading = true;
    this.centrosCusto$ = this.centroCustoService.listarAtivos().pipe(
      catchError(() => of([])),
      tap(() => (this.centrosCustoLoading = false)),
      shareReplay(),
    );
  }

  private subAlcadas() {
    this.alcadasLoading = true;
    this.alcadas$ = this.alcadaService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.alcadasLoading = false)),
      shareReplay(),
    );
  }

  private subCondicoesPagamento() {
    this.condicoesPagamentoLoading = true;
    this.condicoesPagamento$ = this.condicaoPagamentoService.listarAtivos().pipe(
      catchError(() => of([])),
      tap(() => (this.condicoesPagamentoLoading = false)),
      shareReplay(),
    );
  }

  private subTiposPedido() {
    this.tiposPedidoLoading = true;
    this.tiposPedido$ = this.tipoPedidoService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.tiposPedidoLoading = false)),
      shareReplay(),
    );
  }

  private subEnderecos() {
    this.enderecosLoading = true;
    const idPessoa = this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoa;
    this.enderecos$ = this.enderecoService
      .listarFiliais(idPessoa)
      .pipe(
        catchError(() => of([])),
        tap((enderecos) => {
          this.enderecos = enderecos;
          this.enderecosLoading = false;
        }),
        shareReplay(),
      ).pipe(
        map((enderecos) => enderecos.filter((t) => t.tipo === TipoEndereco.Entrega)));
  }

  private preLoadEndereco() {
    if (this.enderecos && this.enderecos.length) {
      if (this.filiais && this.filiais.length) {
        if (this.pedidos && this.pedidos.length) {
          this.pedidos.forEach((pedido) => {
            if (pedido.idComprador) {
              pedido.itens.forEach((item) => {
                const filial = this.filiais.find(
                  (filialCorrente) => filialCorrente.idPessoaJuridica === pedido.idComprador,
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
              });
            }
          });
        }
      }
    }
  }

  private subIvas() {
    this.ivasLoading = true;
    this.ivas$ = this.ivaService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.ivasLoading = false)),
      shareReplay(),
    );
  }

  private subGruposCompradores() {
    this.gruposCompradoresLoading = true;
    this.gruposCompradores$ = this.grupoCompradoresService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.gruposCompradoresLoading = false)),
      shareReplay(),
    );
  }

  private subOrganizacoesCompras() {
    this.organizacoesComprasLoading = true;
    this.organizacoesCompras$ = this.organizacaoCompraService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.organizacoesComprasLoading = false)),
      shareReplay(),
    );
  }

  private subFiliais() {
    this.filiaisLoading = true;
    this.filiais$ = this.pessoaJuridicaService.ObterFiliais().pipe(
      catchError(() => of([])),
      tap((filiais) => {
        this.filiais = filiais;
        this.preLoadFilial();
        this.filiaisLoading = false;
      }),
      shareReplay(),
    );
  }

  private preLoadFilial() {
    if (this.filiais && this.filiais.length) {
      if (this.pedidos && this.pedidos.length) {
        const usuario = this.authService.usuario();
        this.pedidos.forEach((pedido) => {
          if (pedido.itens && pedido.itens.length) {
            if (pedido.itens[0].itemSolicitacaoCompra.pessoaJuridica) {
              const filial = this.filiais.find(
                (f) =>
                  f.idPessoaJuridica ===
                  pedido.itens[0].itemSolicitacaoCompra.pessoaJuridica.idPessoaJuridica,
              );
              if (filial) {
                pedido.idComprador = filial.idPessoaJuridica;
                this.changedValueFilial(pedido.idComprador);
              }
            } else {
              pedido.idComprador = usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica;
              this.changedValueFilial(pedido.idComprador);
            }
          }
        });
        this.preLoadEndereco();
      }
    }
  }

  private subFornecedores() {
    this.fornecedoresService.obterEmpresasFornecedorasPorRazaoSocial('').subscribe((response) => {
      this.fornecedores = response;
      this.preLoadFornecedor();
    });
  }

  private obtenhaProdutosPorCodigo(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.obtenhaProdutosPorCodigo(this.codigosProdutos)
      .subscribe(
        (response) => {
          this.PopuleProdutos(response);
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        }
      )
  }

  private PopuleProdutos(produtos: Produto[]){
    this.pedidos.forEach(pedido =>
        pedido.itens.forEach(item => (
           item.produto = produtos.length > 0 ? produtos.filter( x => x.codigo === item.itemSolicitacaoCompra.codigoProduto)[0] : null,
           item.idProduto = produtos.length > 0 ? produtos.filter( x => x.codigo === item.itemSolicitacaoCompra.codigoProduto)[0].idProduto : null
        )
      )
    )
  }

  private preLoadFornecedor() {
    if (this.fornecedores && this.fornecedores.length) {
      if (this.pedidos && this.pedidos.length) {
        this.pedidos.forEach((pedido) => {
          if (pedido.itens && pedido.itens.length) {
            if (
              pedido.itens[0].itemSolicitacaoCompra.fornecedorFixo &&
              !pedido.itens[0].itemSolicitacaoCompra.fornecedorFixo.trim() != null
            ) {
              const fornecedor = this.fornecedores.find(
                (f) => f.codigoPessoa === pedido.itens[0].itemSolicitacaoCompra.fornecedorFixo,
              );
              if (fornecedor) {
                pedido.idFornecedor = fornecedor.idPessoaJuridica;
              }
            }
          }
        });
      }
    }
  }

  // #endregion

  private instanciarPedidos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const gruposItensSolicitacaoCompraPedidos = Array<any>();

    // Dividir itens da solicitação de compra por codigoFilialEmpresa e FornecedorFixo, cada grupo de itens será um pedido
    this.itensSolicitacaoCompra.forEach((itemSolicitacaoCompra) => {
      const index = gruposItensSolicitacaoCompraPedidos.findIndex(
        (grp) =>
          grp['codigoFilialEmpresa'] === itemSolicitacaoCompra.codigoFilialEmpresa &&
          grp['fornecedorFixo'] === itemSolicitacaoCompra.fornecedorFixo,
      );
      if (index !== -1) {
        gruposItensSolicitacaoCompraPedidos[index]['itens'].push(itemSolicitacaoCompra);
      } else {
        gruposItensSolicitacaoCompraPedidos.push({
          codigoFilialEmpresa: itemSolicitacaoCompra.codigoFilialEmpresa,
          fornecedorFixo: itemSolicitacaoCompra.fornecedorFixo,
          itens: [itemSolicitacaoCompra],
        });
      }
    });

    // Utilizamos cada item para instanciar um pedido
    if (gruposItensSolicitacaoCompraPedidos && gruposItensSolicitacaoCompraPedidos.length) {
      gruposItensSolicitacaoCompraPedidos.forEach((grupoItensSolicitacaoCompra) => {
        this.instanciarPedido(grupoItensSolicitacaoCompra);
      });
    }
    this.blockUI.stop();
  }

  private instanciarPedido(grupoItensSolicitacaoCompra: any) {
    const usuario = this.authService.usuario();

    const pedido: Pedido = new Pedido();
    pedido.idPedido = 0;
    pedido.idUsuario = usuario.idUsuario;
    pedido.idTenant = usuario.permissaoAtual.idTenant;
    pedido.situacao = SituacaoPedido['Pré-pedido'];
    pedido.idFornecedor = null;

    if (this.parametrosIntegracaoSapHabilitado) {
      const grpDefault = this.gruposCompradores.find((grp) => grp.codigoDefault);
      if (grpDefault) { pedido.idGrupoCompradores = grpDefault.idGrupoCompradores; }

      const orgDefault = this.organizacoesCompras.find((org) => org.codigoDefault);
      if (orgDefault) { pedido.idOrganizacaoCompra = orgDefault.idOrganizacaoCompra; }
    }

    const tipoPedidoDefault = Array<TipoPedido>();
    this.tiposPedido.forEach((tipoPedido) => {
      if (tipoPedido.tiposRequisicao && this.solicitacaoCompra.tipoRequisicao) {
        const tipoPedidoRequisicoes = tipoPedido.tiposRequisicao.filter(
          (p) => p.idTipoRequisicao === this.solicitacaoCompra.tipoRequisicao.idTipoRequisicao,
        );
        if (tipoPedidoRequisicoes.length > 0) { tipoPedidoDefault.push(tipoPedido); }
      }
    });

    if (tipoPedidoDefault.length === 1) { pedido.idTipoPedido = tipoPedidoDefault[0].idTipoPedido; }

    this.subFiliais();

    pedido.frete = TipoFrete.Cif;
    pedido.origemPedido = OrigemPedido['Sem Negociação'];

    pedido.itens = new Array<PedidoItem>();
    grupoItensSolicitacaoCompra['itens'].forEach((itemSolicitacaoCompra) => {
      let pedidoItem;

      if (itemSolicitacaoCompra.tipoItem === '9') {
        itemSolicitacaoCompra.subItens.forEach((subItemSolicitacaoCompra) => {
          pedidoItem = new PedidoItem(
            0,
            '',
            0,
            0,
            0,
            null,
            null,
            subItemSolicitacaoCompra.quantidade,
            null,
            null,
            SituacaoPedidoItem.Ativo,
            null,
            subItemSolicitacaoCompra.valorReferencia,
            subItemSolicitacaoCompra.valorReferencia,
            subItemSolicitacaoCompra.valorReferencia * subItemSolicitacaoCompra.quantidade,
            Moeda.Real,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            itemSolicitacaoCompra.idItemSolicitacaoCompra,
            subItemSolicitacaoCompra.idSubItemSolicitacaoCompra,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          );

          pedidoItem.descricao = subItemSolicitacaoCompra.nomeServico;

          if (
            subItemSolicitacaoCompra.valorReferencia !== null &&
            subItemSolicitacaoCompra.valorReferencia !== undefined
          ) {
            pedidoItem.valor = subItemSolicitacaoCompra.valorReferencia;
          } else if (
            subItemSolicitacaoCompra.precoBruto !== null &&
            subItemSolicitacaoCompra.precoBruto !== undefined
          ) {
            pedidoItem.valor = subItemSolicitacaoCompra.precoBruto;
          } else if (
            subItemSolicitacaoCompra.precoLiquido !== null &&
            subItemSolicitacaoCompra.precoLiquido !== undefined
          ) {
            pedidoItem.valor = subItemSolicitacaoCompra.precoLiquido;
          } else {
            pedidoItem.valor = 0;
          }

          if (
            subItemSolicitacaoCompra.precoBruto !== null &&
            subItemSolicitacaoCompra.precoBruto !== undefined
          ) {
            pedidoItem.precoBruto = subItemSolicitacaoCompra.precoBruto;
          }

          if (
            subItemSolicitacaoCompra.precoLiquido !== null &&
            subItemSolicitacaoCompra.precoLiquido !== undefined
          ) {
            pedidoItem.precoLiquido = subItemSolicitacaoCompra.precoLiquido;
          }

          pedidoItem.itemSolicitacaoCompra = itemSolicitacaoCompra;

          pedidoItem.valorFrete = 0.0;

          pedidoItem.idUsuarioSolicitante = this.idUsuarioRequisitante;

          // Inicializando Propriedades SAP
          if (this.exibirFlagSapEm) { pedidoItem.sapEm = false; }

          if (this.exibirFlagSapEmNaoAvaliada) { pedidoItem.sapEmNaoAvaliada = false; }

          if (this.exibirFlagSapEntrFaturas) { pedidoItem.sapEntrFaturas = false; }

          if (this.exibirFlagSapRevFatEm) { pedidoItem.sapRevFatEm = false; }

          pedido.itens.push(pedidoItem);
        });
      } else {
        pedidoItem = new PedidoItem(
          0,
          '',
          0,
          0,
          0,
          null,
          null,
          itemSolicitacaoCompra.quantidade,
          null,
          null,
          SituacaoPedidoItem.Ativo,
          null,
          itemSolicitacaoCompra.valorReferencia,
          itemSolicitacaoCompra.valorReferencia,
          itemSolicitacaoCompra.valorReferencia * itemSolicitacaoCompra.quantidade,
          Moeda.Real,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          itemSolicitacaoCompra.idItemSolicitacaoCompra,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        );

        pedidoItem.descricao = itemSolicitacaoCompra.nomeProduto;
        pedidoItem.itemSolicitacaoCompra = itemSolicitacaoCompra;

        pedidoItem.valorFrete = 0.0;

        pedidoItem.idUsuarioSolicitante = this.idUsuarioRequisitante;

        // Inicializando Propriedades SAP
        if (this.exibirFlagSapEm) { pedidoItem.sapEm = false; }

        if (this.exibirFlagSapEmNaoAvaliada) { pedidoItem.sapEmNaoAvaliada = false; }

        if (this.exibirFlagSapEntrFaturas) { pedidoItem.sapEntrFaturas = false; }

        if (this.exibirFlagSapRevFatEm) { pedidoItem.sapRevFatEm = false; }

        pedido.itens.push(pedidoItem);
      }
    });

    const ccDefault = this.centrosCusto.find((cc) => cc.codigoDefault);
    pedido.itens.forEach((pedidoItem) => {
      if (ccDefault) {
        pedidoItem.idCentroCusto = ccDefault.idCentroCusto;
      }
    });

    if (!this.pedidos) {
      this.pedidos = new Array<Pedido>();
    }

    pedido.moeda = Moeda.Real;

    if (pedido.itens.length > 0) {
      pedido.moeda = pedido.itens[0].moeda;
    }

    this.pedidos.push(pedido);
  }

  private confirmarPedidosErrorHandler(error: any) {
    if (error && error.status === 400) {
      const pedidosGeradosDto: Array<PedidoGeradoDto> = error.error;
      if (pedidosGeradosDto && pedidosGeradosDto) {
        pedidosGeradosDto.forEach((pg) => {
          const descricaoPedido = pg.pedido.fornecedor.nomeFantasia
            ? pg.pedido.fornecedor.nomeFantasia
            : pg.pedido.fornecedor.razaoSocial + -+pg.pedido.fornecedor.cnpj;

          switch (pg.status) {
            case 'Pedido inválido': {
              this.toastr.warning(
                `Pedido ao fornecedor ${descricaoPedido} ${this.translationLibrary.translations.ALERTS.INVALID_ORDER_MARKETPLACE}`,
                null,
                { timeOut: 10000 },
              );
              break;
            }
            case 'Pedido inapto à aprovação': {
              const usuario = this.authService.usuario();
              switch (usuario.permissaoAtual.pessoaJuridica.tipoAprovacao) {
                case TipoAprovacao.Departamento:
                  this.toastr.warning(
                    `Pedido ao fornecedor ${descricaoPedido} ${this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_DEPARTMENT}`,
                    null,
                    { timeOut: 10000 },
                  );
                  break;
                case TipoAprovacao.CentroCusto:
                  this.toastr.warning(
                    `Pedido ao fornecedor ${descricaoPedido} ${this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_COST_CENTER}`,
                    null,
                    { timeOut: 10000 },
                  );
                  break;
                default:
                  this.toastr.warning(
                    `Pedido ao fornecedor ${descricaoPedido} ${this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_APPROVAL_TYPE}`,
                    null,
                    { timeOut: 10000 },
                  );
                  break;
              }
              break;
            }
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
            default: {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              break;
            }
          }
        });
      } else {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    } else if (error && error.status === 500) {
      const pedidosGeradosDto: Array<PedidoGeradoDto> = error.error;
      if (pedidosGeradosDto && pedidosGeradosDto.length) {
        pedidosGeradosDto.forEach((pg) => {
          const descricaoPedido = pg.pedido.fornecedor.nomeFantasia
            ? pg.pedido.fornecedor.nomeFantasia
            : pg.pedido.fornecedor.razaoSocial + -+pg.pedido.fornecedor.cnpj;
          if (pg.status === 'Erro Inesperado') {
            this.toastr.warning(
              `${this.translationLibrary.translations.ALERTS.INVALID_ORDER_DELETED_ALL}`,
              null,
              { timeOut: 10000 },
            );
          }
        });
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }

    this.blockUI.stop();
  }

  private isPedidoValido(pedido: Pedido): boolean {
    if (!pedido.idFornecedor) {
      this.toastr.warning(`É obrigatório selecionar um fornecedor para o pedido`);
      return false;
    }

    const descricaoPedido = pedido.fornecedor.nomeFantasia
      ? pedido.fornecedor.nomeFantasia
      : pedido.fornecedor.razaoSocial + ' - ' + pedido.fornecedor.cnpj;

    if (!pedido.idCondicaoPagamento) {
      this.toastr.warning(
        `É obrigatório selecionar uma condição de pagamento para o pedido ao fornecedor ${descricaoPedido}`,
      );
      return false;
    }

    if (!pedido.idTipoPedido) {
      this.toastr.warning(
        `É obrigatório selecionar um tipo de pedido para o pedido ao fornecedor ${descricaoPedido}`,
      );
      return false;
    }

    if (this.parametrosIntegracaoSapHabilitado) {
      if (!pedido.idGrupoCompradores) {
        this.toastr.warning(
          `É obrigatório selecionar um grupo de compradores para o pedido ao fornecedor ${descricaoPedido}`,
        );
        return false;
      }

      if (!pedido.idOrganizacaoCompra) {
        this.toastr.warning(
          `É obrigatório selecionar uma organização de compras para o pedido ao fornecedor ${descricaoPedido}`,
        );
        return false;
      }
    }

    if (!pedido.frete) {
      this.toastr.warning(
        `É obrigatório selecionar o incoterms para o pedido ao fornecedor ${descricaoPedido}`,
      );
      return false;
    }

    if (pedido.itens.findIndex((item) => item.quantidade > this.max) !== -1) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.INVALID_ORDER_EXCEEDS_MAX_QUANTITY,
      );
      return false;
    }

    if (
      pedido.fornecedor.faturamentoMinimo &&
      this.subTotalPedido(pedido) < pedido.fornecedor.faturamentoMinimo.valor
    ) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.INVALID_ORDER_MINIMUM_BILLING,
      );
      return false;
    }

    for (const pedidoItem of pedido.itens) {
      if (!pedidoItem.idEnderecoEntrega) {
        let mensagemErro = 'É obrigatório selecionar um endereço de entrega para o item "';
        mensagemErro += pedidoItem.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!pedidoItem.idCentroCusto) {
        let mensagemErro = 'É obrigatório selecionar um centro de custo no item "';
        mensagemErro += pedidoItem.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (this.parametrosIntegracaoSapHabilitado && !pedidoItem.idIva) {
        let mensagemErro = 'É obrigatório selecionar um IVA no item "';
        mensagemErro += pedidoItem.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!pedidoItem.prazoEntrega) {
        let mensagemErro = `É obrigatório especificar um prazo de entrega para o item \"`;
        mensagemErro += pedidoItem.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!pedidoItem.quantidade || pedidoItem.quantidade < this.min) {
        let mensagemErro = 'A quantidade do item "';
        mensagemErro += pedidoItem.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        mensagemErro += pedido.idPedido + '" não pode ser menor que ';
        mensagemErro += this.min;
        mensagemErro += ' e não pode estar em branco.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!pedidoItem.idProduto) {
        let mensagemErro = 'É obrigatório realizar o vínculo a um produto no item "';
        mensagemErro += pedidoItem.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        this.toastr.warning(mensagemErro);
        return false;
      }
    }

    return true;
  }
}
