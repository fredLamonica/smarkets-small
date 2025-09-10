import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs-compat';
import { finalize, takeUntil } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { Arquivo, CondicaoPagamento, TipoFrete, UnidadeMedidaTempo } from '../../../shared/models';
import { CompraAutomatizadaCotacaoAnexoDto } from '../../../shared/models/dto/compra-automatizada-cotacao-anexo-dto';
import { ConfiguracoesCompraAutomatizadaDto } from '../../../shared/models/dto/configuracoes-compra-automatizada-dto';
import { CriterioEscolha } from '../../../shared/models/enums/criterio-escolha';
import { ArquivoService, CondicaoPagamentoService, PessoaJuridicaService, TranslationLibraryService } from '../../../shared/providers';
import { ConfiguracaoModuloCompraAutomatizadaService } from '../../../shared/providers/configuracao-modulo-compra-automatizada.service';
import { ErrorService } from '../../../shared/utils/error.service';
import { UtilitiesService } from '../../../shared/utils/utilities.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-configuracao-compra-automatizada',
  templateUrl: './manter-configuracao-compra-automatizada.component.html',
  styleUrls: ['./manter-configuracao-compra-automatizada.component.scss'],
})
export class ManterConfiguracaoCompraAutomatizadaComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  idPessoaJuridica: number;
  form: FormGroup;
  paramsSub: Subscription;
  secaoAtual: string = '/ Compras Automatizadas';
  titulo: string = 'Configurar Módulos';
  configuracaoModuloCompraAutomatizada: ConfiguracoesCompraAutomatizadaDto;
  tipoFrete = TipoFrete;
  criterioEscolha = CriterioEscolha;
  unidadeMedidaTempo = UnidadeMedidaTempo;
  condicoesPagamento: Array<CondicaoPagamento>;
  configuracaoAnexo = {
    quantidadeMaxima: 1,
    extensoesPermitidas: Array<string>('pdf', 'jpeg', 'jpg', 'png'),
  };
  podeBaixar: boolean = false;

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

  maskNumero = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    allowDecimal: false,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 5,
  });

  constructor(
    private arquivoService: ArquivoService,
    private configuracaoModuloCompraAutomatizadaService: ConfiguracaoModuloCompraAutomatizadaService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private currencyPipe: CurrencyPipe,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private pessoaJuridicaService: PessoaJuridicaService,
    private route: ActivatedRoute,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private utilitiesService: UtilitiesService,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormulario();
    this.obterParametros();
  }

  salvar(): void {

    this.blockUI.start();

    this.configuracaoModuloCompraAutomatizada = { ...this.configuracaoModuloCompraAutomatizada, ...this.form.value };
    this.configuracaoModuloCompraAutomatizada.valorLimiteGeracaoCarrinho = this.utilitiesService.getNumberWithoutFormat(this.form.controls.valorLimiteGeracaoCarrinho.value);
    this.configuracaoModuloCompraAutomatizada.idPessoaJuridica = this.idPessoaJuridica;

    const servico = this.configuracaoModuloCompraAutomatizada.idConfiguracaoModuloCompraAutomatizada ? 'alterar' : 'inserir';
    this.configuracaoModuloCompraAutomatizadaService[servico](this.configuracaoModuloCompraAutomatizada).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
        () => {
          this.obterConfiguracoes();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        (error) => {
          this.errorService.treatError(error);
        },
      );
  }

  selecionarArquivo(arquivos: Array<Arquivo>): void {

    if (this.form.controls.anexos.value.length > 0) {
      this.toastr.error('A quantidade máxima de anexos é 1 arquivo.');
      return;
    }

    const novoAnexo = new CompraAutomatizadaCotacaoAnexoDto();
    novoAnexo.arquivo = arquivos[0];
    const [{ nome, descricaoTamanho }] = arquivos;
    novoAnexo.arquivo.nomeTamanho = `${nome} (${descricaoTamanho})`;
    this.form.controls.anexos.value.push(novoAnexo);
    this.podeBaixar = false;
  }
  removerArquivo(): void {
    this.form.controls.anexos.value.pop();
    this.podeBaixar = false;
  }

  baixarArquivo(): void {
    this.arquivoService.createDownloadElement(this.form.controls.anexos.value[0], this.form.controls.anexos.value[0].nome);
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      compraAutomatizadaCatalogoHabilitada: [false],
      precoCatalogo: [],
      prazoEntregaCatalogo: [],
      freteCatalogo: [],
      valorLimiteGeracaoCarrinho: [],
      pedidoAutomaticoHabilitado: [false],
      compraAutomatizadaCotacaoHabilitada: [false],
      periodoCotacao: [],
      unidadeMedidaPeriodoCotacao: [null],
      periodoPrimeiraRodada: [null],
      unidadeMedidaPeriodoPrimeiraRodada: [null],
      freteCotacao: [null],
      textoPadraoHabilitadoCotacoes: [false],
      termoConcordancia: [],
      idCondicaoPagamentoCotacao: [],
      limiteItensCotacaoHabilitado: [false],
      limiteItensCotacao: [],
      anexos: [new Array<Arquivo>()],
    });

    this.form.controls.limiteItensCotacao.disable();

    this.form.controls.limiteItensCotacaoHabilitado.valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (value) => {
          if (value) {
            this.form.controls.limiteItensCotacao.enable();
          } else {
            this.form.controls.limiteItensCotacao.disable();
          }
        },
      );
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idPessoaJuridica = +params['idPessoaJuridica'];

        if (this.idPessoaJuridica) {
          this.obterConfiguracoes();
        }

      });
  }

  private preencherFormulario() {
    this.form.patchValue(this.configuracaoModuloCompraAutomatizada);

    if (this.configuracaoModuloCompraAutomatizada.anexos.length > 0) {
      this.configuracaoModuloCompraAutomatizada.anexos[0].permiteExcluir = true;
      this.podeBaixar = true;
    }

    this.form.patchValue({ valorLimiteGeracaoCarrinho: this.obtenhaValorFormatado(this.configuracaoModuloCompraAutomatizada.valorLimiteGeracaoCarrinho) });
  }

  private obtenhaValorFormatado(valor: number) {
    return this.currencyPipe.transform(valor, undefined, '', '1.2-4', 'pt-BR').trim();
  }

  private obterConfiguracoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoModuloCompraAutomatizadaService.obter(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
        (response) => {
          if (response) {
            if (!this.configuracaoModuloCompraAutomatizada) {
              this.titulo += ` / ${response.razaoSocial}`;
            }

            this.configuracaoModuloCompraAutomatizada = response;
            this.obterCondicoesPagamento();
            this.preencherFormulario();
          }
        },
        (error) => this.errorService.treatError(error),
      );
  }

  private obterCondicoesPagamento() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.condicaoPagamentoService.listarPorTenant(this.configuracaoModuloCompraAutomatizada.idTenant).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
        (response) => {
          if (response) {
            this.condicoesPagamento = response;
          }
        }, (error) => this.errorService.treatError(error),
      );
  }

}
