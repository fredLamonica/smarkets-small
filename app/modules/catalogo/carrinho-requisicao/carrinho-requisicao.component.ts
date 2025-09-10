import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CentroCusto, CondicaoPagamento, Departamento, GrupoCompradores, Paginacao, Requisicao, RequisicaoItem, TipoRequisicao } from '@shared/models';
import { AutenticacaoService, CentroCustoService, CondicaoPagamentoService, ContaContabilService, DepartamentoService, GrupoCompradoresService, TipoRequisicaoService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, concat } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Alcada } from '../../../shared/models/alcada';
import { ContaContabilDto } from '../../../shared/models/dto/conta-contabil-dto';
import { TipoAlcadaAprovacao } from '../../../shared/models/enums/tipo-alcada-aprovacao';
import { ContaContabilFiltro } from '../../../shared/models/fltros/conta-contabil-filtro';
import { RequisicaoService } from '../../../shared/providers/requisicao.service';
import { ErrorService } from '../../../shared/utils/error.service';
import { UtilitiesService } from '../../../shared/utils/utilities.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'carrinho-requisicao',
  templateUrl: './carrinho-requisicao.component.html',
  styleUrls: ['./carrinho-requisicao.component.scss'],
})
export class CarrinhoRequisicaoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-output-rename
  @Output('atualizar-carrinho') atualizarCarrinho = new EventEmitter();

  requisicoes: Requisicao[];
  requisicoesTeste: Requisicao[];
  totalItensRequisicao: number;
  todasAsEmpresasPossuemIntegracaoErp: boolean;

  centrosDeCusto: Array<CentroCusto>;
  centrosDeCustoLoading: boolean;
  centroDeCustoUnico: boolean;

  alcadas: Array<Alcada>;
  alcadasLoading: boolean;
  alcadaUnica: boolean;

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;

  condicoesPagamento: Array<CondicaoPagamento>;
  condicoesPagamentoLoading: boolean;

  tiposRequisicao: Array<TipoRequisicao>;
  tiposRequisicaoLoading: boolean;
  tipoRequisicaoUnico: boolean;
  tipoRequisicaoUnicoLoaded: Subject<TipoRequisicao> = new Subject<TipoRequisicao>();

  gruposCompradores: Array<GrupoCompradores>;
  gruposCompradoresLoading: boolean;
  grupoCompradoresUnico: boolean;

  contasContabeis$: Observable<Array<ContaContabilDto>>;
  contasContabeisLoading: boolean;
  contaContabilUnica: boolean;
  contasContabeisInput$ = new Subject<string>();
  contaContabilFiltro: ContaContabilFiltro = new ContaContabilFiltro();

  departamentos: Array<Departamento>;
  departamentosLoading: boolean;
  departamentoUnico: boolean;
  habilitarDepartamentoRequisicao: boolean;

  itensSendoSalvos: number = 0;

  readonly textoNgSelectLoading: string = 'Buscando...';
  readonly textoNgSelectLimpar: string = 'Limpar';
  readonly textoNgSelectPlaceholder: string = 'Selecione';

  constructor(
    private requisicaoService: RequisicaoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    private authService: AutenticacaoService,
    private centroCustoService: CentroCustoService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private tipoRequisicaoService: TipoRequisicaoService,
    private grupoCompradoresService: GrupoCompradoresService,
    private contaContabilService: ContaContabilService,
    private errorService: ErrorService,
    private utilitiesService: UtilitiesService,
    private departamentoService: DepartamentoService,
  ) {
    super();
  }

  ngOnInit() {
    this.habilitarDepartamentoRequisicao = this.authService.usuario().permissaoAtual.pessoaJuridica.habilitarDepartamentoRequisicao;
    this.obterRequisicoes();
  }

  esvaziarCarrinho() {
    this.requisicoes = new Array<Requisicao>();
    this.refreshTodasAsEmpresasPossuemIntegracaoErp();
  }

  confirmarRequisicao() {
    const usuario = this.authService.usuario();
    if (usuario.permissaoAtual.pessoaJuridica.bloquearRequisicaoPedido) {
      return this.toastr.warning(this.translationLibrary.translations.ALERTS.COMPANY_BLOCKED_TO_GENERATE_ORDERS_AND_REQUESTS);
    }
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    for (const req of this.requisicoes) {
      const isValid = this.validarRequisicao(req);
      if (!isValid) {
        this.blockUI.stop();
        return;
      }
    }
    this.requisicaoService.confirmar(this.requisicoes).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.esvaziarCarrinho();
          }

          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);

          this.blockUI.stop();

          this.router.navigate(['/marketplace']);
          this.atualizarResumoCarrinho();
        },
        (responseError) => {
          this.errorService.treatError(responseError);
          this.blockUI.stop();
        });

  }

  validarRequisicao(requisicao: Requisicao) {
    if (!requisicao.idEnderecoEntrega) {
      let mensagemErro = 'É obrigatório selecionar um endereço no item "';
      mensagemErro += requisicao.itens[0].produto.descricao + '" na requisição.';
      this.toastr.warning(mensagemErro);
      return false;
    }

    if (this.tipoAlcadaAprovacao === this.tipoAlcadaAprovacaoEnum.desmembrada) {
      if (!requisicao.idCentroCusto) {
        let mensagemErro = 'É obrigatório selecionar um centro de custo no item "';
        mensagemErro += requisicao.itens[0].produto.descricao + '" na requisição.';
        this.toastr.warning(mensagemErro);
        return false;
      }
    }

    if (!requisicao.idTipoRequisicao) {
      let mensagemErro = 'É obrigatório selecionar um tipo de requisição no item "';
      mensagemErro += requisicao.itens[0].produto.descricao + '" na requisição.';
      this.toastr.warning(mensagemErro);
      return false;
    }

    if (!requisicao.idSlaItem) {
      let mensagemErro = 'É obrigatório selecionar uma classificação no item "';
      mensagemErro += requisicao.itens[0].produto.descricao + '" na requisição.';
      this.toastr.warning(mensagemErro);
      return false;
    }

    if (requisicao.empresaSolicitante.habilitarIntegracaoERP && !requisicao.idGrupoCompradores) {
      let mensagemErro = 'É obrigatório selecionar um grupo de compradores no item "';
      mensagemErro += requisicao.itens[0].produto.descricao + '" na requisição.';
      this.toastr.warning(mensagemErro);
      return false;
    }

    if (this.habilitarDepartamentoRequisicao && !requisicao.idDepartamento) {
      let mensagemErro = 'É obrigatório selecionar um departamento no item "';
      mensagemErro += requisicao.itens[0].produto.descricao + '" na requisição.';
      this.toastr.warning(mensagemErro);
      return false;
    }

    for (const itemRequisicao of requisicao.itens) {
      if (!this.isQuantidadeValida(itemRequisicao)) {
        return false;
      }

      if (requisicao.empresaSolicitante.habilitarIntegracaoERP && !this.isValorDeReferenciaValido(itemRequisicao)) {
        return false;
      }

      if (!this.isDataEntregaValida(itemRequisicao)) {
        return false;
      }
    }
    return true;
  }

  sumValores(requisicoes: Requisicao[]) {
    if (requisicoes) {
      return requisicoes.map((requisicao) => {
        if (requisicao.itens && requisicao.itens.length > 0) {
          return requisicao.itens.map((requisicaoItem) => {
            if (!requisicaoItem.entregaProgramada) {
              if (requisicaoItem.valorReferencia && requisicaoItem.valorReferencia !== 0) {
                return requisicaoItem.quantidade * requisicaoItem.valorReferencia;
              }

              if (requisicaoItem.produto && requisicaoItem.produto.valorReferencia && requisicaoItem.produto.valorReferencia !== 0) {
                return requisicaoItem.quantidade * requisicaoItem.produto.valorReferencia;
              } else {
                return 0;
              }
            } else {
              let valorTotal = 0;

              if (requisicaoItem.datasDasEntregasProgramadas) {
                for (const entrega of requisicaoItem.datasDasEntregasProgramadas) {
                  valorTotal += entrega.quantidade * entrega.valor;
                }
              }

              return valorTotal;
            }
          }).reduce((x, y) => x + y, 0);
        } else {
          return 0;
        }
      }).reduce((x, y) => x + y, 0);
    }
  }

  totalProdutos(requisicoes: Requisicao[]) {
    if (requisicoes) {
      return requisicoes.map((requisicao) => {
        if (requisicao.itens) {
          return requisicao.itens.length;
        }
      }).reduce((x, y) => x + y, 0);
    }
  }

  removerRequisicaoConcluida(requisicao: Requisicao) {
    const j = this.requisicoes.indexOf(requisicao);
    if (j > -1) {
      this.requisicoes.splice(j, 0);
    }
  }

  tratarDataEntrega(requisicoes: Array<Requisicao>): Array<Requisicao> {
    requisicoes.forEach((requisicao) => {
      requisicao.itens.forEach((requisicaoItem) => {
        requisicaoItem.dataEntrega = this.datePipe.transform(requisicaoItem.dataEntrega, 'yyyy-MM-dd');
        requisicaoItem.minDataEntrega = this.datePipe.transform(requisicaoItem.minDataEntrega, 'yyyy-MM-dd');
        return requisicaoItem;
      });
    });
    return requisicoes;
  }

  removerRequisicao(requisicao: Requisicao) {
    const posicao = this.requisicoes.indexOf(requisicao);
    this.requisicoes.splice(posicao, 1);

    this.refreshTodasAsEmpresasPossuemIntegracaoErp();

    this.atualizarCarrinho.emit();
  }

  removerRequisicoes(requisicoesItens: Array<RequisicaoItem>) {
    console.log(requisicoesItens);
  }

  atualizarResumoCarrinho() {
    this.atualizarCarrinho.emit();
  }

  itemAlterado(status: string) {
    if (status === 'salvando') {
      this.itensSendoSalvos += 1;
    } else {
      this.itensSendoSalvos -= 1;
    }

    if (this.itensSendoSalvos < 0) {
      this.itensSendoSalvos = 0;
    }
  }

  itensEstaoSendoSalvos(): boolean {
    return this.itensSendoSalvos > 0;
  }

  private obterRequisicoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.requisicaoService.obterRequisicoesCarrinho().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (requisicoes) => {
          if (requisicoes) {
            this.requisicoes = this.tratarDataEntrega(requisicoes);

            if (requisicoes.length > 0) {
              this.obterCentroCustoPadrao();
              this.refreshTodasAsEmpresasPossuemIntegracaoErp();
              this.populeCentrosDeCusto();
              this.populeCondicoesDePagamento();
              this.populeTiposRequisicao();
              this.assineEventoDePesquisaDeContasContabeis();

              if (this.habilitarDepartamentoRequisicao) {
                this.populeDepartamentos();
              }

              if (this.requisicoes.some((x) => x.empresaSolicitante.habilitarIntegracaoERP)) {
                this.populeGruposDeCompradores();
              }
            }
          } else {
            this.toastr.info('Nenhuma requisição realizada.');
          }

          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private isQuantidadeValida(itemRequisicao: RequisicaoItem): boolean {
    if (itemRequisicao.quantidade < 1) {
      let mensagemErro = 'Não foi possível confirmar a requisição, lote mínimo não alcançado para o produto "';
      mensagemErro += itemRequisicao.produto.descricao;
      this.toastr.warning(mensagemErro);
      return false;
    }

    return true;
  }

  private isDataEntregaValida(itemRequisicao: RequisicaoItem): boolean {
    if (!itemRequisicao.dataEntrega) {
      let mensagemErro = 'É obrigatório informar a data de entrega no item "';
      mensagemErro += itemRequisicao.produto.descricao + '" na requisição.';
      this.toastr.warning(mensagemErro);
      return false;
    }

    const dataEntrega = moment(itemRequisicao.dataEntrega);

    if (!dataEntrega.isSameOrAfter(itemRequisicao.minDataEntrega)) {
      let mensagemErro = 'A data de entrega no item "';
      mensagemErro += itemRequisicao.produto.descricao + '" deve ser igual ou posterior a ';
      mensagemErro += this.datePipe.transform(itemRequisicao.minDataEntrega, 'dd/MM/yyyy') + '.';
      this.toastr.warning(mensagemErro);

      return false;
    }

    return true;
  }

  private isValorDeReferenciaValido(itemRequisicao: RequisicaoItem): boolean {
    if (!itemRequisicao.valorReferencia || itemRequisicao.valorReferencia <= 0) {
      this.toastr.warning(`É obrigatório informar o valor de referência no item "${itemRequisicao.produto.descricao}" na requisição.`);
      return false;
    }

    return true;
  }

  private obterCentroCustoPadrao() {
    this.centroCustoService.obterCentroCustoPadrao().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (centroDefault) => {
          if (centroDefault) {
            this.requisicoes.forEach((requisicao) => {
              requisicao.centroCusto = centroDefault;
              requisicao.idCentroCusto = centroDefault.idCentroCusto;
            });
          }
        },
      );
  }

  private refreshTodasAsEmpresasPossuemIntegracaoErp() {
    this.todasAsEmpresasPossuemIntegracaoErp = (this.requisicoes && this.requisicoes.length > 0 && this.requisicoes.every((x) => x.empresaSolicitante.habilitarIntegracaoERP)) || false;
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
            for (const requisicao of this.requisicoes) {
              requisicao.idCentroCusto = centroDeCusto.idCentroCusto;
              requisicao.centroCusto = centroDeCusto;
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
      .subscribe((condicoesDePagamento) => this.condicoesPagamento = condicoesDePagamento);
  }

  private populeTiposRequisicao() {
    this.tiposRequisicaoLoading = true;

    this.tipoRequisicaoService.obterTodos().pipe(
      finalize(() => this.tiposRequisicaoLoading = false))
      .subscribe((tiposDeRequisicao) => {
        this.tiposRequisicao = tiposDeRequisicao;

        if (tiposDeRequisicao && tiposDeRequisicao.length === 1) {
          this.tipoRequisicaoUnico = true;
          this.tipoRequisicaoUnicoLoaded.next(tiposDeRequisicao[0]);
        }
      });
  }

  private populeGruposDeCompradores() {
    this.gruposCompradoresLoading = true;

    this.grupoCompradoresService.listar().pipe(
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
            for (const requisicao of this.requisicoes) {
              requisicao.idGrupoCompradores = grupoDeCompradores.idGrupoCompradores;
              requisicao.grupoCompradores = grupoDeCompradores;
            }
          }
        }
      });
  }

  private populeDepartamentos() {
    this.departamentosLoading = true;

    this.departamentoService.listar().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.departamentosLoading = false))
      .subscribe((departamentos) => {
        this.departamentos = departamentos;

        if (departamentos) {
          if (departamentos.length === 1) {
            this.departamentoUnico = true;
            const departamento = departamentos[0];

            for (const requisicao of this.requisicoes) {
              requisicao.idDepartamento = departamento.idDepartamento;
              requisicao.departamento = departamento;
            }
          }
        }
      });
  }

  private assineEventoDePesquisaDeContasContabeis() {
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

}
