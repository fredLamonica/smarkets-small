import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterProdutoModalComponent } from '@shared/components';
import { CatalogoItem, ItemSolicitacaoCompra, ItemSolicitacaoCompraComentario, Moeda, PerfilUsuario, SituacaoPedido, SituacaoRequisicao, SituacaoSolicitacaoItemCompra, SolicitacaoCompra, TipoAprovacao, TipoCatalogoItem, TipoProduto, Usuario } from '@shared/models';
import { AutenticacaoService, SolicitacaoCompraService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ResumoCarrinhoComponent } from '../../container/resumo-carrinho/resumo-carrinho.component';
import { VincularProdutoExistenteComponent } from '../vincular-produto-existente/vincular-produto-existente.component';
import { ConfirmarVinculoPedidoItemComponent } from './confirmar-vinculo-pedido-item/confirmar-vinculo-pedido-item.component';
import { ConfirmarVinculoRequisicaoItemComponent } from './confirmar-vinculo-requisicao-item/confirmar-vinculo-requisicao-item.component';
import { ManterItemSolicitacaoCompraComponent } from './manter-item-solicitacao-compra/manter-item-solicitacao-compra.component';

@Component({
  selector: 'item-solicitacao-compra',
  templateUrl: './item-solicitacao-compra.component.html',
  styleUrls: ['./item-solicitacao-compra.component.scss'],
})
export class ItemSolicitacaoCompraComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() item: ItemSolicitacaoCompra;
  @Input('tipo-documento') tipoDocumento: string;

  Moeda = Moeda;
  TipoCatalogoItem = TipoCatalogoItem;
  SituacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  PerfilUsuario = PerfilUsuario;
  permitirVinculo: boolean;

  usuarioAtual: Usuario;

  tipoVinculoSubItens: TipoCatalogoItem.Catalogo | TipoCatalogoItem.Requisicao;

  @Input('em-selecao') emSelecao: boolean;

  // #region Ações de vinculo requisição de subitem
  idRequisicao: number;
  // #endregion

  // #region Ações de vinculo Pedido de subitem
  idFornecedor: number;
  idPedido: number;

  // #region Pedido de Regularização

  // @Input('em-regularizacao') emRegularizacao: boolean;

  @Input() selecionado: boolean;
  @Output('selecao') selecaoEmitter = new EventEmitter();
  @Input('solicitacao') solicitacao: SolicitacaoCompra;

  visualizarCatalogo: boolean = false;

  ocultarCardVinculoManual: boolean = true;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private authService: AutenticacaoService,
    private modalService: NgbModal,
  ) { }

  getPrevisaoEntrega(): string {
    return moment(this.item.dataRemessa).add(this.item.previsaoEntregaDias, 'days').format();
  }

  ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
    this.permitirVinculo = this.retornaPermissaoVinculo();
    if (this.item.subItens) {
      this.obterDadosVinculoSubItem();
    }
  }

  visualizar() {
    const modalRef = this.modalService.open(ManterItemSolicitacaoCompraComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.itemSolicitacaoCompra = this.item;
  }

  anexarArquivo() {
    const modalRef = this.modalService.open(ManterItemSolicitacaoCompraComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.itemSolicitacaoCompra = this.item;
  }

  // #region Comentarios
  obterComentarios() {
    if (!this.item.comentarios) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.solicitacaoCompraService
        .obterComentariosPorItem(this.item.idSolicitacaoCompra, this.item.idItemSolicitacaoCompra)
        .subscribe(
          (response) => {
            if (response) { this.item.comentarios = response; }
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  enviarComentario(comentario: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .comentarItem(this.item.idSolicitacaoCompra, this.item.idItemSolicitacaoCompra, comentario)
      .subscribe(
        (response) => {
          if (response) {
            if (!this.item.comentarios) {
              this.item.comentarios = new Array<ItemSolicitacaoCompraComentario>();
            }
            response.usuarioAutor = this.authService.usuario();
            this.item.comentarios.unshift(response);
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
  // #endregion

  // #region Vinculo
  retornaPermissaoVinculo(): boolean {
    return (
      [SituacaoSolicitacaoItemCompra.Nova].includes(this.item.situacao) &&
      this.usuarioAtual.permissaoAtual.perfil !== PerfilUsuario.Requisitante
    );
  }

  // Vinculo a pedido
  vincularPedido(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .vincularPedidoItem(this.item.idSolicitacaoCompra, this.item.idItemSolicitacaoCompra, event)
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.item.situacao = SituacaoSolicitacaoItemCompra['Disponível em Pre-pedido'];
          this.item.pedidoItem = response;
          this.permitirVinculo = false;
          ResumoCarrinhoComponent.atualizarCarrinho.next();
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
                switch (this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAprovacao) {
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
              default:
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR,
                );
                break;
            }
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        },
      );
  }

  // Vinculo a requisição
  criarRequisicao(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .vincularRequisicaoItem(
        this.item.idSolicitacaoCompra,
        this.item.idItemSolicitacaoCompra,
        event,
      )
      .subscribe(
        (response) => {
          if (response && response.idRequisicao) {
            response.itens[0].usuarioResponsavel = this.authService.usuario();
            this.item.situacao = SituacaoSolicitacaoItemCompra.Disponivel;
            this.item.requisicaoItem = response.itens[0];
            this.permitirVinculo = false;
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.warning(
              'Não foi possível criar uma requisição para o item pois não há regras na matriz de responsábilidade para Tipo de Documento da solicitação e Categoria do Produto selecionado',
            );
          }
          this.blockUI.stop();
        },
        (error) => {
          switch (error.status) {
            case 400:
              this.toastr.error(error.error);
              break;
            default:
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              break;
          }

          this.blockUI.stop();
        },
      );
  }
  // #endregion

  obterDadosVinculoSubItem() {
    this.obterDadosRequisicaoSubItem();
    if (!this.idRequisicao) { this.obterDadosPedidoSubItem(); }
  }
  obterDadosRequisicaoSubItem() {
    const subItemVinculado = this.item.subItens.find(
      (si) => si.situacao === SituacaoSolicitacaoItemCompra.Disponivel && si.requisicaoItem != null,
    );
    if (subItemVinculado) {
      this.idRequisicao = subItemVinculado.requisicaoItem.idRequisicao;
      this.tipoVinculoSubItens = TipoCatalogoItem.Requisicao;
    } else {
      this.idRequisicao = null;
      this.tipoVinculoSubItens = null;
    }
  }

  obterDadosPedidoSubItem() {
    const subItemVinculado = this.item.subItens.find(
      (si) => si.situacao === SituacaoSolicitacaoItemCompra.Disponivel && si.pedidoItem != null,
    );
    if (subItemVinculado) {
      this.idPedido = subItemVinculado.pedidoItem.idPedido;
      this.idFornecedor = subItemVinculado.pedidoItem.idFornecedor;
      this.tipoVinculoSubItens = TipoCatalogoItem.Catalogo;
    } else {
      this.idPedido = null;
      this.idFornecedor = null;
      this.tipoVinculoSubItens = null;
    }
  }

  atualizarSituacao(event) {
    if (event.idPedido != null) {
      this.item.subItens.forEach((subitem) => {
        const pi = event.itens.find(
          (i) => i.idSubItemSolicitacaoCompra === subitem.idSubItemSolicitacaoCompra,
        );
        if (pi) {
          subitem.pedidoItem = pi;
        }
      });

      if (event.situacao === SituacaoPedido.Confirmado) {
        for (let index = 0; index < this.item.subItens.length; index++) {
          if (this.item.subItens[index].situacao !== SituacaoSolicitacaoItemCompra.Cancelada) {
            this.item.subItens[index].situacao = SituacaoSolicitacaoItemCompra.Concluida;
          }
        }
        this.item.situacao = SituacaoSolicitacaoItemCompra.Concluida;
      } else if (event.situacao === SituacaoPedido['Aguardando Pacote']) {
        this.obterDadosPedidoSubItem();
      }
    } else if (event.idRequisicao != null) {
      this.item.subItens.forEach((subitem) => {
        const ri = event.itens.find(
          (i) => i.idSubItemSolicitacaoCompra === subitem.idSubItemSolicitacaoCompra,
        );
        if (ri) {
          subitem.requisicaoItem = ri;
        }
      });

      if (event.situacao === SituacaoRequisicao.Confirmada) {
        for (let index = 0; index < this.item.subItens.length; index++) {
          if (this.item.subItens[index].situacao !== SituacaoSolicitacaoItemCompra.Cancelada) {
            this.item.subItens[index].situacao = SituacaoSolicitacaoItemCompra.Disponivel;
          }
        }
        this.item.situacao = SituacaoSolicitacaoItemCompra.Disponivel;
      } else if (event.situacao === SituacaoRequisicao['Aguardando Pacote']) {
        this.obterDadosRequisicaoSubItem();
      }
    }
  }

  //#endregion

  vincularProduto() {
    const modalRef = this.modalService.open(VincularProdutoExistenteComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result) {
        this.confirmarVinculo(result);
      }
    });
  }

  confirmarVinculo(event) {
    if (event.item.tipo === TipoCatalogoItem.Catalogo) { this.confirmarVinculoPedido(event); } else { this.confirmarVinculoRequisicao(event); }
  }

  cadastrarProduto() {
    const modalRef = this.modalService.open(ManterProdutoModalComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.descricao = this.item.nomeProduto
      ? this.item.nomeProduto
      : this.item.descricao;
    modalRef.componentInstance.descricaoDetalhada = this.item.descricaoProduto;
    modalRef.componentInstance.codigo = this.item.codigoProduto;
    modalRef.componentInstance.ncm = this.item.ncm;
    modalRef.componentInstance.valorReferencia = this.item.valorReferencia;
    modalRef.componentInstance.tipoProduto = TipoProduto.Produto;

    modalRef.componentInstance.codigoCategoriaProduto = this.item.codigoCategoria;
    modalRef.componentInstance.nomeCategoriaProduto = this.item.nomeCategoria;

    modalRef.componentInstance.siglaUnidadeMedida = this.item.siglaUnidadeMedida;
    modalRef.componentInstance.codigoUnidadeMedida = this.item.siglaUnidadeMedida;
    modalRef.componentInstance.descricaoUnidadeMedida = this.item.descricaoUnidadeMedida;
    modalRef.componentInstance.permiteQuantidadeFracionadaUnidadeMedida = true;

    modalRef.result.then(
      (result) => {
        if (result) {
          const catalogoItem = new CatalogoItem();
          catalogoItem.produto = result;
          catalogoItem.tipo = TipoCatalogoItem.Requisicao;
          this.confirmarVinculo({ item: catalogoItem });
        }
      },
      () => { });
  }

  onSelecionar(event: any) {
    this.selecaoEmitter.emit(event.target.checked);
  }

  onSelecionarTodos(event: any) {
    this.selecaoEmitter.emit(event.target.checked);
  }

  //#endregion

  permitirSelecao(): boolean {
    return ![
      SituacaoSolicitacaoItemCompra.Nova,
      SituacaoSolicitacaoItemCompra.Bloqueada,
      SituacaoSolicitacaoItemCompra.Disponivel,
      SituacaoSolicitacaoItemCompra['Disponível em Pre-pedido'],
      SituacaoSolicitacaoItemCompra.Aberta,
    ].includes(this.item.situacao);
  }
  carregarCatalogo() {
    this.visualizarCatalogo = true;
  }

  carregarSubItens() {
    if (!this.item.subItens) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.solicitacaoCompraService.obterSubItens(this.item.idItemSolicitacaoCompra).subscribe(
        (response) => {
          if (response) {
            this.item.subItens = response;
          }
          this.blockUI.stop();
        },
        (error) => {
          switch (error.status) {
            case 400:
              this.toastr.error(error.error);
              break;
            default:
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              break;
          }

          this.blockUI.stop();
        },
      );
    }
  }

  private confirmarVinculoPedido(event) {
    const modalRef = this.modalService.open(ConfirmarVinculoPedidoItemComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.item = event.item;
    modalRef.componentInstance.itemSolicitacaoCompra = this.item;
    modalRef.result.then((result) => {
      if (result) { this.vincularPedido(result); }
    });
  }

  private confirmarVinculoRequisicao(event) {
    const modalRef = this.modalService.open(ConfirmarVinculoRequisicaoItemComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.item = event.item;
    modalRef.componentInstance.quantidade = event.quantidade;
    modalRef.componentInstance.tipoDocumento = this.tipoDocumento;
    modalRef.componentInstance.itemSolicitacaoCompra = this.item;
    modalRef.result.then((result) => {
      if (result) {
        this.criarRequisicao(result);
      }
    });
  }
}
