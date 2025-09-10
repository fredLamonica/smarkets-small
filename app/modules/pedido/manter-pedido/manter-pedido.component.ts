import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ConfirmacaoComponent, ConfirmacaoMudancaPedidoComponent, ModalConfirmacaoExclusao, ObservacaoPedidoComponent, SdkModalComponent } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ManterEntregasProgramadasComponent } from '@shared/components/manter-entregas-programadas/manter-entregas-programadas.component';
import { AnaliseAprovacaoPedidoItem, Arquivo, AvaliacaoPedido, Endereco, OrigemPedido, Paginacao, Pedido, PedidoItem, PedidoTramite, PerfilUsuario, SituacaoPedido, SituacaoPedidoItem, SolicitacaoItem, SolicitacaoItemAnalise, TipoAprovacao, TipoEndereco, TipoFrete, Usuario } from '@shared/models';
import { OrigemProgramacaoDeEntrega } from '@shared/models/enums/origem-programacao-de-entrega.enum';
import { IntegracaoErp } from '@shared/models/integracao-com-erp/integracao-erp';
import { Transportadora } from '@shared/models/transportadora';
import { AprovacaoService, AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { IntegracaoErpService } from '@shared/providers/integracao-erp.service';
import { TransportadoraService } from '@shared/providers/transportadora.service';
import { ErrorService } from '@shared/utils/error.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { ColumnTypeEnum } from '../../../shared/components/data-list/models/column-type.enum';
import { SelectionModeEnum } from '../../../shared/components/data-list/models/selection-mode.enum';
import { TableConfig } from '../../../shared/components/data-list/table/models/table-config';
import { ConfigTableFerramentas } from '../../../shared/components/funcionalidade/smk-table-funcionalidade/models/config-table-ferramentas';
import { SmkTableFuncionalidadeComponent } from '../../../shared/components/funcionalidade/smk-table-funcionalidade/smk-table-funcionalidade.component';
import { ModalTextAreaComponent } from '../../../shared/components/modal-textarea/modal-textarea.component';
import { ConfiguracaoColunaDto } from '../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoColunaUsuarioDto } from '../../../shared/models/configuracao-coluna-usuario-dto';
import { ConfiguracoesEntregasProgramadas } from '../../../shared/models/configuracoes-entregas-programadas';
import { ModoModal } from '../../../shared/models/enums/modo-modal.enum';
import { OrigemFluxoIntegracaoErp } from '../../../shared/models/enums/origem-fluxo-integracao-erp.enum';
import { PedidoAnexo } from '../../../shared/models/pedido/pedido-anexo';
import { PedidoAprovacaoDto } from '../../../shared/models/pedido/pedido-aprovacao-dto';
import { PedidoCanceladoDto } from '../../../shared/models/pedido/pedido-cancelado-dto';
import { PedidoEntregaProgramadaPrevistaDto } from '../../../shared/models/pedido/pedido-entrega-programada-prevista-dto';
import { PedidoItemDataEntregaPrevistaDto } from '../../../shared/models/pedido/pedido-item-data-entrega-prevista-dto';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { AlcadaService } from '../../../shared/providers/alcada.service';
import { PedidoService } from '../../../shared/providers/pedido.service';
import { ListarHistoricoRecebimentoPedidoComponent } from '../listar-historico-recebimento-pedido/listar-historico-recebimento-pedido.component';
import { ManterDataEntregaPrevistaComponent } from '../manter-data-entrega-prevista/manter-data-entrega-prevista';
import { ManterPedidoItemComponent } from '../manter-pedido-item/manter-pedido-item.component';
import { SelecionarOutroProdutoComponent } from '../selecionar-outro-produto/selecionar-outro-produto.component';
import { VisualizarPedidoItemComponent } from '../visualizar-pedido-item/visualizar-pedido-item.component';
import { PedidoAlteracaoDto } from './../../../shared/models/pedido/pedido-alteracao-dto';
import { PedidoExibicaoDto } from './../../../shared/models/pedido/pedido-exibicao-dto';
import { PedidoItemProdutoDto } from './../../../shared/models/pedido/pedido-item-produto-dto';
import { PedidoItemServicoDto } from './../../../shared/models/pedido/pedido-item-servico-dto';
import { AcaoPosRemocaoPedidoComponent } from './../acao-pos-remocao-pedido/acao-pos-remocao-pedido.component';
import { ManterAvaliacaoComponent } from './../manter-avaliacao/manter-avaliacao.component';
import { ExibirEnderecoComponent } from './exibir-endereco/exibir-endereco.component';
import { ReceberPedidoComponent } from './receber-pedido/receber-pedido.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-pedido',
  templateUrl: './manter-pedido.component.html',
  styleUrls: ['./manter-pedido.component.scss'],
})
export class ManterPedidoComponent extends Unsubscriber implements OnInit, OnDestroy {

  get flagPermiteSelecionarTransportadora(): boolean {
    return this._flagPermiteSelecionarTransportadora;
  }

  @BlockUI() blockUI: NgBlockUI;

  initialPedidoState: string;
  hasObservacaoBeenModified: boolean = false;

  Frete = TipoFrete;
  Situacao = SituacaoPedido;
  SituacaoPedidoItem = SituacaoPedidoItem;
  SituacaoAnalise = AnaliseAprovacaoPedidoItem;
  OrigemPedido = OrigemPedido;

  titulo: string;
  tituloComplementar: string;
  idPedido: number;
  pedido: PedidoExibicaoDto;
  integracaoSapHabilitada: boolean;
  usuarioLogado: Usuario;
  dataAprovacao: string;
  faturamentoMinimo: string;
  organizacaoDeCompra: string;
  grupoDeCompradores: string;
  dataDeEntrega: string;
  alcadaDeAprovacao: string;
  configuracaoDaTableDeItens: TableConfig<PedidoItem>;
  configuracaoColunasDosItens: ConfiguracaoColunaUsuarioDto;
  configuracaoColunasDosItensService: ConfiguracaoColunaUsuarioDto;
  configuracaoFerramentasDaTable: ConfigTableFerramentas;
  exibirSecaoAnexos: boolean;
  exibirSecaoFluxoIntegracaoErp: boolean;
  pedidoItemProdutosSelecionados: PedidoItemProdutoDto[];
  pedidoItemServicosSelecionados: PedidoItemServicoDto[];
  pedidoItemProdutosCancelados: PedidoItemProdutoDto[] = [];
  pedidoItemServicosCancelados: PedidoItemServicoDto[] = [];
  enderecosComprador = {};
  enderecosFornecedor = {};
  enderecoComprador: string = '';
  enderecoFornecedor: string = '';
  contatoTransportadora: string;
  enderecoTransportadora: string = '';
  enderecoEntrega: string = '';
  permitirAvaliacaoCriterio: boolean;
  isEntregue: boolean;

  enderecos = {};
  criteriosAvaliacao: Array<AvaliacaoPedido>;
  origem: string = '';
  isLinkHabilitado: boolean = false;
  flagPermiteSalvarCodigo: boolean = false;
  form: FormGroup;
  transportadorasHomologadas: Array<Transportadora>;

  integracaoApiHabilitada: boolean;
  integracaoErpHabilitada: boolean;
  integracaoRequisicaoErp: boolean;
  integracaoRequisicaoErpComPermissaoDeEditar: boolean;
  origemFluxoIntegracaoErp = OrigemFluxoIntegracaoErp;
  exibirCodigoIntegracao: boolean;

  pedidosAnexos: Array<PedidoAnexo>;
  datasEntregasPrevistas: PedidoItemDataEntregaPrevistaDto[] = [];

  @ViewChild(SmkTableFuncionalidadeComponent) tableProdutos: SmkTableFuncionalidadeComponent<PedidoItemProdutoDto>;
  @ViewChild(SmkTableFuncionalidadeComponent) tableServicos: SmkTableFuncionalidadeComponent<PedidoItemServicoDto>;

  private _flagPermiteSelecionarTransportadora: boolean;

