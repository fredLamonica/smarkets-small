import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { AlterarValorReferenciaComponent } from '@shared/components/modals/alterar-valor-referencia/alterar-valor-referencia.component';
import { ClassificacaoPreco, Cotacao, CotacaoItem, CotacaoRodada, CotacaoRodadaProposta, Iva, Moeda, PerfilUsuario, SituacaoCotacao, SituacaoCotacaoItem, TipoFrete, UnidadeMedidaTempo } from '@shared/models';
import { AutenticacaoService, CotacaoRodadaService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { UtilitiesService } from '../../../../shared/utils/utilities.service';
import { DetalhesProdutoComponent } from '../../../catalogo/detalhes-produto/detalhes-produto.component';
import { ManterDesclassificacaoPropostaComponent } from '../manter-desclassificacao-proposta/manter-desclassificacao-proposta.component';
import { StatusFornecedor } from './../../../../shared/models/enums/status-fornecedor';
import { Usuario } from './../../../../shared/models/usuario';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mapa-comparativo-item',
  templateUrl: './mapa-comparativo-item.component.html',
  styleUrls: ['./mapa-comparativo-item.component.scss'],
})
export class MapaComparativoItemComponent extends Unsubscriber implements OnInit {

  get emAndamento(): boolean {
    return this.cotacao && this.processo === 'andamento';
  }

  get emAnalise(): boolean {
    return this.cotacao && this.processo === 'analise';
  }

  get emBalisamento(): boolean {
    return (
      this.cotacao &&
      this.processo === 'balizamento' &&
      this.item.situacao === SituacaoCotacaoItem.Ativo
    );
  }

  get cancelada(): boolean {
    return this.processo === 'cancelada';
  }

  get podeAvaliar(): boolean {
    if (this.rodadaAtual.finalizada && !this.cancelada) {
      const algumaPropostaAnalisadaRodadaAtual = this.rodadaSelecionada.propostas.some(
        (p) => p.vencedor || p.desclassificado,
      );

      return (
        this.rodadaSelecionada &&
        this.rodadaAtual &&
        this.rodadaSelecionada.idCotacaoRodada === this.rodadaAtual.idCotacaoRodada &&
        this.item.situacao !== SituacaoCotacaoItem.Finalizado &&
        this.cotacao.situacao !== SituacaoCotacao.Encerrada &&
        !algumaPropostaAnalisadaRodadaAtual
      );
    } else if (this.rodadaAtual.finalizada && this.cancelada) {
      return false;
    } else {
      return (
        this.rodadaSelecionada &&
        this.rodadaAtual &&
        this.rodadaSelecionada.idCotacaoRodada === this.rodadaAtual.idCotacaoRodada &&
        !this.rodadaAtual.finalizada &&
        this.emAnalise
      );
    }
  }
  @BlockUI() blockUI: NgBlockUI;

  Moeda = Moeda;
  TipoFrete = TipoFrete;
  UnidadeMedidaTempo = UnidadeMedidaTempo;
  ClassificacaoPreco = ClassificacaoPreco;
  SituacaoCotacaoItem = SituacaoCotacaoItem;

  usuarioAtual: Usuario;

  @Input() index: number;
  @Input() processo: 'andamento' | 'analise' | 'cancelada' | 'balizamento' = 'andamento';

  // tslint:disable-next-line: no-input-rename
  @Input('parametrosIntegracaoSapHabilitado') parametrosIntegracaoSapHabilitado: boolean;

  // tslint:disable-next-line: no-input-rename
  @Input('rodada-atual') rodadaAtual: CotacaoRodada;
  @Input() item: CotacaoItem;
  @Input() cotacao: Cotacao;

  @Input() selecionado: boolean;
  // tslint:disable-next-line: no-output-rename
  @Output('selecao') selecaoEmitter = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output('classificar-vencedor') classificarVencedorEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('desclassificar-vencedor') desclassificarVencedorEmitter = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output('classificar-vencedor-pacote') classificarVencedorPacoteEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('desclassificar-vencedor-pacote') declassificarVencedorPacoteEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('pacote-nao-preenchido') pacoteNaoPreenchidoEmitter = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output('selecaoPropostas') selecaoPropostasEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('abaUltimosPrecos') abaUltimosPrecosEmitter = new EventEmitter();

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

  rodadaSelecionada: CotacaoRodada;

  @Input() ivas: Array<Iva>;

  cotacaoItemComPropostasSelecionadas: CotacaoItem;

