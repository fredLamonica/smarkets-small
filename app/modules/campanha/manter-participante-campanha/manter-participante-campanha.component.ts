import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import {
  Campanha, Cidade, Estado, Pais, Situacao,
  SituacaoCampanha
} from '@shared/models';
import {
  CampanhaService, CidadeService, EstadoService, PaisService, SuporteService, TranslationLibraryService
} from '@shared/providers';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'app-manter-participante-campanha',
  templateUrl: './manter-participante-campanha.component.html',
  styleUrls: ['./manter-participante-campanha.component.scss']
})
export class ManterParticipanteCampanhaComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  public maskCnpj = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/
  ];
  public maskTelefone = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  public maskCelular = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
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

  public urlCampanha: string;
  public form: FormGroup;
  public campanha: Campanha;

  private paramsSub: Subscription;

  public inativa: boolean = false;
  public usarGestorRequisitante = false;
  public usarGestorAprovador = false;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private campanhaService: CampanhaService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public suporteService: SuporteService,
    private paisService: PaisService,
    private estadoService: EstadoService,
    private cidadeService: CidadeService
  ) { }

  ngOnInit() {
    this.contruirFormulario();
    this.obterParametros();

    this.formSub();
    this.subPaises();
    this.form.patchValue({ idPais: 30 });
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.urlCampanha = params['url'];

      if (this.urlCampanha) {
        this.obterCampanha();
      } else {
        this.notFound();
      }
    });
  }

  private obterCampanha() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.campanhaService.obterPorUrl(this.urlCampanha).subscribe(
      response => {
        if (response) {
          this.campanha = response;
          if (
            this.campanha.situacao != SituacaoCampanha.Ativa ||
            !moment().isBetween(
              moment(this.campanha.dataInicio),
              moment(this.campanha.dataFim).add(1, 'days')
            )
          ) {
            this.inativa = true;
          }
        } else {
          this.notFound();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idCampanhaParticipante: [0],
      idCampanha: [0],
      idPessoaJuridica: [null],
      situacao: [Situacao['Inativo']],
      dataAdesao: [null],
      cnpj: ['', Validators.compose([Validators.required, CustomValidators.cnpj])],
      razaoSocial: ['', Validators.required],
      nomeResponsavel: ['', Validators.required],
      emailResponsavel: [null, Validators.compose([Validators.required, Validators.email])],
      telefoneResponsavel: [null],
      celularResponsavel: [null, Validators.required],
      nomeRequisitante: [''],
      emailRequisitante: [null, Validators.email],
      nomeAprovador: [''],
      emailAprovador: [null, Validators.email],
      indicacao: [null, Validators.required],
      aceite: [false],
      idPais: [{ value: null, disabled: true }, Validators.required],
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
  }

  private get formValid(): boolean {
    if (!this.form.value.aceite) {
      this.toastr.warning(
        'Para enviar seu registro é necessário aceitar os termos de concordância'
      );
      return false;
    }

    if (this.form.invalid || !this.validarCamposRequired()) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if ((this.form.controls.emailRequisitante.value && this.form.controls.emailRequisitante.value == this.form.controls.emailResponsavel.value) ||
      (this.form.controls.emailAprovador.value && this.form.controls.emailAprovador.value == this.form.controls.emailResponsavel.value) ||
      (this.form.controls.emailAprovador.value && this.form.controls.emailRequisitante.value && this.form.controls.emailAprovador.value == this.form.controls.emailRequisitante.value)) {
      this.toastr.warning(
        'Não é possível cadastrar dois ou mais usuários diferentes com o mesmo email'
      );
      return false;
    }

    return true;
  }

  public enviar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formValid) {
      let participante = this.form.getRawValue();
      this.campanhaService.inserirParticipante(this.campanha.idCampanha, participante).subscribe(
        reponse => {
          this.blockUI.stop();
          this.successHandler();
        },
        error => {
          this.errorHandler(error);
          this.blockUI.stop();
        }
      );
    } else {
      this.blockUI.stop();
    }
  }

  public notFound() {
    this.router.navigate(['/', '404']);
  }

  private errorHandler(error: any) {
    if (error && error.status == 400) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
      modalRef.componentInstance.html = true;
      modalRef.componentInstance.cancelarLabel = 'none';
      switch (error.error) {
        case 'Registro duplicado': {
          modalRef.componentInstance.confirmacao = `
            <p>Verificamos que seus dados já foram cadastrados no sistema, entre em contato com o suporte para maiores informações.</p>
            <p class="mb-0"><span class="font-weight-bold">TELEFONE:</span> ${this.suporteService.telefone}</p>
            <p><span class="font-weight-bold">E-MAIL:</span> ${this.suporteService.email}</p>
          `;
          break;
        }
        case 'Ação já realizada': {
          modalRef.componentInstance.confirmacao = `
            <p>Já verificamos que seus dados já foram cadastrados no sistema, entre em contato com o suporte para maiores informações.</p>
            <p class="mb-0"><span class="font-weight-bold">TELEFONE:</span> ${this.suporteService.telefone}</p>
            <p><span class="font-weight-bold">E-MAIL:</span> ${this.suporteService.email}</p>
          `;
          break;
        }
        case 'Registro inativo': {
          modalRef.componentInstance.confirmacao = `
            <p>Esta campanha se encontra inativa, entre em contato com o suporte para maiores informações.</p>
            <p class="mb-0"><span class="font-weight-bold">TELEFONE:</span> ${this.suporteService.telefone}</p>
            <p><span class="font-weight-bold">E-MAIL:</span> ${this.suporteService.email}</p>
          `;
          break;
        }
        default: {
          modalRef.componentInstance.confirmacao = `
            <p>${this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR}</p>
          `;
          break;
        }
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
  }

  private successHandler() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = `
      <p class="font-weight-bold">Parabéns! Agora você faz parte do melhor marketplace do Brasil.</p>
      <p>Em instantes você receberá sua senha por e-mail e mais instruções de acesso a plataforma.</p>
      <p>Obrigado.</p>
    `;
    modalRef.componentInstance.html = true;
    modalRef.componentInstance.cancelarLabel = 'none';
    modalRef.result.then(result => {
      this.router.navigate(['/']);
    });
  }

  public setUsarGestorRequisitante() {
    if (!this.usarGestorRequisitante) {
      this.preencherDadosUsuario('nomeRequisitante', 'emailRequisitante');
      this.usarGestorRequisitante = true;
    } else {
      this.form.controls.nomeRequisitante.setValue(null);
      this.form.controls.emailRequisitante.setValue(null);
      this.form.controls.nomeRequisitante.enable();
      this.form.controls.emailRequisitante.enable();
      this.usarGestorRequisitante = false;
    }
  }

  public setUsarGestorAprovador() {
    if (!this.usarGestorAprovador) {
      this.preencherDadosUsuario('nomeAprovador', 'emailAprovador');
      this.usarGestorAprovador = true;
    } else {
      this.form.controls.nomeAprovador.setValue(null);
      this.form.controls.emailAprovador.setValue(null);
      this.form.controls.nomeAprovador.enable();
      this.form.controls.emailAprovador.enable();
      this.usarGestorAprovador = false;
    }
  }

  private preencherDadosUsuario(controlNome: string, controlEmail: string) {
    this.form.get(controlNome).setValue(this.form.controls.nomeResponsavel.value);
    this.form.get(controlEmail).setValue(this.form.controls.emailResponsavel.value);
    this.form.get(controlNome).disable();
    this.form.get(controlEmail).disable();
  }

  public alterarDadosUsuario() {
    if (this.usarGestorRequisitante) {
      this.preencherDadosUsuario('nomeRequisitante', 'emailRequisitante');
    }
    if (this.usarGestorAprovador) {
      this.preencherDadosUsuario('nomeAprovador', 'emailAprovador');
    }
  }

  private validarCamposRequired() {
    if (
      this.isNullOrWhitespace(this.form.controls.cnpj.value) ||
      this.isNullOrWhitespace(this.form.controls.razaoSocial.value) ||
      this.isNullOrWhitespace(this.form.controls.nomeResponsavel.value) ||
      this.isNullOrWhitespace(this.form.controls.emailResponsavel.value) ||
      this.isNullOrWhitespace(this.form.controls.celularResponsavel.value) ||
      this.isNullOrWhitespace(this.form.controls.indicacao.value) ||
      this.isNullOrWhitespace(this.form.controls.idPais.value) ||
      this.isNullOrWhitespace(this.form.controls.idEstado.value) ||
      this.isNullOrWhitespace(this.form.controls.idCidade.value) ||
      this.isNullOrWhitespace(this.form.controls.cep.value) ||
      this.isNullOrWhitespace(this.form.controls.logradouro.value) ||
      this.isNullOrWhitespace(this.form.controls.numero.value) ||
      this.isNullOrWhitespace(this.form.controls.bairro.value)
    ) {
      return false;
    }

    return true;
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch { }
    return a || b;
  }

  // #region Localizacao

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

  public estados$: Observable<Array<Estado>>;
  public estadosLoading: boolean;

  private subEstados(idPais: number) {
    this.estadosLoading = true;
    this.estados$ = this.estadoService.obterEstados(idPais).pipe(
      catchError(() => of([])),
      tap(() => (this.estadosLoading = false))
    );
  }

  public cidades$: Observable<Array<Cidade>>;
  public cidadesLoading: boolean;

  private subCidades(idEstado: number) {
    this.cidadesLoading = true;
    this.cidades$ = this.cidadeService.obterCidades(idEstado).pipe(
      catchError(() => of([])),
      tap(() => (this.cidadesLoading = false))
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

  // #endregion
}
