import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { Arquivo, CotacaoItem, CotacaoRodada, Endereco, Paginacao, TipoFrete, TipoProduto, UnidadeMedida, UnidadeMedidaTempo } from '@shared/models';
import { CotacaoRodadaService } from '@shared/providers';
import { TranslationLibraryService } from '@shared/providers/translation-library.service';
import { ErrorService } from '@shared/utils/error.service';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, concat } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ManterEntregasProgramadasComponent } from '../../../../shared/components/manter-entregas-programadas/manter-entregas-programadas.component';
import { ConfiguracoesEntregasProgramadas } from '../../../../shared/models/configuracoes-entregas-programadas';
import { CotacaoRodadaPropostaDto } from '../../../../shared/models/dto/cotacao-rodada-proposta-dto';
import { ModoModal } from '../../../../shared/models/enums/modo-modal.enum';
import { OrigemProgramacaoDeEntrega } from '../../../../shared/models/enums/origem-programacao-de-entrega.enum';
import { NcmFiltro } from '../../../../shared/models/fltros/ncm-filtro';
import { Ncm } from '../../../../shared/models/ncm';
import { DetalhesProdutoComponent } from '../../../catalogo/detalhes-produto/detalhes-produto.component';
import { NcmService } from './../../../../shared/providers/ncm.service';
import { UtilitiesService } from './../../../../shared/utils/utilities.service';

@Component({
  selector: 'manter-cotacao-proposta-item',
  templateUrl: './manter-cotacao-proposta-item.component.html',
  styleUrls: ['./manter-cotacao-proposta-item.component.scss'],
})
export class ManterCotacaoPropostaItemComponent extends Unsubscriber implements OnInit, OnDestroy {
  @Input() set reenviarProposta(value: boolean) {
    this._reenviarProposta = value;
    if (value) {
      let idCotacaoRodadaPropostaPaiAux, idCotacaoRodadaPropostaAux;

      if (this.item.proposta && !this.item.proposta.enviada) {
        idCotacaoRodadaPropostaPaiAux = this.item.proposta.idCotacaoRodadaPropostaPai;
        idCotacaoRodadaPropostaAux = this.item.proposta.idCotacaoRodadaProposta;
      } else {
        idCotacaoRodadaPropostaPaiAux = this.item.proposta
          ? this.item.proposta.idCotacaoRodadaProposta
          : 0;
        idCotacaoRodadaPropostaAux = 0;
      }

      const statusAtividade = this.item.proposta ? this.item.proposta.ativo : false;

      this.form.patchValue({
        idCotacaoRodadaPropostaPai: idCotacaoRodadaPropostaPaiAux,
        idCotacaoRodadaProposta: idCotacaoRodadaPropostaAux,
        dataHoraLiberacaoReenvio: null,
        idUsuarioLiberacaoReenvio: 0,
        ativo: statusAtividade ? statusAtividade : false,
      });

      if (statusAtividade) { this.form.enable(); }
    }
  }

  get getReenviarProposta() {
    return this._reenviarProposta;
  }
  get getUnidadeMedida() {
    return this.item.produto.unidadeMedida.sigla;
  }

  get getTipoFrete(){
    return [TipoFrete.Cif, TipoFrete.Fob].includes(this.formPropostaItemHeader.value.incoterms)
            ? false : true;
  }

  get precoBruto(): string {
    if (
      !this.form.getRawValue().precoUnidade ||
      !this.form.getRawValue().quantidadeDisponivel ||
      !this.item.quantidade
    ) {
      return '0,00';
    } else {
      const precoUnidade = Number(
        this.form.getRawValue().precoUnidade.replace(/\./g, '').replace(',', '.'),
      );

      const quantidadeDisponivel = Number(
        this.form.getRawValue().quantidadeDisponivel.toString().replace(/\./g, '').replace(',', '.'),
      );

      let precoBruto;

      if (this.item.quantidade > quantidadeDisponivel) {
        precoBruto = precoUnidade * quantidadeDisponivel;
      } else {
        precoBruto = precoUnidade * this.item.quantidade;
      }

      return this.currencyPipe.transform(precoBruto, undefined, '', '1.2-4', 'pt-BR');
    }
  }
  @BlockUI() blockUI: NgBlockUI;

