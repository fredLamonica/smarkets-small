import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ConfirmacaoComponent } from '@shared/components';
import {
  ItemSolicitacaoCompra,
  Moeda,
  Ordenacao,
  PerfilUsuario,
  SituacaoSolicitacaoItemCompra
} from '@shared/models';
import {
  AutenticacaoService,
  LocalStorageService,
  SolicitacaoCompraService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ErrorService } from '../../../shared/utils/error.service';
import { ManterItemSolicitacaoCompraComponent } from '../../solicitacao-compra/item-solicitacao-compra/manter-item-solicitacao-compra/manter-item-solicitacao-compra.component';
import { ManterUsuarioResponsavelSolicitacaoCompraComponent } from '../../solicitacao-compra/manter-usuario-responsavel-solicitacao-compra/manter-usuario-responsavel-solicitacao-compra.component';
import { Acompanhamento } from '../acompanhamento';
import { ItemComentarioModalComponent } from '../item-comentario-modal/item-comentario-modal.component';
import { SolicitacaoCompraFiltro } from './../../../shared/models/fltros/solicitacao-compra-filtro';
import { SolicitacaoCompra } from './../../../shared/models/solicitacao-compra/solicitacao-compra';

@Component({
  selector: 'acompanhamento-solicitacao-compra',
  templateUrl: './acompanhamento-solicitacao-compra.component.html',
  styleUrls: ['./acompanhamento-solicitacao-compra.component.scss']
})
export class AcompanhamentoSolicitacaoCompraComponent extends Unsubscriber implements OnInit, Acompanhamento {
  @BlockUI() blockUI: NgBlockUI;

  public itensSolicitacao: Array<ItemSolicitacaoCompra>;
  public SituacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  public Moeda = Moeda;
  public flagBotaoAlterarResponsavelVisivel: boolean = false;
  public desvinculoItemSolicitacaoCompra: boolean = false

  private totalPaginas: number;
  private pagina: number;

  private filtroSolicitacaoCompra = 'filtroSolicitacaoCompra';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private authService: AutenticacaoService,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.flagBotaoAlterarResponsavelVisivel = this.isBotaoAlterarResponsavelVisivel();
    this.desvinculoItemSolicitacaoCompra = this.authService.usuario().permissaoAtual.pessoaJuridica.habilitarDesvinculoItemSolicitacaoCompra;
    this.resetPaginacao();

