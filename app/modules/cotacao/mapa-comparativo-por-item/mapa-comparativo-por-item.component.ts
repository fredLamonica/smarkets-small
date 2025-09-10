import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import {
  ClassificacaoPreco,
  Cotacao, CotacaoItem, CotacaoRodada, CotacaoRodadaProposta, Iva, Moeda, SituacaoCotacao, SituacaoCotacaoItem, SituacaoSolicitacaoItemCompra, TipoFrete,
  UnidadeMedidaTempo
} from '@shared/models';
import {
  ArquivoService,
  AutenticacaoService, CotacaoRodadaService, CotacaoService, IvaService, TranslationLibraryService
} from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ListarRequisicoesNaoFinalizadasComponent } from '../listar-requisicoes-nao-finalizadas/listar-requisicoes-nao-finalizadas.component';
import { ManterCotacaoPedidoComponent } from '../manter-cotacao-pedido/manter-cotacao-pedido.component';
import { ManterCotacaoRodadaComponent } from '../manter-cotacao-rodada/manter-cotacao-rodada.component';
import { IvaFornecedorDto } from './../../../shared/models/dto/iva-fornecedor-dto';
import { ManterFornecedorRodadaComponent } from './manter-fornecedor-rodada/manter-fornecedor-rodada.component';
import { PermitirAlterarPropostaComponent } from './permitir-alterar-proposta/permitir-alterar-proposta.component';

