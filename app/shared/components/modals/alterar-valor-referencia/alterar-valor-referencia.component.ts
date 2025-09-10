import { CotacaoItem } from '@shared/models';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CotacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-alterar-valor-referencia',
  templateUrl: './alterar-valor-referencia.component.html',
  styleUrls: ['./alterar-valor-referencia.component.scss']
})
export class AlterarValorReferenciaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  @Input('cotacao-item') cotacaoItem: CotacaoItem;

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
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private currencyPipe: CurrencyPipe,
    private cotacaoService: CotacaoService
  ) {}

  ngOnInit() {
    this.construirFormulario();

    if (this.cotacaoItem) {
      this.preencherFormulario();
    }
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      valorReferencia: [null]
    });
  }

  private preencherFormulario() {
    this.form.patchValue({
      valorReferencia: this.currencyPipe.transform(
        this.cotacaoItem.valorReferencia ? this.cotacaoItem.valorReferencia : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR'
      )
    });
  }

  public solicitaConfirmar() {
    this.blockUI.start();
    let cotacaoItemAlterar = Object.assign({}, this.cotacaoItem);
    cotacaoItemAlterar.valorReferencia = this.removeMascaraValor(this.form.value.valorReferencia);
    this.cotacaoService.alterarItem(cotacaoItemAlterar).subscribe(
      response => {
        if (response) {
          // altera referencia do objeto
          this.cotacaoItem.valorReferencia = cotacaoItemAlterar.valorReferencia;
          this.confirmar();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public removeMascaraValor(valor: string) {
    return Number(valor.replace(/\./g, '').replace(',', '.'));
  }

  public adicionaMascaraValor(valor: string) {
    return Number(valor.replace(/\./g, '').replace(',', '.'));
  }

  public confirmar() {
    this.activeModal.close(this.cotacaoItem);
  }

  public cancelar() {
    this.activeModal.close(false);
  }
}
