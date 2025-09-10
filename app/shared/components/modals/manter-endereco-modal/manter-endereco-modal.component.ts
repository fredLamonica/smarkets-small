import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Endereco, TipoEndereco, Pais, Estado, Cidade } from '@shared/models';
import {
  TranslationLibraryService,
  PaisService,
  EstadoService,
  CidadeService,
  EnderecoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'manter-endereco-modal',
  templateUrl: './manter-endereco-modal.component.html',
  styleUrls: ['./manter-endereco-modal.component.scss']
})
export class ManterEnderecoModalComponent implements OnInit {
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

  @Input() tiposEnderecos: Array<TipoEndereco> = new Array<TipoEndereco>();
  @Input() hasAddress: boolean;
  public selected = ['Instituicional'];
  public TipoEndereco = TipoEndereco;
  public endereco: Endereco;

  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private paisService: PaisService,
    private estadoService: EstadoService,
    private cidadeService: CidadeService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.tiposEnderecos.concat(this.tiposEnderecos);
    this.construirFormulario();
    this.formSub();
    this.subPaises();

    if (this.endereco) {
      this.preencherFormulario(this.endereco);
    } else {
      this.form.patchValue({ idPais: 30 });
    }
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idEndereco: [0],
      idPessoa: [0],
      idPais: [null, Validators.required],
      idEstado: [null, Validators.required],
      idCidade: [null, Validators.required],
      idSolicitacaoFornecedor: [null],
      idSolicitacaoFornecedorEndereco: [null],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      referencia: [''],
      bairro: ['', Validators.required],
      principal: [false],
      tipo: [{ value: null, disabled: true }, TipoEndereco],
      tipos: [
        this.tiposEnderecos.length == 1
          ? [TipoEndereco.Entrega]
          : !this.hasAddress // senão tem endereço seta o institucional
          ? [TipoEndereco.Institucional]
          : new Array<TipoEndereco>()
      ]
    });

    if (this.endereco) {
      this.form.controls.tipo.setValidators([Validators.required]);
      this.form.controls.tipo.updateValueAndValidity();
    } else {
      this.form.controls.tipos.setValidators([Validators.required]);
      this.form.controls.tipos.updateValueAndValidity();
    }
    this.form.controls.idPais.disable();
  }

  public preencherFormulario(endereco: Endereco) {
    this.form.patchValue(endereco);
    this.form.controls.idCidade.setValue(endereco.idCidade);
  }

  public paises: Array<Pais>;
  public paises$: Observable<Array<Pais>>;
  public paisesLoading: boolean;

  private subPaises() {
    this.paisesLoading = true;
    this.paises$ = this.paisService.obterPaises().pipe(
      catchError(() => of([])),
      tap(() => (this.paisesLoading = false))
    );
  }

  public estados: Array<Estado>;
  public estados$: Observable<Array<Estado>>;
  public estadosLoading: boolean;

  private subEstados(idPais: number) {
    this.estadosLoading = true;
    this.estados$ = this.estadoService.obterEstados(idPais).pipe(
      catchError(() => of([])),
      tap(estados => {
        this.estados = estados;
        this.estadosLoading = false;
      })
    );
  }

  public cidades: Array<Cidade>;
  public cidades$: Observable<Array<Cidade>>;
  public cidadesLoading: boolean;

  private subCidades(idEstado: number) {
    this.cidadesLoading = true;
    this.cidades$ = this.cidadeService.obterCidades(idEstado).pipe(
      catchError(() => of([])),
      tap(cidades => {
        this.cidades = cidades;
        this.cidadesLoading = false;
      })
    );
  }

  private subPais: Subscription;
  private subEstado: Subscription;

  private formSub() {
    const pais = this.form.get('idPais');
    this.subPais = pais.valueChanges.subscribe((idPais: number) => {
      if (idPais) {
        this.subEstados(idPais);
      }

      this.form.controls.idCidade.disable();
    });

    const estado = this.form.get('idEstado');
    this.subEstado = estado.valueChanges.subscribe((idEstado: number) => {
      if (idEstado) {
        this.form.controls.idCidade.enable();
        this.subCidades(idEstado);
      } else {
        this.form.controls.idCidade.disable();
      }
      this.form.patchValue({ idCidade: null });
    });
  }

  public salvar() {
    if (this.form.valid) {
      let endereco = this.form.getRawValue();
      endereco.cidade = this.cidades.find(cidade => cidade.idCidade == endereco.idCidade);
      if (endereco.cidade)
        endereco.cidade.estado = this.estados.find(estado => estado.idEstado == endereco.idEstado);

      if (this.endereco) {
        this.alterar(endereco);
      } else {
        this.incluir(endereco);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private incluir(endereco: any) {
    delete endereco.tipo;
    this.activeModal.close(endereco);
  }

  private alterar(endereco: any) {
    delete endereco.tipos;
    this.activeModal.close(endereco);
  }

  public cancelar() {
    this.activeModal.close();
  }
}
