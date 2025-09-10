import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cidade, Estado, Pais, TipoFrete } from '@shared/models';
import { FaturamentoMinimoFreteDto } from '@shared/models/dto/faturamento-minimo-frete-dto';
import { FaturamentoMinimoFrete } from '@shared/models/faturamento-minimo-frete';
import {
  CidadeService,
  EstadoService,
  FaturamentoMinimoFreteService,
  PaisService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'app-manter-faturamento-minimo-frete',
  templateUrl: './manter-faturamento-minimo-frete.component.html',
  styleUrls: ['./manter-faturamento-minimo-frete.component.scss']
})
export class ManterFaturamentoMinimoFreteComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-pessoa') idPessoa: number;
  @Input('id-endereco') idFaturamentoMinimoFrete: number;

  public Tipo = TipoFrete;

  public form: FormGroup;
  public paises: Array<Pais>;
  public estados: Array<Estado>;
  public cidades: Array<Cidade>;

  private subPais: Subscription;
  private subEstado: Subscription;

  public maskValor = createNumberMask({
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
    integerLimit: 12
  });

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private paisService: PaisService,
    private estadoService: EstadoService,
    private cidadeSevice: CidadeService,
    private faturamentoMinimoService: FaturamentoMinimoFreteService,
    public activeModal: NgbActiveModal,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnDestroy() {
    if (this.subPais) {
      this.subPais.unsubscribe();
    }
    if (this.subEstado) {
      this.subEstado.unsubscribe();
    }
  }

  async ngOnInit() {
    this.contruirFormulario();

    await this.obterListas();

    this.subscriptions();

    if (this.idFaturamentoMinimoFrete) {
      this.form.addControl('tipoFrete', new FormControl(Validators.required));
      this.obterFaturamentoMinimoFrete();
    } else {
      this.form.addControl('tipos', new FormControl(Validators.required));
      this.form.patchValue({ idPais: 30 });
    }
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idFaturamentoMinimoFrete: [0],
      idPessoa: [0],
      idPais: [null, Validators.required],
      idEstado: [null],
      idCidade: [null],
      valor: [null, Validators.required]
    });

    this.form.controls.idPais.disable();
    this.form.controls.idEstado.disable();
    this.form.controls.idCidade.disable();
  }

  private preencherFormulario(faturamentoMinimoFrete: FaturamentoMinimoFrete) {
    this.form.patchValue(this.adicionarMascaras(faturamentoMinimoFrete));
  }

  private async obterListas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.paises = await this.paisService.obterPaises().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  private subscriptions() {
    const pais = this.form.get('idPais');
    this.subPais = pais.valueChanges.subscribe((idPais: number) => {
      if (idPais) this.obterEstados(idPais);
      this.form.controls.idEstado.disable();
    });

    const estado = this.form.get('idEstado');
    this.subEstado = estado.valueChanges.subscribe((idEstado: number) => {
      if (idEstado) this.obterCidades(idEstado);
      this.form.controls.idCidade.disable();
    });
  }

  private obterEstados(idPais: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.estadoService.obterEstados(idPais).subscribe(
      response => {
        if (response) {
          this.estados = response;
          this.form.controls.idEstado.enable();
        } else {
          this.estados = new Array<Estado>();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private obterCidades(idEstado: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cidadeSevice.obterCidades(idEstado).subscribe(
      response => {
        if (response) {
          this.cidades = response;
          this.form.controls.idCidade.enable();
        } else {
          this.cidades = new Array<Cidade>();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let faturamento: FaturamentoMinimoFrete = this.removerMascaras(this.form.value);

    if (await this.faturamentoValido(faturamento)) {
      // TODO: Atualmente so vamos trabalhar com empresas no brasil
      faturamento.idPais = 30;
      if (this.idFaturamentoMinimoFrete) this.alterar(faturamento);
      else this.inserir(faturamento);
    } else {
      this.blockUI.stop();
    }
  }

  private async faturamentoValido(
    FaturamentoMinimoFrete: FaturamentoMinimoFrete
  ): Promise<boolean> {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

  private removerMascaras(item: any): FaturamentoMinimoFrete {
    item.valor = +item.valor.replace(/\./g, '').replace(',', '.');
    return item;
  }

  private adicionarMascaras(item: any) {
    item.valor = this.currencyPipe.transform(item.valor, undefined, '', '1.2-4', 'pt-BR').trim();
    return item;
  }

  private inserir(faturamento: FaturamentoMinimoFrete) {
    let faturamentoDto = new FaturamentoMinimoFreteDto();
    faturamentoDto.faturamentoBase = faturamento;
    faturamentoDto.tipos = this.form.value.tipos;
    faturamentoDto.faturamentoBase.idPessoa = this.idPessoa;

    this.faturamentoMinimoService.inserir(faturamentoDto).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(response);
      },
      error => {
        if (error && error.status == 400) {
          switch (error.error) {
            case 'Registro duplicado':
              this.toastr.error(
                this.translationLibrary.translations.ALERTS.INVALID_MINIMUM_BILLING_ALREADY_EXISTS
              );
              break;
            default:
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              break;
          }
        } else this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private alterar(faturamento: FaturamentoMinimoFrete) {
    this.faturamentoMinimoService.alterar(faturamento).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(faturamento);
      },
      error => {
        if (error && error.status == 400) {
          switch (error.error) {
            case 'Registro duplicado':
              this.toastr.error(
                this.translationLibrary.translations.ALERTS.INVALID_MINIMUM_BILLING_ALREADY_EXISTS
              );
              break;
            default:
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              break;
          }
        } else this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private obterFaturamentoMinimoFrete() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.faturamentoMinimoService.obterPorId(this.idFaturamentoMinimoFrete).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public cancelar() {
    this.activeModal.close();
  }
}
