import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { now } from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { SelectionModeEnum } from '../../../shared/components/data-list/models/selection-mode.enum';
import { TableConfig } from '../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../shared/components/data-list/table/models/table-pagination';
import { TableStyleEnum } from '../../../shared/components/data-list/table/models/table-style.enum';
import { Ferramenta } from '../../../shared/components/funcionalidade/smk-table-funcionalidade/models/ferramenta';
import { PerfilUsuario, Usuario } from '../../../shared/models';
import { ConfiguracaoColunaDto } from '../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../shared/models/configuracao-filtro-usuario-dto';
import { FuncionalidadeConfiguracaoUsuario } from '../../../shared/models/enums/funcionalidade-configuracao-usuario.enum';
import { SituacaoPedidoTrack } from '../../../shared/models/enums/Track/situacao-pedido-track';
import { FiltroBase } from '../../../shared/models/fltros/base/filtro-base';
import { TrackFiltroDto } from '../../../shared/models/fltros/track/track-filtro-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../../../shared/models/paginacao-pesquisa-configurada-dto';
import { PedidoTrackDto } from '../../../shared/models/pedido-track/pedido-track-dto';
import { EnumToArrayPipe } from '../../../shared/pipes';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '../../../shared/providers';
import { ImportacaoModeloService } from '../../../shared/providers/importacao-modelo.service';
import { PedidoTrackService } from '../../../shared/providers/track/pedido-track.service';
import { ErrorService } from '../../../shared/utils/error.service';
@Component({
  selector: 'smk-liste-pedido-track',
  templateUrl: './liste-pedido-track.component.html',
  styleUrls: ['./liste-pedido-track.component.scss']
})
export class ListePedidoTrackComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

    readonly textoLoading: string = 'Buscando...';
    readonly textoLimpar: string = 'Limpar';

    pedidosTrackSelecionados: PedidoTrackDto[];
    configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
    filtroInformado: boolean = false;
    paginacaoPesquisaConfigurada?: PaginacaoPesquisaConfiguradaDto<PedidoTrackDto>;
    colunasDisponiveis: Array<ConfiguracaoColunaDto>;
    configuracaoDaTable: TableConfig<PedidoTrackDto>;
    opcoesSituacao: Array<{ index: number, name: string }>;
    opcoesOrigem: Array<{ index: number, name: string }>;
    permiteAvancarStatus: boolean = false;
    permiteEditar: boolean = false;
    permiteReenviarNotificacao: boolean = false;

    filtro = { pagina: 1, itensPorPagina: 5 } as TrackFiltroDto;
    formFiltro: FormGroup;
    mascaraSomenteNumeros = RegExp('\[0-9\]');


    ferramentas: Array<Ferramenta> = new Array<Ferramenta>();

    situacaoPedidoEnum = SituacaoPedidoTrack;
    usuarioLogado: Usuario;

    constructor(
      protected toastr: ToastrService,
      protected fb: FormBuilder,
      protected translationLibrary: TranslationLibraryService,
      protected errorService: ErrorService,
      protected arquivoService: ArquivoService,
      protected route: ActivatedRoute,
      protected router: Router,
      protected modalService: NgbModal,
      protected autenticacaoService: AutenticacaoService,
      protected pedidoTrackService: PedidoTrackService,
      protected importacaoModeloService: ImportacaoModeloService
    ) {
      super();
    }

    maskCnpj = [
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '/',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ];


    ngOnInit(){
      this.usuarioLogado = this.autenticacaoService.usuario();
      this.inicialize();
    }

    limpeFiltro(): void {
      this.formFiltro.reset();

      if(this.usuarioLogado.permissaoAtual.perfil == PerfilUsuario.RequisitanteTrack){
        this.formFiltro.patchValue({requisitante: this.usuarioLogado.email})
      }

      this.filtreResetePagina();
    }

    filtreResetePagina() {
      this.filtreItens(false, true);
    }

    situacoesSearchFn(term: string, item: any): any {
      return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
    }
    importar(){
      document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
    }

    private construaFormFiltro() {
      this.formFiltro = this.fb.group({
        linhaItem: [null],
        numerosPedidos: [[]],
        situacoes: [null],
        requisitante: [null],
        descricaoPedido: [null],
        dataRemessaInicio: [null],
        dataRemessaFim: [null],
      });

      if(this.usuarioLogado.permissaoAtual.perfil == PerfilUsuario.RequisitanteTrack){

        this.formFiltro.patchValue({requisitante: this.usuarioLogado.email})
        this.formFiltro.controls.requisitante.disable();
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


    exportar(relatorio: boolean): void {
      this.pedidoTrackService
      .exporte(FuncionalidadeConfiguracaoUsuario.ConfiguracaoUsuarioTrack, this.filtro)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório FUP ${(new Date(now()).toLocaleString())}.xlsx`,
          );

          this.emitirToastrDeSucesso();
        },
      (error) => {
          this.errorService.treatError(error);
        }
      )
    }



    selecione(paradasManutencao: PedidoTrackDto[]): void {
      if (paradasManutencao && paradasManutencao instanceof Array && paradasManutencao.length)
        this.pedidosTrackSelecionados = paradasManutencao;

      this.permiteAvancarStatus = paradasManutencao && paradasManutencao.length > 1 ? true : false;
      this.permiteReenviarNotificacao = paradasManutencao && paradasManutencao.length >= 1 ? true : false;
      this.permiteEditar = paradasManutencao.length == 1;
    }

    pagine(paginacao: TablePagination): void {
      this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
      this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

      this.filtreItens(false);
    }

    upload() {
      document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
    }

    filtreItens(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
      if(this.valideCampos()){

          this.blockUI.start(this.translationLibrary.translations.LOADING);

          if (resetarPagina) {
            this.filtro.pagina = 1;
          }

          this.pedidoTrackService
          .filtreOperacoes(FuncionalidadeConfiguracaoUsuario.ConfiguracaoUsuarioTrack, this.filtro)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<any>) => {
              // Limpando o item selecionado.
              this.selecione([]);

              this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
              this.configureGrid();

              if (emitirToastrDeSucesso) {
                this.emitirToastrDeSucesso();
              }

              this.blockUI.stop();
            },
            (error) => {
              this.errorService.treatError(error);
              this.blockUI.stop();
            }
        )
      }
    }

   private valideCampos(){

    if((this.filtro.dataRemessaFim == null && this.filtro.dataRemessaInicio != null)
      || (this.filtro.dataRemessaInicio == null && this.filtro.dataRemessaFim != null)){
      this.toastr.warning("Informe Data Remessa Inicio e Data Remessa Fim.")

      return false;
    }

    return true;
    }

    private inicialize(): void {
      this.populeSituacoes();
      this.obtenhaColunasDisponiveis();
      this.construaFormFiltro();
      this.filtreItensNaInicializacao();
    }

    private configureGrid(): void {
      this.configuracaoDaTable = {
        page: this.filtro.pagina,
        pageSize: this.filtro.itensPorPagina,
        totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
        totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
        selectionMode: SelectionModeEnum.Multiple,
        style: TableStyleEnum.Striped
      } as TableConfig<PedidoTrackDto>;
    }

    private filtreItensNaInicializacao(): void {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.pedidoTrackService.obtenhaFiltroSalvo(this.usuarioLogado.permissaoAtual.idTenant, FuncionalidadeConfiguracaoUsuario.ConfiguracaoUsuarioTrack).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (filtroSalvo: FiltroBase) => {
            this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5, idTenant: this.usuarioLogado.permissaoAtual.idTenant};
            this.formFiltro.patchValue(this.filtro);
            this.filtreItens(false);
          },
          (error: any) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          });
    }

    private obtenhaColunasDisponiveis(): void {
      this.pedidoTrackService
        .obtenhaColunasDisponiveis(FuncionalidadeConfiguracaoUsuario.ConfiguracaoUsuarioTrack)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
          (error) => this.errorService.treatError(error));
    }

    private emitirToastrDeSucesso(): void {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
    }

    private populeSituacoes(): void {
      let situacoes = new EnumToArrayPipe().transform(SituacaoPedidoTrack) as Array<any>;

      if (situacoes) {
        this.opcoesSituacao = situacoes.sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
      }
    }
    ngOnDestroy(): void {
      super.ngOnDestroy();
    }
}
