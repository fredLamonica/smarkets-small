import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { concat, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { Marca, Ordenacao, Paginacao } from '../../../shared/models';
import { Alcada } from '../../../shared/models/alcada';
import { CentroCusto } from '../../../shared/models/centro-custo';
import { CondicaoPagamento } from '../../../shared/models/condicao-pagamento';
import { ContaContabilDto } from '../../../shared/models/dto/conta-contabil-dto';
import { OperadorDeComparacao } from '../../../shared/models/enums/operador-de-comparacao.enum';
import { TipoAlcadaAprovacao } from '../../../shared/models/enums/tipo-alcada-aprovacao';
import { ContaContabilFiltro } from '../../../shared/models/fltros/conta-contabil-filtro';
import { FornecedorFilter } from '../../../shared/models/fltros/fornecedor-filter';
import { GrupoCompradores } from '../../../shared/models/grupo-compradores';
import { PessoaJuridicaDto } from '../../../shared/models/pessoa-juridica-dto';
import { Regularizacao } from '../../../shared/models/regularizacao/regularizacao';
import { Usuario } from '../../../shared/models/usuario';
import { ContaContabilService, FornecedorService, MarcaService } from '../../../shared/providers';
import { AlcadaService } from '../../../shared/providers/alcada.service';
import { CentroCustoService } from '../../../shared/providers/centro-custo.service';
import { CondicaoPagamentoService } from '../../../shared/providers/condicao-pagamento.service';
import { GrupoCompradoresService } from '../../../shared/providers/grupo-compradores.service';
import { RegularizacaoService } from '../../../shared/providers/regularizacao.service';
import { TranslationLibraryService } from '../../../shared/providers/translation-library.service';
import { ErrorService } from '../../../shared/utils/error.service';
import { UtilitiesService } from '../../../shared/utils/utilities.service';

@Component({
  selector: 'smk-carrinho-regularizacao',
  templateUrl: './carrinho-regularizacao.component.html',
  styleUrls: ['./carrinho-regularizacao.component.scss'],
})
export class CarrinhoRegularizacaoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input() usuarioAtual: Usuario;

  @Output() atualizarCarrinho: EventEmitter<void> = new EventEmitter<void>();

  regularizacoes: Array<Regularizacao>;
  fornecedores$: Observable<Array<PessoaJuridicaDto>>;
  fornecedoresLoading: boolean;
  fornecedoresInput$ = new Subject<string>();
  centrosDeCusto: Array<CentroCusto>;
  centrosDeCustoLoading: boolean;
  centroDeCustoUnico: boolean;
  condicoesPagamento: Array<CondicaoPagamento>;
  condicoesPagamentoLoading: boolean;
  condicoesPagamentoUnica: boolean;
  gruposCompradores: Array<GrupoCompradores>;
  gruposCompradoresLoading: boolean;
  grupoCompradoresUnico: boolean;
  alcadas: Array<Alcada>;
  alcadasLoading: boolean;
  alcadaUnica: boolean;
  marcas: Array<Marca>;
  marcasLoading: boolean;
  contasContabeis$: Observable<Array<ContaContabilDto>>;
  contasContabeisLoading: boolean;
  contaContabilUnica: boolean;
  contasContabeisInput$ = new Subject<string>();
  contaContabilFiltro: ContaContabilFiltro = new ContaContabilFiltro();

  readonly textoNgSelectLoading: string = 'Buscando...';
  readonly textoNgSelectLimpar: string = 'Limpar';
  readonly textoNgSelectPlaceholder: string = 'Selecione';

  private filtroFornecedor: FornecedorFilter;

  constructor(
    private router: Router,
    private regularizacaoService: RegularizacaoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService,
    private centroCustoService: CentroCustoService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private grupoCompradoresService: GrupoCompradoresService,
    private alcadaService: AlcadaService,
    private utilitiesService: UtilitiesService,
    private errorService: ErrorService,
    private marcarService: MarcaService,
    private contaContabilService: ContaContabilService,
  ) {
    super();
  }

  ngOnInit() {
    this.populeMarcas();
    this.obterRegularizacoes();

    this.filtroFornecedor = new FornecedorFilter({
      itensPorPagina: 100,
      pagina: 1,
      operadorDeComparacao: OperadorDeComparacao.OR,
      idTenantCliente: this.usuarioAtual.permissaoAtual.pessoaJuridica.idTenant,
      itemOrdenar: 'RazaoSocial',
      ordenacao: Ordenacao.ASC,
    });
  }

  removaRegularizacao(regularizacao: Regularizacao) {
    const posicao = this.regularizacoes.indexOf(regularizacao);
    this.regularizacoes.splice(posicao, 1);
    this.atualizarCarrinho.emit();
  }

  atualizeResumoCarrinho() {
    this.atualizarCarrinho.emit();
  }

  confirmeRegularizacao(regularizacao: Regularizacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.regularizacaoService.confirmar(regularizacao).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.esvaziarCarrinho();
          }

          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.router.navigate(['/marketplace']);
          this.atualizeResumoCarrinho();
        },
        (responseError) => this.errorService.treatError(responseError));
  }

  esvaziarCarrinho() {
    this.regularizacoes = new Array<Regularizacao>();
  }

  private obterRegularizacoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.regularizacaoService.getCarrinho().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (regularizacoes) => {
          if (regularizacoes) {
            this.regularizacoes = regularizacoes;

            if (this.regularizacoes.length > 0) {
              this.obterCentroCustoPadrao();
              this.populeCentrosDeCusto();
              this.populeCondicoesDePagamento();
              this.assineEventoDePesquisaDeFornecedores();
              this.assineEventoDePesquisaDeContasContabeis();

              if (this.usuarioAtual) {
                if (this.usuarioAtual.permissaoAtual.pessoaJuridica.habilitarIntegracaoERP) {
                  this.populeGruposDeCompradores();
                }

                if (this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao === TipoAlcadaAprovacao.unificada) {
                  this.populeAlcadas();
                }
              }

            }
          }
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  private obterCentroCustoPadrao() {
    this.centroCustoService.obterCentroCustoPadrao().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (centroDefault) => {
          if (centroDefault) {
            for (const regularizacao of this.regularizacoes) {
              regularizacao.centroCusto = centroDefault;
              regularizacao.idCentroCusto = centroDefault.idCentroCusto;
            }
          }
        },
      );
  }

  private assineEventoDePesquisaDeFornecedores(): void {
    this.fornecedores$ = concat(
      this.utilitiesService.getObservable(new Array<PessoaJuridicaDto>()),
      this.fornecedoresInput$.pipe(
        takeUntil(this.unsubscribe),
        filter((termoDeBusca) => termoDeBusca !== null && termoDeBusca.length >= 3),
        debounceTime(750),
        distinctUntilChanged(),
        tap(() => (this.fornecedoresLoading = true)),
        switchMap((termoDeBusca: string) => {
          this.filtroFornecedor.cnpj = termoDeBusca;
          this.filtroFornecedor.razaoSocial = termoDeBusca;
          this.filtroFornecedor.nomeFantasia = termoDeBusca;

          return this.fornecedorService.filtro(this.filtroFornecedor).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => (this.fornecedoresLoading = false)),
            map((paginacao: Paginacao<PessoaJuridicaDto>) => paginacao ? paginacao.itens : new Array<PessoaJuridicaDto>()),
            catchError(() => this.utilitiesService.getObservable(new Array<PessoaJuridicaDto>())),
          );
        }),
      ),
    );
  }

  private assineEventoDePesquisaDeContasContabeis(): void {
    const ITENS_POR_PAGINA: number = 100;
    const PAGINA: number = 1;
    this.contasContabeis$ = concat(
      this.utilitiesService.getObservable(new Array<ContaContabilDto>()),
      this.contasContabeisInput$.pipe(
        takeUntil(this.unsubscribe),
        filter((termoDeBusca) => termoDeBusca !== null && termoDeBusca.length >= 3),
        debounceTime(750),
        distinctUntilChanged(),
        tap(() => (this.contasContabeisLoading = true)),
        switchMap((termoDeBusca: string) => {
          this.contaContabilFiltro.itensPorPagina = ITENS_POR_PAGINA;
          this.contaContabilFiltro.pagina = PAGINA;
          this.contaContabilFiltro.termo = termoDeBusca;
          return this.contaContabilService.listarContasPai(this.contaContabilFiltro).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => (this.contasContabeisLoading = false)),
            map((paginacao: Paginacao<ContaContabilDto>) => paginacao ? paginacao.itens : new Array<ContaContabilDto>()),
            catchError(() => this.utilitiesService.getObservable(new Array<ContaContabilDto>())),
          );
        }),
      ),
    );
  }

  private populeCentrosDeCusto() {
    this.centrosDeCustoLoading = true;

    this.centroCustoService.listarAtivos().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.centrosDeCustoLoading = false))
      .subscribe((centrosDeCusto) => {
        this.centrosDeCusto = centrosDeCusto;

        if (centrosDeCusto) {
          let centroDeCusto: CentroCusto;

          if (centrosDeCusto.length === 1) {
            centroDeCusto = centrosDeCusto[0];
            this.centroDeCustoUnico = true;
          } else {
            centroDeCusto = centrosDeCusto.find((x) => x.codigoDefault);
          }

          if (centroDeCusto) {
            for (const regularizacao of this.regularizacoes) {
              regularizacao.idCentroCusto = centroDeCusto.idCentroCusto;
              regularizacao.centroCusto = centroDeCusto;
            }
          }
        }
      });
  }

  private populeCondicoesDePagamento() {
    this.condicoesPagamentoLoading = true;

    this.condicaoPagamentoService.listarAtivos().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.condicoesPagamentoLoading = false))
      .subscribe((condicoesDePagamento) => {
        this.condicoesPagamento = condicoesDePagamento;

        if (condicoesDePagamento && condicoesDePagamento.length === 1) {
          const condicaoDePagamento = condicoesDePagamento[0];

          for (const regularizacao of this.regularizacoes) {
            regularizacao.idCondicaoPagamento = condicaoDePagamento.idCondicaoPagamento;
            regularizacao.condicaoPagamento = condicaoDePagamento;
          }

          this.condicoesPagamentoUnica = true;
        }
      });
  }

  private populeGruposDeCompradores() {
    this.gruposCompradoresLoading = true;

    this.grupoCompradoresService.listar().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.gruposCompradoresLoading = false))
      .subscribe((gruposCompradores) => {
        this.gruposCompradores = gruposCompradores;

        if (gruposCompradores) {
          let grupoDeCompradores: GrupoCompradores;

          if (gruposCompradores.length === 1) {
            grupoDeCompradores = gruposCompradores[0];
            this.grupoCompradoresUnico = true;
          } else {
            grupoDeCompradores = gruposCompradores.find((x) => x.codigoDefault);
          }

          if (grupoDeCompradores) {
            for (const regularizacao of this.regularizacoes) {
              regularizacao.idGrupoCompradores = grupoDeCompradores.idGrupoCompradores;
              regularizacao.grupoCompradores = grupoDeCompradores;
            }
          }
        }
      });
  }

  private populeAlcadas() {
    this.alcadasLoading = true;

    this.alcadaService.listar().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.alcadasLoading = false))
      .subscribe((alcadas) => {
        this.alcadas = alcadas;

        if (alcadas && alcadas.length === 1) {
          const alcada = alcadas[0];

          for (const regularizacao of this.regularizacoes) {
            regularizacao.idAlcada = alcada.idAlcada;
          }

          this.alcadaUnica = true;
        }
      });
  }

  private populeMarcas(): void {
    this.marcasLoading = true;

    this.marcarService.listar().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.marcasLoading = false))
      .subscribe((marcas) => this.marcas = marcas);
  }

}
