import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ItemSolicitacaoCompra, Moeda, PerfilUsuario,
  SituacaoPedido, SituacaoSolicitacaoItemCompra, SubItemSolicitacaoCompra, SubItemSolicitacaoCompraComentario, TipoAprovacao, TipoCatalogoItem, Usuario
} from '@shared/models';
import {
  AutenticacaoService, SolicitacaoCompraService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ManterSubItemSolicitacaoCompraComponent } from './manter-sub-item-solicitacao-compra/manter-sub-item-solicitacao-compra.component';


@Component({
  selector: 'sub-item-solicitacao-compra',
  templateUrl: './sub-item-solicitacao-compra.component.html',
  styleUrls: ['./sub-item-solicitacao-compra.component.scss'],
})
export class SubItemSolicitacaoCompraComponent implements OnInit {

  public static desvincularSubItem: Subject<any> = new Subject();
  @BlockUI() blockUI: NgBlockUI;

  @Input('em-regularizacao') emRegularizacao: boolean;

  @Input('id-solicitacao-compra') idSolicitacaoCompra: number;
  @Input('id-itemSolicitacao') idItemSolicitacaoCompra: number;
  @Input('sub-item') subItem: SubItemSolicitacaoCompra;
  @Input('item-solicitacao') itemSolicitacaoCompra: ItemSolicitacaoCompra;

  @Input('id-pedido') idPedido: number;
  @Input('id-fornecedor') idFornecedor: number;
  @Input('id-requisicao') idRequisicao: number;

  @Input('tipo-documento') tipoDocumento: string;

  @Input('tipo-vinculo-sub-item') tipoVinculoSubItens?: TipoCatalogoItem;

  @Output('atualizar-situacao') atualizarSituacaoEmitter = new EventEmitter();
  @Output('item-desvinculado') itemDesvinculadoEmitter = new EventEmitter();
  @Output('sub-item-vinculado-requisicao') subItemVinculadoRequisicaoEmitter = new EventEmitter();

  public Moeda = Moeda;
  public TipoCatalogoItem = TipoCatalogoItem;
  public SituacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  public PerfilUsuario = PerfilUsuario;

  public usuarioAtual: Usuario;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private authService: AutenticacaoService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
    this.subscribeDesvincularSubItem();
  }

  public visualizar() {
    const modalRef = this.modalService.open(ManterSubItemSolicitacaoCompraComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.subItemSolicitacaoCompra = this.subItem;
    modalRef.componentInstance.idSolicitacaoCompra = this.idSolicitacaoCompra;
  }

  public anexarArquivo() {
    const modalRef = this.modalService.open(ManterSubItemSolicitacaoCompraComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.subItemSolicitacaoCompra = this.subItem;
    modalRef.componentInstance.idSolicitacaoCompra = this.idSolicitacaoCompra;
  }

  public obterComentarios() {
    if (!this.subItem.comentarios) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.solicitacaoCompraService
        .obterComentariosPorSubItem(
          this.idSolicitacaoCompra,
          this.subItem.idItemSolicitacaoCompra,
          this.subItem.idSubItemSolicitacaoCompra
        )
        .subscribe(
          response => {
            if (response) this.subItem.comentarios = response;
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    }
  }

  public enviarComentario(comentario: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .comentarSubItem(
        this.idSolicitacaoCompra,
        this.subItem.idItemSolicitacaoCompra,
        this.subItem.idSubItemSolicitacaoCompra,
        comentario
      )
      .subscribe(
        response => {
          if (response) {
            if (!this.subItem.comentarios)
              this.subItem.comentarios = new Array<SubItemSolicitacaoCompraComentario>();
            response.usuarioAutor = this.authService.usuario();
            this.subItem.comentarios.unshift(response);
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  // #region Vinculo
  public permitirVinculo(): boolean {
    return (
      [SituacaoSolicitacaoItemCompra.Nova].includes(this.subItem.situacao) &&
      this.usuarioAtual.permissaoAtual.perfil != PerfilUsuario.Requisitante
    );
  }

  // Vinculo a pedido
  public vincularPedido(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .vincularPedidoSubItem(
        this.idSolicitacaoCompra,
        this.subItem.idItemSolicitacaoCompra,
        this.subItem.idSubItemSolicitacaoCompra,
        event
      )
      .subscribe(
        response => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          switch (response.situacao) {
            case SituacaoPedido['Aguardando Pacote']:
              this.subItem.situacao = SituacaoSolicitacaoItemCompra.Disponivel;
              break;
            default:
              this.subItem.situacao = SituacaoSolicitacaoItemCompra.Concluida;
              break;
          }
          this.emitirSituacao(response);

          this.subItem.pedidoItem = response.itens[0];
        },
        error => {
          if (error && error.status == 400) {
            switch (error.error) {
              case 'Pedido inválido':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_MARKETPLACE
                );
                break;
              case 'Pedido inapto à aprovação': {
                switch (this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAprovacao) {
                  case TipoAprovacao.Departamento:
                    this.toastr.warning(
                      this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_DEPARTMENT
                    );
                    break;
                  case TipoAprovacao.CentroCusto:
                    this.toastr.warning(
                      this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_COST_CENTER
                    );
                    break;
                  default:
                    this.toastr.warning(
                      this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_APPROVAL_TYPE
                    );
                    break;
                }
                break;
              }
              case 'Tipo aprovação não informado':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_NO_APPROVAL_TYPE
                );
                break;
              case 'Usuário não vinculado a departamento':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_USER_WITHOUT_DEPARTMENT
                );
                break;
              case 'Usuário não vinculado a centro de custo':
                this.toastr.warning(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_USER_WITHOUT_COST_CENTER
                );
                break;
              default:
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR
                );
                break;
            }
          } else
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  // Vinculo a requisição
  public criarRequisicao(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .vincularRequisicaoSubItem(
        this.idSolicitacaoCompra,
        this.subItem.idItemSolicitacaoCompra,
        this.subItem.idSubItemSolicitacaoCompra,
        event
      )
      .subscribe(
        response => {
          response.itens[0].usuarioResponsavel = this.authService.usuario();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.subItem.situacao = SituacaoSolicitacaoItemCompra.Disponivel;

          this.emitirSituacao(response);

          this.subItem.requisicaoItem = response.itens[0];

          this.subItemVinculadoRequisicaoEmitter.emit();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private subscribeDesvincularSubItem() {
    SubItemSolicitacaoCompraComponent.desvincularSubItem.subscribe(message => {
      if (this.subItem.idSubItemSolicitacaoCompra == message) {
        this.subItem.situacao = SituacaoSolicitacaoItemCompra.Nova;
        this.subItem.pedidoItem = null;
        this.subItem.requisicaoItem = null;

        this.itemDesvinculadoEmitter.emit();
      }
    });
  }

  private emitirSituacao(response) {
    this.atualizarSituacaoEmitter.emit(response);
  }
  // #endregion
}
