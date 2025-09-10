import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Pais, Estado, Endereco, Cidade, TipoEndereco } from '@shared/models';
import {
  TranslationLibraryService,
  PaisService,
  EnderecoService,
  EstadoService,
  CidadeService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { EnderecoDto } from '@shared/models/dto/endereco-dto';

@Component({
  selector: 'app-manter-endereco',
  templateUrl: './manter-endereco.component.html',
  styleUrls: ['./manter-endereco.component.scss']
})
export class ManterEnderecoComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-pessoa') idPessoa: number;
  @Input('id-endereco') idEndereco: number;

  public maskCep = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskPositiveInteger = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: null,
    allowDecimal: false,
    decimalSymbol: ',',
    decimalLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10
  });

  public Tipo = TipoEndereco;

  public form: FormGroup;
  public paises: Array<Pais>;
  public estados: Array<Estado>;
  public cidades: Array<Cidade>;

  private subPais: Subscription;
  private subEstado: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private paisService: PaisService,
    private estadoService: EstadoService,
    private cidadeSevice: CidadeService,
    private enderecoService: EnderecoService,
    public activeModal: NgbActiveModal
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

    if (this.idEndereco) {
      this.form.addControl('tipo', new FormControl(null, Validators.required));
      this.form.controls.tipo.updateValueAndValidity();
      this.form.addControl('principal', new FormControl());
      this.obterEndereco();
    } else {
      this.form.addControl('tipos', new FormControl(null, Validators.required));
      this.form.controls.tipos.updateValueAndValidity();
      this.form.patchValue({ idPais: 30 });
    }
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idEndereco: [0],
      idPessoa: [0],
      idPais: [null, Validators.required],
      idEstado: [null, Validators.required],
      idCidade: [null, Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      referencia: [''],
      bairro: ['', Validators.required],
      principal: [false]
    });

    this.form.controls.idPais.disable();
    this.form.controls.idEstado.disable();
    this.form.controls.idCidade.disable();
  }

  private preencherFormulario(endereco: Endereco) {
    this.form.patchValue(endereco);
  }

  private async obterListas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.paises = await this.paisService.obterPaises().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
    return true;
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

  private obterEndereco() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.enderecoService.obterPorId(this.idEndereco).subscribe(
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

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      let endereco: Endereco = this.form.value;

      // TODO: Atualmente so vamos trabalhar com empresas no brasil
      endereco.idPais = 30;

      if (this.idEndereco) {
        this.alterar(endereco);
      } else {
        let enderecoDto = new EnderecoDto();
        enderecoDto.enderecobase = endereco;
        enderecoDto.tipos = this.form.value.tipos;
        this.inserir(enderecoDto);
      }
    } else {
      this.blockUI.stop();
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private inserir(endereco: EnderecoDto) {
    endereco.enderecobase.idPessoa = this.idPessoa;
    this.enderecoService.inserir(endereco).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(response);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private alterar(endereco: Endereco) {
    this.enderecoService.alterar(endereco).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(endereco);
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
