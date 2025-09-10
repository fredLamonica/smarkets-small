import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { concat, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ConfirmacaoComponent } from '../../../../shared/components/modals/confirmacao/confirmacao.component';
import { SmkConfirmacaoComponent } from '../../../../shared/components/modals/smk-confirmacao/smk-confirmacao.component';
import { Arquivo, Cidade, ContaContabil, Estado, Marca, Paginacao, PessoaJuridica, TipoFrete } from '../../../../shared/models';
import { Alcada } from '../../../../shared/models/alcada';
import { CentroCusto } from '../../../../shared/models/centro-custo';
import { CondicaoPagamento } from '../../../../shared/models/condicao-pagamento';
import { ContaContabilDto } from '../../../../shared/models/dto/conta-contabil-dto';
import { Endereco } from '../../../../shared/models/endereco';
import { TipoAlcadaAprovacao } from '../../../../shared/models/enums/tipo-alcada-aprovacao';
import { TipoEndereco } from '../../../../shared/models/enums/tipo-endereco';
import { UnidadeMedidaTempo } from '../../../../shared/models/enums/unidade-medida-tempo';
import { EnderecoFiltro } from '../../../../shared/models/fltros/endereco-filtro';
import { GrupoCompradores } from '../../../../shared/models/grupo-compradores';
import { PessoaJuridicaDto } from '../../../../shared/models/pessoa-juridica-dto';
import { Regularizacao } from '../../../../shared/models/regularizacao/regularizacao';
import { RegularizacaoAnexo } from '../../../../shared/models/regularizacao/regularizacao-anexo';
import { RegularizacaoItem } from '../../../../shared/models/regularizacao/regularizacao-item';
import { Usuario } from '../../../../shared/models/usuario';
import { EnderecoService } from '../../../../shared/providers/endereco.service';
import { RegularizacaoService } from '../../../../shared/providers/regularizacao.service';
import { TranslationLibraryService } from '../../../../shared/providers/translation-library.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { UtilitiesService } from '../../../../shared/utils/utilities.service';
import { ResumoCarrinhoComponent } from '../../../container/resumo-carrinho/resumo-carrinho.component';

