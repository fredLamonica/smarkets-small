import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { OrigemPedido, PerfilUsuario, SituacaoPedido, Usuario } from '@shared/models';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuditoriaComponent } from '../../../shared/components/auditoria/auditoria.component';
import { TableConfig } from '../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../shared/components/data-list/table/models/table-pagination';
import { ConfiguracaoColunaDto } from '../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../shared/models/configuracao-filtro-usuario-dto';
import { TipoIntegracao } from '../../../shared/models/enums/tipo-integracao';
import { PaginacaoPesquisaConfiguradaDto } from '../../../shared/models/paginacao-pesquisa-configurada-dto';
import { PedidoDto } from '../../../shared/models/pedido/pedido-dto';
import { PedidoFiltroDto } from '../../../shared/models/pedido/pedido-filtro-dto';
import { EnumToArrayPipe } from '../../../shared/pipes';
import { PedidoService } from '../../../shared/providers/pedido.service';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-listar-pedidos',
  templateUrl: './listar-pedidos.component.html',
  styleUrls: ['./listar-pedidos.component.scss'],
})
export class ListarPedidosComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  readonly textoLimpar: string = 'Limpar';

  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoDaTable: TableConfig<PedidoDto>;
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  filtro: PedidoFiltroDto;
  formFiltro: FormGroup;
  filtroInformado: boolean;
  filtroOrigemPedidoInformado: boolean;
  integracaoRequisicaoErp: boolean;
  integracaoErpHabilitada: boolean;
  integracaoSapHabilitada: boolean;
  integracaoApiHabilitada: boolean;
  habilitarIntegracaoSistemaChamado: boolean;
  opcoesSituacao: Array<{ index: number, name: string }>;
  opcoesOrigem: Array<string>;
  paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<PedidoDto>;
  pedidoSelecionado: PedidoDto;
  pedidos: Array<PedidoDto>;
  Situacao = SituacaoPedido;
  usuariosLoading: boolean;
  usuarioLogado: Usuario;
  usuarios: Array<Usuario>;

  mascaraSomenteNumeros = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: false,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private autenticacaoService: AutenticacaoService,
    private arquivoService: ArquivoService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  filtrePedidos(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
    this.inicieLoading();

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.pedidoService.filtre(this.filtro, this.integracaoRequisicaoErp).pipe(
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

  origensSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  selecione(pedidos: Array<PedidoDto>): void {
    this.pedidoSelecionado = pedidos && pedidos instanceof Array && pedidos.length > 0 ? pedidos[0] : undefined;
  }

  visualize(): void {
    if (this.pedidoSelecionado) {
      this.router.navigate([`../${this.integracaoRequisicaoErp ? 'requisicoes-erp' : 'pedidos'}`, this.pedidoSelecionado.idPedido], { relativeTo: this.route });
    }
  }

  limpeFiltro(): void {
    this.formFiltro.reset();
    this.filtrePedidos(false, true);
  }

  filtre(): void {
    this.filtrePedidos(false, true);
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.filtrePedidos(false);
  }

  populeOrigens(): void {
    const origens = new EnumToArrayPipe().transform(OrigemPedido) as Array<any>;

    this.opcoesOrigem = origens.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  }

  exporte(): void {
    this.inicieLoading();

    this.pedidoService.exporte(this.filtro, this.integracaoRequisicaoErp).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório de Pedidos ${this.filtro.dataCriacaoInicio} a ${this.filtro.dataCriacaoFim}.xls`,
          );

          this.emitirToastrDeSucesso();
        },
        (error) => this.errorService.treatError(error));
  }

  gerePdf() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoService.gerarPdfPedido(this.pedidoSelecionado.idPedido).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
        () => this.toastr.success('PDF gerado com sucesso'),
        (error) => this.errorService.treatError(error),
      );
  }
  mostrarFiltroErp() {
    const permissao = this.usuarioLogado.permissaoAtual.perfil;

    return (

      !this.integracaoRequisicaoErp &&
      (this.integracaoErpHabilitada || this.integracaoSapHabilitada || this.integracaoApiHabilitada) ||
      permissao === PerfilUsuario.Fornecedor
    );
  }

  permiteAuditoria() {
    const permissao = this.usuarioLogado.permissaoAtual.perfil;

    return (
      permissao === PerfilUsuario.Administrador ||
      permissao === PerfilUsuario.Gestor ||
      permissao === PerfilUsuario.Comprador ||
      permissao === PerfilUsuario.Requisitante
    );
  }

  abrirAuditoria() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.nomeClasse = 'Pedido';
    modalRef.componentInstance.idEntidade = this.pedidoSelecionado.idPedido;
  }

  private configureGrid(): void {
    this.configuracaoDaTable = new TableConfig<PedidoDto>({
      page: this.filtro.pagina,
      pageSize: this.filtro.itensPorPagina,
      totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
      totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
    });
  }

  private inicialize(): void {
    this.integracaoRequisicaoErp = this.activatedRoute.snapshot.data['integracaoRequisicaoErp'] as boolean;
    this.usuarioLogado = this.autenticacaoService.usuario();
    const configuracaoDeModuloIntegracao = this.usuarioLogado.permissaoAtual.configuracaoDeModuloIntegracao;
    this.integracaoErpHabilitada = configuracaoDeModuloIntegracao && configuracaoDeModuloIntegracao.tipoIntegracao === TipoIntegracao.ERP;
    this.integracaoApiHabilitada = configuracaoDeModuloIntegracao && configuracaoDeModuloIntegracao.tipoIntegracao === TipoIntegracao.API;
    this.habilitarIntegracaoSistemaChamado = configuracaoDeModuloIntegracao && configuracaoDeModuloIntegracao.habilitarIntegracaoSistemaChamado;
    this.integracaoSapHabilitada = configuracaoDeModuloIntegracao && configuracaoDeModuloIntegracao.tipoIntegracao === TipoIntegracao.SAP;

    this.construaFormFiltro();
    this.populeSituacoes();
    this.populeOrigens();
    this.obtenhaColunasDisponiveis();
    this.filtrePedidosNaInicializacao();
  }

  private construaFormFiltro(): void {
    this.formFiltro = this.fb.group({
      idPedido: [null],
      situacao: [null],
      dataCriacaoInicio: [null],
      dataCriacaoFim: [null],
      dataAprovacaoInicio: [null],
      dataAprovacaoFim: [null],
      dataUltimaAtualizacaoInicio: [null],
      dataUltimaAtualizacaoFim: [null],
      dataAprovacaoFornecedorInicio: [null],
      dataAprovacaoFornecedorFim: [null],
      dataEntregaInicio: [null],
      dataEntregaFim: [null],
      origem: [null],
      idOrigem: [null],
      cliente: [null],
      fornecedor: [null],
      usuarioResponsavel: [null],
      usuarioAprovador: [null],
      idChamado: [null],
      descricaoItem: [null],
    });

    if (this.integracaoRequisicaoErp) {
      this.formFiltro.addControl('requisicaoErp', this.fb.control(null));
    } else {
      this.formFiltro.addControl('pedidoErp', this.fb.control(null));
    }

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

  private populeSituacoes(): void {
    let situacoes = new EnumToArrayPipe().transform(SituacaoPedido) as Array<any>;

    let filtro: (itemSituacaoPedido: { index: number, name: string }) => boolean;

    if (this.integracaoRequisicaoErp) {
      filtro = (itemSituacaoPedido: { index: number, name: string }) => {
        return itemSituacaoPedido.index === SituacaoPedido['Aguardando Integração Requisição'] ||
          itemSituacaoPedido.index === SituacaoPedido['Integração Requisição Cancelada'] ||
          itemSituacaoPedido.index === SituacaoPedido['Aguardando Integração'] ||
          itemSituacaoPedido.index === SituacaoPedido['Aguardando aprovação'] ||
          itemSituacaoPedido.index === SituacaoPedido['Aguardando requisitante'] ||
          itemSituacaoPedido.index === SituacaoPedido['Erro de Integração'];
      };
    } else {
      filtro = (itemSituacaoPedido: { index: number, name: string }) => {
        return itemSituacaoPedido.index !== SituacaoPedido['Aguardando Integração Requisição'] &&
          itemSituacaoPedido.index !== SituacaoPedido['Integração Requisição Cancelada'];
      };
    }

    situacoes = situacoes.filter((situacao) => filtro(situacao));

    if (situacoes) {
      this.opcoesSituacao = situacoes.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
      this.opcoesSituacao = this.opcoesSituacao.filter(item => item.name !== 'Pré-pedido');
      this.trateSituacoesFiltro(this.opcoesSituacao);
    }
  }

  private trateSituacoesFiltro(situacoes: Array<{ index: number, name: string }>){
    const perfil = this.autenticacaoService.perfil();
    situacoes.forEach((s) => {
      if(s.name === 'Entregue Parcialmente'){
        s.name = 'Recebido Parcialmente';
      }
      if(s.name === 'Aprovado'){
        s.name = 'Aguardando confirmação do fornecedor';
      }
      if(s.name === 'Confirmado'){
        s.name = 'Confirmado pelo fornecedor';
      }
      if(s.name === 'Aguardando requisitante'){
        s.name = 'Aguardando revisão do requisitante';
      }
      if(s.name === 'Preparado'){
        s.name = 'Preparado para envio';
      }
      switch (perfil) {
        case PerfilUsuario.Fornecedor:
          if(s.name === 'Aguardando aprovação'){
            s.name = 'Aguardando aprovação do cliente';
          }
        default:
          if(s.name === 'Aguardando aprovação'){
            s.name = 'Aguardando aprovação interna';
          }
          if(s.name === 'Entregue'){
            s.name = 'Recebido';
          }
      }
    })
  }

  private obtenhaColunasDisponiveis(): void {
    this.pedidoService.obtenhaColunasDiponiveis(this.integracaoRequisicaoErp).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
        (error) => this.errorService.treatError(error));
  }

  private filtrePedidosNaInicializacao(): void {
    this.inicieLoading();

    this.pedidoService.obtenhaFiltroSalvo(this.integracaoRequisicaoErp).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: PedidoFiltroDto) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5 };
          this.formFiltro.patchValue(this.filtro);
          this.filtrePedidos(false);
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }
  private inicieLoading(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
  }

  private emitirToastrDeSucesso(): void {
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }
}
