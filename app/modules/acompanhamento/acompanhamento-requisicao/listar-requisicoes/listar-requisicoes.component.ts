import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuditoriaComponent } from '../../../../shared/components/auditoria/auditoria.component';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { TableConfig } from '../../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../../shared/components/data-list/table/models/table-pagination';
import { ListarFluxoIntegracaoErpComponent } from '../../../../shared/components/listar-fluxo-integracao-erp/listar-fluxo-integracao-erp.component';
import { TemaBotoesModalConfirmacao } from '../../../../shared/components/modals/smk-confirmacao/enums/tema-botoes-modal-confirmacao.enum';
import { SmkConfirmacaoComponent } from '../../../../shared/components/modals/smk-confirmacao/smk-confirmacao.component';
import { PessoaJuridica, RequisicaoItemComentario, Usuario } from '../../../../shared/models';
import { ConfiguracaoColunaDto } from '../../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../../shared/models/configuracao-filtro-usuario-dto';
import { OrigemFluxoIntegracaoErp } from '../../../../shared/models/enums/origem-fluxo-integracao-erp.enum';
import { PerfilUsuario } from '../../../../shared/models/enums/perfil-usuario';
import { SituacaoRequisicaoItem } from '../../../../shared/models/enums/situacao-requisicao-item';
import { PaginacaoPesquisaConfiguradaDto } from '../../../../shared/models/paginacao-pesquisa-configurada-dto';
import { RequisicaoDto } from '../../../../shared/models/requisicao/requisicao-dto';
import { RequisicaoFiltroDto } from '../../../../shared/models/requisicao/requisicao-filtro-dto';
import { EnumToArrayPipe } from '../../../../shared/pipes/enum-to-array.pipe';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '../../../../shared/providers';
import { RequisicaoService } from '../../../../shared/providers/requisicao.service';
import { UsuarioService } from '../../../../shared/providers/usuario.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { ManterUsuarioResponsavelComponent } from '../manter-usuario-responsavel/manter-usuario-responsavel.component';