@Component({
  selector: 'smk-regularizacao',
  templateUrl: './regularizacao.component.html',
  styleUrls: ['./regularizacao.component.scss'],
})
export class RegularizacaoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('modalObservacoes', { read: TemplateRef }) modalObservacoesTmp: TemplateRef<any>;

  @Input() usuarioAtual: Usuario;
  @Input() regularizacao: Regularizacao;
  @Input() indexPai: number;
  @Input() fornecedores$: Observable<Array<PessoaJuridicaDto>>;
  @Input() fornecedoresLoading: boolean;
  @Input() fornecedoresInput$ = new Subject<string>();
  @Input() centrosDeCusto: Array<CentroCusto>;
  @Input() centrosDeCustoLoading: boolean;
  @Input() centroDeCustoUnico: boolean;
  @Input() alcadas: Array<Alcada>;
  @Input() alcadasLoading: boolean;
  @Input() alcadaUnica: boolean;
  @Input() condicoesPagamento: Array<CondicaoPagamento>;
  @Input() condicoesPagamentoLoading: boolean;
  @Input() condicoesPagamentoUnica: boolean;
  @Input() gruposCompradores: Array<GrupoCompradores>;
  @Input() gruposCompradoresLoading: boolean;
  @Input() grupoCompradoresUnico: boolean;
  @Input() marcas: Array<Marca>;
  @Input() marcasLoading: boolean;
  @Input() textoNgSelectLoading: string;
  @Input() textoNgSelectLimpar: string;
  @Input() textoNgSelectPlaceholder: string;
  @Input() contasContabeis$: Observable<Array<ContaContabilDto>>;
  @Input() contasContabeisLoading: boolean;
  @Input() contaContabilUnica: boolean;
  @Input() contasContabeisInput$ = new Subject<string>();

  @Output() confirmar: EventEmitter<Regularizacao> = new EventEmitter<Regularizacao>();
  @Output() remover: EventEmitter<Regularizacao> = new EventEmitter<Regularizacao>();
  @Output() atualizarCarrinho: EventEmitter<void> = new EventEmitter<void>();
  @Output('removerItens') removerItensEvent: EventEmitter<Array<RegularizacaoItem>> = new EventEmitter<Array<RegularizacaoItem>>();

  enderecos$: Observable<Array<Endereco>>;
  enderecosLoading: boolean;
  enderecoUnico: boolean;
  enderecosInput$ = new Subject<string>();
  enderecoSelecionado: Endereco;
  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;
  TipoEndereco = TipoEndereco;
  UnidadeMedidaTempo = UnidadeMedidaTempo;
  bindingEmpresa: string;
  itensSendoSalvos: number = 0;
  tipoFrete = TipoFrete;
  fornecedorSelecionado: PessoaJuridicaDto;
  contaContabilSelecionada: ContaContabilDto;

  formObservacoes: FormGroup = this.fb.group({
    observacao: [''],
  });

  isListaExtensaEnderecos: boolean;

  enderecoFiltro: EnderecoFiltro = new EnderecoFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private regularizacaoService: RegularizacaoService,
    private enderecoService: EnderecoService,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private utilitiesService: UtilitiesService,
  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  removerItem(regularizacaoItem: RegularizacaoItem) {
    const index = this.regularizacao.itens.indexOf(regularizacaoItem);
    if (index > -1) {
      this.regularizacao.itens.splice(index, 1);

      if (this.regularizacao.itens.length === 0) {
        this.remover.emit(this.regularizacao);
      }
    }
  }

  atualizarResumoCarrinho() {
    this.atualizarCarrinho.emit();
  }

  alterarRegularizacao() {
    let status = 'salvando';

    this.regularizacao.ultimaAlteracao = status;
    this.itemAlterado(status);

    this.regularizacaoService.put(this.regularizacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.regularizacao.ultimaAlteracao = moment().format();
            this.itemAlterado(null);
            ResumoCarrinhoComponent.atualizarCarrinho.next();
          }
        },
        (error) => {
          status = 'erro';

          this.regularizacao.ultimaAlteracao = status;
          this.itemAlterado(status);
        },
      );
  }

  atualizarAlteracao(status: string) {
    this.regularizacao.ultimaAlteracao = status;
    this.itemAlterado(status);
  }

  fornecedorChange(fornecedorSelecionado: PessoaJuridicaDto) {
    if (fornecedorSelecionado) {
      this.regularizacao.idPessoaJuridicaFornecedor = fornecedorSelecionado.idPessoaJuridica;
      this.regularizacao.fornecedor.idPessoaJuridica = fornecedorSelecionado.idPessoaJuridica;
      this.regularizacao.fornecedor.cnpj = fornecedorSelecionado.cnpj;
      this.regularizacao.fornecedor.razaoSocial = fornecedorSelecionado.razaoSocial;
      this.regularizacao.fornecedor.nomeFantasia = fornecedorSelecionado.nomeFantasia;
    } else {
      this.regularizacao.idPessoaJuridicaFornecedor = null;
      this.regularizacao.fornecedor.idPessoaJuridica = null;
      this.regularizacao.fornecedor.cnpj = null;
      this.regularizacao.fornecedor.razaoSocial = null;
      this.regularizacao.fornecedor.nomeFantasia = null;
    }

    this.alterarRegularizacao();
  }

  contaContabilChange(contaContabilSelecionada: ContaContabilDto) {
    if (contaContabilSelecionada) {
      this.regularizacao.idContaContabil = contaContabilSelecionada.idContaContabil;
      this.regularizacao.contaContabil.codigo = contaContabilSelecionada.codigo;
      this.regularizacao.contaContabil.descricao = contaContabilSelecionada.descricao;
    } else {
      this.regularizacao.idContaContabil = null;
      this.regularizacao.contaContabil.codigo = null;
      this.regularizacao.contaContabil.descricao = null;
    }

    this.alterarRegularizacao();
  }

  inserirAnexos(arquivos: Array<Arquivo>) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.regularizacaoService.postAnexos(this.regularizacao.idRegularizacao, arquivos).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.obterAnexos();
        },
        (error) => this.errorService.treatError(error),
      );
  }

  excluirAnexo(regularizacaoAnexo: RegularizacaoAnexo) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.regularizacaoService.deleteAnexos(regularizacaoAnexo.idRegularizacaoAnexo).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => {
          this.obterAnexos();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        (error) => {
          if (error && error.status === 304) {
            this.obterAnexos();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        });
  }

  abrirObservacoes() {
    this.formObservacoes.patchValue({ observacao: this.regularizacao.observacao });

    const modalRef = this.modalService.open(this.modalObservacoesTmp, { centered: true });

    modalRef.result.then(
      (result) => {
        if (result) {
          const anteriorVazio = this.regularizacao.observacao ? this.regularizacao.observacao.trim() === '' : true;
          const posteriorVazio = this.formObservacoes.value.observacao ? this.formObservacoes.value.observacao.trim() === '' : true;

          if (!anteriorVazio && posteriorVazio) {
            const confirmacaoRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

            confirmacaoRef.componentInstance.confirmacao = 'Você removeu as observações, tem certeza que deseja salvar esta alteração?';

            confirmacaoRef.result.then(
              (resultConfirmacao) => {
                if (resultConfirmacao) {
                  this.atualizarObservacao();
                }
              },
            );
          } else {
            this.atualizarObservacao();
          }
        }

      },
      (reason) => { },
    );
  }

  obtenhaValorTotal(): number {
    if (this.regularizacao && this.regularizacao.itens && this.regularizacao.itens.length > 0) {
      return this.regularizacao.itens.map((regularizacaoItem) => {
        if (regularizacaoItem.valorUnitario && regularizacaoItem.valorUnitario !== 0) {
          return regularizacaoItem.quantidade * regularizacaoItem.valorUnitario;
        }

        if (regularizacaoItem.produto && regularizacaoItem.produto.valorReferencia && regularizacaoItem.produto.valorReferencia !== 0) {
          return regularizacaoItem.quantidade * regularizacaoItem.produto.valorReferencia;
        } else {
          return 0;
        }
      }).reduce((valorA, valorB) => valorA + valorB, 0);
    } else {
      return 0;
    }
  }

  confirmeRegularizacao(): void {
    this.confirmar.next(this.regularizacao);
  }

  itensEstaoSendoSalvos(): boolean {
    return this.itensSendoSalvos > 0;
  }

  enderecoSearchFn(term: string, item: Endereco) {
    term = term.toLowerCase();
    return (
      item.logradouro.toLowerCase().indexOf(term) > -1 ||
      item.bairro.toLowerCase().indexOf(term) > -1 ||
      item.cidade.nome.toLowerCase().indexOf(term) > -1 ||
      item.cidade.estado.nome.toLowerCase().indexOf(term) > -1 ||
      item.cidade.estado.abreviacao.toLowerCase().indexOf(term) > -1 ||
      item.cep.toLowerCase().indexOf(term) > -1
    );
  }

  enderecoChange(enderecoSelecionado: Endereco) {
    if (enderecoSelecionado) {
      this.regularizacao.idEnderecoEntrega = enderecoSelecionado.idEndereco;
      this.regularizacao.enderecoEntrega = {} as Endereco;
      this.regularizacao.enderecoEntrega.logradouro = enderecoSelecionado.logradouro;
      this.regularizacao.enderecoEntrega.numero = enderecoSelecionado.numero;
      this.regularizacao.enderecoEntrega.bairro = enderecoSelecionado.bairro;
      this.regularizacao.enderecoEntrega.cep = enderecoSelecionado.cep;

      this.regularizacao.enderecoEntrega.cidade = new Cidade({
        nome: enderecoSelecionado.cidade.nome,
        estado: new Estado({
          abreviacao: enderecoSelecionado.cidade.estado.abreviacao,
        }),
      });
    } else {
      this.regularizacao.idEnderecoEntrega = null;
      this.regularizacao.enderecoEntrega = null;
    }

    this.alterarRegularizacao();
  }

  private inicialize(): void {
    this.tipoAlcadaAprovacao = this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao;
    this.isListaExtensaEnderecos = this.regularizacao.empresaSolicitante.listaExtensaEnderecos;

    this.populeEnderecos();

    const nomeEmpresa = this.regularizacao.empresaSolicitante.nomeFantasia
      ? this.regularizacao.empresaSolicitante.nomeFantasia
      : this.regularizacao.empresaSolicitante.razaoSocial;

    this.bindingEmpresa = `${this.regularizacao.empresaSolicitante.cnpj} - ${nomeEmpresa}`;

    this.processeAnexos(this.regularizacao.anexos);

    if (this.regularizacao) {
      if (this.regularizacao.contaContabil) {
        this.contaContabilSelecionada = new ContaContabilDto({
          idContaContabil: this.regularizacao.idContaContabil,
          codigo: this.regularizacao.contaContabil.codigo,
          descricao: this.regularizacao.contaContabil.descricao,
        });
      } else {
        this.regularizacao.contaContabil = new ContaContabil();
      }

      if (this.regularizacao.fornecedor) {
        this.fornecedorSelecionado = new PessoaJuridicaDto({
          idPessoaJuridica: this.regularizacao.idPessoaJuridicaFornecedor,
          cnpj: this.regularizacao.fornecedor.cnpj,
          razaoSocial: this.regularizacao.fornecedor.razaoSocial,
          nomeFantasia: this.regularizacao.fornecedor.nomeFantasia,
        });
      } else {
        this.regularizacao.fornecedor = new PessoaJuridica(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        );
        if (this.regularizacao.enderecoEntrega) {
          this.enderecoSelecionado = this.regularizacao.enderecoEntrega;
        } else {
          this.regularizacao.enderecoEntrega = {} as Endereco;
        }
      }
    }
  }

  private populeEnderecos() {
    if (this.isListaExtensaEnderecos) {
      this.obtenhaListaExtensaEnderecos();
    } else {
      this.obtenhaListaSimplesEnderecos();
    }
  }

  private obtenhaListaSimplesEnderecos(): void {
    this.enderecosLoading = true;
    const idPessoa = this.regularizacao.empresaSolicitante.idPessoa;
    this.enderecos$ = this.enderecoService.listar(idPessoa).pipe(
      takeUntil(this.unsubscribe),
      map((enderecos) => enderecos.filter((t) => t.tipo === TipoEndereco.Entrega)),
      tap((enderecos) => {
        if (enderecos && enderecos.length === 1) {
          const endereco = enderecos[0];

          this.regularizacao.idEnderecoEntrega = endereco.idEndereco;
          this.regularizacao.enderecoEntrega = endereco;
          this.enderecoUnico = true;
        }
      }),
      finalize(() => this.enderecosLoading = false));
  }

  private obtenhaListaExtensaEnderecos(): void {
    const idPessoa = this.regularizacao.empresaSolicitante.idPessoa;
    this.enderecos$ = concat(
      this.utilitiesService.getObservable(new Array<Endereco>()),
      this.enderecosInput$.pipe(
        takeUntil(this.unsubscribe),
        filter((termoDeBusca) => termoDeBusca !== null && termoDeBusca.length >= 3),
        debounceTime(750),
        distinctUntilChanged(),
        tap(() => (this.enderecosLoading = true)),
        switchMap((termoDeBusca: string) => {
          this.enderecoFiltro.idPessoa = idPessoa;
          this.enderecoFiltro.itensPorPagina = 20;
          this.enderecoFiltro.pagina = 1;
          this.enderecoFiltro.termo = termoDeBusca;
          this.enderecoFiltro.tipoEndereco = TipoEndereco.Entrega;
          return this.enderecoService.filtrarPorPessoa(this.enderecoFiltro).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => (this.enderecosLoading = false)),
            map((paginacao: Paginacao<Endereco>) => paginacao ? paginacao.itens : new Array<Endereco>()),
            catchError(() => this.utilitiesService.getObservable(new Array<Endereco>())),
          );
        }),
      ),
    );
  }

  private obterAnexos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.regularizacaoService.getAnexos(this.regularizacao.idRegularizacao).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (regularizacaoAnexos) => {
          if (regularizacaoAnexos) {
            this.processeAnexos(regularizacaoAnexos);
          } else {
            this.regularizacao.anexos = new Array<RegularizacaoAnexo>();
          }
        }, () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  private processeAnexos(regularizacaoAnexos: Array<RegularizacaoAnexo>): void {
    this.regularizacao.anexos = regularizacaoAnexos.map((regularizacaoAnexo: RegularizacaoAnexo) => ({ ...regularizacaoAnexo, permiteExcluir: true }));
  }

  private atualizarObservacao() {
    this.regularizacao.observacao = this.formObservacoes.value.observacao;
    this.alterarRegularizacao();
  }

  private itemAlterado(status: string) {
    if (status === 'salvando') {
      this.itensSendoSalvos += 1;
    } else {
      this.itensSendoSalvos -= 1;
    }

    if (this.itensSendoSalvos < 0) {
      this.itensSendoSalvos = 0;
    }
  }

  removerItens() {
    const itensSelecionados = this.regularizacao.itens.filter( (item) => item.selecionado);
    if (itensSelecionados.length > 0) {
      const modalRef = this.modalService.open(SmkConfirmacaoComponent, { centered: true })
      modalRef.componentInstance.conteudo = 'Deseja Excluir os itens selecionados ? ';
      modalRef.componentInstance.titulo = 'Atenção';

      modalRef.result.then(
      async (result) => {
        if(result) {
          this.blockUI.start();
          this.regularizacaoService.deleteItens(itensSelecionados).pipe(
          takeUntil(this.unsubscribe))
          .subscribe(
            (response) => {
              if (response && response > 0) {
                itensSelecionados.forEach(item => {
                const index = this.regularizacao.itens.indexOf(item);
                if (index > -1) {
                  this.regularizacao.itens.splice(index, 1);
                }
                });
                this.regularizacao.selecionarTodos = false;
                ResumoCarrinhoComponent.atualizarCarrinho.next();
                this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                this.atualizarCarrinho.emit();
                this.removerItensEvent.emit(itensSelecionados);
              } else {
                this.toastr.error('Falha ao remover item.');
              }
              this.blockUI.stop();
            },
            () => {
              this.blockUI.stop();
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            },
          );
        }

      },
      (reason) => { },
    );
    }
  }

  selecionarTodos(event, requisicao: Regularizacao) {
    requisicao.habilitarBtnRemover = event.target.checked;
    requisicao.itens.forEach( (p) => {
      return p.selecionado = event.target.checked;
    });
  }

  itemSelecionado(itemSelecionado: RegularizacaoItem) {
    this.regularizacao.selecionarTodos = false;
    const selecionados = this.regularizacao.itens.filter((p) =>  p.selecionado);
    this.regularizacao.habilitarBtnRemover = selecionados.length > 0;

    if (selecionados.length === this.regularizacao.itens.length) {
      this.regularizacao.selecionarTodos = true;
    }

  }
}
