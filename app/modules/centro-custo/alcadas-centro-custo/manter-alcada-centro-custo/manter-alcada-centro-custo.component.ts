import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaProduto, CentroCustoAlcada, Moeda, Situacao, Usuario } from '@shared/models';
import { CategoriaProdutoService, CentroCustoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { UsuarioService } from '../../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-alcada-centro-custo',
  templateUrl: './manter-alcada-centro-custo.component.html',
  styleUrls: ['./manter-alcada-centro-custo.component.scss'],
})
export class ManterAlcadaCentroCustoComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('id-centro-custo') idCentroCusto: number;

  // tslint:disable-next-line: no-input-rename
  @Input('id-alcada') idAlcada: number;

  @BlockUI() blockUI: NgBlockUI;

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

  Moeda = Moeda;

  Situacao = Situacao;
  form: FormGroup;

  usuarios: Array<Usuario>;
  categoriasProduto: Array<CategoriaProduto>;
  endregion;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private centroCustoService: CentroCustoService,
    private categoriaProdutoService: CategoriaProdutoService,
    private usuarioService: UsuarioService,
    private currencyPipe: CurrencyPipe,
  ) { }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    await this.obterListas();
    if (this.idAlcada) {
      this.obterAlcada();
    } else {
      this.blockUI.stop();
    }
  }

  async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      const alcada: CentroCustoAlcada = this.removerMascaras(this.form.value);
      if (this.idAlcada) {
        this.alterar(alcada);
      } else {
        this.inserir(alcada);
      }
    } else {
      this.blockUI.stop();
    }
  }

  cancelar() {
    this.activeModal.close();
  }

  // #region Categorias de produto
  compareFn(a, b): boolean {
    return a.idCategoriaProduto == b.idCategoriaProduto;
  }

  categoriaRemovida() {
    this.form.get('utilizaTodasCategorias').patchValue(false);
  }

  private obterAlcada() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.centroCustoService.obterAlcadaPorId(this.idCentroCusto, this.idAlcada).subscribe(
      (response) => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idCentroCustoAlcada: [0],
      idCentroCusto: [this.idCentroCusto],
      idTenant: [0],
      idAprovador: [null, Validators.required],
      situacao: [Situacao.Ativo],
      codigo: [''],
      descricao: ['', Validators.required],
      moeda: [Moeda.Real, Validators.required],
      valor: [null, Validators.required],
      utilizaTodasCategorias: [false],
      categoriasProduto: [new Array<CategoriaProduto>()],
    });
  }

  private preencherFormulario(alcada: CentroCustoAlcada) {
    this.form.patchValue(this.adicionarMascaras(alcada));
  }

  private removerMascaras(alcada: any): CentroCustoAlcada {
    // Utiliza expressão regular para remover todos os pontos da string
    alcada.valor = +(alcada.valor.replace(/\./g, '').replace(',', '.'));
    return alcada;
  }

  private adicionarMascaras(alcada: any) {
    alcada.valor = this.currencyPipe.transform(alcada.valor, undefined, '', '1.2-4', 'pt-BR').trim();
    return alcada;
  }

  private formularioValido(): boolean {
    // required
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }

  private inserir(alcada: CentroCustoAlcada) {
    this.centroCustoService.inserirAlcada(this.idCentroCusto, alcada).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(response);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private alterar(alcada: CentroCustoAlcada) {
    this.centroCustoService.alterarAlcada(this.idCentroCusto, alcada).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(alcada);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private async obterListas() {
    try {
      this.usuarios = await this.usuarioService.listar().toPromise();
      this.categoriasProduto = await this.categoriaProdutoService.listarAtivas().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }
}
