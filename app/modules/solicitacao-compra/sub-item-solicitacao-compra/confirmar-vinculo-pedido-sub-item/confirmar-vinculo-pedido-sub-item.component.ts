import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CatalogoItem, CentroCusto, CondicaoPagamento, Endereco, GrupoCompradores, ItemSolicitacaoCompra, Iva, OrganizacaoCompra, Pedido, PedidoItem, PessoaJuridica, SituacaoPedido, SituacaoPedidoItem, SubItemSolicitacaoCompra, TipoEndereco, TipoFrete, TipoPedido
} from '@shared/models';
import {
  AutenticacaoService, CentroCustoService,
  CondicaoPagamentoService, EnderecoService, GrupoCompradoresService,
  IvaService, OrganizacaoCompraService, PessoaJuridicaService, SolicitacaoCompraService, TipoPedidoService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { ConfirmacaoComponent } from '@shared/components';
import * as moment from 'moment';
import * as business from 'moment-business';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { PedidoService } from '../../../../shared/providers/pedido.service';
import { SubItemSolicitacaoCompraComponent } from '../sub-item-solicitacao-compra.component';

@Component({
  selector: 'app-confirmar-vinculo-pedido-sub-item',
  templateUrl: './confirmar-vinculo-pedido-sub-item.component.html',
  styleUrls: ['./confirmar-vinculo-pedido-sub-item.component.scss'],
})
export class ConfirmarVinculoPedidoSubItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  idPedido: number;
  subItem: SubItemSolicitacaoCompra;
  itemSolicitacaoCompra: ItemSolicitacaoCompra;
  idItemSolicitacaoCompra: number;

  Frete = TipoFrete;
  TipoEndereco = TipoEndereco;

  @Output('atualizar-situacao-item') atualizarSituacaoItemEmitter = new EventEmitter();

  item: CatalogoItem;
  pedido: Pedido;
  centrosCusto: Array<CentroCusto>;
  centrosCusto$: Observable<Array<CentroCusto>>;
  centrosCustoLoading: boolean;

  condicoesPagamento: Array<CondicaoPagamento>;
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

  quantidade: number;

  maxQuant: number = 999999999;

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
    private pedidoService: PedidoService,
    private modalService: NgbModal,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private pessoaJuridicaService: PessoaJuridicaService,
  ) { }

  async ngOnInit() {
    this.obterParametrosIntegracaoSapHabilitado();
    await this.obterListas();
    if (this.idPedido) {
      this.obterPedido();
    } else {
      this.instanciarPedido();
    }
  }

  async obterPedido() {
    this.pedido = await this.pedidoService.obterPorIdOld(this.idPedido).toPromise();
    this.pedido.itens.forEach((item) => {
      item.dataEntrega = moment(item.dataEntrega).format('YYYY-MM-DD');
    });
    this.pedido.itens.push(this.instaciarPedidoItem());
  }

  instaciarPedidoItem(): PedidoItem {
    const pedidoItem = new PedidoItem(
      0,
      '',
      0,
      0,
      0,
      this.item.contratoCatalogoItem.idContratoCatalogoItem,
      this.item.contratoCatalogoItem,
      this.quantidade,
      this.itemSolicitacaoCompra.dataRemessa,
      null,
      SituacaoPedidoItem.Ativo,
      null,
      this.item.contratoCatalogoItem.valor,
      this.item.contratoCatalogoItem.valor,
      this.item.contratoCatalogoItem.valor * this.quantidade,
      this.item.contratoCatalogoItem.moeda,
      this.item.contratoCatalogoItem.idMarca,
      null,
      this.item.contratoCatalogoItem.idProduto,
      this.item.contratoCatalogoItem.produto,
      this.item.contratoCatalogoItem.idFornecedor,
      this.item.contratoCatalogoItem.garantia,
      this.item.contratoCatalogoItem.frete,
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
      null,
    );

    // Inicializando Propriedades SAP
    if (this.exibirFlagSapEm) { pedidoItem.sapEm = false; }

    if (this.exibirFlagSapEmNaoAvaliada) { pedidoItem.sapEmNaoAvaliada = false; }

    if (this.exibirFlagSapEntrFaturas) { pedidoItem.sapEntrFaturas = false; }

    if (this.exibirFlagSapRevFatEm) { pedidoItem.sapRevFatEm = false; }

    pedidoItem.dataEntrega = business
      .addWeekDays(moment(), this.item.contratoCatalogoItem.prazoEntrega)
      .format('YYYY-MM-DD');
    pedidoItem.minDataEntrega = pedidoItem.dataEntrega;
    pedidoItem.idSubItemSolicitacaoCompra = this.subItem.idSubItemSolicitacaoCompra;

    if (
      this.item &&
      this.item.contratoCatalogoItem &&
      this.item.contratoCatalogoItem.produto &&
      this.item.contratoCatalogoItem.produto.unidadeMedida &&
      this.item.contratoCatalogoItem.produto.unidadeMedida.permiteQuantidadeFracionada
    ) {
      this.maxQuant = 999999999.9999;
    } else {
      this.maxQuant = 999999999;
    }

    if (this.enderecos && this.enderecos.length > 0) {
      const enderecoEntrega: Array<Endereco> = this.enderecos.filter(
        (endereco) => endereco.tipo === TipoEndereco.Entrega,
      );

      if (enderecoEntrega && enderecoEntrega.length > 0) {
        pedidoItem.idEnderecoEntrega = enderecoEntrega[0].idEndereco;
      } else {
        pedidoItem.idEnderecoEntrega = this.enderecos[0].idEndereco;
      }
    }

    return pedidoItem;
  }

  OnQuantidadeChange(valor: string, index: number) {
    if (valor && valor.toString().includes(',')) {
      this.pedido.itens[index].quantidade = Number(valor.replace(/\./g, '').replace(',', '.'));
    }
  }

  itemDesabilitado(pedidoItem: PedidoItem): boolean {
    return (
      this.subItem &&
      pedidoItem.idSubItemSolicitacaoCompra !== this.subItem.idSubItemSolicitacaoCompra
    );
  }

  confirmar() {
    if (this.isPedidoValido()) {
      // Validando info de propriedades SAP
      if (!this.exibirFlagSapEm) {
        this.pedido.itens.forEach((item) => (item.sapEm = null));
      }

      if (!this.exibirFlagSapEmNaoAvaliada) {
        this.pedido.itens.forEach((item) => (item.sapEmNaoAvaliada = null));
      }

      if (!this.exibirFlagSapEntrFaturas) {
        this.pedido.itens.forEach((item) => (item.sapEntrFaturas = null));
      }

      if (!this.exibirFlagSapRevFatEm) {
        this.pedido.itens.forEach((item) => (item.sapRevFatEm = null));
      }

      this.activeModal.close(this.pedido);
    }
  }

  fechar() {
    this.activeModal.close();
  }

  subTotalPedido(pedido): number {
    const valores = pedido.itens.map((item) => {
      return item.quantidade * item.valor;
    });
    if (valores && valores.length) { return valores.reduce((prev, cur) => prev + cur, 0); } else { return 0; }
  }

  excluirItemPedido(index: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Deseja excluir o item do pedido?`;
    modalRef.componentInstance.confirmarLabel = 'Excluir';
    modalRef.result.then((result) => {
      if (result) {
        this.solicitacaoCompraService
          .desvincularSubItemPedidoItem(
            this.idItemSolicitacaoCompra,
            this.pedido.itens[index].idSubItemSolicitacaoCompra,
            this.pedido.itens[index],
          )
          .subscribe(
            (response) => {
              SubItemSolicitacaoCompraComponent.desvincularSubItem.next(
                this.pedido.itens[index].idSubItemSolicitacaoCompra,
              );
              this.pedido.itens.splice(index, 1);
              if (this.pedido.itens.length === 1) {
                this.pedido.idPedido = 0;
                this.pedido.itens[0].idPedido = 0;
              }

              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.blockUI.stop();
            },
            (error) => { },
          );
      }
    });
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
      this.subCentrosCusto();
      this.ivas = await this.ivaService.listar().toPromise();
      this.gruposCompradores = await this.grupoCompradoresService.listar().toPromise();
      this.organizacoesCompras = await this.organizacaoCompraService.listar().toPromise();
      this.tiposPedido = await this.tipoPedidoService.listar().toPromise();
      this.filiais = await this.pessoaJuridicaService.ObterFiliais().toPromise();
      const idPessoa = this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoa;
      this.enderecos = await this.enderecoService.listar(idPessoa).toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  private subCentrosCusto() {
    this.centrosCustoLoading = true;
    this.centrosCusto$ = this.centroCustoService.listarAtivos().pipe(
      catchError(() => of([])),
      tap((centrosCusto) => {
        this.centrosCusto = centrosCusto;
        this.preLoadCentroCusto();
        this.centrosCustoLoading = false;
      }),
      shareReplay(),
    );
  }

  private preLoadCentroCusto() {
    if (this.centrosCusto && this.centrosCusto.length) {
      if (this.pedido && this.pedido.itens) {
        this.pedido.itens.forEach((item, index) => {
          if (this.itemSolicitacaoCompra.rateios && this.itemSolicitacaoCompra.rateios.length) {
            const codigosCentroCusto = this.itemSolicitacaoCompra.rateios.map((rateio) => {
              return rateio.codigoCentroCusto;
            });
            if (codigosCentroCusto && codigosCentroCusto.length) {
              const centroCusto = this.centrosCusto.find((cc) =>
                codigosCentroCusto.includes(cc.codigo),
              );

              if (centroCusto) {
                item.idCentroCusto = centroCusto.idCentroCusto;
              }
            }
          } else {
            const centroCustoDefault = this.centrosCusto.filter((p) => p.codigoDefault);
            if (centroCustoDefault.length) { item.idCentroCusto = centroCustoDefault[0].idCentroCusto; } else if (this.centrosCusto.length === 1) {
              item.idCentroCusto = this.centrosCusto[0].idCentroCusto;
            }
          }
        });
      }
    }
  }

  private instanciarPedido() {
    const usuario = this.authService.usuario();
    this.pedido = new Pedido();
    this.pedido.idPedido = 0;
    this.pedido.idUsuario = usuario.idUsuario;
    this.pedido.idTenant = usuario.permissaoAtual.idTenant;
    this.pedido.situacao = SituacaoPedido['Pré-pedido'];
    this.pedido.idFornecedor = this.item.contratoCatalogoItem.idFornecedor;
    if (this.subItem.pessoaJuridica) {
      this.pedido.idComprador = this.subItem.pessoaJuridica.idPessoaJuridica;
      this.pedido.comprador = this.subItem.pessoaJuridica;
    } else {
      this.pedido.idComprador = usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica;
    }
    this.pedido.idComprador = usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica;
    this.pedido.frete = this.item.contratoCatalogoItem.frete;

    if (this.parametrosIntegracaoSapHabilitado) {
      const grpDefault = this.gruposCompradores.find((grp) => grp.codigoDefault);
      if (grpDefault) { this.pedido.idGrupoCompradores = grpDefault.idGrupoCompradores; }
    }

    this.pedido.itens = [this.instaciarPedidoItem()];
  }

  private isPedidoValido(): boolean {
    if (!this.pedido.idCondicaoPagamento) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.INVALID_ORDER_INVALID_PAYMENT_METHOD,
      );
      return false;
    }

    if (!this.pedido.idTipoPedido) {
      this.toastr.warning('É obrigatório selecionar um tipo de pedido');
      return false;
    }

    if (this.parametrosIntegracaoSapHabilitado) {
      if (!this.pedido.idGrupoCompradores) {
        this.toastr.warning('É obrigatório selecionar um grupo de compradores');
        return false;
      }

      if (!this.pedido.idOrganizacaoCompra) {
        this.toastr.warning('É obrigatório selecionar uma organização de compras');
        return false;
      }
    }

    if (this.pedido.itens.findIndex((item) => item.quantidade > this.maxQuant) !== -1) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.INVALID_ORDER_EXCEEDS_MAX_QUANTITY,
      );
      return false;
    }

    // if (this.pedido.fornecedor.faturamentoMinimo && this.subTotalPrePedido(index) < this.prePedidos[index].fornecedor.faturamentoMinimo.valor) {
    //   this.toastr.warning(this.translationLibrary.translations.ALERTS.INVALID_ORDER_MINIMUM_BILLING);
    //   return false;
    // }

    for (const pedidoItem of this.pedido.itens) {
      if (!pedidoItem.idEnderecoEntrega) {
        let mensagemErro = 'É obrigatório selecionar um endereço de entrega para o item "';
        mensagemErro += pedidoItem.produto.descricao + '" no pré-pedido.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (!pedidoItem.idCentroCusto) {
        let mensagemErro = 'É obrigatório selecionar um centro de custo no item "';
        mensagemErro += pedidoItem.produto.descricao + '" no pré-pedido.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (this.parametrosIntegracaoSapHabilitado && !pedidoItem.idIva) {
        let mensagemErro = 'É obrigatório selecionar um IVA no item "';
        mensagemErro += pedidoItem.produto.descricao + '" no pré-pedido.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (
        !pedidoItem.dataEntrega ||
        !moment(pedidoItem.dataEntrega).isAfter(
          moment(pedidoItem.minDataEntrega).subtract(1, 'days'),
        )
      ) {
        let mensagemErro = `É obrigatório selecionar uma data de entrega posterior a ${moment(
          pedidoItem.minDataEntrega,
        )
          .subtract(1, 'days')
          .format('YYYY-MM-DD')} para o item \"`;
        mensagemErro += pedidoItem.produto.descricao + '" no pré-pedido.';
        this.toastr.warning(mensagemErro);
        return false;
      }

      if (pedidoItem.quantidade < pedidoItem.contratoCatalogoItem.loteMinimo) {
        let mensagemErro = 'A quantidade do item "';
        mensagemErro += pedidoItem.produto.descricao + '" no pré-pedido "';
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
            mensagemErro = `<p>O pedido não pode ser concluído pois o campo <span class="font-weight-bold">${camposObrigatorios[0]}</span> é obrigatorio no cadastro do produto. Favor solicitar a revisão do cadastro do produto <span class="font-weight-bold">${pedidoItem.produto.descricao}</span><p>`;
          }
          this.toastr.warning(mensagemErro, null, { enableHtml: true, timeOut: 15000 });
          return false;
        }
      }
    }

    return true;
  }
}
