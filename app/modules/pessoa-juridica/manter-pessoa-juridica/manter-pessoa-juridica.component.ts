import { formatDate, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent } from '@shared/components';
import { Arquivo, AtividadePessoa, Cnae, DomicilioBancario, Endereco, PendenciasFornecedor, PerfilTributario, PerfilUsuario, Pessoa, PessoaJuridica, PlanoAcaoFornecedor, PorteEmpresa, RespostaGestaoFornecedor, RespostaGestaoFornecedorComentario, ResultadoQuestionarioFornecedor, SituacaoPessoaJuridica, SituacaoQuestionarioFornecedor, StatusPendenciaFornecedor, StatusPlanoAcaoFornecedor, TipoAprovacao, TipoCadastroEmpresa, TipoDocumentoFornecedor, TipoPessoa, Usuario } from '@shared/models';
import { TipoEmpresa } from '@shared/models/enums/tipo-empresa';
import { ArquivoService, AutenticacaoService, EnderecoService, NaturezaJuridicaService, PendenciasFornecedorService, PessoaJuridicaService, PlanoAcaoFornecedorService, QuestionarioGestaoFornecedorService, ResultadoQuestionarioFornecedorService, TranslationLibraryService } from '@shared/providers';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { UsuarioService } from '../../../shared/providers/usuario.service';
import { SdkManterLogoComponent } from './../../../shared/components/sdk-manter-logo/sdk-manter-logo.component';
import { TipoEmpresaDisplay } from './../../../shared/models/enums/tipo-empresa';
import { RespostaMultiplaEscolhaFornecedor } from './../../../shared/models/resposta-multipla-escolha-fornecedor';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-pessoa-juridica',
  templateUrl: './manter-pessoa-juridica.component.html',
  styleUrls: ['./manter-pessoa-juridica.component.scss'],
})
export class ManterPessoaJuridicaComponent extends Unsubscriber implements OnInit {
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

  tipoEmpresa: TipoEmpresa;
  enumTipoEmpresa = TipoEmpresa;
  tipoEmpresaValues = Object.values(this.enumTipoEmpresa).filter((e) => typeof e === 'number');
  tipoEmpresaDisplay = TipoEmpresaDisplay;

  TipoDocumentoFornecedor = TipoDocumentoFornecedor;

  formsRespostas = new Array<FormGroup>();
  resultados: Array<ResultadoQuestionarioFornecedor>;
  enumSituacaoQuestionario = SituacaoQuestionarioFornecedor;
  idElementoQuestionario: string;
  usuarioLogado: Usuario;
  comentarios = new Array<string>();

  idEmpresaCadastradora: number;

  tabAtiva: string;

  usuarios$: Observable<Array<Usuario>>;
  usuariosLoading: boolean;

  naturezasJuridicas$: Observable<Array<Usuario>>;
  naturezasJuridicasLoading: boolean;

