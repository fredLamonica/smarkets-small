import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ManterUsuarioModalComponent } from '@shared/components/modals/manter-usuario-modal/manter-usuario-modal.component';
import {
  AtividadePessoa,
  NaturezaJuridica,
  PerfilTributario,
  PerfilTributarioDisplay, Pessoa,
  PessoaJuridica,
  PorteEmpresa, SituacaoPessoaJuridica,
  TipoCadastroEmpresa,
  TipoPessoa
} from '@shared/models';
import { GeneralDataDto } from '@shared/models/buyer/general-data-dto';
import { UsuarioDto } from '@shared/models/dto/usuario-dto';
import { TipoEmpresa, TipoEmpresaDisplay } from '@shared/models/enums/tipo-empresa';
import {
  AutenticacaoService,
  NaturezaJuridicaService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { BuyerServiceService } from '@shared/providers/buyer-service.service';
import { ErrorService } from '@shared/utils/error.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import {
  TipoOrganizacao,
  TipoOrganizacaoDisplay
} from '../../../shared/models/enums/tipo-organizacao';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dados-gerais-comprador',
  templateUrl: './dados-gerais-comprador.component.html',
  styleUrls: ['./dados-gerais-comprador.component.scss'],
})
export class DadosGeraisCompradorComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;

  maskCnpj = [
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
    /\d/,
  ];
  maskTelefone = [
    '(',
    /\d/,
    /\d/,
    ')',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  maskCelular = [
    '(',
    /\d/,
    /\d/,
    ')',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  maskCpf = [
    /\d/,
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
    '-',
    /\d/,
    /\d/,
    /\d/,
  ];

  isCreate = false;
  enableCamposFranquia = false;
  enableTipoEmpresa = false;
  isFranquia = false;
  isPending = false;
  empresaCadastradora: PessoaJuridica;
  empresaCadastradoraIsHolding: boolean;

  tipoEmpresa: TipoEmpresa;
  tipoOrganizacao: TipoOrganizacao;

  tipoEmpresaDisplay = TipoEmpresaDisplay;
  enumTipoEmpresa = TipoEmpresa;
  tipoEmpresaValues = Object.values(this.enumTipoEmpresa).filter((e) => typeof e === 'number');

  tipoOrganizacaoDisplay = TipoOrganizacaoDisplay;
  enumTipoOrganizacao = TipoOrganizacao;
  tipoOrganizacaoValues = Object.values(this.enumTipoOrganizacao).filter(
    (e) => typeof e === 'number',
  );

  enumPorteEmpresa = PorteEmpresa;
  opcoesPorteEmpresa = Object.keys(this.enumPorteEmpresa).filter(Number);

  naturezasJuridicas$: Observable<Array<NaturezaJuridica>>;
  naturezasJuridicasLoading: boolean;

  enumTipoCadastroEmpresa = TipoCadastroEmpresa;
  opcoesTipoCadastroEmpresa = Object.keys(this.enumTipoCadastroEmpresa).filter(Number);

  perfilTributarioDisplay = PerfilTributarioDisplay;
  enumPerfilTributario = PerfilTributario;
  opcoesPerfilTributario = Object.values(this.enumPerfilTributario).filter(
    (e) => typeof e === 'number',
  );

  mainUserArray: any[];
  idMainUser: number;
  codigoFilialEmpresaObrigatorio: boolean;

  get mostraEstruturaOrganizacional(): boolean {
    const idTenantSmarkets = 1;
    return (!this.generalDataDto && this.autenticacaoService.usuario().permissaoAtual.idTenant === idTenantSmarkets && !this.idPessoaJuridicaMatriz);
  }

  private idPessoaJuridica: number;
  private idPessoaJuridicaMatriz: number;
  private _document = '';

  private generalDataDto: GeneralDataDto;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private autenticacaoService: AutenticacaoService,
    private naturezaJuridicaService: NaturezaJuridicaService,
    private buyerServiceService: BuyerServiceService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    const paramId = this.route.parent.snapshot.params.id;

    this.construirFormulario();
    this.subListas();
    if (paramId) {
      this.idPessoaJuridica = paramId;
      this.obterDadosGerais();
    } else {
      this.isCreate = true;
      this._document = this.pessoaJuridicaService.obterDocumento();
      const paramMatriz = this.route.snapshot.params.idPessoaJuridicaMatriz;
      if (paramMatriz) {
        this.idPessoaJuridicaMatriz = +paramMatriz;
        this.obterEmpresaCadastradora();
      } else {
        if (!this.autenticacaoService.usuario().permissaoAtual.isSmarkets) {
          const pessoaJuridicaLogada =
            this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica;
          this.empresaCadastradoraIsHolding = pessoaJuridicaLogada.holding;
          this.idPessoaJuridicaMatriz = pessoaJuridicaLogada.idPessoaJuridica;
        }
      }
      this.pessoaJuridicaService.alterarDocumento('');
    }
  }

  ngOnDestroy() {
    if (!this.idPessoaJuridica) {
      this.pessoaJuridicaService.alterarLogo('');
    }

    super.ngOnDestroy();
  }

  subListas() {
    this.subNaturezaJuridica();
  }

  onChangeTipoEmpresa() {
    if (this.tipoEmpresa === TipoEmpresa.HoldingEmpresarial) {
      this.form.patchValue({
        holding: true,
        filial: false,
      });
    } else if (this.tipoEmpresa === TipoEmpresa.Convencional) {
      this.form.patchValue({
        holding: false,
      });
    } else {
      this.form.patchValue({
        holding: null,
      });
    }
  }

  onChangeTipoOrganizacao(tipoOrganizacao: any) {
    if (this.tipoOrganizacao === TipoOrganizacao.Franquia) {
      this.exibirCamposFranquia(true);
      this.form.patchValue({
        franquia: true,
      });
    } else if (this.tipoOrganizacao === TipoOrganizacao.Matriz) {
      this.exibirCamposFranquia(false);
      this.form.patchValue({
        franquia: false,
        filial: false,
        marcaFranquia: '',
        codigoFranquia: '',
      });
    } else {
      this.exibirCamposFranquia(false);
      this.form.patchValue({
        franquia: false,
        marcaFranquia: '',
        codigoFranquia: '',
      });
    }
  }
  disableTipoEmpresa() {
    if (this.idPessoaJuridica && !this.enableTipoEmpresa) {
      return true;
    }
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      const form = this.form.value;
      this.preencherTipoEmpresa(form);

      if (this.idPessoaJuridica) { this.alterar(form); } else { this.inserir(form); }
    } else {
      this.blockUI.stop();
    }
  }

  obterEmpresaCadastradora() {
    this.buyerServiceService.ObterDadosGeraisPorIdPessoaJuridica(this.idPessoaJuridicaMatriz).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.empresaCadastradoraIsHolding = response.holding;
            this.blockUI.stop();
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  naturezasJuridicaSearchFn(term: string, item: NaturezaJuridica) {
    term = term.toLowerCase();
    return (
      item.descricao.toLowerCase().indexOf(term) > -1 ||
      item.codigo.toLowerCase().indexOf(term) > -1
    );
  }

  createUser() {
    const modalRef = this.modalService.open(ManterUsuarioModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'modal-manter-usuario',
    });
    modalRef.result.then((result) => {
      if (result) {
        const mainUser = new UsuarioDto(result.idUsuario, result.pessoaFisica.nome, result.email);
        this.mainUserArray = [mainUser];
        this.idMainUser = result.idUsuario;
      }
    });
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idPessoaJuridica: [0],
      codigoFilialEmpresa: [''],
      razaoSocial: ['', Validators.required],
      nomeFantasia: [''],
      holding: [null],
      filial: [''],
      porte: [''],
      dataCadastro: [''],
      idNaturezaJuridica: [null],
      numeroFuncionarios: [null],
      tipoCadastro: [''],
      homePage: [''],
      contato: [''],
      telefone: [''],
      email: [''],
      perfilTributario: [''],
      inscricaoEstadual: [''],
      inscricaoMunicipal: [''],
      patrimonioLiquido: [0],
      optanteSimplesNacional: [''],
      capitalSocial: [null],
      capitalIntegralizado: [null],
      dataIntegralizacao: [null],
      idUsuarioPrincipal: [null],
      franquia: [''],
      marcaFranquia: [''],
      codigoFranquia: [''],
    });
  }

  private obterDadosGerais() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.buyerServiceService.ObterDadosGeraisPorIdPessoaJuridica(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.generalDataDto = response;
            this.preencherFormulario(response);
            this.blockUI.stop();
            this.codigoFilialEmpresaObrigatorio = this.generalDataDto.integracaoSapHabilitada || this.generalDataDto.habilitarIntegracaoERP;
          }
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private preencherFormulario(generalDataDto: GeneralDataDto) {
    if (generalDataDto.dataIntegralizacao) {
      generalDataDto.dataIntegralizacao = new Date(generalDataDto.dataIntegralizacao)
        .toISOString()
        .substring(0, 10);
    }
    if (generalDataDto.dataCadastro) {
      generalDataDto.dataCadastro = new Date(generalDataDto.dataCadastro)
        .toISOString()
        .substring(0, 10);
    }

    generalDataDto.holding = generalDataDto.holding ? generalDataDto.holding : false;
    this.isPending = generalDataDto.situacao === SituacaoPessoaJuridica.Pendente ? true : false;

    if (generalDataDto.franquia) {
      this.isFranquia = true;
    }

    this.form.patchValue(generalDataDto);

    this.obterEstruturaOrganizacional();
    this.obterTipoOrganizacao();
    this.exibirCamposFranquia(generalDataDto.franquia);
  }

  private obterEstruturaOrganizacional() {
    this.tipoEmpresa = this.form.controls.holding.value
      ? this.enumTipoEmpresa.HoldingEmpresarial
      : this.enumTipoEmpresa.Convencional;
  }

  private obterTipoOrganizacao() {
    if (
      this.form.controls.franquia.value != null &&
      (this.form.controls.filial.value == null || !this.form.controls.filial.value) &&
      (this.form.controls.holding.value == null || !this.form.controls.holding.value)
    ) {
      this.tipoOrganizacao = this.form.controls.franquia.value
        ? this.enumTipoOrganizacao.Franquia
        : this.enumTipoOrganizacao.Matriz;
      this.enableTipoEmpresa = false;
    } else {
      this.tipoOrganizacao = null;
      this.enableTipoEmpresa = true;
    }
  }

  private subNaturezaJuridica() {
    this.naturezasJuridicasLoading = true;
    this.naturezasJuridicas$ = this.naturezaJuridicaService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.naturezasJuridicasLoading = false)),
    );
  }

  private exibirCamposFranquia(value: boolean) {
    this.enableCamposFranquia = value;
  }

  private inserir(formValue) {
    const pessoaJuridica = this.instanceCompany(formValue);

    this.pessoaJuridicaService.inserir(pessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/comprador/', response.idPessoaJuridica, 'dados-gerais']);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private alterar(generalDataDto: GeneralDataDto) {
    this.buyerServiceService.AlterarDadosGeraisPessoaJuridica(generalDataDto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.generalDataDto = response;
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.obterTipoOrganizacao();
          }
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      if (this.form.controls.codigoFranquia.errors) {
        this.toastr.warning(
          'O campo Código Franquia é obrigatório e deve ser preenchido somente com números.',
        );
        return false;
      }
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (this.isCreate && !this.form.value.idUsuarioPrincipal) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    const openDate = moment(this.form.value.dataCadastro).valueOf();
    const currentDate = moment(moment().format('YYYY-MM-DD')).valueOf();
    if (openDate >= currentDate) {
      this.toastr.warning('A data de abertura deve ser menor que a data atual');
      return false;
    }

    return true;
  }

  private preencherTipoEmpresa(form: any) {
    form.holding = this.tipoEmpresa === this.enumTipoEmpresa.HoldingEmpresarial ? true : false;

    if (
      !form.holding &&
      !this.tipoEmpresa &&
      !this.empresaCadastradoraIsHolding &&
      this.tipoOrganizacao !== TipoOrganizacao.Franquia
    ) {
      form.filial = true;
      form.franquia = false;
    }
  }

  private instanceCompany(formValue): PessoaJuridica {
    const pessoa: Pessoa = new Pessoa(0, null, TipoPessoa.PessoaJuridica, null, 0);
    const pessoaJuridica = new PessoaJuridica(
      pessoa.idPessoa,
      pessoa.codigoPessoa,
      pessoa.tipoPessoa,
      pessoa.cnd,
      pessoa.idTenant,
      formValue.idPessoaJuridica,
      formValue.idNaturezaJuridica,
      this._document,
      formValue.razaoSocial,
      formValue.nomeFantasia,
      formValue.inscricaoEstadual,
      formValue.inscricaoMunicipal,
      formValue.tipoCadastro,
      formValue.capitalSocial,
      formValue.capitalIntegralizado,
      formValue.dataIntegralizacao,
      null,
      null,
      formValue.patrimonioLiquido,
      formValue.perfilTributario,
      formValue.optanteSimplesNacional,
      null,
      formValue.porte,
      null,
      formValue.numeroFuncionarios,
      formValue.homePage,
      formValue.filial,
      null,
      formValue.idUsuarioPrincipal,
      null,
      null,
      formValue.idPessoaJuridicaMatriz,
      new AtividadePessoa(0, false, true, false, false),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      formValue.codigoFilialEmpresa,
      formValue.contato,
      formValue.telefone,
      formValue.email,
    );

    pessoaJuridica.dataCadastro = formValue.dataCadastro;

    pessoaJuridica.logo = this.pessoaJuridicaService.obterLogo();
    this.pessoaJuridicaService.alterarLogo('');

    pessoaJuridica.holding = formValue.holding;
    pessoaJuridica.franquia = formValue.franquia;
    pessoaJuridica.marcaFranquia = formValue.marcaFranquia;
    pessoaJuridica.codigoFranquia = formValue.codigoFranquia;

    if (this.idPessoaJuridicaMatriz) {
      pessoaJuridica.idPessoaJuridicaMatriz = this.idPessoaJuridicaMatriz;
    }

    return pessoaJuridica;
  }
}