  private situcoesExibicaoSecaoDeAnexo =
    new Array<SituacaoPedido>(SituacaoPedido.Confirmado, SituacaoPedido.Preparado, SituacaoPedido.Faturado, SituacaoPedido.Enviado, SituacaoPedido['Entregue Parcialmente']);

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private autenticacaoService: AutenticacaoService,
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private modalService: NgbModal,
    private aprovacaoService: AprovacaoService,
    private fb: FormBuilder,
    private transportadoraService: TransportadoraService,
    private integracaoErpService: IntegracaoErpService,
    private datePipe: DatePipe,
    private serviceError: ErrorService,
    private customCurrencyPipe: CustomCurrencyPipe,
    private alcadaService: AlcadaService,
    private cdr: ChangeDetectorRef,
    private errorService: ErrorService,
  ) {
    super();
  }

  async ngOnInit() {
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.integracaoApiHabilitada = this.usuarioLogado.permissaoAtual.pessoaJuridica.integrarApiPedidos;
    this.integracaoErpHabilitada = this.usuarioLogado.permissaoAtual.pessoaJuridica.habilitarIntegracaoERP;
    this.integracaoRequisicaoErp = this.route.snapshot.data['integracaoRequisicaoErp'] as boolean;
    this.integracaoRequisicaoErpComPermissaoDeEditar = this.integracaoRequisicaoErp;
    this.integracaoSapHabilitada = this.usuarioLogado.permissaoAtual.pessoaJuridica.integracaoSapHabilitada;
    this.exibirCodigoIntegracao = this.integracaoErpHabilitada || this.integracaoApiHabilitada;

    this.obterParametros();
    this.construirFormulario();

    this.transportadorasHomologadas = (
      await this.transportadoraService.listar().toPromise()
    ).filter((th) => th.statusHomologacao === 1); // Status = Homologado
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  selecionePedidoProdutoItem(itens: Array<PedidoItemProdutoDto>): void {
    this.pedidoItemProdutosSelecionados = itens && itens instanceof Array && itens.length > 0 ? itens : undefined;
  }

  selecionePedidoServicoItem(itens: Array<PedidoItemServicoDto>): void {
    this.pedidoItemServicosSelecionados = itens && itens instanceof Array && itens.length > 0 ? itens : undefined;
  }

  salvarCodigo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pedido.codigo = this.form.controls.codigo.value;

    if (this.pedido.codigo != null || this.pedido.codigo !== '') {
      this.alterar();
    }
  }

  exibirEndereco(pedidoItem: PedidoItem) {
    const modalRef = this.modalService.open(ExibirEnderecoComponent, { centered: true });
    modalRef.componentInstance.idEnderecoEntrega = pedidoItem.idEnderecoEntrega;
  }

  obterEndereco(endereco: Endereco): string {
    if (endereco) {
      return `${endereco.cidade.estado.pais.nome} - ${endereco.cidade.estado.nome} - ${endereco.cidade.nome} - ${endereco.bairro}, ${endereco.logradouro}, ${endereco.numero} - CEP ${endereco.cep}`;
    } else {
      return '';
    }
  }

  vizualizarObservacaoNoPedido() {

    const modalObservacaoPedido = this.modalService.open(ObservacaoPedidoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalObservacaoPedido.componentInstance.pedido = this.pedido;
    modalObservacaoPedido.componentInstance.readonly = this.pedido.situacao === SituacaoPedido['Integração Requisição Cancelada'];

    modalObservacaoPedido.result.then(
      (result) => {
        if (result) {
          this.obterParametros();
          this.hasObservacaoBeenModified = true;
        }
      },
      () => { });
  }

  visualizeObservacoesItem(pedidoItemSelecionado: any) {
    const modalObservacaoPedidoItem = this.modalService.open(SdkModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalObservacaoPedidoItem.componentInstance.title = 'Observações do Item';
    modalObservacaoPedidoItem.componentInstance.hasFooter = true;
    modalObservacaoPedidoItem.componentInstance.showButtonConfirm = false;
    modalObservacaoPedidoItem.componentInstance.content = `
      <p class='col-12 text-center pt-4 font-weight-bold'>
      ${pedidoItemSelecionado.observacao ? pedidoItemSelecionado.observacao : 'O item em questão não possui observação.'}
      </p>`;
  }

  voltar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  itensAtivosProduto(): Array<PedidoItemProdutoDto> {
    if (this.pedido && this.pedido.itensProduto.length) {
      return this.pedido.itensProduto.filter((item) => item.situacao === SituacaoPedidoItem.Ativo);
    } else { return new Array<PedidoItemProdutoDto>(); }
  }

  itensAtivosServico(): Array<PedidoItemServicoDto> {
    if (this.pedido && this.pedido.itensServico.length) {
      return this.pedido.itensServico.filter((item) => item.situacao === SituacaoPedidoItem.Ativo);
    } else { return new Array<PedidoItemServicoDto>(); }
  }

  obtenhaCodigoDeIntegracaoErpDoProduto(pedido: Pedido, pedidoItem: PedidoItem): string {
    return this.pedidoService.obtenhaCodigoDeIntegracaoErpDoProduto(pedido, pedidoItem);
  }

  avaliar() {
    this.modalService
      .open(ManterAvaliacaoComponent, { centered: true })
      .result.then(() => { }, () => { });
  }

  // #region PERMISSÃO DE AÇÕES
  permitirPreparo(): boolean {
    if (this.integracaoRequisicaoErp) {
      return false;
    }

    if (this.pedido && this.pedido.situacao === SituacaoPedido.Confirmado) {
      if (
        [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Fornecedor].includes(
          this.usuarioLogado.permissaoAtual.perfil,
        ) &&
        this.usuarioLogado.permissaoAtual.pessoaJuridica.idPessoaJuridica === this.pedido.idFornecedor &&
        (this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Fornecedor || this.usuarioLogado.permissaoAtual.idTenant === this.pedido.idTenant)
      ) {
        return true;
      }
    }
  }

  permitirFaturar(): boolean {
    if (this.integracaoRequisicaoErp) {
      return false;
    }

    if (this.pedido && this.pedido.situacao === SituacaoPedido.Preparado) {
      if (
        [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Fornecedor].includes(
          this.usuarioLogado.permissaoAtual.perfil,
        ) &&
        this.usuarioLogado.permissaoAtual.pessoaJuridica.idPessoaJuridica === this.pedido.idFornecedor &&
        (this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Fornecedor || this.usuarioLogado.permissaoAtual.idTenant === this.pedido.idTenant)
      ) {
        return true;
      }
    }
  }

  permitirEnvio() {
    if (this.integracaoRequisicaoErp) {
      return false;
    }

    if (this.pedido && this.pedido.situacao === SituacaoPedido.Faturado) {
      if (
        [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Fornecedor].includes(
          this.usuarioLogado.permissaoAtual.perfil,
        ) &&
        this.usuarioLogado.permissaoAtual.pessoaJuridica.idPessoaJuridica === this.pedido.idFornecedor &&
        (this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Fornecedor || this.usuarioLogado.permissaoAtual.idTenant === this.pedido.idTenant)
      ) {
        return true;
      }
    }
  }

  permitirCancelamento() {
    if (this.integracaoRequisicaoErp) {
      return false;
    }

    if (
      this.pedido &&
      ![
        SituacaoPedido.Entregue,
        SituacaoPedido.Faturado,
        SituacaoPedido.Enviado,
        SituacaoPedido['Cancelamento Solicitado'],
        SituacaoPedido.Cancelado,
        SituacaoPedido['Aguardando Integração'],
      ].includes(this.pedido.situacao)
    ) {
      if (
        (this.usuarioLogado.idUsuario === this.pedido.idUsuario ||
          [PerfilUsuario.Administrador, PerfilUsuario.Gestor].includes(
            this.usuarioLogado.permissaoAtual.perfil,
          )) &&
        this.pedido.idTenant === this.usuarioLogado.permissaoAtual.idTenant
      ) {
        return true;
      }
    }
  }

  permitirSelecionarTransportadora() {
    if (this.integracaoRequisicaoErp) {
      return false;
    }

    if (this.pedido.frete === TipoFrete.Fob) {
      const perfilComPermissao = [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Comprador,
        PerfilUsuario.Comprador,
      ].includes(this.autenticacaoService.perfil());

      const pedidoAguardandoAprovacaoInterna =
        this.pedido.situacao === SituacaoPedido['Aguardando aprovação'];

      if (perfilComPermissao && pedidoAguardandoAprovacaoInterna) {
        return true;
      }
    }

    return false;
  }

  permitirSalvar() {
    return this.pedido && this.usuarioLogado.permissaoAtual.idTenant === this.pedido.idTenant;
  }

  permitirReceber() {
    return this.pedido && this.usuarioLogado.permissaoAtual.idTenant === this.pedido.idTenant;
  }

  //#endregion

  // #region TRAMITES DO PEDIDO
  tramitarPedido(situacao: SituacaoPedido) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

    modalRef.componentInstance.confirmacao = `Tem certeza que deseja registrar pedido como ${SituacaoPedido[situacao]}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          switch (situacao) {
            case SituacaoPedido.Preparado:
              this.prepararPedido();
              break;
            case SituacaoPedido.Faturado:
              this.faturarPedido();
              break;
            case SituacaoPedido.Enviado:
              this.enviarPedido();
              break;
            case SituacaoPedido.Entregue:
              this.receberPedido();
              break;
            default:
              break;
          }
        }
      },
      () => { });
  }

  prepararPedido() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const tramite = new PedidoTramite(
      0,
      this.idPedido,
      SituacaoPedido.Preparado,
      0,
      moment().format(),
      null,
      null,
    );

    this.pedidoService.prepararPedido(tramite).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.pedido.situacao = response.situacao;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  faturarPedido() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const tramite = new PedidoTramite(
      0,
      this.idPedido,
      SituacaoPedido.Faturado,
      0,
      moment().format(),
      null,
      null,
    );

    this.pedidoService.faturarPedido(tramite).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.pedido.situacao = response.situacao;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  enviarPedido() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const tramite = new PedidoTramite(
      0,
      this.idPedido,
      SituacaoPedido.Enviado,
      0,
      moment().format(),
      null,
      null,
    );

    this.pedidoService.enviarPedido(tramite).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.pedido.situacao = response.situacao;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  receberPedido() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const tramite = new PedidoTramite(
      0,
      this.idPedido,
      SituacaoPedido.Entregue,
      0,
      moment().format(),
      null,
      null,
    );

    this.pedidoService.receberPedido(tramite).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.pedido.situacao = response.situacao;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.isEntregue = this.pedido.situacao === SituacaoPedido.Entregue;
        },
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }
  // #endregion

  // #region RECEBER PEDIDO

  solicitarReceberPedido() {
    const modalRef = this.modalService.open(ReceberPedidoComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.pedido = this.pedido;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.pedido = result;
        }
      },
      () => { });
  }

  // #region ANÁLISE DE PEDIDO FORNECEDOR/APROVADOR INTERNO
  permitirAnalise(): boolean {
    if (this.integracaoRequisicaoErp) {
      return false;
    }

    if (this.pedido && this.usuarioLogado.permissaoAtual.pessoaJuridica.tipoAprovacao !== TipoAprovacao.Integracao) {
      switch (this.pedido.situacao) {
        case SituacaoPedido['Aguardando aprovação']:
          return this.pedido.idsAprovadores.includes(this.usuarioLogado.idUsuario) && this.pedido.idTenant === this.usuarioLogado.permissaoAtual.idTenant;

        case SituacaoPedido['Aguardando fornecedor']:
        case SituacaoPedido['Aprovado']:
          return this.usuarioLogado.permissaoAtual.pessoaJuridica.idPessoaJuridica === this.pedido.idFornecedor;

        default:
          return false;
      }
    }

    return false;
  }

  solicitarAprovarItens(pedidoItemSelecionados: any[]) {
    if (this.exibirBotaoDataEntregaPrevista(pedidoItemSelecionados) && pedidoItemSelecionados.some((item) => !item.dataEntregaPrevista)) {
      this.altereDataEntregaPrevistaItens(pedidoItemSelecionados, true);
    } else {
      this.aprovarItens(pedidoItemSelecionados);
    }
  }

  reprovarItem(pedidoItemSelecionados: any[], isProduto: boolean) {
    const modalRef = this.modalService.open(ConfirmacaoMudancaPedidoComponent, { centered: true });

    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja reprovar o item?';

    modalRef.result.then(
      (result) => {
        pedidoItemSelecionados.forEach(
          (pedidoItem) => {
            pedidoItem.solicitacaoItem.analise = new SolicitacaoItemAnalise(
              0,
              pedidoItem.solicitacaoItem.idSolicitacaoItem,
              0,
              AnaliseAprovacaoPedidoItem.Rejeitado,
              result,
            );
          },
        );

        this.atualizeItensSelecionados(pedidoItemSelecionados, isProduto);
        this.atualizeTableDeItensDoPedido();

        this.pedido.valor = this.calcularValorTotalPedido(this.pedido);
      },
      () => { });
  }

  solicitarEncerrarAnalise() {
    // Frete tipo FOB
    if (this.transportadoraObrigatoria() && !this.pedido.idTransportadora) {
      this.toastr.warning(
        `É obrigatório selecionar uma transportadora homologada para um pedido com frete FOB.`,
      );
    } else {
      const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

      modalRef.componentInstance.confirmacao = `Tem certeza que deseja encerrar a análise do pedido?`;

      modalRef.result.then(
        (result) => {
          if (result) {
            this.encerrarAnalise();
          }
        },
        () => { });
    }
  }

  encerrarAnalise() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.analiseValida()) {
      if (this.transportadoraObrigatoria()) {
        this.concluirAnaliseFreteFob();
      } else {
        this.concluirAnalise();
      }
    }
  }

  solicitarAprovarTodos(pedidoItens: any[]) {
    const itensNaoAvaliados = pedidoItens.filter((item) => !item.solicitacaoItem.analise);

    if (this.exibirBotaoDataEntregaPrevista(pedidoItens) && pedidoItens.some((item) => !item.dataEntregaPrevista)) {
      this.altereDataEntregaPrevistaItens(itensNaoAvaliados, true);
    } else {
      this.aprovarTodos(itensNaoAvaliados);
    }
  }

  reprovarTodos(pedidoItens: any[]) {
    const modalRef = this.modalService.open(ConfirmacaoMudancaPedidoComponent, { centered: true });

    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja recusar todos os itens?';

    modalRef.result.then(
      (result) => {
        pedidoItens.forEach((item) => {
          if (!item.solicitacaoItem.analise) {
            item.solicitacaoItem.analise = new SolicitacaoItemAnalise(
              0,
              item.solicitacaoItem.idSolicitacaoItem,
              0,
              AnaliseAprovacaoPedidoItem.Rejeitado,
              result,
            );
          }
        });

        this.atualizeTableDeItensDoPedido();

        this.pedido.valor = this.calcularValorTotalPedido(this.pedido);
      },
      () => { });
  }

  contruirObservacaoRecusa(pedidoItem: PedidoItem) {
    return `
      Produto: ${this.pedido.origemPedido !== OrigemPedido['Sem Negociação'] ? pedidoItem.produto.descricao : pedidoItem.descricao}
      Quantidade: ${pedidoItem.quantidade}
      Valor: R$ ${pedidoItem.valor}`;
  }

  permiteAnalisarTodos(pedidoItens: any[]): boolean {
    return pedidoItens.every((item) => item.solicitacaoItem.analise == null);
  }

  existemItensAnalisar(pedidoItens: any[]): boolean {
    return pedidoItens.some((item) => item.solicitacaoItem.analise == null);
  }

  permiteExibirProgramacaoEntrega(pedidoItemSelecionados: any[]): boolean {
    return this.itemIndividualSelecionado(pedidoItemSelecionados) && pedidoItemSelecionados[0].entregaProgramada;
  }

  permiteExibirAlterarObservacao(pedidoItemSelecionados: any[]): boolean {
    return this.permiteExibirBotoesAnalise(pedidoItemSelecionados)
      && pedidoItemSelecionados[0].solicitacaoItem
      && pedidoItemSelecionados[0].solicitacaoItem.analise
      && pedidoItemSelecionados[0].solicitacaoItem.analise.situacao === AnaliseAprovacaoPedidoItem.Rejeitado
      ;
  }

  itemIndividualSelecionado(pedidoItemSelecionados: any[]): boolean {
    if (!pedidoItemSelecionados || pedidoItemSelecionados.length === 0) {
      return false;
    }

    const idsPedidoItens = pedidoItemSelecionados.map((pi) => pi.idPedidoItem);

    const idsPedidoItensDistintos = new Set(idsPedidoItens);

    return idsPedidoItensDistintos.size === 1;
  }

  exibirBotaoDataEntregaPrevista(pedidoItemSelecionados: any[]): boolean {
    return this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Fornecedor
      && this.pedido.situacao === SituacaoPedido.Aprovado
      && this.permiteExibirBotoesAnalise(pedidoItemSelecionados);
  }

  permiteExibirBotoesAnalise(pedidoItemSelecionados: any[]): boolean {
    return pedidoItemSelecionados && pedidoItemSelecionados.length > 0
      && this.permitirAnalise();
  }

  permiteAprovarPedidoItens(pedidoItemSelecionados: any[]): boolean {
    return pedidoItemSelecionados.every((item) => !item.solicitacaoItem.analise || item.solicitacaoItem.analise.situacao !== AnaliseAprovacaoPedidoItem.Aprovado)
      ;
  }

  permiteReprovarPedidoItens(pedidoItemSelecionados: any[]): boolean {
    return pedidoItemSelecionados.every((item) => !item.solicitacaoItem.analise || item.solicitacaoItem.analise.situacao !== AnaliseAprovacaoPedidoItem.Rejeitado)
      ;
  }

  altereDataEntregaPrevistaItens(pedidoItemSelecionados: any[], aprovarItensPosConclusao = false) {
    const modalRef = this.modalService.open(ManterDataEntregaPrevistaComponent, { centered: true, backdrop: 'static', size: 'lg' });

    const dtosEntregas: PedidoItemDataEntregaPrevistaDto[] = [];

    pedidoItemSelecionados.forEach(
      (pedidoItem) => {
        if (!pedidoItem.idPedidoEntregasProgramadas) {
          dtosEntregas.push(new PedidoItemDataEntregaPrevistaDto({
            idPedidoItem: pedidoItem.idPedidoItem,
            dataEntregaPrevista: pedidoItem.dataEntregaPrevista,
            descricao: pedidoItem.produto.descricao,
          }));
        } else {
          const entrega = dtosEntregas.find((ent) => ent.idPedidoItem === pedidoItem.idPedidoItem);

          if (entrega) {
            entrega.entregasProgramadas.push(new PedidoEntregaProgramadaPrevistaDto({
              idPedidoEntregasProgramadas: pedidoItem.idPedidoEntregasProgramadas,
              dataEntregaPrevista: pedidoItem.dataEntregaPrevista,
              descricao: pedidoItem.produto.descricao,
            }));
          } else {
            dtosEntregas.push(new PedidoItemDataEntregaPrevistaDto({
              idPedidoItem: pedidoItem.idPedidoItem,
              dataEntregaPrevista: pedidoItem.dataEntregaPrevista,
              descricao: pedidoItem.produto.descricao,
              entregasProgramadas: [
                new PedidoEntregaProgramadaPrevistaDto({
                  idPedidoEntregasProgramadas: pedidoItem.idPedidoEntregasProgramadas,
                  dataEntregaPrevista: pedidoItem.dataEntregaPrevista,
                  descricao: pedidoItem.produto.descricao,
                }),
              ],
            }));
          }
        }
      },
    );

    modalRef.componentInstance.dtosEntregas = dtosEntregas;

    if (aprovarItensPosConclusao) {
      modalRef.componentInstance.validacaoAtiva = true;
    }

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apliqueDataEntregaPrevista(pedidoItemSelecionados, result, aprovarItensPosConclusao);
        }
      },
      () => { });
  }

  // #endregion

  // #region REVISÃO DE PEDIDO PELO REQUISITANTE
  solicitarEncerrarRevisao() {
    if (this.revisaoValida()) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

      modalRef.componentInstance.confirmacao = `Tem certeza que deseja encerrar a revisão do pedido?`;

      modalRef.result.then(
        (result) => {
          if (result) {
            this.encerrarRevisao();
          }
        },
        () => { });
    }
  }
  // #endregion

  solicitarCancelarPedido() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

    modalRef.componentInstance.confirmacao = `Tem certeza que deseja cancelar o pedido?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          if (this.pedido.situacao !== SituacaoPedido.Confirmado) {
            this.cancelarPedido();
          } else {
            this.soliciteMotivoCancelamento();
          }
        }
      },
      () => { });
  }

  permitirAlteracao(): boolean {
    if (this.integracaoRequisicaoErp) {
      return false;
    }

    if (this.pedido) {
      const perfil = this.autenticacaoService.perfil();
      if (this.pedido.situacao === SituacaoPedido['Aguardando requisitante']) {
        if (((perfil === PerfilUsuario.Requisitante || perfil === PerfilUsuario.Comprador || perfil === PerfilUsuario.Gestor) && this.usuarioLogado.idUsuario === this.pedido.idUsuario) ||
          (perfil === PerfilUsuario.Administrador && this.usuarioLogado.permissaoAtual.idTenant === this.pedido.idTenant)) {
          return true;
        }
      }
    }
    return false;
  }

  permiteExibirAlteracaoItem(pedidoItemSelecionados: any[]): boolean {
    if (this.integracaoRequisicaoErp) {
      return false;
    }

    if (!this.pedido) {
      return false;
    }

    if (!this.itemIndividualSelecionado(pedidoItemSelecionados)) {
      return false;
    }

    return this.permitirAlteracao();
  }

  alterarObservacao(pedidoItemSelecionado: any, isProduto: boolean) {
    const modalRef = this.modalService.open(ConfirmacaoMudancaPedidoComponent, { centered: true });
    modalRef.componentInstance.observacao = pedidoItemSelecionado.solicitacaoItem.analise.observacao;
    modalRef.componentInstance.titulo = 'Comentário';

    modalRef.result.then(
      (result) => {
        pedidoItemSelecionado.solicitacaoItem.analise.observacao = result;
        this.atualizeItensSelecionados([pedidoItemSelecionado], isProduto);
      },
      () => { });
  }

  obterOrigem() {
    if (this.pedido.idCotacao !== null && this.pedido.origemPedido === this.OrigemPedido.Cotação) {
      this.origem = this.origem.concat('COT_').concat(this.pedido.idCotacao.toString());
    } else if (this.pedido.idContratoCatalogo !== null && this.pedido.origemPedido === this.OrigemPedido.Catalogo) {
      this.origem = this.origem.concat('CAT_').concat(this.pedido.idContratoCatalogo.toString());
    } else if (this.pedido.idRegularizacao && this.pedido.origemPedido === this.OrigemPedido.Regularização) {
      this.origem = this.origem.concat('REG_').concat(this.pedido.idRegularizacao.toString());
    } else if (this.pedido.idContratoCatalogo !== null && this.pedido.origemPedido === this.OrigemPedido['Contrato Automático']) {
      this.origem = this.origem.concat('CON_').concat(this.pedido.idContratoCatalogo.toString());
    } else if (this.pedido.idContratoCatalogo !== null && this.pedido.origemPedido === this.OrigemPedido['Contrato Colaborativo']) {
      this.origem = this.origem.concat('COL_').concat(this.pedido.idContratoCatalogo.toString());
    } else {
      this.origem = '';
    }
  }

  navegarOrigem() {
    if (null != this.pedido.idContratoCatalogo && [PerfilUsuario.Administrador, PerfilUsuario.Gestor].includes(this.usuarioLogado.permissaoAtual.perfil)) {
      this.router.navigate([`${this.integracaoRequisicaoErp ? '../' : ''}../../contratos`, this.pedido.idContratoCatalogo], { relativeTo: this.route });
    } else if (null != this.pedido.idCotacao && [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador].includes(this.usuarioLogado.permissaoAtual.perfil)) {
      this.router.navigate([`${this.integracaoRequisicaoErp ? '../' : ''}../../acompanhamentos/cotacoes`, this.pedido.idCotacao], { relativeTo: this.route });
    }
  }

  linkHabilitado() {
    this.isLinkHabilitado =
      this.pedido.origemPedido !== this.OrigemPedido.Regularização &&
      ((this.pedido.idContratoCatalogo !== null && [PerfilUsuario.Administrador, PerfilUsuario.Gestor].includes(this.usuarioLogado.permissaoAtual.perfil)) ||
        (this.pedido.idCotacao !== null && [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador].includes(this.usuarioLogado.permissaoAtual.perfil)));
  }

  permiteAbrirObservacao(pedidoItemSelecionados: any[]) {
    if (!this.itemIndividualSelecionado(pedidoItemSelecionados)) {
      return false;
    }

    if (!pedidoItemSelecionados[0].solicitacaoItem
      || !pedidoItemSelecionados[0].solicitacaoItem.analise
      || pedidoItemSelecionados[0].solicitacaoItem.analise.situacao !== AnaliseAprovacaoPedidoItem.Rejeitado
    ) {

    }

    return this.permitirAlteracao();
  }

  abrirObservacao(pedidoItemSelecionado: any) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

    modalRef.componentInstance.titulo = 'Comentário';
    modalRef.componentInstance.confirmarLabel = 'none';
    modalRef.componentInstance.cancelarLabel = 'Fechar';

    modalRef.componentInstance.confirmacao = pedidoItemSelecionado.solicitacaoItem.analise.observacao
      ? `${pedidoItemSelecionado.solicitacaoItem.analise.observacao}`
      : 'Não há comentário na análise';

    modalRef.result.then(() => { }, () => { });
  }

  // #region EDIÇÃO DE PEDIDO PELO REQUISITANTE

  editarItem(pedidoItemSelecionado: any, isProduto: boolean) {
    const modalRef = this.modalService.open(ManterPedidoItemComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.pedidoItem = pedidoItemSelecionado;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.tratarEdicaoItem(result, isProduto);
        }
      },
      () => { },
    );
  }

  visualizeItem(pedidoItemSelecionado: any) {
    const modalRef = this.modalService.open(VisualizarPedidoItemComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.pedidoItem = pedidoItemSelecionado;
    modalRef.result.then(() => { }, () => { });
  }

  // #endregion

  visualizeProgramacaoDeEntrega(pedidoItemSelecionado: any) {
    const modalRef = this.modalService.open(ManterEntregasProgramadasComponent, { centered: true, size: 'lg' });

    const tituloModal = this.pedido.origemPedido === OrigemPedido['Sem Negociação'] && !pedidoItemSelecionado.produto
      ? pedidoItemSelecionado.descricao
      : pedidoItemSelecionado.produto.descricao;

    const config = new ConfiguracoesEntregasProgramadas({
      origem: OrigemProgramacaoDeEntrega.pedido,
      idItem: pedidoItemSelecionado.idPedidoItem ? pedidoItemSelecionado.idPedidoItem : pedidoItemSelecionado.idPedidoItemPai,
      modoModal: ModoModal.normal,
      tituloModal: tituloModal,
    });

    modalRef.componentInstance.config = config;
  }

  // #region REMOÇÃO DE PEDIDO PELO REQUISITANTE
  solicitarRemoverItem(pedidoItemSelecionado: any, isProduto: boolean) {
    this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        () => this.removerItem(pedidoItemSelecionado.idPedidoItem, pedidoItemSelecionado.idPedidoItemPai, isProduto),
        () => { },
      );
  }

  salvarAvaliacaoPedido(objetoSelecionado: any) {
    if (objetoSelecionado) {
      const item = this.criteriosAvaliacao[objetoSelecionado.index];
      if (!!item) {
        item.nota = objetoSelecionado.rating;

        if (item.idAvaliacaoPedido > 0) {
          this.alterarAvaliacao(item);
        } else {
          this.inserirAvaliacao(item);
        }
      }
    }
  }
  // #endregion

  // #endregion

  gerePdf() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.gerarPdfPedido(this.pedido.idPedido).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => this.toastr.success('PDF gerado com sucesso'),
        (error) => this.serviceError.treatError(error),
      );
  }

  permiteAuditoria() {
    const perfilUsuarioLogado = this.usuarioLogado.permissaoAtual.perfil;

    return (
      perfilUsuarioLogado === PerfilUsuario.Administrador ||
      perfilUsuarioLogado === PerfilUsuario.Gestor ||
      perfilUsuarioLogado === PerfilUsuario.Comprador ||
      perfilUsuarioLogado === PerfilUsuario.Requisitante
    );
  }

  abrirAuditoria() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.nomeClasse = 'Pedido';
    modalRef.componentInstance.idEntidade = this.pedido.idPedido;
  }

  changeTransportadora(transportadoraSelecionada: Transportadora): void {
    this.pedido.transportadora = null;

    if (transportadoraSelecionada) {
      this.pedido.transportadora = this.transportadorasHomologadas.find((t) => t.idTransportadora === transportadoraSelecionada.idTransportadora);
    }

    this.tratarTransportadora();
  }

  //#region historicoRecebimento
  exibirHistoricoRecebimento() {
    const modalRef = this.modalService.open(ListarHistoricoRecebimentoPedidoComponent, { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.idPedido = this.idPedido;
    modalRef.componentInstance.situacao = this.pedido.situacao;
  }

  permiteManterAnexos(): boolean {
    return this.pedido &&
      (this.integracaoErpHabilitada && this.pedido.origemPedido !== this.OrigemPedido.Regularização && this.pedido.situacao === SituacaoPedido['Aguardando Integração'] &&
        [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Requisitante, PerfilUsuario.Comprador, PerfilUsuario.Fornecedor].includes(this.usuarioLogado.permissaoAtual.perfil))
      ||
      (this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Fornecedor && this.situcoesExibicaoSecaoDeAnexo.includes(this.pedido.situacao));
  }

  inserirPedidoAnexos(arquivos: Array<Arquivo>) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.inserirAnexos(this.idPedido, arquivos).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.obterAnexos(true);
        },
        (error) => {
          this.serviceError.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  excluirAnexo(pedidoAnexo: PedidoAnexo) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pedidoService.deletarAnexo(pedidoAnexo.idPedidoAnexo).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.obterAnexos(true);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        () => {
          this.blockUI.stop();
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  estaPreenchido(colecao: Array<any>): boolean {
    return colecao != null && colecao.length > 0;
  }

  findLastIndex(array, predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) {
        return i;
      }
    }
    return -1;
  }

  private transportadoraObrigatoria(): boolean {
    return this.autenticacaoService.usuario().permissaoAtual.perfil !== PerfilUsuario.Fornecedor
      && this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica.transportadoraObrigatoriaPedidoFob
      && this.pedido.frete === TipoFrete.Fob;
  }

  private tratarTransportadora(): void {
    this.enderecoTransportadora = '';
    this.contatoTransportadora = '';

    if (this.pedido.transportadora) {
      if (this.pedido.transportadora.pessoaJuridica && this.pedido.transportadora.pessoaJuridica.enderecos && this.pedido.transportadora.pessoaJuridica.enderecos.length > 0) {
        this.enderecoTransportadora = this.obterEndereco(this.pedido.transportadora.pessoaJuridica.enderecos[0]);
      }

      this.contatoTransportadora = `${this.pedido.transportadora.contato} - ${this.pedido.transportadora.telefone} - ${this.pedido.transportadora.email}`;
    }
  }

  private atualizeTableDeItensDoPedido(): void {
    this.configureTableDeItensDoPedido();
    this.cdr.detectChanges();
  }

  private atualizeItensSelecionados(pedidoItensSelecionados: any[], isProduto: boolean): void {
    pedidoItensSelecionados.forEach(
      (pedidoItem) => {
        const indexItemSelecionado = this.pedido.itensProduto.findIndex((x) => x.idPedidoItem === pedidoItem.idPedidoItem);

        if (indexItemSelecionado > -1) {
          if (isProduto) {
            this.pedido.itensProduto[indexItemSelecionado] = pedidoItem;
          } else {
            this.pedido.itensServico[indexItemSelecionado] = pedidoItem;
          }
        }
      },
    );
  }

  private hasNoModification(state: PedidoExibicaoDto) {
    const currentPedidoState = JSON.stringify(state);
    return !this.hasObservacaoBeenModified && this.initialPedidoState === currentPedidoState;
  }

  private permiteExcluirAnexo(pedidoAnexo: PedidoAnexo) {
    return this.usuarioLogado.idUsuario === pedidoAnexo.idUsuario;
  }

  private obterAnexos(bloquearTela: boolean) {
    if (!this.integracaoRequisicaoErp || (this.pedido && this.pedido.origemPedido === OrigemPedido.Regularização)) {
      if (bloquearTela) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
      }

      this.pedidoService.obterArquivosAnexos(this.idPedido).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => {
          if (bloquearTela) {
            this.blockUI.stop();
          }
        })).subscribe(
          (pedidosAnexos) => {
            if (pedidosAnexos) {
              for (const pedidoAnexo of pedidosAnexos) {
                pedidoAnexo.permiteExcluir = this.permiteExcluirAnexo(pedidoAnexo);
              }

              this.pedidosAnexos = pedidosAnexos;
            } else {
              this.pedidosAnexos = new Array<PedidoAnexo>();
            }
          },
          () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
        );
    }
  }

  private permiteSalvarCodigo(): boolean {
    return (
      !this.pedido.comprador.integrarApiPedidos &&
      ([PerfilUsuario.Administrador, PerfilUsuario.Gestor].includes(
        this.usuarioLogado.permissaoAtual.perfil,
      ) ||
        this.pedido.usuario.idUsuario === this.usuarioLogado.idUsuario)
    );
  }

  private construirFormulario() {
    this.form = this.fb.group({
      codigo: [''],
    });
  }

  private alterar() {
    const pedidoAlteracaoDto = new PedidoAlteracaoDto({
      id: this.pedido.idPedido,
      codigo: this.pedido.codigo,
    });
    this.pedidoService.altereInformacoesPedido(pedidoAlteracaoDto).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => this.toastr.success('Informações alteradas com sucesso'),
        () => this.toastr.warning(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  private configureTableDeItensDoPedido(): void {
    this.configuracaoDaTableDeItens = new TableConfig<PedidoItem>({ useLocalPagination: true, selectionMode: SelectionModeEnum.Multiple });
    this.configuracaoColunasDosItens = new ConfiguracaoColunaUsuarioDto({ colunas: Array<ConfiguracaoColunaDto>() });
    this.configuracaoColunasDosItensService = new ConfiguracaoColunaUsuarioDto({ colunas: Array<ConfiguracaoColunaDto>() });
    this.configuracaoFerramentasDaTable = new ConfigTableFerramentas({ exibirExportar: false, exibirConfigurarColunas: false });

    const labelIdProduto = this.integracaoSapHabilitada && !this.integracaoRequisicaoErp && !this.integracaoRequisicaoErpComPermissaoDeEditar && !this.pedido.idIntegracaoPedidoERP
      ? 'Código ERP'
      : this.integracaoRequisicaoErp || this.integracaoRequisicaoErpComPermissaoDeEditar || this.pedido.idIntegracaoPedidoERP
        ? 'Código Integração'
        : 'ID Produto';

    this.configuracaoColunasDosItens.colunas.push(...new Array<ConfiguracaoColunaDto>(
      new ConfiguracaoColunaDto({ coluna: 'origem', label: 'Origem', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'id', label: labelIdProduto, tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'produto', label: 'Produto', tipo: ColumnTypeEnum.CustomTemplate }),
    ));

    if ((this.permitirAnalise() || this.permitirAlteracao()) && this.pedido.itensProduto.some((pi) => pi.solicitacaoItem && (pi.solicitacaoItem.analise ? true : false))) {
      this.configuracaoColunasDosItens.colunas.push(new ConfiguracaoColunaDto({ coluna: 'situacao', label: 'Situação', tipo: ColumnTypeEnum.CustomTemplate }));
    }

    if ((this.permitirAnalise() || this.permitirAlteracao()) && this.pedido.itensServico.some((pi) => pi.solicitacaoItem && (pi.solicitacaoItem.analise ? true : false))) {
      this.configuracaoColunasDosItens.colunas.push(new ConfiguracaoColunaDto({ coluna: 'situacao', label: 'Situação', tipo: ColumnTypeEnum.CustomTemplate }));
    }

    this.configuracaoColunasDosItens.colunas.push(...new Array<ConfiguracaoColunaDto>(
      new ConfiguracaoColunaDto({ coluna: 'marca', label: 'Marca', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'embalagemEmbarque', label: 'Caixa de embarque', tipo: ColumnTypeEnum.Text }),
      new ConfiguracaoColunaDto({ coluna: 'unidadeDeMedida', label: 'Unid. medida', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'quantidade', label: 'Qtde.', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'valorUnitario', label: 'Vl. unitário', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'ipiAliquota', label: 'IPI', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'pisAliquota', label: 'PIS', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'cofinsAliquota', label: 'COFINS', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'icmsAliquota', label: 'ICMS', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'stAliquota', label: 'ST', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'ncm', label: 'NCM', tipo: ColumnTypeEnum.Text }),
    ));

    this.configuracaoColunasDosItensService.colunas.push(...new Array<ConfiguracaoColunaDto>(
      new ConfiguracaoColunaDto({ coluna: 'origem', label: 'Origem', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'id', label: labelIdProduto, tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'servico', label: 'Serviço', tipo: ColumnTypeEnum.CustomTemplate }),
    ));

    if ((this.permitirAnalise() || this.permitirAlteracao()) && this.pedido.itensProduto.some((pi) => pi.solicitacaoItem && (pi.solicitacaoItem.analise ? true : false))) {
      this.configuracaoColunasDosItensService.colunas.push(new ConfiguracaoColunaDto({ coluna: 'situacao', label: 'Situação', tipo: ColumnTypeEnum.CustomTemplate }));
    }

    if ((this.permitirAnalise() || this.permitirAlteracao()) && this.pedido.itensServico.some((pi) => pi.solicitacaoItem && (pi.solicitacaoItem.analise ? true : false))) {
      this.configuracaoColunasDosItensService.colunas.push(new ConfiguracaoColunaDto({ coluna: 'situacao', label: 'Situação', tipo: ColumnTypeEnum.CustomTemplate }));
    }

    this.configuracaoColunasDosItensService.colunas.push(...new Array<ConfiguracaoColunaDto>(
      new ConfiguracaoColunaDto({ coluna: 'unidadeDeMedida', label: 'Unid. medida', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'quantidade', label: 'Qtde.', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'valorUnitario', label: 'Vl. unitário', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'pisAliquota', label: 'PIS', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'cofinsAliquota', label: 'COFINS', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'csllAliquota', label: 'CSLL', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'issAliquota', label: 'ISS', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'irAliquota', label: 'IR', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'inssAliquota', label: 'INSS', tipo: ColumnTypeEnum.CustomTemplate }),
      new ConfiguracaoColunaDto({ coluna: 'ncm', label: 'NCM', tipo: ColumnTypeEnum.Text }),
    ));
    const itensAtivosProduto = this.itensAtivosProduto();
    const itensAtivosServico = this.itensAtivosServico();

    if (itensAtivosProduto && itensAtivosProduto.length > 0) {
      if (itensAtivosProduto[0].prazoEntrega) {
        this.configuracaoColunasDosItens.colunas.push(new ConfiguracaoColunaDto({ coluna: 'prazoDeEntrega', label: 'Prazo de entrega', tipo: ColumnTypeEnum.CustomTemplate }));
      } else {
        this.configuracaoColunasDosItens.colunas.push(new ConfiguracaoColunaDto({ coluna: 'dataDeEntrega', label: 'Dt. entrega', tipo: ColumnTypeEnum.CustomTemplate }));
      }
    }

    if (itensAtivosServico && itensAtivosServico.length > 0) {
      if (itensAtivosServico[0].prazoEntrega) {
        this.configuracaoColunasDosItensService.colunas.push(new ConfiguracaoColunaDto({ coluna: 'prazoDeEntrega', label: 'Prazo de entrega', tipo: ColumnTypeEnum.CustomTemplate }));
      } else {
        this.configuracaoColunasDosItensService.colunas.push(new ConfiguracaoColunaDto({ coluna: 'dataDeEntrega', label: 'Dt. entrega', tipo: ColumnTypeEnum.CustomTemplate }));
      }
    }

    this.configuracaoColunasDosItens.colunas.push(new ConfiguracaoColunaDto({ coluna: 'dataEntregaPrevista', label: 'Dt. entrega prevista', tipo: ColumnTypeEnum.CustomTemplate }));
    this.configuracaoColunasDosItensService.colunas.push(new ConfiguracaoColunaDto({ coluna: 'dataEntregaPrevista', label: 'Dt. entrega prevista', tipo: ColumnTypeEnum.CustomTemplate }));
    this.configuracaoColunasDosItens.colunas.push(new ConfiguracaoColunaDto({ coluna: 'valorTotal', label: 'Vl. total', tipo: ColumnTypeEnum.CustomTemplate }));
    this.configuracaoColunasDosItensService.colunas.push(new ConfiguracaoColunaDto({ coluna: 'valorTotal', label: 'Vl. total', tipo: ColumnTypeEnum.CustomTemplate }));
  }

  private obterParametros() {
    this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idPedido = +params[this.integracaoRequisicaoErp ? 'idRequisicao' : 'idPedido'];

        if (this.idPedido) {
          this.obterPedido();
        }
      });
  }

  private obterPedido() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const endpointGetPedido: Observable<PedidoExibicaoDto> = this.integracaoRequisicaoErp
      ? this.pedidoService.obterIntegracoesErpPorId(this.idPedido)
      : this.pedidoService.obterPorId(this.idPedido);

    endpointGetPedido.pipe(
      takeUntil(this.unsubscribe),
    )
      .subscribe(
        (response) => {
          if (response) {
            this.tratarPedido(response);
            this.registreVisualizacaoFornecedor();
            this.configureTableDeItensDoPedido();
            this.obterOrigem();
            this.linkHabilitado();
            this.flagPermiteSalvarCodigo = this.permiteSalvarCodigo();
            this._flagPermiteSelecionarTransportadora = this.permitirSelecionarTransportadora();
            this.preencherCodigo(response.codigo);
            this.obterAnexos(false);

            this.initialPedidoState = JSON.stringify(this.pedido);

            this.relacioneEntregasPedidoItens(this.pedido.itensProduto);
            this.relacioneEntregasPedidoItens(this.pedido.itensServico);
          }
          this.blockUI.stop();
        },
        (error) => {
          const mensagemPedidoNaoEncontrado: string = 'Pedido não encontrado';
          let mensagemDeErro: string = this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR;

          if (error && error instanceof HttpErrorResponse && error.error === mensagemPedidoNaoEncontrado) {
            mensagemDeErro = mensagemPedidoNaoEncontrado;
          }

          this.toastr.error(mensagemDeErro);

          this.blockUI.stop();
        },
      );
  }

  private relacioneEntregasPedidoItens(pedidoItens: any[]) {
    pedidoItens.forEach((item) => {
      item.relateds = pedidoItens.filter((it) => item !== it && it.idPedidoItem === item.idPedidoItem);
    });
  }

  private obtenhaIntegracoesErpDoProduto(pedido: PedidoExibicaoDto): Observable<PedidoExibicaoDto> {
    if (pedido && this.pedidoPossuiItensPreenchidos(pedido) && (this.integracaoRequisicaoErp || pedido.idIntegracaoPedidoERP)) {
      const observablesDeIntegracoesErp = new Array<Observable<void>>();

      for (const pedidoItem of pedido.itensProduto) {
        const observableDeIntegracoesErp = this.integracaoErpService.getListaGestaoIntegracaoProduto(pedidoItem.idProduto, 999, 1).pipe(
          map((paginacaoIntegracoesErp: Paginacao<IntegracaoErp>) => {
            if (paginacaoIntegracoesErp) {
              pedidoItem.produto.integracoesErp = paginacaoIntegracoesErp.itens;
            }
          }));

        observablesDeIntegracoesErp.push(observableDeIntegracoesErp);
      }

      for (const pedidoItem of pedido.itensServico) {
        const observableDeIntegracoesErp = this.integracaoErpService.getListaGestaoIntegracaoProduto(pedidoItem.idProduto, 999, 1).pipe(
          map((paginacaoIntegracoesErp: Paginacao<IntegracaoErp>) => {
            if (paginacaoIntegracoesErp) {
              pedidoItem.produto.integracoesErp = paginacaoIntegracoesErp.itens;
            }
          }));

        observablesDeIntegracoesErp.push(observableDeIntegracoesErp);
      }

      return forkJoin(observablesDeIntegracoesErp).pipe(map(() => pedido));
    }

    return new Observable((subscriber) => subscriber.next(pedido));
  }

  private pedidoPossuiItensPreenchidos(pedido: PedidoExibicaoDto) {
    return (pedido.itensProduto && pedido.itensProduto.length > 0)
      || (pedido.itensServico && pedido.itensServico.length > 0);
  }

  private preencherCodigo(codigo: string) {
    this.form.controls.codigo.patchValue(codigo);
  }

  private tratarPedido(pedido: PedidoExibicaoDto) {
    pedido.itensProduto = this.calcularValorTotalItens(pedido.itensProduto);
    pedido.itensServico = this.calcularValorTotalItens(pedido.itensServico);

    this.tratarEnderecosComprador(pedido.comprador.enderecos);
    this.tratarEnderecosFornecedor(pedido.fornecedor.enderecos);
    this.pedido = pedido;
    this.titulo = `${this.integracaoRequisicaoErp ? 'Requisições ERP' : 'Pedidos'} /`;
    this.tituloComplementar = `${this.integracaoRequisicaoErp ? 'Requisição ERP' : 'Pedido'} #${this.pedido.idPedido}`;
    this.integracaoRequisicaoErp = this.integracaoRequisicaoErp && this.pedido.situacao !== SituacaoPedido['Aguardando aprovação'] && this.pedido.situacao !== SituacaoPedido['Aguardando requisitante'];

    this.dataAprovacao = this.pedido.dataAprovacao ? this.datePipe.transform(this.pedido.dataAprovacao, 'dd/MM/yyyy HH:mm') : '';

    this.faturamentoMinimo = this.pedido.itensProduto && this.pedido.itensProduto.length && this.pedido.itensProduto[0].faturamentoMinimo
      ? this.customCurrencyPipe.transform(this.pedido.itensProduto[0].faturamentoMinimo, this.pedido.itensProduto[0].moeda, '1.2-3', 'symbol')
      : this.pedido.fornecedor ? this.pedido.fornecedor.faturamentoMinimo : '';

    if (!this.faturamentoMinimo) {
      this.faturamentoMinimo = this.pedido.itensServico && this.pedido.itensServico.length && this.pedido.itensServico[0].faturamentoMinimo
        ? this.customCurrencyPipe.transform(this.pedido.itensServico[0].faturamentoMinimo, this.pedido.itensServico[0].moeda, '1.2-3', 'symbol')
        : this.pedido.fornecedor ? this.pedido.fornecedor.faturamentoMinimo : '';
    }

    this.organizacaoDeCompra = this.pedido.organizacaoCompra
      ? this.pedido.organizacaoCompra.codigoOrganizacaoCompra + (this.pedido.organizacaoCompra.descricaoOrganizacaoCompra ? ' - ' + this.pedido.organizacaoCompra.descricaoOrganizacaoCompra : '')
      : '';

    this.grupoDeCompradores = this.pedido.grupoCompradores
      ? this.pedido.grupoCompradores.codigoGrupoCompradores + (this.pedido.grupoCompradores.nomeGrupoCompradores ? ' - ' + this.pedido.grupoCompradores.nomeGrupoCompradores : '')
      : '';

    if (this.pedido.idAlcada) {
      this.alcadaService.obterPorId(this.pedido.idAlcada).pipe(
        takeUntil(this.unsubscribe))
        .subscribe((alcada) => {
          if (alcada) {
            this.alcadaDeAprovacao = alcada.descricao;
          }
        });
    }

    this.dataDeEntrega = this.pedido.ultimaDataEntrega
      ? moment(this.pedido.ultimaDataEntrega).format('DD/MM/YYYY')
      : '';

    this.tratarTransportadora();

    this.exibirSecaoAnexos =
      (!this.integracaoRequisicaoErp && (this.integracaoErpHabilitada || (this.pedido && this.pedido.comprador && this.pedido.comprador.habilitarIntegracaoERP))) ||
      (this.integracaoRequisicaoErp && this.integracaoErpHabilitada && this.pedido && this.pedido.origemPedido === OrigemPedido.Regularização) ||
      ((!this.integracaoErpHabilitada || this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Fornecedor) && this.pedido && this.situcoesExibicaoSecaoDeAnexo.includes(this.pedido.situacao));

    this.exibirSecaoFluxoIntegracaoErp =
      (
        this.integracaoErpHabilitada &&
        this.pedido &&
        this.pedido.situacao !== SituacaoPedido['Aguardando aprovação'] &&
        this.pedido.situacao !== SituacaoPedido['Aguardando requisitante']
      )
      || this.integracaoApiHabilitada;

    if (this.pedido.itensProduto.length > 0) {
      for (const pedidoItem of this.pedido.itensProduto) {
        pedidoItem.minDataEntrega = pedidoItem.dataEntrega;
      }
    }

    if (this.pedido.itensServico.length > 0) {
      for (const pedidoItem of this.pedido.itensServico) {
        pedidoItem.minDataEntrega = pedidoItem.dataEntrega;
      }
    }

    if (this.pedido.comprador.enderecos) {
      this.enderecoComprador = this.obterEndereco(this.pedido.comprador.enderecos.find((endereco) => endereco.tipo === TipoEndereco['Institucional']));
    }

    if (this.pedido.fornecedor.enderecos) {
      this.enderecoFornecedor = this.obterEndereco(this.pedido.fornecedor.enderecos.find((endereco) => endereco.tipo === TipoEndereco['Faturamento']));
    }

    this.verificarPermissaoExibirCriteriosAvaliacao();

    // endereço entrega, se catalogo tem endereço, caso seja de cotação verifica se o comprador
    // tem endereço de entrega cadastrado e seta o endereço de entrega
    const idsEnderecosEntregaCotacaoDistincts = this.pedido.itensProduto
      .map((item) => item.idEnderecoEntrega)
      .concat(
        this.pedido.itensServico
          .map((item) => item.idEnderecoEntrega),
      )
      .filter((value, index, self) => self.indexOf(value) === index);

    if (pedido.enderecoEntrega) {
      this.enderecoEntrega = this.obterEndereco(pedido.enderecoEntrega);
    } else if (idsEnderecosEntregaCotacaoDistincts.length === 1) {
      // se todos pedidos itens forem mesmo endereço entrega, enndereço seria o 'comumm'
      const enderecoEntregaComprador = this.pedido.comprador.enderecos.find(
        (p) => p.idEndereco === idsEnderecosEntregaCotacaoDistincts[0],
      );

      this.pedido.enderecoEntrega = enderecoEntregaComprador;
      this.enderecoEntrega = this.obterEndereco(pedido.enderecoEntrega);
    }

    if (pedido.idTransportadora) {
      const endereco = pedido.transportadora.pessoaJuridica.enderecos.find(
        // tslint:disable-next-line: no-shadowed-variable
        (endereco) => endereco.tipo === TipoEndereco['Institucional'],
      );

      this.enderecoTransportadora = this.obterEndereco(endereco);
    }
  }

  private tratarEnderecosComprador(enderecos: Array<Endereco>) {
    if (enderecos && enderecos.length) {
      const tipos = [
        TipoEndereco['Cobrança'],
        TipoEndereco['Entrega'],
        TipoEndereco['Faturamento'],
        TipoEndereco['Institucional'],
      ];
      tipos.forEach((tipo) => {
        // tslint:disable-next-line: no-shadowed-variable
        let endereco = enderecos.find((endereco) => endereco.tipo === tipo && endereco.principal);
        // tslint:disable-next-line: no-shadowed-variable
        if (!endereco) { endereco = enderecos.find((endereco) => endereco.tipo === tipo); }
        if (endereco) { this.enderecosComprador[TipoEndereco[tipo]] = endereco; }
      });
    }
  }

  private tratarEnderecosFornecedor(enderecos: Array<Endereco>) {
    if (enderecos && enderecos.length) {
      const tipos = [
        TipoEndereco['Cobrança'],
        TipoEndereco['Entrega'],
        TipoEndereco['Faturamento'],
        TipoEndereco['Institucional'],
      ];
      tipos.forEach((tipo) => {
        // tslint:disable-next-line: no-shadowed-variable
        let endereco = enderecos.find((endereco) => endereco.tipo === tipo && endereco.principal);
        // tslint:disable-next-line: no-shadowed-variable
        if (!endereco) { endereco = enderecos.find((endereco) => endereco.tipo === tipo); }

        if (endereco) { this.enderecosFornecedor[TipoEndereco[tipo]] = endereco; }
      });
    }
  }

  private calcularValorTotalItens(itens: Array<any>): Array<any> {
    itens.forEach((item) => {
      item.valorTotal = item.quantidade * item.valor;
    });

    return itens;
  }

  private calcularValorTotalPedido(pedido: PedidoExibicaoDto): number {
    let total = 0;

    pedido.itensProduto.forEach((item) => {
      if (item.situacao === SituacaoPedidoItem.Ativo) {
        if (item.solicitacaoItem && item.solicitacaoItem.analise && item.solicitacaoItem.analise.situacao === AnaliseAprovacaoPedidoItem.Rejeitado) {
          total += 0;
        } else {
          total += item.quantidade * item.valor;
        }
      }
    },
    );

    pedido.itensServico.forEach((item) => {
      if (item.situacao === SituacaoPedidoItem.Ativo) {
        if (item.solicitacaoItem && item.solicitacaoItem.analise && item.solicitacaoItem.analise.situacao === AnaliseAprovacaoPedidoItem.Rejeitado) {
          total += 0;
        } else {
          total += item.quantidade * item.valor;
        }
      }
    },
    );

    return total;
  }

  private trateEntregasDoItem(pedidoItem: any, pedidoItens: any[], isProduto: boolean) {
    const firstIndex = pedidoItens.findIndex((pi) => pi.idPedidoItem === pedidoItem.idPedidoItemPai || pi.idPedidoItemPai === pedidoItem.idPedidoItemPai);
    const lastIndex = this.findLastIndex(pedidoItens, ((pi) => pi.idPedidoItem === pedidoItem.idPedidoItemPai || pi.idPedidoItemPai === pedidoItem.idPedidoItemPai));
    const numberOfEntries = (lastIndex - firstIndex) + 1;

    pedidoItens.splice(firstIndex, numberOfEntries);

    pedidoItem.datasDasEntregasProgramadas.forEach(
      (entregaProgramada) => {
        const novoItemEntrega = {
          ...pedidoItem,
          relateds: null,
          quantidade: entregaProgramada.quantidade,
          dataEntrega: entregaProgramada.dataEntrega,
        };

        pedidoItens.push(novoItemEntrega);
      },
    );

    this.relacioneEntregasPedidoItens(pedidoItens);

    if (isProduto) {
      this.tableProdutos.reconstruaTable(pedidoItens);
    } else {
      this.tableServicos.reconstruaTable(pedidoItens);
    }
  }

  private analiseValida(): boolean {
    let todosItensAnalisados = true;
    this.pedido.itensProduto.forEach((item) => {
      if (!item.solicitacaoItem.analise) {
        todosItensAnalisados = false;
      }
    });

    this.pedido.itensServico.forEach((item) => {
      if (!item.solicitacaoItem.analise) {
        todosItensAnalisados = false;
      }
    });

    if (!todosItensAnalisados) {
      this.toastr.warning(
        'Para encerrar análise é necessário dar um parecer a todos os itens do pedido',
      );
      this.blockUI.stop();

      return false;
    }

    return true;
  }

  private concluirAnaliseFreteFob() {
    this.pedidoService.alterarTransportadora(this.pedido.idPedido, this.pedido.idTransportadora).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        () => this.concluirAnalise(),
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  private concluirAnalise() {
    const solicitacaoItensProduto = this.pedido.itensProduto.map((item) => {
      return item.solicitacaoItem;
    });

    const solicitacaoItensServico = this.pedido.itensServico.map((item) => {
      return item.solicitacaoItem;
    });

    const solicitacaoItens = solicitacaoItensProduto.concat(solicitacaoItensServico);

    const solicitacaoItensSemRepeticaoEntregas: SolicitacaoItem[] = [];

    solicitacaoItens.forEach((solicitacaoItem) => {
      if (!solicitacaoItensSemRepeticaoEntregas.some((an) => an.idSolicitacaoItem === solicitacaoItem.idSolicitacaoItem)) {
        solicitacaoItensSemRepeticaoEntregas.push(solicitacaoItem);
      }
    });

    const analises = solicitacaoItensSemRepeticaoEntregas.map((si) => si.analise);

    const pedidoAprovacaoDto = new PedidoAprovacaoDto({
      idPedido: this.pedido.idPedido,
      analises: analises,
      datasEntregasPrevistas: this.datasEntregasPrevistas,
    });

    this.aprovacaoService.inserir(pedidoAprovacaoDto).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.voltar();
        },
        (error) => {
          if (error && error.status === 400) {
            switch (error.error) {
              case 'Ação já realizada':
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_REVIEW_ALTREADY_REVIEWED,
                );
                break;

              default:
                this.serviceError.treatError(error);
                break;
            }
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        },
      );
  }

  private encerrarRevisao(idPedidoRedirecionamento?: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const pedido = _.cloneDeep(this.pedido);
    this.pedidoItemProdutosCancelados.forEach((item) => pedido.itensProduto.push(item));
    this.pedidoItemServicosCancelados.forEach((item) => pedido.itensServico.push(item));
    pedido.itensProduto.forEach((item) => { item.relateds = null; });
    pedido.itensServico.forEach((item) => { item.relateds = null; });

    this.pedidoService.revisarPedido(pedido).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);

          if (idPedidoRedirecionamento) {
            this.router.navigate(['/carrinho'], {
              queryParams: { idPrePedido: idPedidoRedirecionamento },
            });
          } else {
            this.voltar();
          }
        },
        (error) => {
          if (error && error.status === 400) {
            switch (error.error) {
              case 'Pedido inválido':
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_MARKETPLACE,
                );
                break;

              case 'Pedido inapto à aprovação':
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INVALID_ORDER_APPROVAL_FLOW,
                );
                break;

              default:
                this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
                break;
            }
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        },
      );
  }

  private revisaoValida(): boolean {
    const itensProduto = this.pedido.itensProduto.filter((item) => item.situacao === SituacaoPedidoItem.Ativo);
    const itensServico = this.pedido.itensServico.filter((item) => item.situacao === SituacaoPedidoItem.Ativo);

    if ((!itensProduto || !itensProduto.length) && (!itensServico || !itensServico.length)) {
      this.toastr.warning('Não é possível prosseguir com um pedido sem itens');
      return false;
    }

    if (
      itensProduto.some(
        (item) =>
          item.solicitacaoItem &&
          item.solicitacaoItem.analise &&
          item.solicitacaoItem.analise.situacao === AnaliseAprovacaoPedidoItem.Rejeitado,
      ) ||
      itensServico.some(
        (item) =>
          item.solicitacaoItem &&
          item.solicitacaoItem.analise &&
          item.solicitacaoItem.analise.situacao === AnaliseAprovacaoPedidoItem.Rejeitado,
      )
    ) {
      this.toastr.warning('Não é possível prosseguir sem revisar todos os itens rejeitados');
      return false;
    }

    return true;
  }

  private soliciteMotivoCancelamento() {
    const modalRef = this.modalService.open(ModalTextAreaComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.textoCabecalho = `Motivo do cancelamento`;
    modalRef.result.then((motivo) => {
      if (motivo) {
        this.cancelarPedido(motivo);
      }
    });
  }

  private cancelarPedido(motivo: string = null) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const pedidoCanceladoDto = new PedidoCanceladoDto(
      {
        idPedido: this.pedido.idPedido,
        motivo: motivo,
      },
    );

    this.pedidoService.cancelarPedido(pedidoCanceladoDto).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.pedido.situacao = response;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        (error) => this.errorService.treatError(error),
      );
  }

  private tratarEdicaoItem(pedidoItem: any, isProduto: boolean) {
    const pedidoItens: any[] = isProduto ? this.pedido.itensProduto : this.pedido.itensServico;

    if (pedidoItem.idPedidoItem) {
      const index = pedidoItens.findIndex((item) => pedidoItem.idPedidoItem === item.idPedidoItem);
      if (index !== -1) {
        pedidoItem.idPedidoItemPai = pedidoItem.idPedidoItem;
        pedidoItem.idPedidoItem = 0;
        pedidoItens[index] = pedidoItem;
      }
    } else if (pedidoItem.idPedidoItemPai) {
      const index = pedidoItens.findIndex(
        (item) => pedidoItem.idPedidoItemPai === item.idPedidoItemPai,
      );
      if (index !== -1) {
        pedidoItem.idPedidoItemPai = pedidoItem.idPedidoItemPai;
        pedidoItem.idPedidoItem = 0;
        pedidoItens[index] = pedidoItem;
      }
    } else {
      const index = pedidoItens.findIndex((item) => pedidoItem.codigo === item.codigo);
      if (index !== -1) { pedidoItens[index] = pedidoItem; }
    }

    pedidoItem.solicitacaoItem = null;

    if (pedidoItem.entregaProgramada) {
      if (isProduto) {
        this.trateEntregasDoItem(pedidoItem, this.pedido.itensProduto, isProduto);
      } else {
        this.trateEntregasDoItem(pedidoItem, this.pedido.itensServico, isProduto);
      }
    }

    if (isProduto) {
      this.pedido.itensProduto = this.calcularValorTotalItens(pedidoItens);
    } else {
      this.pedido.itensServico = this.calcularValorTotalItens(pedidoItens);
    }

    this.pedido.valor = this.calcularValorTotalPedido(this.pedido);

    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }

  private removerItem(idPedidoItem: number, idPedidoItemPai: number, isProduto: boolean) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let pedidoItens;

    if (isProduto) {
      pedidoItens = this.pedido.itensProduto;
    } else {
      pedidoItens = this.pedido.itensServico;
    }

    // testa se idPedidoItem é 0, se for encontra o item por meio do idPedidoItemPai pois o item é uma alteração

    let index = -1;
    let numeroEntregas: number;

    if (idPedidoItem) {
      index = pedidoItens.findIndex((item) => item.idPedidoItem === idPedidoItem);
      numeroEntregas = this.pedido.itensProduto.filter((item) => item.idPedidoItem === idPedidoItem).length;
    } else {
      index = pedidoItens.findIndex((item) => item.idPedidoItemPai === idPedidoItemPai);
      numeroEntregas = pedidoItens.findIndex((item) => item.idPedidoItemPai === idPedidoItemPai);
    }

    if (index !== -1) {
      const idFornecedor = this.pedido.idFornecedor;
      const idProduto = pedidoItens[index].idProduto;

      if (isProduto) {
        const itensCancelados = pedidoItens.splice(index, numeroEntregas);
        itensCancelados.forEach((item) => item.situacao = SituacaoPedidoItem.Cancelado);
        this.pedidoItemProdutosCancelados = this.pedidoItemProdutosCancelados.concat(itensCancelados);
      } else {
        const itensCancelados = pedidoItens.splice(index, numeroEntregas);
        itensCancelados.forEach((item) => item.situacao = SituacaoPedidoItem.Cancelado);
        this.pedidoItemServicosCancelados = this.pedidoItemServicosCancelados.concat(itensCancelados);
      }

      if (isProduto) {
        this.tableProdutos.reconstruaTable(pedidoItens);
      } else {
        this.tableServicos.reconstruaTable(pedidoItens);
      }

      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.acaoPosRemocao(idFornecedor, idProduto, isProduto);
    } else {
      this.blockUI.stop();
    }
  }

  private acaoPosRemocao(idFornecedor: number, idProduto: number, isProduto: boolean) {
    if (this.pedido.origemPedido !== OrigemPedido['Sem Negociação']) {
      const modalRef = this.modalService.open(AcaoPosRemocaoPedidoComponent, { centered: true, size: 'lg' });

      modalRef.result.then(
        (result) => {
          switch (result) {
            case 'novoItem':
              this.buscarOutroProduto(this.idPedido, idFornecedor, idProduto, isProduto);
              break;

            case 'novoFornecedor':
              this.toastr.warning('Esse pedido deve ser cancelado e um novo pedido com o outro fornecedor deve ser criado.');
              break;

            default:
              break;
          }
          this.pedido.valor = this.calcularValorTotalPedido(this.pedido);
        },
        () => { });
    } else {
      this.pedido.valor = this.calcularValorTotalPedido(this.pedido);
    }
  }
  // #endregion

  // #region TROCA ITEM MESMO FORNECEDOR
  private buscarOutroProduto(idPedido: number, idFornecedor: number, idProduto: number, isProduto: boolean) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const modalRef = this.modalService.open(SelecionarOutroProdutoComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.idPedido = idPedido;
    modalRef.componentInstance.idFornecedor = idFornecedor;
    modalRef.componentInstance.idProduto = idProduto;

    modalRef.result.then(
      (result) => {
        if (result) {
          if (isProduto) {
            this.pedido.itensProduto.push(result);
            this.pedido.itensProduto = this.calcularValorTotalItens(this.pedido.itensProduto);
          } else {
            this.pedido.itensServico.push(result);
            this.pedido.itensServico = this.calcularValorTotalItens(this.pedido.itensServico);
          }

          this.pedido.valor = this.calcularValorTotalPedido(this.pedido);
        }
      },
      () => { });
  }

  // #endregion

  // #region AVALIACAO DO PEDIDO
  private verificarPermissaoExibirCriteriosAvaliacao() {
    this.permitirAvaliacaoCriterio =
      (this.pedido.situacao === SituacaoPedido.Enviado ||
        this.pedido.situacao === SituacaoPedido.Entregue) &&
      (this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Recebimento ||
        this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Administrador);

    this.isEntregue = this.pedido.situacao === SituacaoPedido.Entregue;

    if (this.permitirAvaliacaoCriterio) {
      this.obterListaCriterios();
    }
  }

  private obterListaCriterios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (this.pedido.situacao === SituacaoPedido.Entregue) {
      this.pedidoService.obterCriteriosAvaliacaoPorCategoriaPedidoRecebido(this.pedido.idPedido).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => this.criteriosAvaliacao = response,
          () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
        );
    } else {
      this.pedidoService.obterCriteriosAvaliacaoPorCategoriaPedido(this.pedido.idPedido).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => this.criteriosAvaliacao = response,
          () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
        );
    }

    this.blockUI.stop();
  }

  private inserirAvaliacao(avaliacao: AvaliacaoPedido) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    avaliacao.idPedido = this.idPedido;

    this.pedidoService.inserirAvalicaoPedido(avaliacao).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS),
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  private alterarAvaliacao(avaliacao: AvaliacaoPedido) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.alterarAvalicaoPedido(avaliacao).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS),
        () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }
  //#endregion

  private registreVisualizacaoFornecedor() {
    const perfilUsuarioLogado = this.autenticacaoService.perfil();

    if (this.pedido.situacao === SituacaoPedido.Aprovado && perfilUsuarioLogado === PerfilUsuario.Fornecedor) {
      this.pedidoService.registreVisualizacaoFornecedor(this.pedido.idPedido).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.blockUI.stop()))
        .subscribe(
          () => { },
          (error) => this.serviceError.treatError(error),
        );
    }
  }

  private aprovarTodos(pedidoItens: any[]) {
    pedidoItens.forEach((item) => {
      item.solicitacaoItem.analise = new SolicitacaoItemAnalise(
        0,
        item.solicitacaoItem.idSolicitacaoItem,
        0,
        AnaliseAprovacaoPedidoItem.Aprovado,
        '',
      );
    });

    this.atualizeTableDeItensDoPedido();

    this.pedido.valor = this.calcularValorTotalPedido(this.pedido);
  }

  private aprovarItens(pedidoItemSelecionados: any[]) {
    pedidoItemSelecionados.forEach(
      (pedidoItem) => {
        pedidoItem.solicitacaoItem.analise =
          new SolicitacaoItemAnalise(0, pedidoItem.solicitacaoItem.idSolicitacaoItem, 0, AnaliseAprovacaoPedidoItem.Aprovado, '');
      },
    );

    this.atualizeTableDeItensDoPedido();

    this.pedido.valor = this.calcularValorTotalPedido(this.pedido);
  }

  private apliqueDataEntregaPrevista(pedidoItemSelecionados: any[], resultados: PedidoItemDataEntregaPrevistaDto[], aprovarItensPosConclusao: boolean) {
    resultados.forEach(
      (resultado) => {
        if (!resultado.entregasProgramadas || !resultado.entregasProgramadas.length) {
          this.apliqueEntregaPrevistaItem(pedidoItemSelecionados, resultado);
        } else {
          this.apliqueEntregaPrevistaEntregaProgramada(resultado, pedidoItemSelecionados);
        }
      },
    );

    if (aprovarItensPosConclusao) {
      this.aprovarItens(pedidoItemSelecionados);
    }
  }

  private apliqueEntregaPrevistaEntregaProgramada(resultado: PedidoItemDataEntregaPrevistaDto, pedidoItemSelecionados: any[]) {
    resultado.entregasProgramadas.forEach((entrega) => {
      const item = pedidoItemSelecionados.find((it) => it.idPedidoItem === resultado.idPedidoItem && it.idPedidoEntregasProgramadas === entrega.idPedidoEntregasProgramadas);
      item.dataEntregaPrevista = entrega.dataEntregaPrevista;
      let dataEntregaPrevista = this.datasEntregasPrevistas.find((dep) => dep.idPedidoItem === item.idPedidoItem);
      if (dataEntregaPrevista) {
        const programada = dataEntregaPrevista.entregasProgramadas.find((en) => en.idPedidoEntregasProgramadas === entrega.idPedidoEntregasProgramadas);
        if (programada) {
          programada.dataEntregaPrevista = entrega.dataEntregaPrevista;
        } else {
          dataEntregaPrevista.entregasProgramadas.push(new PedidoEntregaProgramadaPrevistaDto({
            idPedidoEntregasProgramadas: entrega.idPedidoEntregasProgramadas,
            dataEntregaPrevista: entrega.dataEntregaPrevista,
          }));
        }
      } else {
        dataEntregaPrevista = new PedidoItemDataEntregaPrevistaDto({
          idPedidoItem: item.idPedidoItem,
          entregasProgramadas: [
            new PedidoEntregaProgramadaPrevistaDto({
              idPedidoEntregasProgramadas: entrega.idPedidoEntregasProgramadas,
              dataEntregaPrevista: entrega.dataEntregaPrevista,
            }),
          ],
        });
        this.datasEntregasPrevistas.push(dataEntregaPrevista);
      }
    });
  }

  private apliqueEntregaPrevistaItem(pedidoItemSelecionados: any[], resultado: PedidoItemDataEntregaPrevistaDto) {
    const item = pedidoItemSelecionados.find((it) => it.idPedidoItem === resultado.idPedidoItem);
    item.dataEntregaPrevista = resultado.dataEntregaPrevista;
    let dataEntregaPrevista = this.datasEntregasPrevistas.find((dep) => dep.idPedidoItem === item.idPedidoItem);
    if (dataEntregaPrevista) {
      dataEntregaPrevista.dataEntregaPrevista = resultado.dataEntregaPrevista;
    } else {
      dataEntregaPrevista = new PedidoItemDataEntregaPrevistaDto({
        idPedidoItem: item.idPedidoItem,
        dataEntregaPrevista: resultado.dataEntregaPrevista,
      });
      this.datasEntregasPrevistas.push(dataEntregaPrevista);
    }
  }
}