  empresaCadastradora: PessoaJuridica;
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
    private questionarioGestaoFornecedorService: QuestionarioGestaoFornecedorService,
    private resultadoQuestionarioFornecedorService: ResultadoQuestionarioFornecedorService,
    private planoAcaoFornecedorService: PlanoAcaoFornecedorService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
    private pendenciasFornecedorService: PendenciasFornecedorService,
    private modalService: NgbModal,
    private location: Location,
  ) {
    super();
    this.opcoesTipoCadastroEmpresa = Object.keys(this.enumTipoCadastroEmpresa).filter(Number);
    this.opcoesPorteEmpresa = Object.keys(this.enumPorteEmpresa).filter(Number);
    this.opcoesSituacaoPessoaJuridica = Object.keys(this.enumSituacaoPessoaJuridica).filter(Number);
    this.opcoesPerfilTributario = Object.keys(this.enumPerfilTributario).filter(Number);
  }

  permitiVisualizarUsuarios(): boolean {
    if (
      this.pessoaJuridica &&
      (this.perfilUsuario === this.enumPerfilUsuario.Administrador ||
        this.perfilUsuario === this.enumPerfilUsuario.Gestor)
    ) {
      return true;
    }

    return false;
  }

  selectTab(aba?: string) {
    if (!aba) { this.tabAtiva = 'dados-empresa'; } else { this.tabAtiva = aba; }
  }

  ngOnInit() {
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.perfilUsuario = this.autenticacaoService.perfil();
    this.autoFillAtividades();
    this.subListas();
    this.construirFormulario();
    this.obterParametros();
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

      pessoaJuridica.holding =
        this.tipoEmpresa === this.enumTipoEmpresa.HoldingEmpresarial ? true : false;

      if (this.idPessoaJuridica) { this.alterar(pessoaJuridica); } else { this.inserir(pessoaJuridica); }
    } else {
      this.blockUI.stop();
    }
  }

  voltar() {
    this.location.back();
  }

  exibirDocumentos(): boolean {
    const perfil = this.autenticacaoService.usuario().permissaoAtual.perfil;

    return perfil === PerfilUsuario.Fornecedor;
  }

  // #region Listas
  subListas() {
    this.subUsuario();
    this.subNaturezaJuridica();
  }

  usuarioCustomSearchFn(term: string, item: Usuario) {
    term = term.toLowerCase();
    return (
      item.email.toLowerCase().indexOf(term) > -1 ||
      item.pessoaFisica.nome.toLowerCase().indexOf(term) > -1
    );
  }
  obterEmpresaCadastradora() {
    const idPessoaJuridicaMatriz = this.form.value.idPessoaJuridicaMatriz;
    this.pessoaJuridicaService.obterPorIdSemFiltroPermissao(idPessoaJuridicaMatriz).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.empresaCadastradora = response;
            this.blockUI.stop();
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
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

  //#region Questionarios

  obterResultadosQuestionarios() {
    if (this.perfilUsuario === 3) {
      this.idElementoQuestionario = null;
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.resultadoQuestionarioFornecedorService.obter(this.idPessoaJuridica).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response) {
              this.resultados = response;
              this.blockUI.stop();
            }
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  mostrarQuestionario(id, index) {
    if (this.idElementoQuestionario !== id) {
      if (this.idElementoQuestionario) {
        document.getElementById(this.idElementoQuestionario).click();
      }
      this.idElementoQuestionario = id;
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      if (this.resultados[index].idResultadoQuestionarioFornecedor) {
        this.construirFormsRespostas(index);
        this.blockUI.stop();
      } else {
        this.construirFormsRespostasPendentes(index);
      }
    } else {
      this.idElementoQuestionario = null;
      this.formsRespostas = new Array<FormGroup>();
      this.comentarios = new Array<string>();
    }
  }

  salvarComentario(index) {
    const coment = new RespostaGestaoFornecedorComentario();
    coment.comentario = this.comentarios[index];
    coment.dataCriacao = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', 'pt-BR', '-0300');
    coment.idUsuarioAutor = this.autenticacaoService.usuario().idUsuario;
    coment.usuarioAutor = this.autenticacaoService.usuario();
    this.formsRespostas[index].controls.comentario.setValue(coment);
    this.comentarios[index] = '';
  }

  salvarResultado(index) {
    this.resultados[index].situacao = this.enumSituacaoQuestionario['Em Andamento'];
    if (this.resultados[index].idResultadoQuestionarioFornecedor) {
      this.alterarResultado(index);
    } else {
      this.adicionarResultado(index);
    }
  }

  finalizarResultado(index) {
    let formValido = true;
    this.formsRespostas.forEach((form) => {
      if (form.invalid || this.isNullOrWhitespace(form.controls.resposta.value)) {
        formValido = false;
      }
    });
    if (formValido) {
      this.resultados[index].situacao = this.enumSituacaoQuestionario.Respondido;
      if (this.resultados[index].idResultadoQuestionarioFornecedor) {
        this.alterarResultado(index);
      } else {
        this.adicionarResultado(index);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  adicionarResultado(index) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.copiarRespostas(index);
    this.resultadoQuestionarioFornecedorService.inserir(this.resultados[index]).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.tratarInclusaoQuestionario(response, index);
          this.redefinirFormsRespostas();
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        (error) => {
          this.resultados[index].situacao = this.enumSituacaoQuestionario.Pendente;
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  alterarResultado(index) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.copiarRespostas(index);
    this.resultadoQuestionarioFornecedorService.alterar(this.resultados[index]).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.redefinirFormsRespostas();
          if (this.resultados[index].situacao === this.enumSituacaoQuestionario.Respondido) {
            this.obterResultadoPorId(this.resultados[index].idResultadoQuestionarioFornecedor, index);
          }
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        (error) => {
          this.resultados[index].situacao = this.enumSituacaoQuestionario['Em Andamento'];
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  getInitials(nome: any) {
    let initials = nome.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }

  isNullOrWhitespace(input) {
    return !input || !(input.trim());
  }

  atualizarPlanoAcao(idPlanoAcao: number) {
    this.router.navigate(['./planoacao', idPlanoAcao], { relativeTo: this.route });
  }

  onKeyUpDocumento() {
    if (this.idPessoaJuridica) {
      if (this.form.controls.cnpj.value.length > 14) {
        this._tipoDocumento = TipoDocumentoFornecedor.Cnpj;
      } else {
        this._tipoDocumento = TipoDocumentoFornecedor.Cpf;
      }
    }
  }

  onChangeTipoEmpresa() {
    if (this.tipoEmpresa === this.enumTipoEmpresa.HoldingEmpresarial) {
      this.form.patchValue({
        holding: true,
        filial: false,
      });
    } else if (this.tipoEmpresa === this.enumTipoEmpresa.Convencional) {
      this.form.patchValue({
        holding: false,
      });
    } else {
      this.form.patchValue({
        holding: null,
      });
    }
  }

  empresaPrimeiroNivel(): boolean {
    return (
      (this.pessoaJuridica &&
        (!this.pessoaJuridica.idPessoaJuridicaMatriz ||
          this.pessoaJuridica.idPessoaJuridica === this.pessoaJuridica.idPessoaJuridicaMatriz)) ||
      !this.pessoaJuridica
    );
  }

  adicionarNovaEmpresa() {
    this.router.navigate(['../novo/'.concat(this.idPessoaJuridica.toString())], {
      relativeTo: this.route,
    });
  }

  auditar() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'PessoaJuridica';
    modalRef.componentInstance.idEntidade = this.idPessoaJuridica;
  }

  cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  adicionarLogo() {
    const modalRef = this.modalService.open(SdkManterLogoComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'modal-manter-logo',
    });
    modalRef.componentInstance.idPessoaJuridica = this.idPessoaJuridica;
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idPessoaJuridica = +params['idPessoaJuridica'];
        if (this.idPessoaJuridica) {
          this.obterPessoaJuridica();
          this.obterPlanosAcao();
        } else { this.blockUI.stop(); }
      });

    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idEmpresaCadastradora = +params['idEmpresaCadastradora'];
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
            this.obterPendenciasFornecedor();
            if (this.pessoaJuridica.atividades) { this.atividades = this.pessoaJuridica.atividades; }
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obterPlanosAcao() {
    if (this.perfilUsuario === 3) {
      this.planoAcaoFornecedorService
        .listarPorIdPessoaJuridica(this.idPessoaJuridica)
        .pipe(
          takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.planosAcao = response;
        });
    }
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
      filial: [''],
      dataCadastro: [''],
      dataValidade: [''],
      logo: [''],
      situacao: [''],
      assinaturaEletronica: [''],
      idPessoaJuridicaMatriz: [null],
      cnaes: [''],
      cnaeSelecionado: [null],
      atividades: [''],
      tipoAlcadaAprovacao: [null],
      tipoAprovacao: [TipoAprovacao.Departamento],
      modoAprovacao: [null],
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
      holding: [null],
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

    pessoaJuridica.holding = pessoaJuridica.holding ? pessoaJuridica.holding : false;

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

    this.obterEstruturaOrganizacional();

    if (pessoaJuridica.idPessoaJuridicaMatriz) { this.obterEmpresaCadastradora(); }
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

    if (
      (this.usuarioLogado.permissaoAtual.isSmarkets || !this.idEmpresaCadastradora) &&
      this.form.controls.holding == null
    ) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

  private inserir(pessoaJuridica: PessoaJuridica) {
    if (this.idEmpresaCadastradora) {
      pessoaJuridica.idPessoaJuridicaMatriz = this.idEmpresaCadastradora;
    }

    this.pessoaJuridicaService.inserir(pessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/empresas/', response.idPessoaJuridica]);
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

  private autoFillAtividades() {
    if (this.perfilUsuario !== PerfilUsuario.Fornecedor) { this.atividades.comprador = true; }
  }

  private construirFormsRespostas(index) {
    this.formsRespostas = new Array<FormGroup>();
    this.comentarios = new Array<string>();
    this.resultados[index].respostas.forEach((r) => {
      this.formsRespostas.push(
        this.fb.group({
          idRespostaGestaoFornecedor: r.idRespostaGestaoFornecedor,
          idResultadoQuestionarioFornecedor: r.idResultadoQuestionarioFornecedor,
          idQuestaoGestaoFornecedor: r.idQuestaoGestaoFornecedor,
          pergunta: r.pergunta,
          notaExplicativa: r.notaExplicativa,
          tipo: r.tipo,
          resposta: r.resposta,
          valor: r.valor,
          permiteComentario: r.permiteComentario,
          comentario: r.comentario,
          opcoes: new Array<RespostaMultiplaEscolhaFornecedor>(),
          categoriaQuestao: r.categoriaQuestao,
          peso: r.peso,
        }),
      );
      this.formsRespostas[this.formsRespostas.length - 1].controls.opcoes.setValue(r.opcoes);
      this.comentarios.push('');
    });
    if (this.resultados[index].situacao === this.enumSituacaoQuestionario.Respondido) {
      this.formsRespostas.forEach((form) => {
        form.controls.resposta.disable();
      });
    }
  }

  private construirFormsRespostasPendentes(index) {
    this.questionarioGestaoFornecedorService
      .obterPorId(this.resultados[index].idQuestionarioGestaoFornecedor)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.formsRespostas = new Array<FormGroup>();
          this.comentarios = new Array<string>();
          const questionario = response;
          questionario.questoes.forEach((q) => {
            this.comentarios.push('');
            this.formsRespostas.push(
              this.fb.group({
                idRespostaGestaoFornecedor: 0,
                idResultadoQuestionarioFornecedor: 0,
                idQuestaoGestaoFornecedor: q.idQuestaoGestaoFornecedor,
                pergunta: q.descricao,
                notaExplicativa: q.notaExplicativa,
                tipo: q.tipo,
                resposta: '',
                valor: null,
                permiteComentario: q.permiteComentario,
                comentario: null,
                opcoes: new Array<RespostaMultiplaEscolhaFornecedor>(),
                categoriaQuestao: q.categoriaQuestao,
                peso: q.peso,
              }),
            );
            this.formsRespostas[this.formsRespostas.length - 1].controls.opcoes.setValue(
              q.respostas,
            );
          });
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private copiarRespostas(index) {
    this.resultados[index].respostas = new Array<RespostaGestaoFornecedor>();
    this.formsRespostas.forEach((resposta) => {
      if (
        resposta.controls.tipo.value === 2 &&
        resposta.controls.resposta.value &&
        resposta.controls.resposta.value !== ''
      ) {
        const valorAux = resposta.controls.opcoes.value.find(
          (o) => o.descricao === resposta.controls.resposta.value,
        );
        resposta.controls.valor.setValue(valorAux.valor);
      }
      this.resultados[index].respostas.push(resposta.value);
    });
  }

  private tratarInclusaoQuestionario(resultadoIncluido: ResultadoQuestionarioFornecedor, index) {
    if (this.resultados[index].situacao === this.enumSituacaoQuestionario.Respondido) {
      this.formsRespostas.forEach((form) => {
        form.controls.resposta.disable();
      });
    }

    this.obterResultadoPorId(resultadoIncluido.idResultadoQuestionarioFornecedor, index);
  }

  private redefinirFormsRespostas() {
    document.getElementById(this.idElementoQuestionario).click();
    this.idElementoQuestionario = null;
    this.formsRespostas = new Array<FormGroup>();
    this.comentarios = new Array<string>();
  }

  private obterResultadoPorId(idResultado: number, index: number) {
    this.resultadoQuestionarioFornecedorService.obterPorId(idResultado).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) { this.resultados[index] = response; }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  //#endregion

  private obterPendenciasFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciasFornecedorService.obterPorIdPessoaJuridica(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.pendenciasFornecedor = response.filter(
              (r) => r.status !== StatusPendenciaFornecedor.Excluído,
            );
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obterEstruturaOrganizacional() {
    this.tipoEmpresa = this.form.controls.holding.value
      ? this.enumTipoEmpresa.HoldingEmpresarial
      : this.enumTipoEmpresa.Convencional;
  }
}