@Component({
  selector: 'smk-listar-requisicoes',
  templateUrl: './listar-requisicoes.component.html',
  styleUrls: ['./listar-requisicoes.component.scss'],
})
export class ListarRequisicoesComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  readonly textoLoading: string = 'Buscando...';
  readonly textoLimpar: string = 'Limpar';

  requisicaoSelecionada: RequisicaoDto;
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  filtroInformado: boolean;
  paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<RequisicaoDto>;
  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoDaTable: TableConfig<RequisicaoDto>;
  permiteAlterarResponsavel: boolean;
  permiteCancelar: boolean;
  permiteAvaliar: boolean;
  permiteAuditoria: boolean;
  permiteFluxoDeIntegracaoErp: boolean;
  permiteComentario: boolean;
  exibeComentario: boolean;
  usuarioLogado: Usuario;
  empresaLogada: PessoaJuridica;
  comentarios: Array<RequisicaoItemComentario>;
  filtro: RequisicaoFiltroDto;
  formFiltro: FormGroup;
  opcoesSituacaoRequisicaoItem: Array<any>;
  usuarios: Array<Usuario>;
  usuariosLoading: boolean;

  mascaraSomenteNumeros = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: false,
  };

  SituacaoRequisicaoItem = SituacaoRequisicaoItem;
  PerfilUsuario = PerfilUsuario;

  private modalOptions: NgbModalOptions = { centered: true, backdrop: 'static' };

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private errorService: ErrorService,
    private autenticacaoService: AutenticacaoService,
    private requisicaoService: RequisicaoService,
    private arquivoService: ArquivoService,
    private usuarioService: UsuarioService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.inicialize();
  }

  limpeFiltro(): void {
    this.formFiltro.reset();
    this.filtreRequisicoes(false, true);
  }

  filtre(): void {
    this.filtreRequisicoes(false, true);
  }

  exporte(): void {
    this.inicieLoading();

    this.requisicaoService.exporte(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório de Requisições ${this.filtro.dataCriacaoInicio} a ${this.filtro.dataCriacaoFim}.xls`,
          );

          this.emitirToastrDeSucesso();
        },
        (error) => this.errorService.treatError(error));
  }

  selecione(requisicoes: Array<RequisicaoDto>): void {
    this.requisicaoSelecionada = requisicoes && requisicoes instanceof Array && requisicoes.length > 0 ? requisicoes[0] : undefined;
    this.definaSePermiteAlterarResponsavel();
    this.definaSePermiteCancelar();
    this.definaSePermiteAvaliar();
    this.definaSePermiteAuditoria();
    this.definaSePermiteFluxoDeIntegracaoErp();
    this.definaSePermiteComentario();
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.filtreRequisicoes(false);
  }

  soliciteAlterarResponsavel(): void {
    const modalRef = this.modalService.open(ManterUsuarioResponsavelComponent, this.modalOptions);

    modalRef.componentInstance.modoId = true;
    modalRef.componentInstance.idRequisicaoItem = this.requisicaoSelecionada.idRequisicaoItem;
    modalRef.componentInstance.idUsuarioResponsavel = this.requisicaoSelecionada.idUsuarioResponsavel ? this.requisicaoSelecionada.idUsuarioResponsavel : null;

    modalRef.result.then(
      (requisicaoItemAlterada) => {
        if (requisicaoItemAlterada) {
          this.filtreRequisicoes(true);
        }
      },
      () => { });
  }

  soliciteCancelar(): void {
    const modalRef = this.modalService.open(SmkConfirmacaoComponent, this.modalOptions);

    modalRef.componentInstance.conteudo = 'Deseja cancelar a requisição?';
    modalRef.componentInstance.mensagemAdicional = 'Ao cancelar a ação não poderá ser desfeita.';
    modalRef.componentInstance.temaBotaoConfirmar = TemaBotoesModalConfirmacao.vermelho;
    modalRef.componentInstance.classIcone = 'fas fa-exclamation-triangle';

    modalRef.result.then(
      (confirmou) => {
        if (confirmou) {
          this.cancele();
        }
      },
      () => { });
  }

  soliciteAprovar(): void {
    const modalRef = this.modalService.open(SmkConfirmacaoComponent, this.modalOptions);

    modalRef.componentInstance.conteudo = 'Deseja aprovar a requisição?';
    modalRef.componentInstance.temaBotaoConfirmar = TemaBotoesModalConfirmacao.verde;
    modalRef.componentInstance.classIcone = 'fas fa-check-circle';

    modalRef.result.then(
      (confirmou) => {
        if (confirmou) {
          this.aprove();
        }
      },
      () => { });
  }

  soliciteReprovar(): void {
    const modalRef = this.modalService.open(SmkConfirmacaoComponent, this.modalOptions);

    modalRef.componentInstance.conteudo = 'Deseja reprovar a requisição?';
    modalRef.componentInstance.temaBotaoConfirmar = TemaBotoesModalConfirmacao.vermelho;
    modalRef.componentInstance.classIcone = 'fas fa-times-circle';

    modalRef.result.then(
      (confirmou) => {
        if (confirmou) {
          this.reprove();
        }
      },
      () => { });
  }

  soliciteAuditoria(): void {
    const modalRef = this.modalService.open(AuditoriaComponent, { ...this.modalOptions, size: 'lg' });

    modalRef.componentInstance.nomeClasse = 'RequisicaoItem';
    modalRef.componentInstance.idEntidade = this.requisicaoSelecionada.idRequisicaoItem;
  }

  soliciteFluxoDeIntegracaoErp(): void {
    const modalRef = this.modalService.open(ListarFluxoIntegracaoErpComponent, { ...this.modalOptions, size: 'lg' });

    modalRef.componentInstance.id = this.requisicaoSelecionada.idRequisicaoItem;
    modalRef.componentInstance.origem = OrigemFluxoIntegracaoErp.requisicao;
    modalRef.componentInstance.modoModal = true;
  }

  soliciteComentarios(modalComentariosTmp: TemplateRef<any>): void {
    this.inicieLoading();

    this.requisicaoService.obterComentariosPorIdRequisicaoItem(this.requisicaoSelecionada.idRequisicaoItem).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.comentarios = response;

            this.modalService.open(modalComentariosTmp, { ...this.modalOptions, size: 'lg' }).result.then(
              () => this.comentarios = null,
              () => this.comentarios = null);
          }
        },
        (error) => this.errorService.treatError(error),
      );
  }

  envieComentario(comentario: string): void {
    this.inicieLoading();

    this.requisicaoService.comentarItem(this.requisicaoSelecionada.idRequisicaoItem, comentario).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (comentarioSalvo) => {
          if (comentarioSalvo) {
            comentarioSalvo.usuarioAutor = this.usuarioLogado;
            this.comentarios.unshift(comentarioSalvo);
            this.emitirToastrDeSucesso();
          } else {
            this.toastr.error('Falha ao enviar comentário. Por favor, verifique a sua conexão com a internet e tente novamente.');
          }
        },
        (error) => this.errorService.treatError(error),
      );
  }

  cancele(): void {
    this.inicieLoading();

    this.requisicaoService.cancelarItemPorId(this.requisicaoSelecionada.idRequisicaoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.filtreRequisicoes(true);
          } else {
            this.toastr.warning('Falha ao cancelar o item solicitado. Por favor, verifique a sua conexão com a internet e se o item ainda está disponível para avaliação e tente novamente.');
            this.blockUI.stop();
          }
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  aprove(): void {
    this.inicieLoading();

    this.requisicaoService.aprovarItemPorId(this.requisicaoSelecionada.idRequisicaoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.filtreRequisicoes(true);
          } else {
            this.toastr.warning('Falha ao aprovar o item solicitado. Se o item ainda está disponível para avaliação e tente novamente.');
            this.blockUI.stop();
          }
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  reprove(): void {
    this.inicieLoading();

    this.requisicaoService.reprovarItemPorId(this.requisicaoSelecionada.idRequisicaoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.filtreRequisicoes(true);
          } else {
            this.toastr.warning('Falha ao reprovar o item solicitado. Por favor, verifique a sua conexão com a internet e se o item ainda está disponível para avaliação e tente novamente.');
            this.blockUI.stop();
          }
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  inicieSla(idRequisicaoItem: number): void {
    this.inicieLoading();

    this.requisicaoService.iniciarSlaRequisicaoItemPorId(idRequisicaoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        () => this.filtreRequisicoes(true),
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  pauseSla(idRequisicaoItem: number): void {
    this.inicieLoading();

    this.requisicaoService.pararSlaRequisicaoItemPorId(idRequisicaoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        () => this.filtreRequisicoes(true),
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  filtreRequisicoes(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
    this.inicieLoading();

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.requisicaoService.filtre(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (paginacaoPesquisaConfigurada) => {
          // Limpando a requisição selecionada.
          this.selecione(null);

          this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
          this.configureGrid();

          if (emitirToastrDeSucesso) {
            this.emitirToastrDeSucesso();
          }
        },
        (error) => this.errorService.treatError(error));
  }

  situacoesSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  usuariosSearchFn(term: string, item: Usuario): any {
    return item.pessoaFisica.nome.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  private inicialize(): void {
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.empresaLogada = this.usuarioLogado.permissaoAtual.pessoaJuridica;

    this.construaFormFiltro();
    this.populeSituacoes();
    this.populeUsuarios();
    this.obtenhaColunasDisponiveis();
    this.filtreRequisicoesNaInicializacao();
  }

  private configureGrid(): void {
    this.configuracaoDaTable = new TableConfig<RequisicaoDto>({
      page: this.filtro.pagina,
      pageSize: this.filtro.itensPorPagina,
      totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
      totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
    });
  }

  private filtreRequisicoesNaInicializacao(): void {
    this.inicieLoading();

    this.requisicaoService.obtenhaFiltroSalvo().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: RequisicaoFiltroDto) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5 };
          this.formFiltro.patchValue(this.filtro);
          this.filtreRequisicoes(false);
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }

  private populeSituacoes(): void {
    const situacoes = new EnumToArrayPipe().transform(SituacaoRequisicaoItem) as Array<any>;

    this.opcoesSituacaoRequisicaoItem = situacoes.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  }

  private populeUsuarios(): void {
    this.usuariosLoading = true;

    this.usuarioService.getUsersFromPessoaJuridica(this.usuarioLogado.permissaoAtual.pessoaJuridica.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.usuariosLoading = false))
      .subscribe((usuarios) => this.usuarios = usuarios);
  }

  private obtenhaColunasDisponiveis(): void {
    this.requisicaoService.obtenhaColunasDiponiveis().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
        (error) => this.errorService.treatError(error));
  }

  private definaSePermiteAlterarResponsavel(): void {
    this.permiteAlterarResponsavel =
      this.requisicaoSelecionada &&
      this.autenticacaoService.usuario().permissaoAtual.idTenant === this.requisicaoSelecionada.idTenant &&
      [PerfilUsuario.Gestor, PerfilUsuario.Administrador].includes(this.usuarioLogado.permissaoAtual.perfil) &&
      ![
        SituacaoRequisicaoItem.Cancelado,
        SituacaoRequisicaoItem['Integração Requisição Cancelada'],
        SituacaoRequisicaoItem['Aguardando Integração Requisição'],
      ].includes(this.requisicaoSelecionada.situacao);
  }

  private definaSePermiteCancelar(): void {
    this.permiteCancelar =
      this.requisicaoSelecionada &&
      this.autenticacaoService.usuario().permissaoAtual.idTenant === this.requisicaoSelecionada.idTenant &&
      ![
        SituacaoRequisicaoItem.Finalizado,
        SituacaoRequisicaoItem.Cancelado,
        SituacaoRequisicaoItem['Aguardando Integração Requisição'],
        SituacaoRequisicaoItem['Integração Requisição Cancelada'],
      ].includes(this.requisicaoSelecionada.situacao);
  }

  private definaSePermiteAvaliar(): void {
    if (!this.requisicaoSelecionada || this.requisicaoSelecionada.situacao !== SituacaoRequisicaoItem['Aguardando Aprovação Interna']) {
      this.permiteAvaliar = false;
      return;
    }

    if ([PerfilUsuario.Gestor, PerfilUsuario.Administrador].includes(this.usuarioLogado.permissaoAtual.perfil)
      && this.autenticacaoService.usuario().permissaoAtual.idTenant === this.requisicaoSelecionada.idTenant) {
      this.permiteAvaliar = true;
      return;
    }

    this.permiteAvaliar =
      this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Aprovador &&
      this.requisicaoSelecionada.idUsuarioResponsavelCentroCusto === this.usuarioLogado.idUsuario;
  }

  private definaSePermiteAuditoria(): void {
    this.permiteAuditoria = this.requisicaoSelecionada && this.autenticacaoService.usuario().permissaoAtual.idTenant === this.requisicaoSelecionada.idTenant ? true : false;
  }

  private definaSePermiteFluxoDeIntegracaoErp(): void {
    this.permiteFluxoDeIntegracaoErp =
      this.requisicaoSelecionada &&
      this.autenticacaoService.usuario().permissaoAtual.idTenant === this.requisicaoSelecionada.idTenant &&
      this.empresaLogada.habilitarIntegracaoERP &&
      ![SituacaoRequisicaoItem['Aguardando Aprovação Interna'], SituacaoRequisicaoItem['Em Configuração']].includes(this.requisicaoSelecionada.situacao);
  }

  private definaSePermiteComentario(): void {
    this.exibeComentario = this.requisicaoSelecionada ? true : false;
    this.permiteComentario = this.requisicaoSelecionada && this.autenticacaoService.usuario().permissaoAtual.idTenant === this.requisicaoSelecionada.idTenant ? true : false;
  }

  private emitirToastrDeSucesso(): void {
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }

  private inicieLoading(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
  }

  private construaFormFiltro(): void {
    this.formFiltro = this.fb.group({
      idRequisicao: [null],
      situacao: [null],
      dataCriacaoInicio: [null],
      dataCriacaoFim: [null],
      idUsuarioSolicitante: [null],
      idUsuarioResponsavel: [null],
      centro: [null],
      codigoRc: [null],
      idChamado: [null],
      descricaoItem: [null],
    });

    this.formFiltro.valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((valores) => {
        this.filtro = { ...this.filtro, ...valores };

        let filtroInformado = false;

        for (const property of Object.keys(valores)) {
          if (valores[property] !== null && valores[property] !== '') {
            filtroInformado = true;
            break;
          }
        }

        this.filtroInformado = filtroInformado;
      });
  }

}
