import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CentroCusto, CondicaoPagamento, Endereco, Marca, PerfilUsuario, RequisicaoItem, SituacaoRequisicaoItem, TipoEndereco, UnidadeMedidaTempo, Usuario } from '@shared/models';
import { AutenticacaoService, CentroCustoService, CondicaoPagamentoService, EnderecoService, MarcaService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ConfiguracoesEntregasProgramadas } from '../../../../shared/models/configuracoes-entregas-programadas';
import { EntregaProgramada } from '../../../../shared/models/entrega-programada';
import { OrigemProgramacaoDeEntrega } from '../../../../shared/models/enums/origem-programacao-de-entrega.enum';
import { RequisicaoService } from '../../../../shared/providers/requisicao.service';

@Component({
  selector: 'app-manter-requisicao-item',
  templateUrl: './manter-requisicao-item.component.html',
  styleUrls: ['./manter-requisicao-item.component.scss'],
})
export class ManterRequisicaoItemComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  UnidadeMedidaTempo = UnidadeMedidaTempo;

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

  TipoEndereco = TipoEndereco;

  requisicaoItem: RequisicaoItem;
  form: FormGroup;
  enderecos: Array<Endereco>;
  marcas: Array<Marca>;
  condicoesPagamento: Array<CondicaoPagamento>;
  centrosCusto: Array<CentroCusto>;
  valorTotal: string;
  usuarioLogado: Usuario;

  max = 999999999;
  min = 1;
  origemProgramacaoDeEntrega = OrigemProgramacaoDeEntrega;

  constructor(private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public requisicaoService: RequisicaoService,
    private marcarService: MarcaService,
    private authService: AutenticacaoService,
    private enderecoService: EnderecoService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private centroCustoService: CentroCustoService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
  ) {
    super();
  }

  async ngOnInit() {
    this.blockUI.start();

    this.construirFormulario();

    this.marcas = await this.marcarService.listar().toPromise();
    this.usuarioLogado = this.authService.usuario();
    this.enderecos = await this.enderecoService.listar(this.usuarioLogado.permissaoAtual.pessoaJuridica.idPessoa).toPromise();
    this.condicoesPagamento = await this.condicaoPagamentoService.listarAtivos().toPromise();
    this.centrosCusto = await this.centroCustoService.listarAtivos().toPromise();

    this.tratarDataEntrega();

    if (this.requisicaoItem.valorReferencia) {
      this.valorTotal = this.adicionarMascaras(this.requisicaoItem.valorReferencia * this.requisicaoItem.quantidade);
    } else {
      this.valorTotal = this.adicionarMascaras(0);
    }

    this.preencherFormulario();

    this.blockUI.stop();
  }

  onValorQuantidadeChanged() {
    const valorString: string = this.form.value.valorReferencia;

    if (valorString) {
      const valorNumber: number = +(valorString.replace(/\./g, '').replace(',', '.'));
      const quantidade: number = +this.form.value.quantidade;

      this.valorTotal = this.adicionarMascaras(valorNumber * quantidade);
    }
  }

  enviarItemAprovacao() {
    if (this.isFormValid()) {
      this.blockUI.start();

      const item = this.montarRequisicaoItem();

      this.requisicaoService.enviarItemParaAvaliacao(item).pipe(
        takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);

            item.situacao = response.situacao;
            item.moeda = response.moeda;
            item.tramites = response.tramites;
            item.enderecoEntrega = response.enderecoEntrega;

            this.activeModal.close(item);
          } else {
            this.toastr.warning('Falha ao enviar para aprovação.');
          }
          this.blockUI.stop();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        });
    }
  }

  salvar() {
    if (this.isFormValid()) {
      this.blockUI.start();

      const item = this.montarRequisicaoItem();

      this.requisicaoService.alterarItem(item).pipe(
        takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.activeModal.close(item);
          } else {
            this.toastr.warning('Falha não identificada ao salvar alterações.');
          }
          this.blockUI.stop();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        });
    }
  }

  configEntregaProgramada() {
    return new ConfiguracoesEntregasProgramadas({
      index: 0,
      origem: this.origemProgramacaoDeEntrega.requisicao,
      idItem: this.requisicaoItem.idRequisicaoItem,
      dataEntregaMinima: this.requisicaoItem.minDataEntrega,
      quantidadeMinima: this.min,
      quantidadeMaxima: this.max,
      quantidadeMinimaDoLote: this.min,
      valorMascara: { mask: this.maskValor, guide: false },
      empresaComIntegracaoErp: null,
      permiteQuantidadeFracionada: this.requisicaoItem.produto.unidadeMedida.permiteQuantidadeFracionada,
    });
  }

  atualizeProgramacaoDeEntregas(entregasProgramadas: Array<EntregaProgramada>) {
    this.requisicaoItem.datasDasEntregasProgramadas = entregasProgramadas;
    this.requisicaoItem.quantidade = this.somaQuantidadeEntregasProgramadas(entregasProgramadas);
    this.requisicaoItem.valorReferencia = this.valorDeReferenciaEntregasProgramadas(entregasProgramadas);
  }

  isEdicaoHabilitada(): boolean {
    return this.usuarioLogado && this.usuarioLogado.permissaoAtual.perfil === PerfilUsuario.Comprador && this.requisicaoItem.situacao === SituacaoRequisicaoItem['Em Cotação'];
  }

  fechar() {
    this.activeModal.close();
  }

  private somaQuantidadeEntregasProgramadas(entregasProgramadas: Array<EntregaProgramada>): number {
    let quantidade = 0;
    for (const entregaProgramada of entregasProgramadas) {
      quantidade += entregaProgramada.quantidade;
    }
    return quantidade;
  }

  private valorTotalEntregasProgramadas(entregasProgramadas: Array<EntregaProgramada>): number {
    let valorTotal = 0;
    for (const entregaProgramada of entregasProgramadas) {
      valorTotal += entregaProgramada.quantidade * entregaProgramada.valor;
    }

    return valorTotal;
  }

  private valorDeReferenciaEntregasProgramadas(entregasProgramadas: Array<EntregaProgramada>): number {
    const quantidade = this.somaQuantidadeEntregasProgramadas(entregasProgramadas);
    const valorTotal = this.valorTotalEntregasProgramadas(entregasProgramadas);
    const valorDeReferencia = +valorTotal / +quantidade;

    return Math.floor(valorDeReferencia * 100) / 100;
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      idEnderecoEntrega: [null, Validators.required],
      idMarca: [null],
      idCentroCusto: [null, Validators.required],
      dataEntrega: [null, Validators.required],
      idCondicaoPagamento: [null],
      valorReferencia: [null],
      quantidade: [1, Validators.compose([Validators.required, Validators.min(1), Validators.max(999999999)])],
    });
  }

  private preencherFormulario() {
    this.form.patchValue(this.requisicaoItem);
    this.form.controls.dataEntrega.patchValue(this.requisicaoItem.minDataEntrega);
    if (this.requisicaoItem.valorReferencia) {
      this.form.controls.valorReferencia.patchValue(this.adicionarMascaras(this.requisicaoItem.valorReferencia));
    }
  }

  private tratarDataEntrega() {
    this.requisicaoItem.dataEntrega = this.datePipe.transform(this.requisicaoItem.dataEntrega, 'yyyy-MM-dd');
    this.requisicaoItem.minDataEntrega = this.datePipe.transform(this.requisicaoItem.minDataEntrega, 'yyyy-MM-dd');
  }

  private montarRequisicaoItem(): RequisicaoItem {
    const item: RequisicaoItem = this.removerMascaras(this.form.value);
    item.idRequisicaoItem = this.requisicaoItem.idRequisicaoItem;
    item.idRequisicao = this.requisicaoItem.idRequisicao;
    item.idProduto = this.requisicaoItem.idProduto;
    item.slaItem = this.requisicaoItem.slaItem;
    item.tramites = this.requisicaoItem.tramites;
    item.entregaProgramada = this.requisicaoItem.entregaProgramada;
    item.datasDasEntregasProgramadas = this.requisicaoItem.datasDasEntregasProgramadas;

    return item;
  }

  private isFormValid(): boolean {
    if (!this.form.valid && (this.form.controls.quantidade.errors.min || this.form.controls.quantidade.errors.max)) {
      this.toastr.warning('Preencha o campo "Quantidade" com um valor válido.');
      return false;
    }

    if (!this.form.valid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return this.isDataEntregaValida();
  }

  private isDataEntregaValida(): boolean {
    const dataEntrega = moment(this.form.value.dataEntrega);

    if (!dataEntrega.isSameOrAfter(this.requisicaoItem.minDataEntrega)) {
      let mensagemErro = 'A data de entrega no item deve ser igual ou posterior a ';
      mensagemErro += this.datePipe.transform(this.requisicaoItem.minDataEntrega, 'dd/MM/yyyy') + '.';
      this.toastr.warning(mensagemErro);

      return false;
    }

    return true;
  }

  private adicionarMascaras(valor: number): string {
    return this.currencyPipe.transform(valor, undefined, '', '1.2-4', 'pt-BR').trim();
  }

  private removerMascaras(item: any): RequisicaoItem {
    // Utiliza expressão regular para remover todos os pontos da string
    if (isNaN(item.valorReferencia)) {
      item.valorReferencia = +(item.valorReferencia.replace(/\./g, '').replace(',', '.'));
    }

    return item;
  }

}
