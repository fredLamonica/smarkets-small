import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Arquivo, AtividadePessoa, Cnae, DomicilioBancario, Endereco, PendenciasFornecedor, PerfilTributario, PerfilUsuario, Pessoa, PessoaJuridica, PlanoAcaoFornecedor, PorteEmpresa, SituacaoPessoaJuridica, StatusPlanoAcaoFornecedor, TipoAprovacao, TipoCadastroEmpresa, TipoDocumentoFornecedor, TipoPessoa, Usuario } from '@shared/models';
import { ArquivoService, AutenticacaoService, NaturezaJuridicaService, PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { UsuarioService } from '../../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-transportadora-pessoa-juridica',
  templateUrl: './manter-transportadora-pessoa-juridica.component.html',
  styleUrls: ['./manter-transportadora-pessoa-juridica.component.scss'],
})
export class ManterTransportadoraPessoaJuridicaComponent extends Unsubscriber implements OnInit {
  get tipoDocumento() {
    return this._tipoDocumento;
  }
  // #endregion

  // #region Atividades
  get atividadesPessoaJuridica() {
    return this.form.get('atividades');
  }
  @BlockUI() blockUI: NgBlockUI;

  tipoPerfilUsuario = PerfilUsuario;

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

  cnaes: Array<Cnae>;
  cnaesSelecionados: Array<Cnae>;

  logo: string = '';
  domiciliosBancarios: Array<DomicilioBancario>;
  atividades = new AtividadePessoa();
  imagens = new Array<Arquivo>();

  idPessoaJuridica: number;

  idFornecedor: number;
  pendenciasFornecedor: Array<PendenciasFornecedor>;

  form: FormGroup;
  pessoaJuridica: PessoaJuridica;
  pessoasJuridicas: Array<PessoaJuridica>;
  opcoesTipoCadastroEmpresa: any[];
  opcoesPorteEmpresa: any[];
  opcoesSituacaoPessoaJuridica: any[];
  opcoesPerfilTributario: any[];
  enumTipoCadastroEmpresa = TipoCadastroEmpresa;
  enumPorteEmpresa = PorteEmpresa;
  enumSituacaoPessoaJuridica = SituacaoPessoaJuridica;
  enumPerfilTributario = PerfilTributario;
  usuario: Usuario;
  planosAcao = new Array<PlanoAcaoFornecedor>();
  perfilUsuario: PerfilUsuario;
  enumStatusPlanoAcaoFornecedor = StatusPlanoAcaoFornecedor;
  enumPerfilUsuario = PerfilUsuario;

  TipoDocumentoFornecedor = TipoDocumentoFornecedor;

  usuarioLogado: Usuario;

  usuarios$: Observable<Array<Usuario>>;
  usuariosLoading: boolean;

  naturezasJuridicas$: Observable<Array<Usuario>>;
  naturezasJuridicasLoading: boolean;

  empresas$: Observable<Array<PessoaJuridica>>;
  empresasLoading: boolean;
  // #endregion

  // #region Domicílios bancários
  exibirDomicilios: boolean;
  // #endregion

  //#region Faturamento Mínimo Frete

