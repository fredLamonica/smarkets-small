
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import {
  CentroCusto, CondicaoPagamento, ContaContabil, CotacaoItem, CotacaoRodadaProposta, Endereco, GrupoCompradores, Iva, Marca, OrganizacaoCompra, Pedido,
  PedidoGeradoDto, PedidoItem, PessoaJuridica, SituacaoPedido, SituacaoPedidoItem, TipoAprovacao, TipoEndereco, TipoFrete, TipoPedido, Usuario
} from '@shared/models';
import { Transportadora } from '@shared/models/transportadora';
import {
  AutenticacaoService, CentroCustoService,
  CondicaoPagamentoService, ContaContabilService, CotacaoService, EnderecoService, GrupoCompradoresService, IvaService,
  MarcaService, OrganizacaoCompraService, PessoaJuridicaService, TipoPedidoService, TranslationLibraryService
} from '@shared/providers';
import { ConfiguracoesEmpresaService } from '@shared/utils/configuracoes-empresa.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { map, takeUntil } from 'rxjs/operators';
import { ManterEntregasProgramadasComponent } from '../../../shared/components/manter-entregas-programadas/manter-entregas-programadas.component';
import { Alcada } from '../../../shared/models/alcada';
import { ConfiguracaoDeModuloIntegracao } from '../../../shared/models/configuracao-de-modulo-integracao';
import { ConfiguracoesEntregasProgramadas } from '../../../shared/models/configuracoes-entregas-programadas';
import { ModoModal } from '../../../shared/models/enums/modo-modal.enum';
import { OrigemProgramacaoDeEntrega } from '../../../shared/models/enums/origem-programacao-de-entrega.enum';
import { TipoAlcadaAprovacao } from '../../../shared/models/enums/tipo-alcada-aprovacao';
import { AlcadaService } from '../../../shared/providers/alcada.service';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  selector: 'app-manter-cotacao-pedido',
  templateUrl: './manter-cotacao-pedido.component.html',
  styleUrls: ['./manter-cotacao-pedido.component.scss'],
})
export class ManterCotacaoPedidoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  Frete = TipoFrete;
  TipoEndereco = TipoEndereco;

  pessoaJuridicaCliente: PessoaJuridica;
  idCotacao: number;
  itens: Array<CotacaoItem>;
  pedidos: Array<Pedido> = new Array<Pedido>();

  usuarioAtual: Usuario;

  centrosCusto: Array<CentroCusto>;
  contasContabil: Array<ContaContabil>;

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;
  alcadas: Alcada[];
  alcadasLoading: boolean;

  condicoesPagamento: Array<CondicaoPagamento>;
  marcas: Array<Marca>;
  tiposPedido: Array<TipoPedido>;
  enderecos: Array<Endereco>;
  ivas: Array<Iva>;
  gruposCompradores: Array<GrupoCompradores>;
  organizacoesCompras: Array<OrganizacaoCompra>;
  filiais: Array<PessoaJuridica>;

  parametrosIntegracaoSapHabilitado: boolean = false;
  exibirFlagSapEm: boolean = false;
  exibirFlagSapEmNaoAvaliada: boolean = false;
  exibirFlagSapEntrFaturas: boolean = false;
  exibirFlagSapRevFatEm: boolean = false;

  origemMaterialObrigatorio: boolean;
  utilizacaoMaterialObrigatorio: boolean;
  categoriaMaterialObrigatorio: boolean;

  maxQuant: 999999999;

  idTransportadora: number;
  transportadora: Transportadora;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private centroCustoService: CentroCustoService,
    private contaContabilService: ContaContabilService,
    private alcadaService: AlcadaService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private tipoPedidoService: TipoPedidoService,
    private enderecoService: EnderecoService,
    private authService: AutenticacaoService,
    private grupoCompradoresService: GrupoCompradoresService,
    private organizacaoCompraService: OrganizacaoCompraService,
    private ivaService: IvaService,
    private marcaService: MarcaService,
    private cotacaoService: CotacaoService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private configuracoesEmpresaService: ConfiguracoesEmpresaService,
    private modalService: NgbModal,
    private errorService: ErrorService,
  ) {
    super();
  }

  async ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
    this.obterParametrosIntegracaoSapHabilitado();
    this.obterAlcadas();
    await this.obterListas();
    this.montarPedidos();
    this.obterTipoAlcadaAprovacao();
  }

  subTotalPedido(pedido: Pedido): number {
    const valores = pedido.itens.map((item) => {
      return item.quantidade * item.valor;
    });
    if (valores && valores.length) { return valores.reduce((prev, cur) => prev + cur, 0); } else { return 0; }
  }

  pedidosValidos(): boolean {
    for (const pedido of this.pedidos) {
      if (!this.isPedidoValido(pedido)) { return false; }
    }

    return true;
  }

  fechar() {
    this.activeModal.close();
  }

  confirmar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.pedidosValidos()) {
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

        pedido.itens.forEach((item) => (item.frete = pedido.frete));

        pedido.itens.forEach((item) => (item.embalagemEmbarque = item.embalagemEmbarque));
      });

      this.cotacaoService.gerarPedidos(this.idCotacao, this.pedidos).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.activeModal.close(response);
          },
          (error) => {
            this.errorService.treatError(error);
            this.confirmarPedidosErrorHandler(error);
          },
        );
    } else {
      this.blockUI.stop();
    }
  }

  visualizeEntregasProgramadas(pedidoItem: PedidoItem) {
    const modalRef = this.modalService.open(ManterEntregasProgramadasComponent, { centered: true, size: 'lg' });

    const tituloModal = pedidoItem.descricao
      ? pedidoItem.descricao
      : pedidoItem.produto.descricao;

    const config = new ConfiguracoesEntregasProgramadas({
      origem: OrigemProgramacaoDeEntrega.requisicao,
      idItem: pedidoItem.idRequisicaoItem,
      modoModal: ModoModal.normal,
      tituloModal: tituloModal,
      valorPropostaFornecedor: pedidoItem.valor,
    });

    modalRef.componentInstance.config = config;
  }

  showEntregasProgramadas(pedidoItem: PedidoItem) {
    const cotacaoItem = this.itens.find((i) => i.idRequisicaoItem === pedidoItem.idRequisicaoItem);
    return cotacaoItem.requisicaoItem.entregaProgramada;
  }

  async changedValueFilial(idPessoaJuridica: number) {
    this.carregarEnderecos(idPessoaJuridica);
    this.preLoadEndereco();
  }

  async changedValueCentroCusto(pedido: Pedido) {
    pedido.itens.forEach((item) => (item.idCentroCusto = pedido.idCentroCusto));
  }

  async changedValueContaContabil(pedido: Pedido) {
    pedido.itens.forEach((item) => (item.idContaContabil = pedido.idContaContabil));
  }

  changedValueAlcada(pedido: Pedido) {
    pedido.itens.forEach((item) => (item.idAlcada = pedido.idAlcada));
  }

  async changedValueEndereco(pedido: Pedido, itemPedido: PedidoItem) {
    pedido.itens.forEach((item) => (item.idEnderecoEntrega = itemPedido.idEnderecoEntrega));
    pedido.idEnderecoEntrega = itemPedido.idEnderecoEntrega;
  }

  OnQuantidadeChange(valor: string, pedidoIndex: number, itemIndex: number) {
    if (valor && valor.toString().includes(',')) {
      this.pedidos[pedidoIndex].itens[itemIndex].quantidade = Number(
        valor.toString().replace(/\./g, '').replace(',', '.'),
      );
    }
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

  private async obterListas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.condicoesPagamento = await this.condicaoPagamentoService.listarAtivos().toPromise();
      this.centrosCusto = await this.centroCustoService.listarAtivos().toPromise();
      this.contasContabil = await this.contaContabilService.listar().toPromise();
      this.ivas = await this.ivaService.listar().toPromise();
      this.gruposCompradores = await this.grupoCompradoresService.listar().toPromise();
      this.organizacoesCompras = await this.organizacaoCompraService.listar().toPromise();
      this.tiposPedido = await this.tipoPedidoService.listar().toPromise();
      this.marcas = await this.marcaService.listar().toPromise();

      this.enderecos = await this.enderecoService
        .listar(this.usuarioAtual.permissaoAtual.pessoaJuridica.idPessoa).pipe(
          map((enderecos) => enderecos.filter((t) => t.tipo === TipoEndereco.Entrega)))
        .toPromise();

      this.filiais = await this.pessoaJuridicaService.ObterFiliais().toPromise();

      // let idTransportadora = this.itens[0].propostasVencedoras[0].idTransportadora;
      // if (idTransportadora != 0) {
      //   this.idTransportadora = idTransportadora;
      //   this.transportadora = await this.transportadoraService
      //     .obterPorId(this.idTransportadora)
      //     .toPromise();
      // }
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  private obterAlcadas() {
    this.alcadasLoading = true;

    this.alcadaService.listar().pipe(
      takeUntil(this.unsubscribe))
      .subscribe((alcadas) => {
        if (alcadas) {
          this.alcadas = alcadas;

          if (alcadas.length === 1) {
            for (const pedido of this.pedidos) {
              pedido.idAlcada = alcadas[0].idAlcada;
            }
          }
        }

        this.alcadasLoading = false;
      });
  }

  private montarPedidos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.itens.forEach((item) => {
      const propostasVencedora = item.propostasVencedoras;

      if (propostasVencedora) {
        propostasVencedora.forEach((proposta) => {
          let pedido: Pedido;

          if (!item.filial && item.requisicaoItem && item.requisicaoItem.idItemSolicitacaoCompra) {
            this.toastr.warning(
              'O item \'' +
              item.produto.descricao +
              '\' não possui um empresa filial cadastrada, por isso não é possível gerar pedido para o mesmo',
            );

            this.blockUI.stop();
            this.fechar();
          } else {
            if (item.requisicaoItem.idItemSolicitacaoCompra) {
              pedido = this.pedidos.find((x) => x.idFornecedor === proposta.fornecedor.idPessoaJuridica && x.idComprador === item.filial.idPessoaJuridica);
            }else if(!item.filial){
                 pedido = this.pedidos.find((x) => {
                return  x.idFornecedor === proposta.fornecedor.idPessoaJuridica &&
                        x.idComprador === item.requisicaoItem.empresaSolicitante.idPessoaJuridica &&
                        x.frete === proposta.incoterms;
              });
            }
            else {
              pedido = this.pedidos.find((x) => {
                return !x.comprador &&
                  x.idFornecedor === proposta.fornecedor.idPessoaJuridica &&
                  x.frete === proposta.incoterms &&
                  item.requisicaoItem.empresaSolicitante &&
                  item.requisicaoItem.empresaSolicitante.idPessoaJuridica === x.idComprador;
              });
            }

            if (pedido) {
              pedido.itens.push(this.instanciarItem(item, proposta));
            } else {
              this.pedidos.push(this.instanciarPedido(item, proposta));
            }
          }
        });
      }
    });

    this.configuracoesEmpresaService.processeConfiguracoes(
      this.pedidos.map((x) => x.idComprador),
      (configuracoesDeModuloIntegracao: ConfiguracaoDeModuloIntegracao, idEmpresaCompradora: number) => this.preenchaConfiguracoesDaEmpresaCompradora(configuracoesDeModuloIntegracao, idEmpresaCompradora)).pipe(
        takeUntil(this.unsubscribe))
      .subscribe({
        error: () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      });

    this.blockUI.stop();
  }

  private preenchaConfiguracoesDaEmpresaCompradora(configuracoesDeModuloIntegracao: ConfiguracaoDeModuloIntegracao, idEmpresaCompradora: number) {
    const pedidosDaEmpresaCorrente = this.pedidos.filter((x) => x.idComprador === idEmpresaCompradora);

    for (const pedido of pedidosDaEmpresaCorrente) {
      if (!pedido.comprador) {
        pedido.comprador = {} as PessoaJuridica;
      }

      pedido.comprador.habilitarIntegracaoERP = configuracoesDeModuloIntegracao.habilitarIntegracaoERP;
      pedido.comprador.habilitarAprovacaoAutomaticaRequisicao = configuracoesDeModuloIntegracao.habilitarAprovacaoAutomaticaRequisicao;
      pedido.comprador.habilitarAprovacaoAutomaticaPedido = configuracoesDeModuloIntegracao.habilitarAprovacaoAutomaticaPedido;
      pedido.comprador.habilitarIntegracaoSistemaChamado = configuracoesDeModuloIntegracao.habilitarIntegracaoSistemaChamado;
    }
  }

  private instanciarPedido(item: CotacaoItem, proposta: CotacaoRodadaProposta) {
    const pedido = new Pedido();

    pedido.idPedido = 0;
    pedido.idUsuario = this.usuarioAtual.idUsuario;
    pedido.idTenant = this.usuarioAtual.permissaoAtual.idTenant;
    pedido.situacao = SituacaoPedido['Pré-pedido'];
    pedido.idFornecedor = proposta.fornecedor.idPessoaJuridica;
    pedido.fornecedor = proposta.fornecedor;
    pedido.idCondicaoPagamento = proposta.idCondicaoPagamento;
    pedido.condicaoPagamento = proposta.condicaoPagamento;
    pedido.moeda = item.moeda;
    pedido.idCentroCusto = item.requisicaoItem.idCentroCusto;
    pedido.idContaContabil = item.requisicaoItem.idContaContabil;

    if (item.filial) {
      pedido.idComprador = item.filial.idPessoaJuridica;
      pedido.comprador = item.filial;
      this.changedValueFilial(pedido.idComprador);
    } else if (item.requisicaoItem.empresaSolicitante) {
      pedido.idComprador = item.requisicaoItem.empresaSolicitante.idPessoaJuridica;
      this.carregarEnderecos(pedido.idComprador);
    } else {
      pedido.idComprador = this.usuarioAtual.permissaoAtual.pessoaJuridica.idPessoaJuridica;
    }

    pedido.frete = proposta.incoterms;
    pedido.idCotacao = this.idCotacao;

    if (this.parametrosIntegracaoSapHabilitado) {
      const grpDefault = this.gruposCompradores.find((grp) => grp.codigoDefault);

      if (grpDefault) { pedido.idGrupoCompradores = grpDefault.idGrupoCompradores; }

      const orgDefault = this.organizacoesCompras.find((org) => org.codigoDefault);

      if (orgDefault) { pedido.idOrganizacaoCompra = orgDefault.idOrganizacaoCompra; }
    }

    const tipoPedidoDefault = Array<TipoPedido>();

    this.tiposPedido.forEach((tipoPedido) => {
      if (tipoPedido.tiposRequisicao && item.tipoRequisicao) {
        // tslint:disable-next-line: no-unused-expression
        tipoPedido.tiposRequisicao.filter((p) => p.idTipoRequisicao === item.idTipoRequisicao).length > 0 ? tipoPedidoDefault.push(tipoPedido) : null;
      }
    });

    if (tipoPedidoDefault.length === 1) { pedido.idTipoPedido = tipoPedidoDefault[0].idTipoPedido; }

    pedido.itens = [this.instanciarItem(item, proposta)];

    if (this.transportadora != null) {
      pedido.idTransportadora = this.transportadora.idTransportadora;
      const trans = this.transportadora;
    }

    return pedido;
  }

  private instanciarItem(item: CotacaoItem, proposta: CotacaoRodadaProposta): PedidoItem {
    const pedidoItem = new PedidoItem(
      0,
      '',
      0,
      0,
      0,
      null,
      null,
      item.quantidade,
      null,
      null,
      SituacaoPedidoItem.Ativo,
      null,
      proposta.precoUnidade,
      proposta.precoUnidade,
      proposta.precoBruto,
      item.moeda,
      null,
      null,
      item.idProduto,
      item.produto,
      proposta.fornecedor.idPessoaJuridica,
      proposta.garantia,
      proposta.incoterms,
      proposta.idIva,
      item.requisicaoItem.idItemSolicitacaoCompra,
      item.requisicaoItem.idSubItemSolicitacaoCompra,
      item.idRequisicaoItem,
      item.idCotacaoItem,
      proposta.idCotacaoRodadaProposta,
      proposta.quantidadeDisponivel,
      null,
      null,
      null,
      null,
      proposta.prazoEntrega,
      proposta.faturamentoMinimo,
      proposta.embalagemEmbarque,
      proposta.quantidadeDisponivel,
      null,
    );

    pedidoItem.idCentroCusto = item.requisicaoItem.idCentroCusto;
    pedidoItem.idContaContabil = item.requisicaoItem.idContaContabil;
    // Inicializando Propriedades SAP
    if (this.exibirFlagSapEm) { pedidoItem.sapEm = false; }

    if (this.exibirFlagSapEmNaoAvaliada) { pedidoItem.sapEmNaoAvaliada = false; }

    if (this.exibirFlagSapEntrFaturas) { pedidoItem.sapEntrFaturas = false; }

    if (this.exibirFlagSapRevFatEm) { pedidoItem.sapRevFatEm = false; }

    pedidoItem.idUsuarioSolicitante = item.requisicaoItem.idUsuarioSolicitante;

    if (moment(proposta.dataEntregaDisponivel).isAfter(moment())) {
      pedidoItem.dataEntrega = moment(proposta.dataEntregaDisponivel).format('YYYY-MM-DD');
    } else {
      pedidoItem.dataEntrega = moment().format('YYYY-MM-DD');
    }

    pedidoItem.minDataEntrega = pedidoItem.dataEntrega;

    pedidoItem.idEnderecoEntrega = item.idEnderecoEntrega;

    const ccDefault = this.centrosCusto.find((cc) => cc.codigoDefault);
    if (ccDefault) { pedidoItem.idCentroCusto = ccDefault.idCentroCusto; }

    if (proposta.marca) {
      const marca = this.marcas.find((x) => x.nome.toLocaleLowerCase() === proposta.marca.toLocaleLowerCase());

      pedidoItem.idMarca = marca ? marca.idMarca : null;
    }

    return pedidoItem;
  }

  private isPedidoValido(pedido: Pedido): boolean {
    const descricaoPedido = pedido.fornecedor.nomeFantasia
      ? pedido.fornecedor.nomeFantasia
      : pedido.fornecedor.razaoSocial + -+pedido.fornecedor.cnpj;

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

    if (!pedido.idGrupoCompradores && (this.parametrosIntegracaoSapHabilitado || pedido.comprador.habilitarIntegracaoERP)) {
      this.toastr.warning(`É obrigatório selecionar um grupo de compradores para o pedido ao fornecedor ${descricaoPedido}`);
      return false;
    }

    if (this.parametrosIntegracaoSapHabilitado) {
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

    if (pedido.itens.findIndex((item) => item.quantidade > this.maxQuant) !== -1) {
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
        mensagemErro +=
          pedidoItem.produto.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (this.tipoAlcadaAprovacao === this.tipoAlcadaAprovacaoEnum.desmembrada || pedido.comprador.habilitarIntegracaoERP === true) {
        if (!pedidoItem.idCentroCusto) {
          let mensagemErro = 'É obrigatório selecionar um centro de custo no item "';
          mensagemErro +=
            pedidoItem.produto.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
          this.toastr.warning(mensagemErro);
          return false;
        }
      }

      if (this.parametrosIntegracaoSapHabilitado && !pedidoItem.idIva) {
        let mensagemErro = 'É obrigatório selecionar um IVA no item "';
        mensagemErro +=
          pedidoItem.produto.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (
        !pedidoItem.dataEntrega ||
        moment(pedidoItem.dataEntrega).isBefore(pedidoItem.minDataEntrega)
      ) {
        let mensagemErro = `É obrigatório selecionar uma data de entrega posterior a ${moment(
          pedidoItem.minDataEntrega,
        ).format('DD/MM/YYYY')} para o item \"`;
        mensagemErro +=
          pedidoItem.produto.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (
        !this.pessoaJuridicaCliente.permiteCompraAcimaQuantidade &&
        (!pedidoItem.quantidade || pedidoItem.quantidade > pedidoItem.loteMinimo)
      ) {
        let mensagemErro = 'A quantidade do item "';
        mensagemErro +=
          pedidoItem.produto.descricao + '" no pedido ao fornecedor ' + descricaoPedido;
        mensagemErro += pedido.idPedido + '" não pode ser maior que ';
        mensagemErro += pedidoItem.loteMinimo;
        mensagemErro += ' e não pode estar em branco.';
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
    }

    return true;
  }

  private confirmarPedidosErrorHandler(error: any) {
    if (error && error.status === 400) {
      this.blockUI.stop();
      const pedidosGeradosDto: Array<PedidoGeradoDto> = error.error;
      if (pedidosGeradosDto && Array.isArray(pedidosGeradosDto)) {
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
      } else if (error.status === 400) {
        this.toastr.warning(error.error);
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

  private preLoadEndereco() {
    if (this.enderecos && this.enderecos.length) {
      if (this.filiais && this.filiais.length) {
        if (this.pedidos && this.pedidos.length) {
          this.pedidos.forEach((pedido) => {
            if (pedido.idComprador) {
              pedido.itens.forEach((item) => {
                const filial = this.filiais.find((x) => x.idPessoaJuridica === pedido.idComprador);

                if (filial) {
                  const enderecosFilial = this.enderecos.filter((endereco) => endereco.idPessoa === filial.idPessoa);

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

  private async carregarEnderecos(idPessoaJuridica: number) {
    const idPessoaComprador = this.filiais.find((x) => x.idPessoaJuridica === idPessoaJuridica).idPessoa;
    this.enderecos = await this.enderecoService
      .listar(idPessoaComprador).pipe(
        map((enderecos) => enderecos.filter((t) => t.tipo === TipoEndereco.Entrega)))
      .toPromise();
  }

  private obterTipoAlcadaAprovacao() {
    this.tipoAlcadaAprovacao = this.authService.usuario().permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao;
  }
}
