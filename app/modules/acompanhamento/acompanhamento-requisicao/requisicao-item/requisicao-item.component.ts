import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ConfirmacaoComponent } from '@shared/components';
import { Moeda, PerfilUsuario, RequisicaoItem, RequisicaoItemTramite, SituacaoRequisicaoItem, SituacaoSolicitacaoItemCompra, UnidadeMedidaTempo, Usuario } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import * as business from 'moment-business';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ListarFluxoIntegracaoErpComponent } from '../../../../shared/components/listar-fluxo-integracao-erp/listar-fluxo-integracao-erp.component';
import { ConfiguracaoDeModuloIntegracao } from '../../../../shared/models/configuracao-de-modulo-integracao';
import { OrigemFluxoIntegracaoErp } from '../../../../shared/models/enums/origem-fluxo-integracao-erp.enum';
import { TimelineItemStatus } from '../../../../shared/models/enums/timeline-item-status.enum';
import { TimelineItem } from '../../../../shared/models/timeline-item';
import { ConfiguracaoDeModuloIntegracaoService } from '../../../../shared/providers/configuracao-de-modulo-integracao-service';
import { RequisicaoService } from '../../../../shared/providers/requisicao.service';
import { ManterRequisicaoItemComponent } from '../manter-requisicao-item/manter-requisicao-item.component';
import { ManterUsuarioResponsavelComponent } from '../manter-usuario-responsavel/manter-usuario-responsavel.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'requisicao-item',
  templateUrl: './requisicao-item.component.html',
  styleUrls: ['./requisicao-item.component.scss'],
})
export class RequisicaoItemComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  Moeda = Moeda;

  // tslint:disable-next-line: no-input-rename
  @Input('requisicao-item') item: RequisicaoItem;

  SituacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  SituacaoRequisicaoItem = SituacaoRequisicaoItem;
  UnidadeMedidaTempo = UnidadeMedidaTempo;

  usuarioLogado: Usuario;

  slaStart: string;
  slaEvent: string;
  flagBotaoEditarVisivel: boolean = false;
  flagExibirCronometro: boolean = false;
  flagBotaoCancelarVisivel: boolean = false;
  flagBotoesAvaliacaoVisivel: boolean = false;
  flagBotoesGestorVisivel: boolean = false;
  integracaoErpHabilitada: boolean;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private requisicaoService: RequisicaoService,
    private autenticacaoService: AutenticacaoService,
    private modalService: NgbModal,
    private configuracaoDeModuloIntegracao: ConfiguracaoDeModuloIntegracaoService,
  ) {
    super();
  }

  ngOnInit() {
    if (!this.usuarioLogado) {
      this.obterUsuarioLogado();
    }

    this.processeFlags();
    this.iniciarCronometro();

    this.integracaoErpHabilitada = this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica.habilitarIntegracaoERP;
  }

  editarItem() {
    const modalRef = this.modalService.open(ManterRequisicaoItemComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.requisicaoItem = this.item;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.item.situacao = result.situacao;
          this.item.moeda = result.moeda;
          this.item.tramites = result.tramites;
          this.item.enderecoEntrega = result.enderecoEntrega;

          this.processeFlags();
          this.atualizarTimeLine(this.item.tramites);
        }
      },
      (reason) => { });
  }

  alterarResponsavel() {
    const modalRef = this.modalService.open(ManterUsuarioResponsavelComponent, {
      centered: true,
    });
    modalRef.componentInstance.requisicaoItem = this.item;
    modalRef.result.then((result) => {
      if (result) {
        this.item = result;
      }
    });
  }

  monitorarIntegracaoErp() {
    const modalRef = this.modalService.open(ListarFluxoIntegracaoErpComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.id = this.item.idRequisicaoItem;
    modalRef.componentInstance.origem = OrigemFluxoIntegracaoErp.requisicao;
    modalRef.componentInstance.modoModal = true;
  }

  solicitaAprovarItem() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Deseja aprovar esta requisição?`;
    modalRef.result.then((result) => {
      if (result) { this.aprovarItem(); }
    });
  }

  aprovarItem() {
    this.blockUI.start();

    this.requisicaoService.aprovarItem(this.item).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.item.situacao = SituacaoRequisicaoItem.Aprovado;
            if (this.item.tramites) {
              this.item.tramites.push(
                new RequisicaoItemTramite(
                  0,
                  this.item.idRequisicaoItem,
                  SituacaoRequisicaoItem.Aprovado,
                  '',
                ),
              );

              this.atualizarTimeLine(this.item.tramites);
            }

            // atualizar dados para Cronometro de Sla
            this.item.dataAprovacao = response.dataAprovacao;
            this.item.ultimoRegistroInicioSla = response.ultimoRegistroInicioSla;
            this.item.duracaoSla = 0;
            this.item.tempoSla = response.tempoSla;
            this.item.unidadeMedidaTempoSla = response.unidadeMedidaTempoSla;

            this.iniciarCronometro();
            this.processeFlags();
          } else {
            this.toastr.warning(
              'Falha ao aprovar o item solicitado. Se o item ainda está disponível para avaliação e tente novamente',
            );
          }
          this.blockUI.stop();
        },
        (responseError) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  solicitaReprovarItem() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja reprovar a requisição?`;
    modalRef.result.then((result) => {
      if (result) { this.reprovarItem(); }
    });
  }

  reprovarItem() {
    this.blockUI.start();

    this.requisicaoService.reprovarItem(this.item).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.item.situacao = SituacaoRequisicaoItem['Em Configuração'];

            if (this.item.tramites) {
              this.item.tramites.push(
                new RequisicaoItemTramite(
                  0,
                  this.item.idRequisicaoItem,
                  SituacaoRequisicaoItem.Recusado,
                  '',
                ),
              );
              this.item.tramites.push(
                new RequisicaoItemTramite(
                  0,
                  this.item.idRequisicaoItem,
                  SituacaoRequisicaoItem['Em Configuração'],
                  '',
                ),
              );

              this.atualizarTimeLine(this.item.tramites);
            }

            this.processeFlags();
          } else {
            let mensagemErro: string =
              'Falha ao reprovar o item solicitado. Por favor, verifique a sua conexão com a internet';
            mensagemErro += ' e se o item ainda está disponível para avaliação e tente novamente';
            this.toastr.warning(mensagemErro);
          }
          this.blockUI.stop();
        },
        (responseError) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  solicitaCancelarItem() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja cancelar a requisição?`;
    modalRef.result.then((result) => {
      if (result) { this.cancelarItem(); }
    });
  }

  cancelarItem() {
    this.blockUI.start();

    this.requisicaoService.cancelarItem(this.item).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.item.situacao = SituacaoRequisicaoItem.Cancelado;

            if (this.item.idSubItemSolicitacaoCompra) {
              this.item.subItemSolicitacaoCompra = response.subItemSolicitacaoCompra;
            } else if (this.item.idItemSolicitacaoCompra) {
              this.item.itemSolicitacaoCompra = response.itemSolicitacaoCompra;
            }

            if (this.item.tramites) {
              this.item.tramites.push(
                new RequisicaoItemTramite(
                  0,
                  this.item.idRequisicaoItem,
                  SituacaoRequisicaoItem.Cancelado,
                  '',
                ),
              );

              this.atualizarTimeLine(this.item.tramites);
            }

            this.processeFlags();

            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            let mensagemErro: string =
              'Falha ao cancelar o item solicitado. Por favor, verifique a sua conexão com a internet';
            mensagemErro += ' e se o item ainda está disponível para avaliação e tente novamente';
            this.toastr.warning(mensagemErro);
          }
          this.blockUI.stop();
        },
        (responseError) => {
          this.blockUI.stop();
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  exibirAuditoriaItem() {
    const modalRef = this.modalService.open(AuditoriaComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.nomeClasse = 'RequisicaoItem';
    modalRef.componentInstance.idEntidade = this.item.idRequisicaoItem;
  }

  onRequisicaoItemFavoritoChanged(isFavorito: boolean) {
    this.requisicaoService.favoritarItem(this.item.idRequisicaoItem, isFavorito).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) { this.item.isFavorito = isFavorito; }
        },
        (error) => {
          this.toastr.error('Erro inesperado ao favoritar item. Por favor, tente novamente');
        },
      );
  }

  pausarSla() {
    this.requisicaoService.pararSlaRequisicaoItem(this.item).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => { },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  iniciarSla() {
    this.requisicaoService.iniciarSlaRequisicaoItem(this.item).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => { },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  obterTramites() {
    if (!this.item.tramites) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.requisicaoService.obterTramites(this.item.idRequisicaoItem).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response && response.length) {
              this.item.tramites = response;

              this.atualizarTimeLine(response, true);
            }
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  permitirAcoesCronometroSla(): boolean {
    if (this.usuarioLogado) {
      return [PerfilUsuario.Comprador, PerfilUsuario.Gestor, PerfilUsuario.Administrador].includes(
        this.usuarioLogado.permissaoAtual.perfil,
      );
    } else { return false; }
  }

  // #region Comentarios
  obterComentarios() {
    if (!this.item.comentarios) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.requisicaoService.obterComentariosPorIdRequisicaoItem(this.item.idRequisicaoItem).pipe(
        takeUntil(this.unsubscribe))
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

    this.requisicaoService.comentarItem(this.item.idRequisicaoItem, comentario).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            response.usuarioAutor = this.autenticacaoService.usuario();
            this.item.comentarios.unshift(response);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error(
              'Falha ao enviar comentário. Por favor, verifique a sua conexão com a internet e tente novamente.',
            );
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
  // #endregion

  iniciarCronometro() {
    if (this.exibirCronometro()) {
      // Preparar dados cronometro
      if (!this.item.duracaoSla) { this.item.duracaoSla = 0; }

      let slaMs;

      if (this.item.itemSolicitacaoCompra && this.item.itemSolicitacaoCompra.slaItem) {
        slaMs = moment
          .duration(
            this.item.itemSolicitacaoCompra.slaItem.tempo,
            this.item.itemSolicitacaoCompra.slaItem.unidadeMedidaTempo === UnidadeMedidaTempo.Dia
              ? 'days'
              : 'hours',
          )
          .asMilliseconds();
      } else {
        slaMs = moment
          .duration(
            this.item.tempoSla,
            this.item.unidadeMedidaTempoSla === UnidadeMedidaTempo.Dia ? 'days' : 'hours',
          )
          .asMilliseconds();
      }

      let now = moment();

      if (business.isWeekendDay(now)) {
        if (now.isoWeekday() === 6) { now = now.subtract(0, 'day'); } else { now = now.subtract(1, 'day'); }

        now.set('hours', 0);
        now.set('minutes', 0);
        now.set('seconds', 0);
      }

      this.slaStart = now.format();
      if (this.item.ultimoRegistroPausaSla) {
        // Calculo para obter tempo restante:
        // now + (tempoSla'ms - duracao'ms)

        this.slaEvent = now.add(slaMs - this.item.duracaoSla, 'milliseconds').format();
      } else {
        // Calculo para obter tempo restante:
        // now + (tempoSla'ms - (duracao'ms + (now - ultimoRegistroInicioSla)'ms)

        const weekendDays = business.weekendDays(moment(this.item.dataHoraSla), now);

        const duracaoSlaMs =
          this.item.duracaoSla +
          (now.diff(moment(this.item.dataHoraSla), 'milliseconds') -
            moment.duration(weekendDays, 'days').asMilliseconds());
        const tempoToSlaMs = slaMs - duracaoSlaMs;

        this.slaEvent = now.add(tempoToSlaMs, 'milliseconds').format();
      }
    }
  }

  exibirBotaoFluxoIntegracaoErp(): boolean {
    return this.integracaoErpHabilitada &&
      this.item &&
      this.item.situacao !== SituacaoRequisicaoItem['Aguardando Aprovação Interna'] &&
      this.item.situacao !== SituacaoRequisicaoItem['Em Configuração'];
  }

  private processeFlags() {
    this.flagBotaoEditarVisivel = this.isBotaoEditarVisivel();
    this.flagExibirCronometro = this.exibirCronometro();
    this.flagBotaoCancelarVisivel = this.isBotaoCancelarVisivel();
    this.flagBotoesAvaliacaoVisivel = this.isBotoesAvaliacaoVisiveis();
    this.flagBotoesGestorVisivel = this.isBotoesGestorVisiveis();
  }

  private obterUsuarioLogado() {
    this.usuarioLogado = this.autenticacaoService.usuario();
  }

  private isBotaoEditarVisivel() {
    // return true;
    return this.isBotoesRequisitanteVisiveis() || this.isEdicaoHabilitada();
  }

  private isEdicaoHabilitada(): boolean {
    return (
      this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Comprador &&
      this.item.situacao === SituacaoRequisicaoItem['Em Cotação']
    );
  }

  private isBotoesRequisitanteVisiveis(): boolean {
    if (this.item.situacao !== SituacaoRequisicaoItem['Em Configuração']) {
      return false;
    }

    return this.item.usuarioSolicitante.idUsuario === this.usuarioLogado.idUsuario;
  }

  private isBotoesGestorVisiveis(): boolean {
    const perfil = this.autenticacaoService.perfil();

    return (
      [PerfilUsuario.Gestor, PerfilUsuario.Administrador].includes(perfil) &&
      this.item.situacao !== SituacaoRequisicaoItem.Cancelado &&
      this.item.situacao !== SituacaoRequisicaoItem['Integração Requisição Cancelada'] &&
      this.item.situacao !== SituacaoRequisicaoItem['Aguardando Integração Requisição']
    );
  }

  private isBotoesFluxoIntegracaoErpVisivel(): boolean {
    const perfil = this.autenticacaoService.perfil();

    return this.integracaoErpHabilitada;
  }

  private isBotoesAvaliacaoVisiveis(): boolean {
    if (this.item.situacao !== SituacaoRequisicaoItem['Aguardando Aprovação Interna']) {
      return false;
    }

    if (
      this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Gestor ||
      this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Administrador
    ) {
      return true;
    }

    return (
      this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Aprovador &&
      this.item.centroCusto.idUsuarioResponsavel === this.usuarioLogado.idUsuario
    );
  }

  private isBotaoCancelarVisivel(): boolean {
    return ![
      SituacaoRequisicaoItem.Finalizado,
      SituacaoRequisicaoItem.Cancelado,
      SituacaoRequisicaoItem['Aguardando Integração Requisição'],
      SituacaoRequisicaoItem['Integração Requisição Cancelada'],
    ].includes(this.item.situacao);
  }

  private exibirCronometro(): boolean {
    return [SituacaoRequisicaoItem.Aprovado, SituacaoRequisicaoItem['Em Cotação']].includes(this.item.situacao);
  }

  private atualizarTimeLine(tramites: Array<RequisicaoItemTramite>, blockUi: boolean = false): void {
    this.construirTimeline(tramites).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((timeline) => {
        this.item.timeline = timeline;
        if (blockUi) {
          this.blockUI.stop();
        }
      });
  }

  private construirTimeline(tramites: Array<RequisicaoItemTramite>): Observable<Array<TimelineItem>> {
    const executeConstrucaoDaTimeline: () => Array<TimelineItem> = () => {
      const empresaSolicitanteComIntegracaoErp: boolean = this.item.empresaSolicitante.habilitarIntegracaoERP;
      const empresaSolicitanteComIntegracaoErpAprovaRequisicaoAutomaticamente: boolean = empresaSolicitanteComIntegracaoErp && this.item.empresaSolicitante.habilitarAprovacaoAutomaticaRequisicao;
      const empresaSolicitanteSemIntegracaoErpAprovaRequisicaoAutomaticamente: boolean = this.item.empresaSolicitante.aprovarRequisicoesAutomatico;
      const requerAprovacaoInterna: boolean = (!empresaSolicitanteComIntegracaoErp && !empresaSolicitanteSemIntegracaoErpAprovaRequisicaoAutomaticamente) ||
        (empresaSolicitanteComIntegracaoErp && !empresaSolicitanteComIntegracaoErpAprovaRequisicaoAutomaticamente);
      const timelineMap = new Map<number, TimelineItem>();

      timelineMap.set(SituacaoRequisicaoItem['Pré Requisição'], new TimelineItem({ iconClass: 'fas fa-clipboard-list', title: 'Requisição Gerada' }));
      timelineMap.set(SituacaoRequisicaoItem['Em Configuração'], new TimelineItem({ iconClass: 'fas fa-edit', title: SituacaoRequisicaoItem[SituacaoRequisicaoItem['Em Configuração']] }));

      if (requerAprovacaoInterna) {
        timelineMap.set(SituacaoRequisicaoItem['Aguardando Aprovação Interna'],
          new TimelineItem({ iconClass: 'fas fa-clipboard-check', title: SituacaoRequisicaoItem[SituacaoRequisicaoItem['Aguardando Aprovação Interna']] }));
      }

      if (empresaSolicitanteComIntegracaoErp) {
        timelineMap.set(
          SituacaoRequisicaoItem['Aguardando Integração Requisição'], new TimelineItem({ iconClass: 'fas fa-cog', title: SituacaoRequisicaoItem[SituacaoRequisicaoItem['Aguardando Integração Requisição']] }));
      }

      timelineMap.set(SituacaoRequisicaoItem.Aprovado, new TimelineItem({ iconClass: 'far fa-check-circle', title: SituacaoRequisicaoItem[SituacaoRequisicaoItem.Aprovado] }));
      timelineMap.set(SituacaoRequisicaoItem['Em Cotação'], new TimelineItem({ iconClass: 'fas fa-search-dollar', title: SituacaoRequisicaoItem[SituacaoRequisicaoItem['Em Cotação']] }));
      timelineMap.set(SituacaoRequisicaoItem.Finalizado, new TimelineItem({ iconClass: 'far fa-times-circle', title: SituacaoRequisicaoItem[SituacaoRequisicaoItem.Finalizado] }));

      if (tramites && tramites.length) {
        tramites.forEach((tramite, index) => {
          if (timelineMap.has(tramite.situacao)) {
            timelineMap.get(tramite.situacao).status = TimelineItemStatus.success;
          }

          switch (tramite.situacao) {
            case SituacaoRequisicaoItem['Em Configuração']: {
              if (tramites[index - 1].situacao === SituacaoRequisicaoItem.Recusado && requerAprovacaoInterna) {
                timelineMap.get(SituacaoRequisicaoItem['Aguardando Aprovação Interna']).status = TimelineItemStatus.fail;
              }

              break;
            }

            case SituacaoRequisicaoItem['Aprovado']: {
              if (tramites[index - 1].situacao === SituacaoRequisicaoItem['Em Cotação']) {
                timelineMap.get(SituacaoRequisicaoItem['Em Cotação']).status = null;
              } else if (tramites[index - 1].situacao === SituacaoRequisicaoItem.Finalizado) {
                timelineMap.get(SituacaoRequisicaoItem['Em Cotação']).status = null;
                timelineMap.get(SituacaoRequisicaoItem.Finalizado).status = null;
              }

              break;
            }

            case SituacaoRequisicaoItem['Em Cotação']: {
              if (tramites.some((x) => x.situacao === SituacaoRequisicaoItem.Finalizado)) {
                timelineMap.get(SituacaoRequisicaoItem.Finalizado).status = null;
              }

              break;
            }
          }
        });

        if (tramites[tramites.length - 1] && tramites[tramites.length - 1].situacao !== SituacaoRequisicaoItem['Em Configuração']) {
          timelineMap.delete(SituacaoRequisicaoItem['Em Configuração']);
        }
      } else {
        timelineMap.delete(SituacaoRequisicaoItem['Em Configuração']);
      }

      return Array.from(timelineMap.values()).reduce((previousArray, currentArray) => previousArray.concat(currentArray), []);
    };

    if (!this.item.configuracoesDaIntegracaoErpCarregadas) {
      return this.configuracaoDeModuloIntegracao.get(this.item.empresaSolicitante.idPessoaJuridica).pipe(
        takeUntil(this.unsubscribe),
        map((configuracoesDeModuloIntegracao: ConfiguracaoDeModuloIntegracao) => {
          this.item.empresaSolicitante.habilitarIntegracaoERP = configuracoesDeModuloIntegracao.habilitarIntegracaoERP;
          this.item.empresaSolicitante.habilitarAprovacaoAutomaticaRequisicao = configuracoesDeModuloIntegracao.habilitarAprovacaoAutomaticaRequisicao;
          this.item.empresaSolicitante.habilitarAprovacaoAutomaticaPedido = configuracoesDeModuloIntegracao.habilitarAprovacaoAutomaticaPedido;
          this.item.empresaSolicitante.habilitarIntegracaoSistemaChamado = configuracoesDeModuloIntegracao.habilitarIntegracaoSistemaChamado;

          return executeConstrucaoDaTimeline();
        }));
    } else {
      return new Observable((subscriber) => subscriber.next(executeConstrucaoDaTimeline()));
    }
  }
}