  exibirFaturamentosMinimosFrete: boolean;
  private paramsSub: Subscription;
  private _tipoDocumento: TipoDocumentoFornecedor;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private naturezaJuridicaService: NaturezaJuridicaService,
    private arquivoService: ArquivoService,
    private usuarioService: UsuarioService,
    private autenticacaoService: AutenticacaoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    super();
    this.opcoesTipoCadastroEmpresa = Object.keys(this.enumTipoCadastroEmpresa).filter(Number);
    this.opcoesPorteEmpresa = Object.keys(this.enumPorteEmpresa).filter(Number);
    this.opcoesSituacaoPessoaJuridica = Object.keys(this.enumSituacaoPessoaJuridica).filter(Number);
    this.opcoesPerfilTributario = Object.keys(this.enumPerfilTributario).filter(Number);
  }

  ngOnInit() {
    this.atividades.transportadora = true;
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.perfilUsuario = this.autenticacaoService.perfil();
    this.subListas();
    this.construirFormulario();
    this.obterParametros();
    this.perfilUsuario = this.autenticacaoService.perfil();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    if (this.paramsSub) { this.paramsSub.unsubscribe(); }
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      const form = this.form.value;

      const pessoa: Pessoa = new Pessoa(0, null, TipoPessoa.PessoaJuridica, null, 0);
      form.logo = this.logo;
      if (this.idPessoaJuridica) {
        pessoa.idPessoa = this.pessoaJuridica.idPessoa;
        pessoa.codigoPessoa = this.pessoaJuridica.codigoPessoa;
        pessoa.tipoPessoa = this.pessoaJuridica.tipoPessoa;
        pessoa.cnd = this.pessoaJuridica.cnd;
        this.atividades.idPessoa = this.pessoaJuridica.idPessoa;
      }
      const pessoaJuridica = new PessoaJuridica(
        pessoa.idPessoa,
        pessoa.codigoPessoa,
        pessoa.tipoPessoa,
        pessoa.cnd,
        pessoa.idTenant,
        form.idPessoaJuridica,
        form.idNaturezaJuridica,
        form.cnpj,
        form.razaoSocial,
        form.nomeFantasia,
        form.inscricaoEstadual,
        form.inscricaoMunicipal,
        form.tipoCadastro,
        form.capitalSocial,
        form.capitalIntegralizado,
        form.dataIntegralizacao,
        form.dataValidade,
        form.pastaIntegracao,
        form.patrimonioLiquido,
        form.perfilTributario,
        form.optanteSimplesNacional,
        form.observacao,
        form.porte,
        form.setor,
        form.numeroFuncionarios,
        form.homePage,
        form.filial,
        this.logo,
        form.idUsuarioPrincipal,
        form.situacao,
        form.assinaturaEletronica,
        form.idPessoaJuridicaMatriz,
        this.atividades,
        form.tipoAprovacao,
        form.utilizaPreAprovacaoFornecedor,
        form.aprovarRequisicoesAutomatico,
        form.habilitarModuloCotacao,
        form.utilizaSolicitacaoCompra,
        form.integrarApiPedidos,
        form.integracaoSapHabilitada,
        form.bloquearRequisicaoPedido,
        form.parametrosIntegracaoSapHabilitado,
        form.codigoFilialEmpresa,
        form.contato,
        form.telefone,
        form.email,
      );
      pessoaJuridica.enderecos = form.enderecos;
      if (this.idPessoaJuridica) { this.alterar(pessoaJuridica); } else { this.inserir(pessoaJuridica); }
    } else {
      this.blockUI.stop();
    }
  }

  voltar() {
    this.router.navigate(['/fornecedores/transportadoras']);
  }

  // #region Listas
  subListas() {
    this.subUsuario();
    this.subEmpresas();
    this.subNaturezaJuridica();
  }

  usuarioCustomSearchFn(term: string, item: Usuario) {
    term = term.toLowerCase();
    return (
      item.email.toLowerCase().indexOf(term) > -1 ||
      item.pessoaFisica.nome.toLowerCase().indexOf(term) > -1
    );
  }

  empresasCustomSearchFn(term: string, item: PessoaJuridica) {
    term = term.toLowerCase();
    return (
      item.cnpj.toLowerCase().indexOf(term) > -1 ||
      item.razaoSocial.toLowerCase().indexOf(term) > -1
    );
  }
  // #endregion

  // #region Logo
  async imagenSelecionada(arquivo: Arquivo) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      arquivo = await this.salvarArquivo(arquivo[0]);
      this.logo = arquivo.url;
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
    this.blockUI.stop();
  }

  async salvarArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }

  permitirExibirDomicilios() {
    if (!this.exibirDomicilios) { this.exibirDomicilios = true; }
  }

  permitirExibirFaturamentosMinimosFrete() {
    if (!this.exibirFaturamentosMinimosFrete) { this.exibirFaturamentosMinimosFrete = true; }
  }

  //#endregion

  onKeyUpDocumento() {
    if (this.idPessoaJuridica) {
      if (this.form.controls.cnpj.value.length > 14) {
        this._tipoDocumento = TipoDocumentoFornecedor.Cnpj;
      } else {
        this._tipoDocumento = TipoDocumentoFornecedor.Cpf;
      }
    }
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idPessoaJuridica = +params['idPessoaJuridica'];
        if (this.idPessoaJuridica) {
          this.obterPessoaJuridica();
        } else { this.blockUI.stop(); }
      });
  }

  private obterPessoaJuridica() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.obterPorId(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.preencherFormulario(response);
            this.pessoaJuridica = response;
            if (this.pessoaJuridica.atividades) { this.atividades = this.pessoaJuridica.atividades; }
            this.blockUI.stop();
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private construirFormulario() {
    const perfil: PerfilUsuario = this.autenticacaoService.perfil();
    this.form = this.fb.group({
      idPessoaJuridica: [0],
      cnpj: ['', Validators.compose([Validators.required, CustomValidators.cnpj])],
      razaoSocial: ['', Validators.required],
      idNaturezaJuridica: [null],
      nomeFantasia: [''],
      inscricaoEstadual: [''],
      inscricaoMunicipal: [''],
      tipoCadastro: [''],
      capitalSocial: [null],
      capitalIntegralizado: [null],
      dataIntegralizacao: [''],
      pastaIntegracao: [''],
      patrimonioLiquido: [null],
      perfilTributario: [''],
      optanteSimplesNacional: [''],
      observacao: [''],
      imagens: [new Array<Arquivo>()],
      porte: [''],
      setor: [''],
      numeroFuncionarios: [null],
      homePage: [''],
      filial: ['', Validators.required],
      dataCadastro: [''],
      dataValidade: [''],
      logo: [''],
      situacao: [''],
      assinaturaEletronica: [''],
      idPessoaJuridicaMatriz: [null],
      cnaes: [''],
      cnaeSelecionado: [null],
      atividades: [''],
      tipoAprovacao: [TipoAprovacao.Departamento],
      utilizaPreAprovacaoFornecedor: [false],
      aprovarRequisicoesAutomatico: [true],
      habilitarModuloCotacao: [false],
      utilizaSolicitacaoCompra: [false],
      integrarApiPedidos: [false],
      integracaoSapHabilitada: [false],
      bloquearRequisicaoPedido: [false],
      parametrosIntegracaoSapHabilitado: [false],
      idUsuarioPrincipal: [null],
      codigoFilialEmpresa: [''],
      contato: ['', Validators.required],
      telefone: ['', [Validators.maxLength(20), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      enderecos: [new Array<Endereco>(), Validators.required],
    });

    if (perfil === PerfilUsuario.Administrador) {
      this.form.controls.idUsuarioPrincipal.setValidators([Validators.required]);
      this.form.controls.idUsuarioPrincipal.updateValueAndValidity();
    }
  }

  private preencherFormulario(pessoaJuridica: PessoaJuridica) {
    if (pessoaJuridica.dataIntegralizacao) {
      pessoaJuridica.dataIntegralizacao = new Date(pessoaJuridica.dataIntegralizacao)
        .toISOString()
        .substring(0, 10);
    }
    if (pessoaJuridica.dataCadastro) {
      pessoaJuridica.dataCadastro = new Date(pessoaJuridica.dataCadastro)
        .toISOString()
        .substring(0, 10);
    }
    if (pessoaJuridica.dataValidade) {
      pessoaJuridica.dataValidade = new Date(pessoaJuridica.dataValidade)
        .toISOString()
        .substring(0, 10);
    }

    this.form.patchValue(pessoaJuridica);

    if (PerfilUsuario.Administrador !== this.autenticacaoService.perfil()) {
      this.form.controls.cnpj.disable();
      this.form.controls.razaoSocial.disable();
    }

    if (pessoaJuridica.cnpj.length > 14) {
      this._tipoDocumento = TipoDocumentoFornecedor.Cnpj;
    } else {
      this._tipoDocumento = TipoDocumentoFornecedor.Cpf;
    }

    this.form.controls.cnpj.setValidators(
      Validators.compose([Validators.required, CustomValidators.cpfCnpj]),
    );
    this.form.controls.cnpj.updateValueAndValidity();

    this.logo = pessoaJuridica.logo;
  }

  private formularioValido(): boolean {
    if (this.form.controls.cnpj.invalid && this.form.controls.cnpj.errors.invalidCnpj) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.INVALID_CNPJ);
      return false;
    }
    if (
      this.form.controls.enderecos.invalid ||
      this.form.value.enderecos.length === 0 ||
      null == this.form.value.enderecos
    ) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    } else if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }

  private inserir(pessoaJuridica: PessoaJuridica) {
    this.pessoaJuridicaService.inserir(pessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/fornecedores/transportadoras/']);
            this.toastr.success('Cadastro da empresa realizado.');
          }
          this.blockUI.stop();
        },
        (error) => {
          if (error.error === 'Existe uma empresa cadastrada com o mesmo CNPJ') {
            this.toastr.error(this.translationLibrary.translations.ALERTS.CNPJ_ALREADY_IN_USE);
          } else { this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR); }
          this.blockUI.stop();
        },
      );
  }

  private alterar(pessoaJuridica: PessoaJuridica) {
    this.pessoaJuridicaService.alterar(pessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.blockUI.stop();
          this.toastr.success('Cadastro da empresa atualizado.');
        },
        (error) => {
          if (error.error === 'Existe uma empresa cadastrada com o mesmo CNPJ') {
            this.toastr.warning(this.translationLibrary.translations.ALERTS.CNPJ_ALREADY_IN_USE);
          } else { this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR); }
          this.blockUI.stop();
        },
      );
  }

  private subUsuario() {
    this.usuariosLoading = true;
    this.usuarios$ = this.usuarioService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.usuariosLoading = false)),
    );
  }

  private subNaturezaJuridica() {
    this.naturezasJuridicasLoading = true;
    this.naturezasJuridicas$ = this.naturezaJuridicaService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.naturezasJuridicasLoading = false)),
    );
  }

  private subEmpresas() {
    this.empresasLoading = true;
    this.empresas$ = this.pessoaJuridicaService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.empresasLoading = false)),
    );
  }
}
