import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent } from '@shared/components';
import {
  ItemSolicitacaoCompra, Moeda, PerfilUsuario, SituacaoSolicitacaoItemCompra, SolicitacaoCompra, Usuario
} from '@shared/models';
import {
  AutenticacaoService, SolicitacaoCompraService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ErrorService } from '../../../shared/utils/error.service';
import { DevolverSolicitacaoCompraComponent } from '../devolver-solicitacao-compra/devolver-solicitacao-compra.component';
import { ManterPedidoRegularizacaoComponent } from '../manter-pedido-regularizacao/manter-pedido-regularizacao.component';
import { ManterUsuarioResponsavelSolicitacaoCompraComponent } from '../manter-usuario-responsavel-solicitacao-compra/manter-usuario-responsavel-solicitacao-compra.component';
import { CancelarSolicitacaoCompraComponent } from './../cancelar-solicitacao-compra/cancelar-solicitacao-compra.component';
import { DesbloqueioItemSolicitacaoCompraComponent } from './desbloqueio-item-solicitacao-compra/desbloqueio-item-solicitacao-compra.component';

@Component({
  selector: 'app-manter-solicitacao-compra',
  templateUrl: './manter-solicitacao-compra.component.html',
  styleUrls: ['./manter-solicitacao-compra.component.scss'],
})
export class ManterSolicitacaoCompraComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  Moeda = Moeda;

  solicitacao: SolicitacaoCompra;

  flagBotaoAlterarResponsavelVisivel: boolean = false;

  // #region Pedido de Regularizacao

  emRegularizacao: boolean = false;

  emSelecao: boolean = false;

  // #endregion

  // #region Seleção de itens
  itensSelecionados: Array<ItemSolicitacaoCompra> = new Array<ItemSolicitacaoCompra>();
  todosItensDisponiveisSelecionados: boolean = false;

  itensDisponiveis: Array<ItemSolicitacaoCompra> = new Array<ItemSolicitacaoCompra>();
  itensDisponiveisSelecionados: Array<ItemSolicitacaoCompra> = new Array<ItemSolicitacaoCompra>();
  itensDisponiveisBusca: Array<ItemSolicitacaoCompra>;

  usuarioAtual: Usuario;
  usuarioRequisitante: boolean;

  private idSolicitacaoCompra: number;
  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
    private errorService: ErrorService,
  ) {
    super();
  }

  getPrevisaoEntrega(previsaoEntregaDias: number): string {
    return moment(this.solicitacao.dataCriacao).add(previsaoEntregaDias, 'days').format();
  }

  ngOnInit() {
    this.flagBotaoAlterarResponsavelVisivel = this.isBotaoAlterarResponsavelVisivel();
    this.obterParametros();
    this.usuarioAtual = this.authService.usuario();
    this.usuarioRequisitante = this.usuarioAtual.permissaoAtual.perfil === PerfilUsuario.Requisitante;
  }

  obterSolicitacaoCompra() {
    const idUsuarioLogado = this.authService.usuario().idUsuario;
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService.obterPorId(this.idSolicitacaoCompra)
      .pipe(takeUntil(this.unsubscribe)).subscribe(
        (response) => {
          if (response) {
            this.solicitacao = response;
            this.itensDisponiveis = response.itens;
          }

          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  auditar(idSolicitacaoCompra: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'SolicitacaoCompra';
    modalRef.componentInstance.idEntidade = idSolicitacaoCompra;
  }

  isTelefoneVisivel(): boolean {
    if (this.solicitacao && this.solicitacao.telefoneRequisitante) { return true; }
    return false;
  }

  voltar() {
    this.router.navigate(['/acompanhamentos'], { queryParams: { aba: 'solicitacoes-compra' } });
  }

  cancelar() {
    this.abreModalCancelar();
  }

  bloquear() {
    this.abreModalBloquear();
  }

  abreModalCancelar() {
    const modalRef = this.modalService.open(CancelarSolicitacaoCompraComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });

    if (this.itensSelecionados.length === this.solicitacao.itens.length) {
      modalRef.componentInstance.titulo =
        'Tem certeza que deseja cancelar todos os itens da solicitação de compra ' +
        this.solicitacao.idSolicitacaoCompra +
        '?';
    } else {
      modalRef.componentInstance.itensSolicitacaoCompra = this.itensSelecionados;
      modalRef.componentInstance.titulo =
        'Tem certeza que deseja cancelar os itens selecionados da solicitação de compra ' +
        this.solicitacao.idSolicitacaoCompra +
        '?';
    }

    modalRef.result.then((result) => {
      if (result) {
        this.confirmaCancelamento(this.solicitacao.idSolicitacaoCompra, result.justificativa);
      }
    });
  }

  confirmaCancelamento(idSolicitacaoCompra: number, justificativa: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const idsItensSelecionados = this.itensSelecionados.map((p) => p.idItemSolicitacaoCompra);
    this.solicitacaoCompraService
      .cancelarSolicitacao(idSolicitacaoCompra, idsItensSelecionados, justificativa)
      .pipe(takeUntil(this.unsubscribe)).subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.obterSolicitacaoCompra();
            this.alterarStatusItensSc(
              idsItensSelecionados,
              SituacaoSolicitacaoItemCompra.Cancelada,
            );
            this.removerselecaoItens();
            this.blockUI.stop();
          } else {
            this.toastr.warning('Falha ao cancelar Solicitação de compra.');
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  itensDisponiveisNovos(): boolean {
    const itensNovos = this.itensDisponiveis.some(
      (p) => p.situacao === SituacaoSolicitacaoItemCompra.Nova,
    );

    if (itensNovos) { return true; }
    return false;
  }

  btnBloquear(): boolean {
    const itensNovos = this.itensDisponiveis.some(
      (p) =>
        p.situacao === SituacaoSolicitacaoItemCompra.Nova ||
        p.situacao === SituacaoSolicitacaoItemCompra.Disponivel ||
        p.situacao === SituacaoSolicitacaoItemCompra.Aberta ||
        p.situacao === SituacaoSolicitacaoItemCompra['Disponível em Pre-pedido'],
    );

    if (itensNovos) { return true; }
    return false;
  }

  disabledBtnCancelar(): boolean {
    const selecionados = this.itensSelecionados.filter(
      (p) => p.situacao !== SituacaoSolicitacaoItemCompra.Nova,
    );
    if (selecionados && selecionados.length) {
      return true;
    }
    return false;
  }

  btnDesbloquear(): boolean {
    let itensBloqueados = [];
    if (this.solicitacao != null) {
      itensBloqueados = this.itensDisponiveis.filter(
        (i) => i.situacao === SituacaoSolicitacaoItemCompra.Bloqueada,
      );

      if (itensBloqueados.length !== 0) {
        return true;
      }
    }
    return false;
  }

  desbloquear() {
    const modalRef = this.modalService.open(DesbloqueioItemSolicitacaoCompraComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });

    const itensSolicitacaoCompra = JSON.parse(JSON.stringify(this.itensSelecionados));
    modalRef.componentInstance.itensSolicitacaoCompra = itensSolicitacaoCompra;

    modalRef.result.then((result) => {
      if (result) {
        this.confirmaDesbloquear();
      }
    });
  }

  disabledBtnDesbloquear(): boolean {
    const selecionados = this.itensSelecionados.filter(
      (p) => p.situacao !== SituacaoSolicitacaoItemCompra.Bloqueada,
    );
    if (selecionados && selecionados.length) {
      return true;
    }
    return false;
  }

  disabledBtnBloquear(): boolean {
    const selecionados = this.itensSelecionados.filter(
      (p) => p.situacao === SituacaoSolicitacaoItemCompra.Bloqueada,
    );
    if (selecionados && selecionados.length) {
      return true;
    }
    return false;
  }

  disabledBtnVincular() {
    return !this.itensSelecionados.some((x) => x.situacao === SituacaoSolicitacaoItemCompra.Nova);
  }

  abreModalBloquear() {
    const modalRef = this.modalService.open(DevolverSolicitacaoCompraComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });

    if (this.itensSelecionados.length === this.solicitacao.itens.length) {
      modalRef.componentInstance.titulo =
        'Tem certeza que deseja bloquear todos os itens da solicitação de compra ' +
        this.solicitacao.idSolicitacaoCompra +
        '?';
    } else {
      modalRef.componentInstance.itensSolicitacaoCompra = this.itensSelecionados;
      modalRef.componentInstance.titulo =
        'Tem certeza que deseja bloquear os itens selecionados da solicitação de compra ' +
        this.solicitacao.idSolicitacaoCompra +
        '?';
    }

    modalRef.result.then((result) => {
      if (result) {
        this.confirmaDevolver(
          this.solicitacao.idSolicitacaoCompra,
          result.justificativa,
          result.enviarEmail,
        );
      }
    });
  }

  confirmaDevolver(
    idSolicitacaoCompra: number,
    justificativa: string,
    enviarEmail: boolean,
  ) {
    const idsItensSelecionados = this.itensSelecionados.map((p) => p.idItemSolicitacaoCompra);
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .devolverSolicitacao(idSolicitacaoCompra, idsItensSelecionados, enviarEmail, justificativa)
      .pipe(takeUntil(this.unsubscribe)).subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.alterarStatusItensSc(
              idsItensSelecionados,
              SituacaoSolicitacaoItemCompra.Bloqueada,
            );
            this.obterSolicitacaoCompra();
            this.removerselecaoItens();
            this.blockUI.stop();
          } else {
            this.toastr.warning('Falha ao devolver Solicitação de compra.');
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  confirmaDesbloquear() {
    const idsItensSelecionados = this.itensSelecionados.map((p) => p.idItemSolicitacaoCompra);
    this.alterarStatusItensSc(idsItensSelecionados, SituacaoSolicitacaoItemCompra.Nova);
    this.obterSolicitacaoCompra();
    this.removerselecaoItens();
  }

  alterarResponsavel() {
    const modalRef = this.modalService.open(ManterUsuarioResponsavelSolicitacaoCompraComponent, {
      centered: true,
    });
    modalRef.componentInstance.itemSolicitacaoCompra = this.solicitacao.itens[0];
    modalRef.result.then((result) => {
      if (result) {
        this.solicitacao.itens[0] = result;
      }
    });
  }

  alternarPedidoRegularizacao() {
    const indexItemAtivo = this.solicitacao.itens.findIndex(
      (item) => item.situacao === SituacaoSolicitacaoItemCompra.Nova,
    );
    if (indexItemAtivo !== -1) {
      this.emRegularizacao = true;
    } else {
      this.toastr.warning(
        'Não há itens disponíveis para gerar novo pedido de regularização, pois todos já se encontram vinculados ou finalizados.',
      );
    }
  }

  selecionarItens() {
    const indexItemAtivo = this.solicitacao.itens.findIndex(
      (item) => item.situacao !== SituacaoSolicitacaoItemCompra.Concluida,
    );
    if (indexItemAtivo !== -1) {
      this.emSelecao = true;
    } else {
      this.toastr.warning(
        'Não há itens disponíveis para seleção, pois todos encontram com situação diferente de nova.',
      );
    }
  }

  removerselecaoItens() {
    this.emSelecao = false;
    this.todosItensDisponiveisSelecionados = false;
    this.itensSelecionados = new Array<ItemSolicitacaoCompra>();
    this.itensDisponiveisSelecionados = new Array<ItemSolicitacaoCompra>();
  }

  gerarPedidoRegularizacao() {
    if (
      this.itensSelecionados &&
      this.itensSelecionados.length &&
      this.validaItensSelecionadosPedidoRegularizacao()
    ) {
      const modalRef = this.modalService.open(ManterPedidoRegularizacaoComponent, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
      });
      modalRef.componentInstance.idSolicitacaoCompra = this.idSolicitacaoCompra;
      modalRef.componentInstance.idUsuarioRequisitante = this.solicitacao.usuario
        ? this.solicitacao.usuario.idUsuario
        : null;
      modalRef.componentInstance.itensSolicitacaoCompra = this.itensSelecionados;
      modalRef.componentInstance.solicitacaoCompra = this.solicitacao;
      modalRef.componentInstance.codigosProdutos = this.itensSelecionados.map((p) => p.codigoProduto);
      const idsItensSelecionados = this.itensSelecionados.map((p) => p.idItemSolicitacaoCompra);

      modalRef.result.then((result) => {
        if (result) {
          this.removerselecaoItens();
          this.alterarStatusItensSc(idsItensSelecionados, SituacaoSolicitacaoItemCompra.Concluida);
        }
      });
    } else {
      this.toastr.warning(
        'Para gerar um pedido de regularização é necessário selecionar ao menos um item da solicitação',
      );
    }
  }

  disabledBtnGerarPedidoRegularizacao(): boolean {
    const selecionados = this.itensSelecionados.filter(
      (p) => p.situacao !== SituacaoSolicitacaoItemCompra.Nova,
    );
    if (selecionados.length) {
      return true;
    }
    return false;
  }

  selecionarItem(selecionado: boolean, index: number) {
    if (selecionado) {
      this.itensSelecionados.push(this.solicitacao.itens[index]);
      if (this.itensDisponiveis.length === this.itensSelecionados.length) {
        this.todosItensDisponiveisSelecionados = true;
      }
    } else {
      this.itensSelecionados = this.itensSelecionados.filter(
        (i) => i.idItemSolicitacaoCompra !== this.solicitacao.itens[index].idItemSolicitacaoCompra,
      );
      this.todosItensDisponiveisSelecionados = false;
    }
  }

  itemSelecionado(index: number): boolean {
    return (
      this.itensSelecionados.findIndex(
        (item) =>
          item.idItemSolicitacaoCompra === this.solicitacao.itens[index].idItemSolicitacaoCompra,
      ) !== -1
    );
  }

  btnSelecionarItens(): boolean {
    let itensSelecionaveis = [];
    if (this.solicitacao != null) {
      itensSelecionaveis = this.solicitacao.itens.filter(
        (item) => item.situacao !== SituacaoSolicitacaoItemCompra.Concluida,
      );

      if (itensSelecionaveis.length !== 0) {
        return true;
      }
    }
    return false;
  }

  selecionarTodosDisponiveis() {
    if (this.todosItensDisponiveisSelecionados) {
      this.todosItensDisponiveisSelecionados = false;
      this.itensSelecionados = new Array<ItemSolicitacaoCompra>();
    } else {
      this.todosItensDisponiveisSelecionados = true;
      this.solicitacao.itens.forEach((item) => {
        if (
          item.situacao !== SituacaoSolicitacaoItemCompra.Concluida &&
          this.exibirItemDisponivel(item) &&
          !this.itemDisponivelSelecionado(item)
        ) {
          this.itensDisponiveisSelecionados.push(item);
        }
        this.itensSelecionados = this.itensDisponiveisSelecionados;
      });
    }
  }

  exibirItemDisponivel(itemSolicitacaoCompra: ItemSolicitacaoCompra): boolean {
    return (
      !this.itensDisponiveisBusca ||
      this.itensDisponiveisBusca.findIndex(
        (item) => item.idItemSolicitacaoCompra === itemSolicitacaoCompra.idItemSolicitacaoCompra,
      ) !== -1
    );
  }

  itemDisponivelSelecionado(itemSolicitacaoCompra: ItemSolicitacaoCompra): boolean {
    return (
      this.itensDisponiveisSelecionados.findIndex(
        (item) => item.idItemSolicitacaoCompra === itemSolicitacaoCompra.idItemSolicitacaoCompra,
      ) !== -1
    );
  }

  vinculeProduto() {
    const idsItensSelecionados = this.itensSelecionados
      .filter((x) => x.situacao === SituacaoSolicitacaoItemCompra.Nova)
      .map((x) => x.idItemSolicitacaoCompra);

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .vinculeProdutosSelecionados(idsItensSelecionados)
      .pipe(takeUntil(this.unsubscribe)).subscribe(
        (response) => {
          if (response === 'Existem itens que não foram vinculados!') {
            this.toastr.warning(response);
            this.trateRespostaItensVinculados(idsItensSelecionados);
          } else {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.trateRespostaItensVinculados(idsItensSelecionados);
          }
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private trateRespostaItensVinculados(idsItensSelecionados: number[]) {
    this.alterarStatusItensSc(
      idsItensSelecionados,
      SituacaoSolicitacaoItemCompra.Bloqueada,
    );
    this.obterSolicitacaoCompra();
    this.removerselecaoItens();
    this.blockUI.stop();
  }

  private isBotaoAlterarResponsavelVisivel(): boolean {
    const perfil = this.authService.perfil();

    return [PerfilUsuario.Gestor, PerfilUsuario.Comprador, PerfilUsuario.Administrador].includes(
      perfil,
    );
  }

  private obterParametros() {
    this.paramsSub = this.route.params
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idSolicitacaoCompra = params['idSolicitacaoCompra'];

        if (this.idSolicitacaoCompra) {
          this.obterSolicitacaoCompra();
        } else {
          this.blockUI.stop();
        }
      });
  }

  private alterarStatusItensSc(
    idsItensSelecionados: Array<number>,
    situacaoSolicitacaoItemCompra: SituacaoSolicitacaoItemCompra,
  ) {
    idsItensSelecionados.forEach((id) => {
      const item = this.solicitacao.itens.find((p) => p.idItemSolicitacaoCompra === id);
      if (item != null) { item.situacao = situacaoSolicitacaoItemCompra; }
    });
  }

  private validaItensSelecionadosPedidoRegularizacao(): boolean {
    const itensNaoPodeGerarPedido = this.itensSelecionados.filter(
      (p) => p.situacao !== SituacaoSolicitacaoItemCompra.Nova,
    );

    if (itensNaoPodeGerarPedido.length > 0) {
      return false;
    }

    return true;
  }

  // #endregion
}