@Component({
  selector: 'app-mapa-comparativo-por-item',
  templateUrl: './mapa-comparativo-por-item.component.html',
  styleUrls: ['./mapa-comparativo-por-item.component.scss'],
})
export class MapaComparativoPorItemComponent extends Unsubscriber implements OnInit {
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
      this.cotacao.itens.findIndex((item) => item.situacao === SituacaoCotacaoItem.Ativo) !== -1
    );
  }

  get encerrada(): boolean {
    return this.processo === 'encerrada';
  }

  get cancelada(): boolean {
    return this.processo === 'cancelada';
  }
  @BlockUI() blockUI: NgBlockUI;

  processo: 'andamento' | 'analise' | 'balizamento' | 'cancelada' | 'encerrada' = 'andamento';

  Moeda = Moeda;
  TipoFrete = TipoFrete;
  UnidadeMedidaTempo = UnidadeMedidaTempo;
  ClassificacaoPreco = ClassificacaoPreco;

  primeiraRodada: boolean;

  idCotacao: number;
  cotacao: Cotacao;

  rodadaAtual: CotacaoRodada;

  readonly: boolean = false;

  parametrosIntegracaoSapHabilitado: boolean = false;

  ivas: Array<Iva>;
  // #endregion

  // #region Seleção de itens
  itensSelecionados: Array<CotacaoItem> = new Array<CotacaoItem>();
  todosSelecionados: boolean;

  // public propostasUltimosPrecosItem: Array<CotacaoRodadaProposta>;
  itensComPropostasSelecionadas: Array<CotacaoItem> = new Array<CotacaoItem>();

  abaUltimosPrecosSeleciona: boolean;

  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoService: CotacaoService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService,
    private location: Location,
    private ivaService: IvaService,
  ) {
    super();
  }

  ngOnInit() {
    this.obterParametros();
    this.obterParametrosIntegracaoSapHabilitado();
    this.ivaService
      .listar()
      .toPromise()
      .then((iva) => (this.ivas = iva));
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    if (this.paramsSub) { this.paramsSub.unsubscribe(); }
  }

  adicionarFornecedor() {
    const modalRef = this.modalService.open(ManterFornecedorRodadaComponent, {
      centered: true,
    });
    modalRef.componentInstance.cotacao = this.cotacao;
  }

  permitirAlterarProposta() {
    const modalRef = this.modalService.open(PermitirAlterarPropostaComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.cotacao = this.cotacao;
    modalRef.result.then((result) => { });
  }

  solicitarFinalizarAnalise() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja finalizar a análise?`;
    modalRef.result.then((result) => {
      if (result) {
        this.finalizarAnalise();
      }
    });
  }

  solicitarCriarNovaRodada() {
    if (this.podeCriarNovaRodada()) {
      const modalRef = this.modalService.open(ManterCotacaoRodadaComponent, {
        centered: true,
        size: 'lg',
      });
      modalRef.componentInstance.cotacao = this.cotacao;
      modalRef.componentInstance.itens = this.itensSelecionados;
      modalRef.result.then((result) => {
        if (result) {
          this.voltar();
        }
      });
    }
  }

  solicitarGerarPedido() {
    if (this.podeGerarPedido()) {
      const modalRef = this.modalService.open(ManterCotacaoPedidoComponent, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
      });
      modalRef.componentInstance.idCotacao = this.idCotacao;
      if (this.abaUltimosPrecosSeleciona) {
        modalRef.componentInstance.itens = this.itensComPropostasSelecionadas;
      } else { modalRef.componentInstance.itens = this.itensSelecionados; }

      modalRef.componentInstance.pessoaJuridicaCliente = this.cotacao.pessoaJuridicaCliente;
      modalRef.result.then((result) => {
        if (result) {
          // tratar itens de pedidos gerados
          result.forEach((pg) => {
            pg.pedido.itens.forEach((pedidoItem) => {
              const item = this.cotacao.itens.find((i) => i.idCotacaoItem === pedidoItem.idCotacaoItem);
              if (item) { item.situacao = SituacaoCotacaoItem.Finalizado; }

              // Atualiza quantidades da requizição Item;
              item.requisicaoItem.quantidadeComprada += pedidoItem.quantidade;
              item.requisicaoItem.quantidadeRestante =
                item.requisicaoItem.quantidade - item.requisicaoItem.quantidadeComprada;

              if (item.requisicaoItem.quantidadeRestante < 0) {
                item.requisicaoItem.quantidadeRestante = 0;
              }
            });
          });
          this.itensSelecionados = new Array<CotacaoItem>();
        }
      });
    }
  }

  validaIva() {
    let podeGerarPedido = true;
    const ivasPorFornecedor = new Array<IvaFornecedorDto>();
    let exibirAlertasIvasDiferentes = false;

    if (!this.abaUltimosPrecosSeleciona) {
      this.itensSelecionados.forEach((item) => {
        item.propostasVencedoras.forEach((proposta) => {
          if (!proposta.idIva) {
            this.toastr.warning(
              `É necessário preencher o campo IVA do Item ` + item.produto.descricao,
            );
            podeGerarPedido = false;
          } else {
            const ivaFornecedor = ivasPorFornecedor.find(
              (iva) => iva.idPessoaJuridicaFornecedor === proposta.fornecedor.idPessoaJuridica,
            );
            if (!ivaFornecedor) {
              ivasPorFornecedor.push(
                new IvaFornecedorDto(proposta.fornecedor.idPessoaJuridica, proposta.idIva),
              );
            } else if (ivaFornecedor.idIva !== proposta.idIva) {
              podeGerarPedido = false;
              exibirAlertasIvasDiferentes = true;
            }
          }
        });
      });
    } else {
      this.itensComPropostasSelecionadas.forEach((item) => {
        item.propostasVencedoras.forEach((proposta) => {
          if (!proposta.idIva) {
            this.toastr.warning(
              `É necessário preencher o campo IVA do Item ` + item.produto.descricao,
            );
            podeGerarPedido = false;
          } else {
            const ivaFornecedor = ivasPorFornecedor.find(
              (iva) => iva.idPessoaJuridicaFornecedor === proposta.fornecedor.idPessoaJuridica,
            );
            if (!ivaFornecedor) {
              ivasPorFornecedor.push(
                new IvaFornecedorDto(proposta.fornecedor.idPessoaJuridica, proposta.idIva),
              );
            } else if (ivaFornecedor.idIva !== proposta.idIva) {
              podeGerarPedido = false;
              exibirAlertasIvasDiferentes = true;
            }
          }
        });
      });
    }

    if (exibirAlertasIvasDiferentes) {
      this.toastr.warning(
        `Não é possível gerar um pedido com itens de IVAS distintos para um mesmo fornecedor`,
      );
    }

    return podeGerarPedido;
  }

  solicitarEncerrarCotacao() {
    // Quantidade Comprada > 0 para manter fluxo normal de finalizar cotação sem gerar pedido
    const cotacaoItensNaoFinalizados = this.cotacao.itens.filter(
      (i) => i.requisicaoItem.quantidade > i.requisicaoItem.quantidadeComprada,
    );

    if (cotacaoItensNaoFinalizados.length > 0) {
      const modalRef = this.modalService.open(ListarRequisicoesNaoFinalizadasComponent, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
      });

      modalRef.componentInstance.requisicoes = cotacaoItensNaoFinalizados;

      modalRef.result.then((result) => {
        if (result) {
          this.cotacao.situacao = SituacaoCotacao.Encerrada;
          this.processo = 'encerrada';
        }
      });
    } else {
      this.encerrarCotacao();
    }
  }

  voltar() {
    this.router.navigate(['/acompanhamentos'], {
      queryParams: { aba: 'cotacoes' },
    });
  }

  classificarVencedor(item: CotacaoItem, proposta: CotacaoRodadaProposta) {
    if (!item.propostasVencedoras) { item.propostasVencedoras = [proposta]; } else {
      if (
        item.propostasVencedoras.findIndex(
          (p) => p.idCotacaoRodadaProposta === proposta.idCotacaoRodadaProposta,
        ) === -1
      ) {
        item.propostasVencedoras.push(proposta);
      }
    }

    if (item.rodadas && item.rodadas.length) {
      const rodadaIndex = item.rodadas.findIndex(
        (rodada) => rodada.idCotacaoRodada === proposta.idCotacaoRodada,
      );
      if (rodadaIndex !== -1) {
        const propostaIndex = item.rodadas[rodadaIndex].propostas.findIndex(
          (p) => p.idCotacaoRodadaProposta === proposta.idCotacaoRodadaProposta,
        );
        if (propostaIndex !== -1) {
          item.rodadas[rodadaIndex].propostas[propostaIndex].vencedor = true;
          item.rodadas[rodadaIndex].propostas[propostaIndex].desclassificado = false;
        }
      }
    }
  }

  desclassificarVencedor(item: CotacaoItem, proposta: CotacaoRodadaProposta) {
    if (item.propostasVencedoras) {
      item.propostasVencedoras = item.propostasVencedoras.filter(
        (p) => p.idCotacaoRodadaProposta !== proposta.idCotacaoRodadaProposta,
      );
    }

    if (item.rodadas && item.rodadas.length) {
      const rodadaIndex = item.rodadas.findIndex(
        (rodada) => rodada.idCotacaoRodada === proposta.idCotacaoRodada,
      );
      if (rodadaIndex !== -1) {
        const propostaIndex = item.rodadas[rodadaIndex].propostas.findIndex(
          (p) => p.idCotacaoRodadaProposta === proposta.idCotacaoRodadaProposta,
        );
        if (propostaIndex !== -1) {
          item.rodadas[rodadaIndex].propostas[propostaIndex].vencedor = false;
        }
      }
    }
  }

  // #region Analise de itens de pacote de solicitação de compra
  classificarVencedorPacote(item: CotacaoItem, propostasVencedorasDto: Array<any>) {
    let itensDesc = '';
    propostasVencedorasDto.forEach((propostaVencedoraDto) => {
      const cotacaoItem = this.cotacao.itens.find(
        (i) => propostaVencedoraDto.proposta.idCotacaoItem === i.idCotacaoItem,
      );
      if (cotacaoItem) {
        this.classificarVencedor(cotacaoItem, propostaVencedoraDto.proposta);

        if (item.idCotacaoItem !== propostaVencedoraDto.proposta.idCotacaoItem) {
          itensDesc += `${cotacaoItem.idRequisicaoItem} - ${cotacaoItem.produto.descricao};</br>`;
        }
      }
    });

    this.toastr.warning(
      `<p>O fornecedor também foi definido como vencedor dos itens: </br>
        ${itensDesc} </br></br>
        Pois o item ${item.idRequisicaoItem} - ${item.produto.descricao} faz parte de um pacote de itens,
        e todos eles deverão ser finalizados no mesmo pedido`,
      null,
      { enableHtml: true, timeOut: 10000 },
    );
  }

  desclassificarVencedorPacote(item: CotacaoItem, propostasVencedorasDto: Array<any>) {
    let itensDesc = '';
    propostasVencedorasDto.forEach((propostaVencedoraDto) => {
      const cotacaoItem = this.cotacao.itens.find(
        (i) => propostaVencedoraDto.proposta.idCotacaoItem === i.idCotacaoItem,
      );
      if (cotacaoItem) {
        this.desclassificarVencedor(cotacaoItem, propostaVencedoraDto.proposta);

        if (item.idCotacaoItem !== propostaVencedoraDto.proposta.idCotacaoItem) {
          itensDesc += `${cotacaoItem.idRequisicaoItem} - ${cotacaoItem.produto.descricao};</br>`;
        }
      }
    });

    this.toastr.warning(
      `<p>O fornecedor também foi desclassificado como vencedor dos itens: </br>
        ${itensDesc} </br></br>
        Pois o item ${item.idRequisicaoItem} - ${item.produto.descricao} faz parte de um pacote de itens,
        e todos eles deverão ser finalizados no mesmo pedido`,
      null,
      { enableHtml: true, timeOut: 10000 },
    );
  }

  pacoteNaoPreenchido(item: CotacaoItem) {
    const idItemSolicitacaoCompra = item.requisicaoItem.idItemSolicitacaoCompra;
    const itensPacote = this.cotacao.itens.filter(
      (i) => i.requisicaoItem.idItemSolicitacaoCompra === idItemSolicitacaoCompra,
    );
    if (itensPacote && itensPacote.length) {
      const itensDesc = itensPacote
        .map((i) => {
          return `${i.idRequisicaoItem} - ${i.produto.descricao}`;
        })
        .join(';</br>');
      this.toastr.warning(
        `<p>Não foi possível definir o fornecedor como vencedor do item. </br></br>
          O item ${item.idRequisicaoItem} - ${item.produto.descricao} faz parte de um pacote de itens, e todos eles deverão ser finalizados no mesmo pedido. </br></br>
          Itens que participam do pacote: </br></br>
          ${itensDesc} </br></br>
          Como o fornecedor não preencheu proposta para todos itens do mesmo pacote, considere outro fornecedor como vencedor para  todos os itens ou avalie se
          os itens receberam propostas o suficiente para finalizar a cotação.`,
        null,
        { enableHtml: true, timeOut: 10000 },
      );
    }
  }

  onSelecionarTodos() {
    if (
      this.itensSelecionados.length ===
      this.cotacao.itens.filter((item) => item.situacao === SituacaoCotacaoItem.Ativo).length
    ) {
      this.itensSelecionados = new Array<CotacaoItem>();
    } else {
      this.itensSelecionados = this.cotacao.itens.filter(
        (item) => item.situacao === SituacaoCotacaoItem.Ativo,
      );
    }
  }

  selecionarItem(selecionado: boolean, index: number) {
    if (selecionado) {
      if (this.cotacao.itens[index].requisicaoItem.idSubItemSolicitacaoCompra) {
        const itensIguais = this.cotacao.itens.filter(
          (item) =>
            item.requisicaoItem.idItemSolicitacaoCompra ===
            this.cotacao.itens[index].requisicaoItem.idItemSolicitacaoCompra &&
            this.cotacao.itens[index].idCotacaoItem !== item.idCotacaoItem,
        );
        this.itensSelecionados = this.itensSelecionados.concat(itensIguais);
      }
      this.itensSelecionados.push(this.cotacao.itens[index]);
    } else {
      if (this.cotacao.itens[index].requisicaoItem.idSubItemSolicitacaoCompra) {
        const itensIguais = this.cotacao.itens.filter(
          (item) =>
            item.requisicaoItem.idItemSolicitacaoCompra ===
            this.cotacao.itens[index].requisicaoItem.idItemSolicitacaoCompra &&
            this.cotacao.itens[index].idCotacaoItem !== item.idCotacaoItem,
        );
        this.removerItens(itensIguais);
      }
      this.itensSelecionados = this.itensSelecionados.filter(
        (i) => i.idCotacaoItem !== this.cotacao.itens[index].idCotacaoItem,
      );
    }
    if (!selecionado) { this.todosSelecionados = false; } else if (this.isTodosSelecionados()) { this.todosSelecionados = true; }
  }

  itemSelecionado(index: number): boolean {
    return (
      this.itensSelecionados.findIndex(
        (item) => item.idCotacaoItem === this.cotacao.itens[index].idCotacaoItem,
      ) !== -1
    );
  }
  // #endregion

  gerarRelatorioAnalise() {
    const idCotacao = this.cotacao.idCotacao;
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.gerarRelatorioAnalise(idCotacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório Análise Cotação ${idCotacao} - ${moment().format('YYYY_MM_DD-HH_mm')}.xls`,
          );
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  gerarMapaCotacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.obterMapaComparativoPorItem(this.cotacao.idCotacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.cotacaoService.gerarPdfMapaComparativoPorItem(response);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  solicitarRetornarParaAnalise() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja retornar a cotação para a análise?`;
    modalRef.result.then((result) => {
      if (result) {
        this.retornarCotacaoParaAnalise();
      }
    });
  }
  propostaSelecionada(cotacaoItem: CotacaoItem) {
    let indexCotacaoItem = -1;

    const existsCotacaoItem = this.itensComPropostasSelecionadas.some((entry, i) => {
      if (entry && cotacaoItem && entry.idCotacaoItem === cotacaoItem.idCotacaoItem) {
        indexCotacaoItem = i;
        return true;
      }
    });

    if (
      this.itensComPropostasSelecionadas &&
      cotacaoItem &&
      !cotacaoItem.propostasVencedoras.length
    ) {
      this.itensComPropostasSelecionadas.splice(indexCotacaoItem, 1);
    } else if (cotacaoItem && !existsCotacaoItem) {
      this.itensComPropostasSelecionadas.push(cotacaoItem);
    }

    // if (cotacaoItem) this.itensSelecionados = this.itensComPropostasSelecionadas;
  }
  abaUltimosPrecos(event: boolean) {
    this.abaUltimosPrecosSeleciona = event;
  }

  private politicaDeEnvelopeFechadoEmVigor(cotacao) {
    const rodadaEmAndamento =
      cotacao.situacao === SituacaoCotacao.Agendada &&
      moment().isBetween(
        moment(cotacao.rodadaAtual.dataInicio),
        moment(cotacao.rodadaAtual.dataEncerramento),
      );
    const envelopeFechadoHabilitado =
      this.authService.usuario().permissaoAtual.pessoaJuridica.habilitarEnvelopeFechado;

    if (rodadaEmAndamento && envelopeFechadoHabilitado) {
      this.location.back();
      return true;
    } else { return false; }
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idCotacao = params['idCotacao'];

        if (this.idCotacao) { this.obterCotacao(); }
      });
  }

  private obterParametrosIntegracaoSapHabilitado() {
    const usuarioAtual = this.authService.usuario();

    if (usuarioAtual.permissaoAtual.pessoaJuridica.integracaoSapHabilitada) {
      this.parametrosIntegracaoSapHabilitado =
        usuarioAtual.permissaoAtual.pessoaJuridica.parametrosIntegracaoSapHabilitado;
    }
  }

  private obterCotacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.obtenhaMapaComparativo(this.idCotacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            if (!this.politicaDeEnvelopeFechadoEmVigor(response)) {
              this.cotacao = response;
              this.primeiraRodada = this.cotacao.rodadaAtual.ordem === 1 ? true : false;

              if (this.cotacao.situacao === SituacaoCotacao.Encerrada) {
                this.processo = 'encerrada';
              } else if (this.cotacao.situacao === SituacaoCotacao.Cancelada) {
                this.processo = 'cancelada';
              } else {
                if (moment().isAfter(moment(this.cotacao.rodadaAtual.dataEncerramento))) {
                  this.processo = 'analise';
                }

                if (this.cotacao.rodadaAtual && this.cotacao.rodadaAtual.finalizada) {
                  this.processo = 'balizamento';
                }
              }
            }
          }
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private finalizarAnalise() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService.finalizar(this.cotacao.rodadaAtual.idCotacaoRodada).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.cotacao.rodadaAtual.finalizada = true;
          this.processo = 'balizamento';
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private podeCriarNovaRodada(): boolean {
    if (!this.itensSelecionados || !this.itensSelecionados.length) {
      this.toastr.warning(`Para iniciar uma nova rodada é necessário selecionar ao menos um item`);
      return false;
    }
    return true;
  }

  private podeGerarPedido(): boolean {
    let podeGerarPedido = true;
    if (!this.itensSelecionados || !this.itensSelecionados.length) {
      this.toastr.warning(`Para gerar pedidos é necessário selecionar ao menos um item`);
      return (podeGerarPedido = false);
    }

    this.itensSelecionados.forEach((item) => {
      if (!this.abaUltimosPrecosSeleciona && item.propostasVencedoras.length <= 0) {
        this.toastr.warning(
          `A Requisição item ` +
          item.idRequisicaoItem +
          ` - ` +
          item.produto.descricao +
          ` não possui uma proposta vencedora`,
        );
        return (podeGerarPedido = false);
      }

      if (
        item.requisicaoItem &&
        item.requisicaoItem.itemSolicitacaoCompra &&
        item.requisicaoItem.itemSolicitacaoCompra.situacao ===
        SituacaoSolicitacaoItemCompra.Bloqueada
      ) {
        this.toastr.warning(
          `A Requisição item ` +
          item.idRequisicaoItem +
          ` - ` +
          item.produto.descricao +
          ` não é possível gerar um pedido com o item bloqueado`,
        );
        return (podeGerarPedido = false);
      }

      const propostasVencedoras = this.itensComPropostasSelecionadas.filter(
        (p) => p.propostasVencedoras,
      );

      if (this.abaUltimosPrecosSeleciona && !propostasVencedoras.length) {
        this.toastr.warning(
          `A Requisição item ` +
          item.idRequisicaoItem +
          ` - ` +
          item.produto.descricao +
          ` não possui uma proposta selecionada`,
        );
        return (podeGerarPedido = false);
      }

      const notExistsCotacaoItem = !this.itensComPropostasSelecionadas
        .map((p) => p.idCotacaoItem)
        .includes(item.idCotacaoItem);
      if (notExistsCotacaoItem) {
        this.itensComPropostasSelecionadas.push(item);
      }
    });

    if (this.parametrosIntegracaoSapHabilitado && !this.validaIva()) {
      return (podeGerarPedido = false);
    }

    return podeGerarPedido;
  }

  private encerrarCotacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.encerrar(this.idCotacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.cotacao.situacao = SituacaoCotacao.Encerrada;
          this.processo = 'encerrada';
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private removerItens(itens: Array<CotacaoItem>) {
    itens.forEach((element) => {
      this.itensSelecionados = this.itensSelecionados.filter(
        (x) => element.requisicaoItem.idRequisicaoItem !== x.requisicaoItem.idRequisicaoItem,
      );
    });
  }

  private isTodosSelecionados(): boolean {
    return (
      this.itensSelecionados.length &&
      this.itensSelecionados.length ===
      this.cotacao.itens.filter((item) => item.situacao === SituacaoCotacaoItem.Ativo).length
    );
  }

  private retornarCotacaoParaAnalise() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.retornarCotacaoParaAnalise(this.idCotacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.obterCotacao();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          // tslint:disable-next-line: prefer-const
          let a: string;
        },
        (error) => {
          if (
            error.error &&
            (error.error.includes('Não foi possível retornar o status pois') ||
              error.error ===
              'Não foi possível retornar o status pois todos os itens da cotação se encontram finalizados')
          ) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.blockUI.stop();
        },
      );
  }
}
