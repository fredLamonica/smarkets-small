import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Arquivo, SituacaoContratoCatalogo, SituacaoContratoCatalogoItem, Usuario } from '@shared/models';
import { ArquivoService, ImportacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { TableConfig } from '../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../shared/components/data-list/table/models/table-pagination';
import { Ferramenta } from '../../shared/components/funcionalidade/smk-table-funcionalidade/models/ferramenta';
import { ConfiguracaoColunaDto } from '../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../shared/models/configuracao-filtro-usuario-dto';
import { ContratoCatalogoFornecedorDto } from '../../shared/models/fltros/contrato-catalogo-fornecedor-dto';
import { ContratoFornecedorFiltroDto } from '../../shared/models/fltros/contrato-fornecedor-filtro-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../../shared/models/paginacao-pesquisa-configurada-dto';
import { PedidoDto } from '../../shared/models/pedido/pedido-dto';
import { EnumToArrayPipe } from '../../shared/pipes';
import { ContratoCatalogoService } from '../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../shared/utils/error.service';

@Component({
  selector: 'smk-produtos-catalogo-fornecedor',
  templateUrl: './produtos-catalogo-fornecedor.component.html',
  styleUrls: ['./produtos-catalogo-fornecedor.component.scss'],
})
export class ProdutosCatalogoFornecedorComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  readonly textoLimpar: string = 'Limpar';

  situacaoContratoCatalogo = SituacaoContratoCatalogo;
  situacaoContratoCatalogoItem = SituacaoContratoCatalogoItem;
  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoDaTable: TableConfig<ContratoCatalogoFornecedorDto>;
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  filtro: ContratoFornecedorFiltroDto;
  formFiltro: FormGroup;
  filtroInformado: boolean;
  filtroOrigemPedidoInformado: boolean;
  habilitarIntegracaoSistemaChamado: boolean;
  opcoesSituacaoCatalogo: Array<{ index: number, name: string }>;
  opcoesSituacaoItem: Array<{ index: number, name: string }>;
  opcoesOrigem: Array<string>;
  paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<ContratoCatalogoFornecedorDto>;
  contratoSelecionado: ContratoCatalogoFornecedorDto;
  usuariosLoading: boolean;
  usuarioLogado: Usuario;
  usuarios: Array<Usuario>;
  ferramentas: Ferramenta[] = [];

  mascaraSomenteNumeros = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: false,
  };

  maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 12,
  });

  constructor(
    private errorService: ErrorService,
    private fb: FormBuilder,
    private contratoCatalogoService: ContratoCatalogoService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
    private arquivoService: ArquivoService,
    private importacaoService: ImportacaoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  filtreContratos(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.contratoCatalogoService.filtre(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (paginacaoPesquisaConfigurada) => {
          // Limpando a requisição selecionada.
          this.selecione(null);
          this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
          this.configureGrid();

          if (emitirToastrDeSucesso) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
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

  selecione(contratos: Array<ContratoCatalogoFornecedorDto>): void {
    this.contratoSelecionado = contratos && contratos instanceof Array && contratos.length > 0 ? contratos[0] : undefined;
  }

  limpeFiltro(): void {
    this.formFiltro.reset();
    this.filtreContratos(false, true);
  }

  filtre(): void {
    this.filtreContratos(false, true);
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.filtreContratos(false);
  }

  exporte(): void {
    this.inicieLoading();

    this.contratoCatalogoService.exporteContratosMarketplaceFornecedor(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório de Contratos.xlsx`,
          );

          this.emitirToastrDeSucesso();
        },
        (error) => this.errorService.treatError(error));
  }

  selecionarArquivo(arquivo: Arquivo[]) {
    this.importacaoService.importeCatalogosFornecedor(arquivo[0])
      .subscribe(
        () => {
          this.toastr.warning('A carga está sendo processada');
        },
        (error: any) => {
          this.errorService.treatError(error);
        },
      );
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
    this.construaFormFiltro();
    this.populeSituacoes();
    this.construaFerramentas();
    this.obtenhaColunasDisponiveis();
    this.filtreContratosNaInicializacao();
  }

  private construaFormFiltro(): void {
    this.formFiltro = this.fb.group({
      idCatalogo: [null],
      idProduto: [null],
      descricao: [null],
      codigo: [null],
      situacaoCatalogo: [null],
      situacaoItem: [null],
      titulo: [null],
      cliente: [null],
      responsavel: [null],
      dataInicio: [null],
      dataFim: [null],
      preco: [null],
      quantidadeMinima: [null],
      prazoEntrega: [null],
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

  private populeSituacoes(): void {
    this.opcoesSituacaoCatalogo = new EnumToArrayPipe().transform(SituacaoContratoCatalogo) as Array<any>;
    this.opcoesSituacaoItem = new EnumToArrayPipe().transform(SituacaoContratoCatalogoItem) as Array<any>;

        let filtroContrato: (contratoSituacao: { index: number, name: string }) => boolean;
        let filtroContratoitem: (contratoSituacao: { index: number, name: string }) => boolean;

        filtroContrato = (contratoSituacao: { index: number, name: string }) => {
          return contratoSituacao.index != SituacaoContratoCatalogo.Inativo &&
                 contratoSituacao.index != SituacaoContratoCatalogo['Em configuração'] &&
                 contratoSituacao.index != SituacaoContratoCatalogo['Em Revisão']
        };

        filtroContratoitem = (itemSituacao: { index: number, name: string }) => {
          return itemSituacao.index != SituacaoContratoCatalogoItem['Aguardando Inclusão'] &&
                 itemSituacao.index != SituacaoContratoCatalogoItem['Aguardando Exclusão']
        };

        this.opcoesSituacaoItem = this.opcoesSituacaoItem.filter((situacao) => filtroContratoitem(situacao));
        this.opcoesSituacaoCatalogo = this.opcoesSituacaoCatalogo.filter((situacao) => filtroContrato(situacao));

  }

  private obtenhaColunasDisponiveis(): void {
    this.contratoCatalogoService.obtenhaColunasDiponiveis(true).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
        (error) => this.errorService.treatError(error));
  }

  private filtreContratosNaInicializacao(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoCatalogoService.obtenhaFiltroSalvo().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: ContratoFornecedorFiltroDto) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5 };
          this.formFiltro.patchValue(this.filtro);
          this.filtreContratos(false);
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

  private importar(): void {
    document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
  }

  private historico(): void {
    this.router.navigate(['./historico/'], { relativeTo: this.route });
  }

  private construaFerramentas(): void {
    const botoes: Ferramenta[] = [
      {
        tooltip: 'Histórico',
        acao: () => { this.historico(); },
        icone: 'fa-file-upload',
        classe: 'btn-outline-success',
        label: 'Histórico',
      },
      {
        tooltip: 'Importar',
        acao: () => { this.importar(); },
        icone: 'fa-upload',
        classe: 'btn-outline-success',
        label: 'Importar',
      },
    ];

    this.ferramentas.push(...botoes);
  }
}