  maskNcm = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  @Input('habilitar-imposto-ncm-cotacao') habilitarimpostoNcmCotacao = false;

  @Input() permitirEditarPropostaEvent: EventEmitter<void>;
  @Input() cotacaoItemHeaderEvent: EventEmitter<void>;
  @Input() formPropostaItemHeader: FormGroup;
  @Output() inativarAtivarProduto = new EventEmitter<void>();
  @Output() itensAlterados = new EventEmitter<number[]>();
  @Output() itensSalvos = new  EventEmitter<number[]>();


  @Input('cotacao-item') item: CotacaoItem;
  @Input('cotacao-rodada') cotacaoRodada: CotacaoRodada;
  @Output('atualizar-proposta') atualizarPropostaEmitter = new EventEmitter();
  @Input() readonly: boolean = false;
  @Input() index: number;

  @Input() textoNgSelectLoading: string;
  @Input() textoNgSelectLimpar: string;
  @Input() textoNgSelectPlaceholder: string;

  _reenviarProposta: boolean;

  TipoFrete = TipoFrete;
  UnidadeMedidaTempo = UnidadeMedidaTempo;

  form: FormGroup;

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

  enderecoEntrega: string;



  ncmInput$ = new Subject<string>();
  ncmLoading: boolean;
  ncmFiltro: NcmFiltro = new NcmFiltro();

  ncm$: Observable<Array<Ncm>>;


  private unidadesMedida = new Array<UnidadeMedida>();

  constructor(
    private ncmService: NcmService,
    private utilitiesService: UtilitiesService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private modalService: NgbModal,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
  ) {
    super();
  }

  visualizeEntregasProgramadas(cotacaoItem: CotacaoItem) {
    const modalRef = this.modalService.open(ManterEntregasProgramadasComponent, { centered: true, size: 'lg' });

    const tituloModal = cotacaoItem.descricao
      ? cotacaoItem.descricao
      : cotacaoItem.produto.descricao;

    const config = new ConfiguracoesEntregasProgramadas({
      origem: OrigemProgramacaoDeEntrega.requisicao,
      idItem: cotacaoItem.idRequisicaoItem,
      modoModal: ModoModal.reduzido,
      tituloModal: tituloModal,
    });

    modalRef.componentInstance.config = config;
  }

  ngOnInit() {
    this.construirFormulario();
    this.tratarFormulario();
    this.verificarModuloNcmImpostos();

    this.enderecoEntrega = this.obterEndereco(this.item.enderecoEntrega);

    if (this.cotacaoItemHeaderEvent) {
      this.cotacaoItemHeaderEvent.subscribe(() => this.cotacaoItemHeaderAlterado());
    }

    if (this.permitirEditarPropostaEvent) {
      this.permitirEditarPropostaEvent.subscribe(() => this.onPermitirEditarProposta());
    }
  }

  ngOnDestroy() {
    if (this.cotacaoItemHeaderEvent) { this.cotacaoItemHeaderEvent.unsubscribe(); }
  }

  salvar() {
    if (!this.form.enabled) { return; }

    const proposta = this.apliqueAlteracoesDaProposta();

    if (proposta.idCotacaoRodadaProposta) {
      this.alterar(proposta);
    } else {
      this.incluir(proposta);
    }
  }

  verificarNecessidadeValidacaoValorFrete() {
    const controlValorFrete = this.form.controls.valorFrete;

    if ([TipoFrete.Cif, TipoFrete.Fob].includes(this.formPropostaItemHeader.value.incoterms)) {
      controlValorFrete.setValue(null);
      controlValorFrete.clearValidators();
    } else {
      controlValorFrete.setValidators(Validators.required);
    }

    controlValorFrete.updateValueAndValidity();
  }