  rodadaUltimosPrecosSelecionada: CotacaoRodada;
  abaUltimosPrecos: boolean;
  propostasUltimosPrecos: Array<CotacaoRodadaProposta>;
  StatusFornecedor = StatusFornecedor;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
    private route: ActivatedRoute,
    private router: Router,
    private utilitiesServices: UtilitiesService,
  ) {
    super();
  }

  async ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
  }

  obterRodadas() {
    if (!this.item.rodadas) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.cotacaoRodadaService.obterRodadasPorItem(this.item.idCotacaoItem).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response) { this.tratarRodadas(response); }
            this.tratarPropostasVencedorasItem();
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  selecionarRodada(rodada: CotacaoRodada) {
    this.rodadaSelecionada = rodada;
    if (this.cotacaoItemComPropostasSelecionadas) {
      this.abaUltimosPrecos = false;
      this.abaUltimosPrecosEmitter.emit(this.abaUltimosPrecos);
      this.limpaPropostasLista();
    }

    this.preenchaDiferencaPrecoUltimaCompra(this.rodadaSelecionada.propostas);
  }

  selecionarUltimosPrecosPropostas(propostas: Array<CotacaoRodadaProposta>) {
    this.preenchaDiferencaPrecoUltimaCompra(propostas);
    this.propostasUltimosPrecos = propostas;
  }

  obterUltimosPrecos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService.obterUltimosPrecosPorItem(this.item.idCotacaoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.abaUltimosPrecos = true;
          const propostas = response
            .map((p) => p.propostas)
            .reduce((a, b) => {
              return a.concat(b);
            });

          this.selecionarUltimosPrecosPropostas(propostas);
          this.abaUltimosPrecosEmitter.emit(this.abaUltimosPrecos);
          this.selecaoEmitter.emit(false);
        }

        this.blockUI.stop();
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  solicitarMarcarVencedor(proposta: CotacaoRodadaProposta) {
    if (this.podeDefinirPropostaVencedora(proposta)) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, {
        centered: true,
      });
      modalRef.componentInstance.confirmacao = `Tem certeza que deseja marca a proposta como vencedora?`;
      modalRef.result.then((result) => {
        if (result) {
          if (this.item.requisicaoItem.idSubItemSolicitacaoCompra) {
            this.marcarVencedorPacote(proposta);
          } else {
            this.marcarVencedor(proposta);
          }
        }
      });
    }
  }

  marcarVencedor(proposta: CotacaoRodadaProposta) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService.marcarPropostaVencedora(proposta.idCotacaoRodadaProposta).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        proposta.vencedor = true;
        this.classificarVencedorEmitter.emit(proposta);
        this.blockUI.stop();
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  solicitarDesmarcarVencedor(proposta: CotacaoRodadaProposta) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja desmarcar a proposta como vencedora?`;
    modalRef.result.then((result) => {
      if (result) {
        if (result) {
          if (this.item.requisicaoItem.idSubItemSolicitacaoCompra) {
            this.desmarcarVencedorPacote(proposta);
          } else {
            this.desmarcarVencedor(proposta);
          }
        }
      }
    });
  }

  desmarcarVencedor(proposta: CotacaoRodadaProposta) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService.marcarPropostaVencedora(proposta.idCotacaoRodadaProposta).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        proposta.vencedor = false;
        this.desclassificarVencedorEmitter.emit(proposta);
        this.blockUI.stop();
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  marcarDesclassificado(proposta: CotacaoRodadaProposta) {
    if (this.podeDefinirPropostaDesclassificada(proposta)) {
      const modalRef = this.modalService.open(ManterDesclassificacaoPropostaComponent, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
      });

      modalRef.componentInstance.proposta = proposta;

      modalRef.result.then((result) => {
        if (result) {
          proposta.desclassificado = true;
          this.desclassificarVencedorEmitter.emit(proposta);
        }
      });
    }
  }
  obterLogDesclassificado(proposta: CotacaoRodadaProposta) {
    if (this.cotacao.rodadaAtual.finalizada) {
      const modalRef = this.modalService.open(ManterDesclassificacaoPropostaComponent, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
      });

      modalRef.componentInstance.proposta = proposta;
      modalRef.componentInstance.rodadaAtualFinalizada = this.cotacao.rodadaAtual.finalizada;
    }
  }

  desmarcarDesclassificado(proposta: CotacaoRodadaProposta) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja desmarcar a proposta como desclassificada?`;
    modalRef.result.then((result) => {
      if (result) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.cotacaoRodadaService
          .marcarPropostaDesclassificada(proposta.idCotacaoRodadaProposta)
          .pipe(
            takeUntil(this.unsubscribe))
          .subscribe((response) => {
            proposta.desclassificado = false;
            this.blockUI.stop();
          },
            (error) => {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              this.blockUI.stop();
            },
          );
      }
    });
  }

  desmarcarDesconsideradoPreco(proposta: CotacaoRodadaProposta) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja desmarcar a proposta como Desconsiderada pelo Preço ?`;
    modalRef.result.then((result) => {
      if (result) { this.reconsiderarPorPreco(proposta); }
    });
  }

  solicitarDesconsideradoPreco(proposta: CotacaoRodadaProposta) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.confirmacao = `Tem certeza que deseja Desconsiderar a Proposta pelo seu Preço ?`;
    modalRef.result.then((result) => {
      if (result) { this.desconsiderarPorPreco(proposta); }
    });
  }

  podeDesconsiderarPreco(ordem: number): boolean {
    if (ordem === 1) {
      return true;
    }
    return false;
  }

  podeDefinirPropostaVencedora(proposta: CotacaoRodadaProposta): boolean {
    if (proposta.desclassificado) {
      this.toastr.warning(
        'Proposta não pode ser definida como vencedora pois se encontra desclassificada',
      );
      return false;
    }

    const propostasVencedoras = this.rodadaSelecionada.propostas.filter((pi) => pi.vencedor);
    if (propostasVencedoras.length) {
      const quantidade = propostasVencedoras.reduce(
        (sum, current) => sum + current.quantidadeDisponivel,
        0,
      );

      // tslint:disable-next-line: no-unused-expression
      quantidade + proposta.quantidadeDisponivel;
      if (quantidade > this.item.quantidade) {
        this.toastr.warning(
          'Proposta não pode ser definida como vencedora pois superta a quantidade solicitada na cotação',
        );
        return false;
      }
    }

    return true;
  }

  podeDefinirPropostaDesclassificada(proposta: CotacaoRodadaProposta): boolean {
    if (proposta.vencedor) {
      this.toastr.warning('Proposta não pode ser desclassificada pois está marcada como vencedora');
      return false;
    }

    return true;
  }

  // #region Avaliação de propostas de pacote
  marcarVencedorPacote(proposta: CotacaoRodadaProposta) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService
      .marcarPropostaVencedoraPacote(proposta.idCotacaoRodadaProposta)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe((response) => {
        proposta.vencedor = true;
        this.classificarVencedorPacoteEmitter.emit(response);
        this.blockUI.stop();
      },
        (error) => {
          this.marcarVencedorPacoteErrorHandler(error);
        },
      );
  }

  desmarcarVencedorPacote(proposta: CotacaoRodadaProposta) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService
      .marcarPropostaVencedoraPacote(proposta.idCotacaoRodadaProposta)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe((response) => {
        proposta.vencedor = false;
        this.declassificarVencedorPacoteEmitter.emit(response);
        this.blockUI.stop();
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
  // #endregion

  // Seleção de item
  onSelecionar(event: any) {
    this.selecaoEmitter.emit(event.target.checked);
  }

  onSelecionarIVA(idIva: number, proposta: CotacaoRodadaProposta) {
    if (!this.abaUltimosPrecos) {
      const propostaVencedora = this.item.propostasVencedoras.find(
        (p) => p.idCotacaoRodadaProposta === proposta.idCotacaoRodadaProposta,
      );
      propostaVencedora.idIva = idIva;
    } else {
      const propostaVencedora = this.cotacaoItemComPropostasSelecionadas.propostasVencedoras.find(
        (p) => p.idCotacaoRodadaProposta === proposta.idCotacaoRodadaProposta,
      );
      propostaVencedora.idIva = idIva;
    }
  }

  alterarValorReferencia(item: CotacaoItem) {
    const modalRef = this.modalService.open(AlterarValorReferenciaComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.cotacaoItem = item;
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      }
    });
  }

  permiteAlterarValorReferencia(): boolean {
    return (
      this.usuarioAtual &&
      this.usuarioAtual.permissaoAtual &&
      this.usuarioAtual.permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra &&
      this.usuarioAtual.permissaoAtual.pessoaJuridica.permiteAlterarValorReferencia &&
      this.emAnalise
    );
  }

  encontrarRodada(idCotacaoRodadaProposta: number): string {
    const ordem = this.item.rodadas.find((p) => {
      const proposta = p.propostas.find((q) => q.idCotacaoRodadaProposta === idCotacaoRodadaProposta);
      return proposta !== null && proposta !== undefined;
    }).ordem;

    return ordem + 'ª Rodada';
  }

  selecionarProposta(proposta: CotacaoRodadaProposta) {
    this.addOrRemovePropostasLista(proposta);
    this.selecaoPropostasEmitter.emit(this.cotacaoItemComPropostasSelecionadas);
  }

  mostrarIva(proposta: CotacaoRodadaProposta): boolean {
    return (
      this.cotacaoItemComPropostasSelecionadas.propostasVencedoras.filter(
        (p) => p.idCotacaoRodadaProposta === proposta.idCotacaoRodadaProposta,
      ).length !== 0 &&
      this.parametrosIntegracaoSapHabilitado &&
      this.emBalisamento &&
      this.selecionado
    );
  }

  navegarOrigemPedido(idPedido: number) {
    if (
      null != idPedido &&
      idPedido !== 0 &&
      [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador].includes(
        this.authService.usuario().permissaoAtual.perfil,
      )
    ) {
      this.router.navigate(['./pedidos', idPedido]);
    }
  }

  obtenhaDataDeEntrega(): string {
    if (this.item.requisicaoItem.entregaProgramada) {
      if (this.item.requisicaoItem.entregaProgramadaUltimaDataDto) {
        return this.item.requisicaoItem.entregaProgramadaUltimaDataDto.ultimaDataEntregaDias;
      }
    } else {
      if (this.item.dataEntrega) {
        return moment(this.item.dataEntrega).format('DD/MM/YYYY');
      }
    }

    return '--';
  }

  exibirDetalhesRequisicao(idProduto: number) {
    const modalRef = this.modalService.open(DetalhesProdutoComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.idProduto = idProduto;
    modalRef.componentInstance.ocultarBtnAdicionarCarrinho = true;
    modalRef.componentInstance.ocultarUnidadeMedida = true;
    modalRef.componentInstance.ocultarNcm = true;
    modalRef.componentInstance.ocultarIdProduto = true;
    modalRef.componentInstance.ocultarContaContabil = true;
  }

  private tratarRodadas(rodadas: Array<CotacaoRodada>) {
    this.item.rodadas = rodadas;
    this.selecionarRodada(this.item.rodadas[this.item.rodadas.length - 1]);
  }

  private desconsiderarPorPreco(proposta: CotacaoRodadaProposta) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService
      .desconsiderarProposta(proposta.idCotacaoRodadaProposta, true)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe((response) => {
        proposta.desconsideradoPreco = true;
        this.blockUI.stop();
        this.toastr.success('Proposta Desconsiderada com Sucesso!');
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private reconsiderarPorPreco(proposta: CotacaoRodadaProposta) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService
      .desconsiderarProposta(proposta.idCotacaoRodadaProposta, false)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe((response) => {
        proposta.desconsideradoPreco = false;
        this.blockUI.stop();
        this.toastr.success('Proposta Reconsiderada com Sucesso!');
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private marcarVencedorPacoteErrorHandler(error: any) {
    if (error && error.status === 400) {
      if (error.error === 'Itens do pacote sem proposta') {
        this.pacoteNaoPreenchidoEmitter.emit();
      } else {
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }

    this.blockUI.stop();
  }

  private addOrRemovePropostasLista(proposta: CotacaoRodadaProposta) {
    const indexProposta = this.cotacaoItemComPropostasSelecionadas.propostasVencedoras
      .map((p) => p.idCotacaoRodadaProposta)
      .indexOf(proposta.idCotacaoRodadaProposta);

    if (indexProposta !== -1) {
      this.cotacaoItemComPropostasSelecionadas.propostasVencedoras.splice(indexProposta, 1);
      if (!this.cotacaoItemComPropostasSelecionadas.propostasVencedoras.length) {
        this.selecaoEmitter.emit(false);
      }
    } else {
      this.cotacaoItemComPropostasSelecionadas.propostasVencedoras.push(proposta);
      this.selecaoEmitter.emit(true);
    }
  }

  private limpaPropostasLista() {
    this.cotacaoItemComPropostasSelecionadas.propostasVencedoras =
      new Array<CotacaoRodadaProposta>();
    this.selecaoPropostasEmitter.emit(this.cotacaoItemComPropostasSelecionadas);
  }

  private tratarPropostasVencedorasItem() {
    this.cotacaoItemComPropostasSelecionadas = Object.assign({}, this.item);
    this.cotacaoItemComPropostasSelecionadas.propostasVencedoras =
      new Array<CotacaoRodadaProposta>();
  }

  private preenchaDiferencaPrecoUltimaCompra(propostas: CotacaoRodadaProposta[]) {
    if (propostas && this.item.pedidoRecenteMenorValor) {
      propostas.forEach((proposta) => {
        proposta.diferencaPrecoUltimaCompra = proposta.precoUnidade - this.item.pedidoRecenteMenorValor.valor;
      });
    }
  }
}