    let filtroRequisicao = this.localStorageService.getObject(this.filtroSolicitacaoCompra);
    if (filtroRequisicao) {
      this.obterFiltroAvancado(null, filtroRequisicao);
    } else {
      this.obter();
    }
  }

  private isBotaoAlterarResponsavelVisivel(): boolean {
    let perfil = this.authService.perfil();

    return [PerfilUsuario.Gestor, PerfilUsuario.Comprador, PerfilUsuario.Administrador].includes(
      perfil
    );
  }

  public resetPaginacao() {
    this.itensSolicitacao = new Array<ItemSolicitacaoCompra>();
    this.pagina = 1;
  }

  public onScroll(termo: string = '', parametrosFiltroAvancado: any[] = null) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      if (parametrosFiltroAvancado != null) {
        this.obterFiltroAvancado(parametrosFiltroAvancado);
      } else this.obter(termo);
    }
  }

  public obterFiltroAvancado(
    parametrosFiltroAvancado: any[],
    objetoFiltro?: SolicitacaoCompraFiltro
  ) {
    var termoCategoriaSolicitacao = objetoFiltro
      ? objetoFiltro.termoCategoriaSolicitacao
      : parametrosFiltroAvancado[0];
    var termoGrupoCompradores = objetoFiltro
      ? objetoFiltro.termoGrupoCompradores
      : parametrosFiltroAvancado[1];
    var termoTipoRC = objetoFiltro ? objetoFiltro.termoTipoRC : parametrosFiltroAvancado[2];
    var termoCodigoRCSolicitacao = objetoFiltro
      ? objetoFiltro.termoCodigoRCSolicitacao
      : parametrosFiltroAvancado[3];
    var termoSituacaoSolicitacao = objetoFiltro
      ? objetoFiltro.termoSituacaoSolicitacao
      : parametrosFiltroAvancado[4];
    var termoRequisitante = objetoFiltro
      ? objetoFiltro.termoRequisitante
      : parametrosFiltroAvancado[5];
    var termoDescricaoSolicitacao = objetoFiltro
      ? objetoFiltro.termoDescricaoSolicitacao
      : parametrosFiltroAvancado[6];
    var dataInicial = objetoFiltro ? objetoFiltro.dataInicial : parametrosFiltroAvancado[7];
    var dataFinal = objetoFiltro ? objetoFiltro.dataFinal : parametrosFiltroAvancado[8];
    var termoCategoriaDemanda = objetoFiltro
      ? objetoFiltro.termoCategoriaDemanda
      : parametrosFiltroAvancado[9];
    var termoCodigoFilialEmpresa = objetoFiltro
      ? objetoFiltro.termoCodigoFilialEmpresa
      : parametrosFiltroAvancado[10];
    var tipoDocumento = objetoFiltro
      ? objetoFiltro.tipoDocumento
      : parametrosFiltroAvancado[11];
    var termoComprador = objetoFiltro
      ? objetoFiltro.termoComprador
      : parametrosFiltroAvancado[12];
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .obterFiltroAvancado(
        'sc.IdSolicitacaoCompra DESC, CAST(isc.Codigo AS BIGINT)',
        Ordenacao.ASC,
        16,
        this.pagina,
        termoCategoriaSolicitacao,
        termoGrupoCompradores,
        termoTipoRC,
        termoCodigoRCSolicitacao,
        termoSituacaoSolicitacao,
        termoRequisitante,
        termoDescricaoSolicitacao,
        dataInicial,
        dataFinal,
        termoCategoriaDemanda,
        termoCodigoFilialEmpresa,
        tipoDocumento,
        termoComprador
      )
      .subscribe(
        response => {
          if (response) {
            this.itensSolicitacao = this.itensSolicitacao.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.itensSolicitacao = new Array<ItemSolicitacaoCompra>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public obter(termo: string = '') {
    let idUsuarioLogado = this.authService.usuario().idUsuario;
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .obterItemFiltro('sc.IdSolicitacaoCompra DESC, CAST(isc.Codigo AS BIGINT)', Ordenacao.ASC, 32, this.pagina, termo)
      .subscribe(
        response => {
          if (response) {
            this.itensSolicitacao = this.itensSolicitacao.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.itensSolicitacao = new Array<ItemSolicitacaoCompra>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }
  public isTelefoneVisivel(solicitacao: SolicitacaoCompra): boolean {
    if (solicitacao.telefoneRequisitante) return true;
    return false;
  }
  public auditar(idSolicitacaoCompra: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'SolicitacaoCompra';
    modalRef.componentInstance.idEntidade = idSolicitacaoCompra;
  }

  public anexarArquivo(itemSc: ItemSolicitacaoCompra) {
    const modalRef = this.modalService.open(ManterItemSolicitacaoCompraComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.itemSolicitacaoCompra = itemSc;
  }

  // #region Comentarios
  public obterComentarios(itemSc: ItemSolicitacaoCompra) {
    const modalRef = this.modalService.open(ItemComentarioModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.titulo = 'Comentário do item: ' + itemSc.descricao;
    modalRef.componentInstance.item = itemSc;
    modalRef.componentInstance.cancelarLabel = 'Fechar';
  }
  // #endregion

  public alterarResponsavel(indexItem: number) {
    const modalRef = this.modalService.open(ManterUsuarioResponsavelSolicitacaoCompraComponent, {
      centered: true
    });
    modalRef.componentInstance.itemSolicitacaoCompra = this.itensSolicitacao[indexItem];
    modalRef.result.then(result => {
      if (result) {
        this.itensSolicitacao[indexItem] = result;
        this.itensSolicitacao.forEach(item => {
          if (item.idSolicitacaoCompra == result.idSolicitacaoCompra) {
            item.idResponsavel = result.idResponsavel;
            item.usuarioResponsavel = result.usuarioResponsavel;
            item.nomeResponsavel = result.usuarioResponsavel.pessoaFisica.nome;
          }
        });
      }
    });
  }

  public async desvincularItem(indexItem: number) {

    let idItemSolicitacaoCompra = this.itensSolicitacao[indexItem].idItemSolicitacaoCompra;

    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.titulo = `Atenção!`;
    modalRef.componentInstance.confirmacao = 'Deseja realmente desvincular o item?';
    modalRef.componentInstance.html = true;
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Fechar';
    modalRef.result.then(async (result) => {
      if (result) {
        this.solicitacaoCompraService.desvincularItemSc(idItemSolicitacaoCompra)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            location.reload();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          },
        );
      }
    });
  }

}