  removerMascara(propostaItem: any, propostaItemHeader: any): CotacaoRodadaPropostaDto {
    propostaItem.precoBruto = propostaItem.precoBruto
      ? Number(propostaItem.precoBruto.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.precoLiquido = propostaItem.precoLiquido
      ? Number(propostaItem.precoLiquido.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.precoUnidade = propostaItem.precoUnidade
      ? Number(propostaItem.precoUnidade.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.valorFrete = propostaItem.valorFrete
      ? Number(propostaItem.valorFrete.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.ipiAliquota = propostaItem.ipiAliquota
      ? Number(propostaItem.ipiAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.pisAliquota = propostaItem.pisAliquota
      ? Number(propostaItem.pisAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.confinsAliquota = propostaItem.confinsAliquota
      ? Number(propostaItem.confinsAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.icmsAliquota = propostaItem.icmsAliquota
      ? Number(propostaItem.icmsAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.csllAliquota = propostaItem.csllAliquota
      ? Number(propostaItem.csllAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.issAliquota = propostaItem.issAliquota
      ? Number(propostaItem.issAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.irAliquota = propostaItem.irAliquota
      ? Number(propostaItem.irAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.inssAliquota = propostaItem.inssAliquota
      ? Number(propostaItem.inssAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.difalAliquota = propostaItem.difalAliquota
      ? Number(propostaItem.difalAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.stAliquota = propostaItem.stAliquota
      ? Number(propostaItem.stAliquota.replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.faturamentoMinimo = propostaItemHeader.faturamentoMinimo
      ? Number(propostaItemHeader.faturamentoMinimo.toString().replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.incoterms = propostaItemHeader.incoterms
      ? Number(propostaItemHeader.incoterms.toString().replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.condicaoPagamento = propostaItemHeader.condicaoPagamento
      ? Number(propostaItemHeader.condicaoPagamento.toString().replace(/\./g, '').replace(',', '.'))
      : null;
    propostaItem.idCondicaoPagamento = propostaItemHeader.idCondicaoPagamento
      ? Number(
        propostaItemHeader.idCondicaoPagamento.toString().replace(/\./g, '').replace(',', '.'),
      )
      : null;
    propostaItem.prazoEntrega = propostaItemHeader.prazoEntrega
      ? Number(propostaItemHeader.prazoEntrega.toString().replace(/\./g, '').replace(',', '.'))
      : null;
    return propostaItem;
  }

  incluir(proposta: CotacaoRodadaPropostaDto) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.item.proposta = { ...this.item.proposta, ...proposta };
    proposta.idCotacaoItem = this.item.idCotacaoItem;
    proposta.idCotacaoRodada = this.cotacaoRodada.idCotacaoRodada;

    this.cotacaoRodadaService.inserirProposta(proposta)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.item.proposta = { ...this.item.proposta, ...response };
            this.itensSalvos.emit([this.item.idCotacaoItem])
            this.form.patchValue({
              idCotacaoRodadaProposta: response.idCotacaoRodadaProposta,
              idCotacaoItem: response.idCotacaoItem,
              idCotacaoRodada: response.idCotacaoRodada,
              idCotacaoParticipante: response.idCotacaoParticipante,
            });
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
        },
        (error) => {
          this.errorService.treatError(error);
        },
      );
  }

  alterar(proposta: CotacaoRodadaPropostaDto) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.cotacaoRodadaService.alterarProposta(proposta).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.item.proposta = { ...this.item.proposta, ...proposta };
            this.itensSalvos.emit([this.item.idCotacaoItem])
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
        },
        (error) => {
          this.errorService.treatError(error);
        },

      );
  }

  solicitarInativarProduto() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja inativar o item?`;
    modalRef.result.then((result) => {
      if (result) { this.inativarProduto(); }
    });
  }

  solicitarReativarProduto() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja reativar o item?`;
    modalRef.result.then((result) => {
      if (result) { this.reativarProduto(); }
    });
  }

  permiteSalvarProposta(): boolean {
    return this.form.valid && this.form.enabled;
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

  private apliqueAlteracoesDaProposta(): CotacaoRodadaPropostaDto {
    this.atualizarFormulario();

    return this.item.proposta;
  }

  private onPermitirEditarProposta() {
    if (this.item.proposta) {
      this.item.proposta.enviada = false;
      this.readonly = !this.readonly;

      if (this.item.proposta.ativo) {
        this.form.enable();
        this.formPropostaItemHeader.enable();
      }
    }
  }

  private cotacaoItemHeaderAlterado() {
    if (!this.form.enabled) { return; }

    this.verificarNecessidadeValidacaoValorFrete();
    this.apliqueAlteracoesDaProposta();
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      idCotacaoRodadaProposta: [0],
      idCotacaoRodada: [0],
      idCotacaoItem: [0],
      idCotacaoParticipante: [0],
      marca: ['', Validators.required],
      ativo: true,
      ncm: [''],
      ca: [],
      quantidadeDisponivel: [
        this.item.quantidade,
        Validators.compose([
          Validators.required,
          Validators.min(1),
        ]),
      ],
      modelo: [],
      precoLiquido: [],
      precoBruto: [],
      precoUnidade: [null, Validators.compose([
        Validators.required,
        CustomValidators.decimalRequiredValidator,
      ])],
      valorFrete: [null, Validators.compose([
        Validators.required,
      ])],
      dataEntregaDisponivel: [],
      ipiAliquota: [],
      pisAliquota: [],
      confinsAliquota: [],
      icmsAliquota: [],
      difalAliquota: [],
      stAliquota: [],
      csllAliquota: [],
      issAliquota: [],
      irAliquota: [],
      inssAliquota: [],
      garantia: [],
      unidadeMedidaGarantia: [],
      observacao: [],
      anexos: [new Array<Arquivo>()],
      idUsuarioLiberacaoReenvio: [0],
      dataHoraLiberacaoReenvio: [''],
      idCotacaoRodadaPropostaPai: [0],
      embalagemEmbarque: [null, CustomValidators.decimalRequiredValidator],
      idUnidadeMedidaEmbalagemEmbarque: [null, Validators.required],
      unidadeMedidaEmbalagemEmbarque: [],
    });

    if (
      this.item &&
      this.item.produto &&
      this.item.produto.unidadeMedida &&
      this.item.produto.unidadeMedida.permiteQuantidadeFracionada
    ) {
      this.form.controls.quantidadeDisponivel.clearValidators();
      this.form.controls.quantidadeDisponivel.setValidators(
        Validators.compose([
          Validators.required,
          Validators.min(0.0001),
        ]),
      );
    } else {
      this.form.controls.quantidadeDisponivel.clearValidators();
      this.form.controls.quantidadeDisponivel.setValidators(
        Validators.compose([
          Validators.required,
          Validators.min(1),
        ]),
      );
    }
  }

  private preencherFormulario() {
    this.form.patchValue(this.item.proposta);
    this.form.patchValue({
      anexos: this.item.proposta.anexos,
    });
    this.form.patchValue({
      precoBruto: this.currencyPipe.transform(
        this.item.proposta.precoBruto ? this.item.proposta.precoBruto : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      precoLiquido: this.currencyPipe.transform(
        this.item.proposta.precoLiquido ? this.item.proposta.precoLiquido : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      precoUnidade: this.currencyPipe.transform(
        this.item.proposta.precoUnidade ? this.item.proposta.precoUnidade : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      valorFrete: this.currencyPipe.transform(
        this.item.proposta.valorFrete ? this.item.proposta.valorFrete : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      dataEntregaDisponivel: this.datePipe.transform(
        this.item.proposta.dataEntregaDisponivel,
        'yyyy-MM-dd',
      ),
      dataHoraLiberacaoReenvio: this.datePipe.transform(
        this.item.proposta.dataHoraLiberacaoReenvio,
        'yyyy-MM-dd',
      ),
      ipiAliquota: this.currencyPipe.transform(
        this.item.proposta.ipiAliquota != null ? this.item.proposta.ipiAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      pisAliquota: this.currencyPipe.transform(
        this.item.proposta.pisAliquota != null ? this.item.proposta.pisAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      confinsAliquota: this.currencyPipe.transform(
        this.item.proposta.confinsAliquota != null ? this.item.proposta.confinsAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      icmsAliquota: this.currencyPipe.transform(
        this.item.proposta.icmsAliquota != null ? this.item.proposta.icmsAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      csllAliquota: this.currencyPipe.transform(
        this.item.proposta.csllAliquota != null ? this.item.proposta.csllAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      issAliquota: this.currencyPipe.transform(
        this.item.proposta.issAliquota != null ? this.item.proposta.issAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      irAliquota: this.currencyPipe.transform(
        this.item.proposta.irAliquota != null ? this.item.proposta.irAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      inssAliquota: this.currencyPipe.transform(
        this.item.proposta.inssAliquota  != null? this.item.proposta.inssAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      difalAliquota: this.currencyPipe.transform(
        this.item.proposta.difalAliquota  != null ? this.item.proposta.difalAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      stAliquota: this.currencyPipe.transform(
        this.item.proposta.stAliquota != null ? this.item.proposta.stAliquota : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      faturamentoMinimo: this.currencyPipe.transform(
        this.item.proposta.faturamentoMinimo ? this.item.proposta.faturamentoMinimo : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      )
    });

    // Para da segunda rodada em diante, na hora de enviar a proposta.
    if (!this.item.proposta.enviada) {
      this.item.proposta.desconsideradoPreco = false;
    }
    const idCotacaoRodadaProposta = this.item.proposta.idUsuarioLiberacaoReenvio
      ? 0
      : this.item.proposta.idCotacaoRodadaProposta;

    if (!this.item.proposta.ativo) {
      this.form.reset();
      this.form.patchValue({
        idCotacaoRodadaProposta: idCotacaoRodadaProposta,
        idCotacaoParticipante: this.item.proposta.idCotacaoParticipante,
        idCotacaoItem: this.item.proposta.idCotacaoItem,
        idCotacaoRodada: this.item.proposta.idCotacaoRodada,
        idUsuarioLiberacaoReenvio: this.item.proposta.idUsuarioLiberacaoReenvio,
        idCotacaoRodadaPropostaPai: this.item.proposta.idCotacaoRodadaPropostaPai,
      });
    }

    if (!this.item.proposta.ativo || this.readonly) {
      this.form.disable();
    }
  }

  private atualizarFormulario() {
    this.form.patchValue({
      precoBruto: this.precoBruto,
    });

    if (!this.item.proposta) { return; }

    this.form.patchValue({
      precoBruto: this.precoBruto,
      idCotacaoItem: this.item.proposta.idCotacaoItem,
      idCotacaoRodada: this.item.proposta.idCotacaoRodada,
      idCotacaoParticipante: this.item.proposta.idCotacaoParticipante,
    });
  }

  private inativarProduto() {
    this.form.patchValue({ ativo: false });
    this.salvar();
    this.inativarAtivarProduto.emit();
    this.form.disable();
  }

  private reativarProduto() {
    this.form.patchValue({ ativo: true });
    this.item.proposta.ativo = true;
    this.salvar();
    this.inativarAtivarProduto.emit();
    this.form.enable();
  }

  private preencherUnidadeMedidaEmbalagemEmbarque() {
    this.form.controls.idUnidadeMedidaEmbalagemEmbarque.setValue(this.item.produto.idUnidadeMedida);
    this.form.controls.unidadeMedidaEmbalagemEmbarque.setValue(this.item.produto.unidadeMedida);
    this.form.controls.idUnidadeMedidaEmbalagemEmbarque.disable();
    this.form.controls.unidadeMedidaEmbalagemEmbarque.disable();
  }

  private obterEndereco(endereco: Endereco): string {
    if (endereco) {
      return `${endereco.logradouro.toUpperCase()}, ${endereco.numero
        } - ${endereco.bairro.toUpperCase()}, ${endereco.cidade.nome} - ${endereco.cidade.estado.abreviacao
        }, ${endereco.cep}`;
    } else {
      return 'NÃO INFORMADO';
    }
  }

  private verificarModuloNcmImpostos() {
    if (this.habilitarimpostoNcmCotacao) {
      this.tornarNcmImpostosRequired();
    }
  }

  private tornarNcmImpostosRequired() {
    switch (this.item.produto.tipo) {
      case TipoProduto.Produto:
        this.form.controls.ipiAliquota.setValidators(Validators.required);
        this.form.controls.icmsAliquota.setValidators(Validators.required);
        this.form.controls.difalAliquota.setValidators(Validators.required);
        this.form.controls.stAliquota.setValidators(Validators.required);
        break;
      case TipoProduto.Servico:
        this.form.controls.csllAliquota.setValidators(Validators.required);
        this.form.controls.issAliquota.setValidators(Validators.required);
        this.form.controls.irAliquota.setValidators(Validators.required);
        this.form.controls.inssAliquota.setValidators(Validators.required);
        break;
    }
    this.form.controls.confinsAliquota.setValidators(Validators.required);
    this.form.controls.pisAliquota.setValidators(Validators.required);
    this.form.controls.ncm.setValidators(Validators.required);
  }

  private assineEventoDePesquisaDeNCM() {
    const ITENS_POR_PAGINA: number = 100;
    const PAGINA: number = 1;
    this.ncm$ = concat(
      this.utilitiesService.getObservable(new Array<Ncm>()),
      this.ncmInput$.pipe(
        takeUntil(this.unsubscribe),
        filter((termoDeBusca) => termoDeBusca !== null && termoDeBusca.length >= 3),
        debounceTime(750),
        distinctUntilChanged(),
        tap(() => (this.ncmLoading = true)),
        switchMap((termoDeBusca: string) => {
          this.ncmFiltro.itensPorPagina = ITENS_POR_PAGINA;
          this.ncmFiltro.pagina = PAGINA;
          this.ncmFiltro.termo = termoDeBusca;
          return this.ncmService.listarNcm(this.ncmFiltro).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => (this.ncmLoading = false)),
            map((paginacao: Paginacao<Ncm>) => paginacao ? paginacao.itens : new Array<Ncm>()),
            catchError(() => this.utilitiesService.getObservable(new Array<Ncm>())),
          );
        }),
      ),
    );
  }

  veriqueInatividade(){
    if(!this.item.proposta.ativo){
      this.form.patchValue({
        ativo: false,
      });
      this.form.disable();
    }
  }

  private tratarFormulario() {
    if (this.item.proposta && this.item.proposta.idCotacaoRodadaProposta) {
      this.preencherFormulario();
    } else {
      if (this.readonly && !this._reenviarProposta) {
        this.form.disable();
      }
    }

    this.form.patchValue({
      idCotacaoItem: this.item.idCotacaoItem,
      idCotacaoRodada: this.cotacaoRodada.idCotacaoRodada
    })

    this.form.valueChanges.subscribe( (value) => {
    const proposta = this.removerMascara(
      value,
      this.formPropostaItemHeader.getRawValue(),
    )
      this.item.proposta = { ...this.item.proposta, ...proposta };
      this.itensAlterados.emit([this.item.idCotacaoItem]);
    });

    this.preencherUnidadeMedidaEmbalagemEmbarque();
    this.assineEventoDePesquisaDeNCM();

    this.verificarNecessidadeValidacaoValorFrete();
  }
}
