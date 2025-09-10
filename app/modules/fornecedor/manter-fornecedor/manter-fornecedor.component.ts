import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent, ModalConfirmacaoExclusao } from '@shared/components';
import {
  // tslint:disable-next-line: max-line-length
  CategoriaFornecimento, CustomTableColumn, CustomTableColumnType, CustomTableSettings, FornecedorInteressado, FornecedorTermoPesquisa, GrupoContas, Ordenacao, OrigemFornecedor, PendenciasFornecedor, PerfilUsuario, Permissao, PessoaFisica, PessoaJuridica, PlanoAcaoFornecedor, Situacao, SituacaoUsuario, SituacaoValidacaoDocumentoFornecedor, SituacaoVisitaTecnica, SolicitacaoDocumentoFornecedorArquivo, SolicitacaoDocumentoFornecedorValidacao, StatusFornecedor, StatusFornecedorLabel, StatusPendenciaFornecedor, StatusPlanoAcaoFornecedor, StatusSolicitacaoDocumentoFornecedor, TermoPesquisa, TipoDocumentoFornecedor, Usuario, VisitaTecnica
} from '@shared/models';
import { SolicitacaoDocumentoFornecedorValidacaoDto } from '@shared/models/dto/solicitacao-documento-fornecedor-validacao-dto';
import { HistoricoDeAceiteDeTermo } from '@shared/models/historico-de-aceite-de-termo';
import {
  // tslint:disable-next-line: max-line-length
  ArquivoService, AutenticacaoService, CategoriaFornecimentoService, CategoriaProdutoService, ConfiguracaoTermosBoasPraticasService, FornecedorService, GrupoContasService, PendenciasFornecedorService, PessoaJuridicaService, SolicitacaoDocumentoFornecedorArquivoService, TermoPesquisaService, TranslationLibraryService, VisitaTecnicaService
} from '@shared/providers';
import { PlanoAcaoFornecedorService } from '@shared/providers/plano-acao-fornecedor.service';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { UsuarioService } from '../../../shared/providers/usuario.service';
import { EnviarCartaResponsabilidadeFornecedorComponent } from '../enviar-carta-responsabilidade-fornecedor/enviar-carta-responsabilidade-fornecedor.component';
import { HistoricoSolicitacaoDocumentoFornecedorArquivoComponent } from '../historico-solicitacao-documento-fornecedor-arquivo/historico-solicitacao-documento-fornecedor-arquivo.component';
import { ModalMotivoComponent } from '../modal-motivo/modal-motivo.component';
import { ManterPendenciasFornecedorComponent } from '../pendencia-fornecedor/manter-pendencias-fornecedor/manter-pendencias-fornecedor.component';
import { ManterVisitaTecnicaComponent } from '../visita-tecnica/manter-visita-tecnica/manter-visita-tecnica.component';
import { TipoPessoa } from './../../../shared/models/enums/tipo-pessoa';
import { ManterPlanoAcaoFornecedorComponent } from './../manter-plano-acao-fornecedor/manter-plano-acao-fornecedor.component';
import { HistoricoCartasResponsabilidadeComponent } from './historico-cartas-responsabilidade/historico-cartas-responsabilidade.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-zmanter-fornecedor',
  templateUrl: './manter-fornecedor.component.html',
  styleUrls: ['./manter-fornecedor.component.scss'],
})
export class ManterFornecedorComponent extends Unsubscriber implements OnInit, OnDestroy {
  get idTenantAtual() {
    return this._idTenantAtual;
  }
  get flagPermitirExibirUsuarios() {
    return this._flagPermitirExibirUsuarios;
  }
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(HistoricoCartasResponsabilidadeComponent)
  historicoCartasResponsabilidade: HistoricoCartasResponsabilidadeComponent;

  @Input() historicoDeAceitesDeTermos: HistoricoDeAceiteDeTermo[];

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

  maskCpf = [
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    '.',
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    '.',
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    '-',
    /[0-9]/,
    /[0-9]/,
  ];

  idFornecedor: number;
  form: FormGroup;
  habilitarInclusao: boolean;
  SituacaoVisitaTecnica = SituacaoVisitaTecnica;
  perfilUsuario = this.authService.perfil();
  statusFornecedor = StatusFornecedor;
  statusFornecedorLabel = StatusFornecedorLabel;

  habilitarPlanoDeAcoes: boolean = false;
  habilitarVisitaTecnica: boolean = false;

  categoriasFornecimento = new Array<CategoriaFornecimento>();
  visitasTecnicas: Array<VisitaTecnica>;
  settingsTermoPesquisa: CustomTableSettings;
  gruposContas: Array<GrupoContas>;
  termosPesquisa: Array<TermoPesquisa>;
  fornecedorTermosPesquisa = new Array<FornecedorTermoPesquisa>();
  termosPesquisaSelecionados = new Array<FornecedorTermoPesquisa>();
  Situacao = Situacao;
  termoPesquisaFormulario: TermoPesquisa;
  permitirExibirDadosErp = false;
  itensPorPaginaTermoPesquisa: number = 5;
  paginaTermoPesquisa: number = 1;
  totalPaginasTermoPesquisa: number = 0;

  fornecedor: FornecedorInteressado;

  rede: string;

  StatusFornecedor = StatusFornecedor;

  habilitarPendenciaFornecedor: boolean = false;
  pendenciasFornecedor: Array<PendenciasFornecedor>;

  solicitacaoDocumentosFornecedorArquivos: Array<SolicitacaoDocumentoFornecedorArquivo>;
  StatusSolicitacaoDocumento: typeof StatusSolicitacaoDocumentoFornecedor =
    StatusSolicitacaoDocumentoFornecedor;

  enumSituacaoValidacao = SituacaoValidacaoDocumentoFornecedor;

  tabAtiva: string;

  formGestaoUsuario: FormGroup;
  usuarios$: Observable<Array<Usuario>>;
  usuariosLoading: boolean;
  pessoaJuridica: PessoaJuridica;

  TipoDocumentoFornecedor = TipoDocumentoFornecedor;
  tipoDocumentoSelecionado: TipoDocumentoFornecedor;
  // #endregion

  // #region Usuario
  usuario: Usuario;
  usuarioNaoExiste: boolean;
  buscaDeUsuarioRealizada: boolean;

  //#endregion

  // #region Planos de Ação

  itensPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'IdPlanoAcaoFornecedor';
  ordenacao: Ordenacao = Ordenacao.DESC;

  StatusPlanoAcaoFornecedor = StatusPlanoAcaoFornecedor;

  planos: Array<PlanoAcaoFornecedor>;

  habilitarBtnAlterarUsuario: boolean = true;
  habilitarBtnAtualizarUsuario: boolean = false;
  private paramsSub: Subscription;
  private _idTenantAtual: number;

  private usuarioLogado: Usuario;
  //#endregion

  //#region Aba Usuários
  private _flagPermitirExibirUsuarios: boolean;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private visitaTecnicaService: VisitaTecnicaService,
    private authService: AutenticacaoService,
    private fornecedorService: FornecedorService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private categoriaProdutoService: CategoriaProdutoService,
    private planoAcaoFornecedorService: PlanoAcaoFornecedorService,
    private pendenciasFornecedorService: PendenciasFornecedorService,
    private datePipe: DatePipe,
    private configuracaoTermosBoasPraticasService: ConfiguracaoTermosBoasPraticasService,
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private arquivoService: ArquivoService,
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private grupoContasService: GrupoContasService,
    private termoPesquisaService: TermoPesquisaService,
  ) {
    super();
  }

  ngOnInit() {
    this.usuarioLogado = this.authService.usuario();
    this._idTenantAtual = this.obtemTenantAtual();
    this._flagPermitirExibirUsuarios = this.permitirExibirUsuarios();
    this.contruirFormulario();
    this.contruirFormularioGestaoUsuarios();
    this.obterParametros();
    this.selectTab();
    this.construirTableTermoPesquisa();
  }

  ngOnDestroy() {
    if (this.paramsSub) { this.paramsSub.unsubscribe(); }
  }

  obterCategoriasFornecimento() {
    this.categoriaFornecimentoService.obter().subscribe(
      (response) => {
        if (response) {
          this.categoriasFornecimento = response;
          this.categoriasFornecimento.push(
            Object.assign({}, new CategoriaFornecimento(0, 'Outras', 'Outras', this._idTenantAtual)),
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

  obtemTenantAtual() {
    const idTenant = this.authService.usuario().permissaoAtual.idTenant;
    return idTenant;
  }

  solicitarPersistencia() {
    if (!this.idFornecedor) {
      this.salvar();
    } else {
      this.alterar(this.obterFornecedorInteressado());
    }
  }

  cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  buscarFornecedorCnpj() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.tipoDocumentoSelecionado) {
      if (this.form.controls.cnpj.valid) {
        const cnpj = this.form.value.cnpj;
        this.fornecedorService.obterPorCnpj(cnpj).subscribe(
          (response) => {
            this.blockUI.stop();
            this.tratarFornecedor(response[0]);
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
      } else {
        this.blockUI.stop();
        if (this.form.controls.cnpj.errors.invalidCpf) {
          this.toastr.warning('CPF inválido');
        } else {
          this.toastr.warning(this.translationLibrary.translations.ALERTS.INVALID_CNPJ);
        }
      }
    } else {
      this.blockUI.stop();
      this.toastr.warning('Por favor selecione um tipo de documento');
    }
  }

  abrirModalDeEnvioDeCartaDeResponsabilidadeFornecedor() {
    const modalRef = this.modalService.open(EnviarCartaResponsabilidadeFornecedorComponent, {
      centered: true,
    });
    modalRef.componentInstance.fornecedor = this.fornecedor;
    modalRef.result.then((result) => {
      this.historicoCartasResponsabilidade.obterHistoricoCartasDeResponsabilidade();
    });
  }

  onChangeTipoDocumentoFornecedor() {
    if (this.tipoDocumentoSelecionado === TipoDocumentoFornecedor.Cpf) {
      this.form.controls.cnpj.setValidators(
        Validators.compose([Validators.required, CustomValidators.cpf]),
      );
    } else {
      this.form.controls.cnpj.setValidators(
        Validators.compose([Validators.required, CustomValidators.cnpj]),
      );
    }
    this.form.controls.cnpj.updateValueAndValidity();
  }

  convidarFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.convidarFornecedor(this.fornecedor).subscribe(
      (response) => {
        if (response) {
          this.obterParametros();
        }

        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  // #region adicionar a rede local
  solicitarAdicaoRedeLocal() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Tem certeza que deseja adicionar o fornecedor aos seus fornecedores?';
    modalRef.result.then((result) => {
      if (result) { this.adicionarRedeLocal(); }
    });
  }

  buscarUsuario() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (
      this.form.controls.emailUsuario.valid &&
      !this.isNullOrWhitespace(this.form.controls.emailUsuario.value)
    ) {
      const email = this.form.value.emailUsuario;

      this.usuarioService.obterPorEmail(email).subscribe(
        (response) => {
          this.blockUI.stop();
          this.tratarUsuario(response);
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.blockUI.stop();
      this.toastr.warning('Verifique o campo Email');
    }
  }

  buscarUsuarioFormGestaoUsuario() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (
      this.formGestaoUsuario.controls.emailUsuario.valid &&
      !this.isNullOrWhitespace(this.formGestaoUsuario.controls.emailUsuario.value)
    ) {
      const email = this.formGestaoUsuario.value.emailUsuario;

      this.usuarioService.obterPorEmail(email).subscribe(
        (response) => {
          this.blockUI.stop();
          this.tratarUsuario(response);
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.blockUI.stop();
      this.toastr.warning('Verifique o campo Email');
    }
  }

  isNullOrWhitespace(input) {
    const a = !input;
    const b = !input.trim();
    return a || b;
  }

  // #endregion

  // #region Categorias

  atualizarCategoriasFornecimento() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.idFornecedor && this.form.controls.categoriasFornecimento.valid) {
      const categoriaOutrasRemovida: boolean = this.verificaRemocaoCategoriaOutras();
      const categoriasFornecimento = this.categoriasFornecimentoSemOutras();

      this.fornecedorService
        .atualizarCategoriasFornecimento(
          this.idFornecedor,
          categoriasFornecimento,
          categoriaOutrasRemovida,
        )
        .subscribe(
          (response) => {
            if (categoriaOutrasRemovida) {
              this.fornecedor.possuiCategoriaFornecimentoInteresse = false;
            }
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }
  //#endregion

  // #region Historico De AceiteDeTermos
  solicitarHistoricoDeAceiteDeTermos() {
    const collapse = document.getElementById('collapseTermoBoasPraticas').className;
    if (collapse === 'collapse') {
      this.configuracaoTermosBoasPraticasService
        .obterHistoricoDeAceitesParaCliente(this.fornecedor.idFornecedor, this.fornecedor.idTenant)
        .subscribe(
          (result) => {
            if (result.length > 0) { this.historicoDeAceitesDeTermos = result; } else { this.historicoDeAceitesDeTermos = null; }
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  obterDescricao(aceitouTermo: boolean) {
    if (aceitouTermo) { return 'Leu e aceitou os termos de boas práticas'; } else { return 'Não está de acordo com os termos de boas práticas ao fornecedor'; }
  }
  // #endregion

  // #region Documentos
  obterDocumentos() {
    if (
      this.solicitacaoDocumentosFornecedorArquivos === undefined &&
      this.fornecedor.idPessoaJuridicaFornecedor
    ) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      if (this.fornecedor.idPessoaJuridicaFornecedor) {
        const idPessoaJuridicaHoldingPai =
          this.usuarioLogado.permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai;
        this.solicitacaoDocumentoFornecedorArquivoService
          .obterDocumentos(this.fornecedor.idPessoaJuridicaFornecedor)
          .subscribe(
            (response) => {
              this.solicitacaoDocumentosFornecedorArquivos = response;
              this.blockUI.stop();
            },
            (error) => {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              this.blockUI.stop();
            },
          );
      }
    }
  }

  obterCor(solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo) {
    if (solicitacaoDocumentoFornecedorArquivo.dataVencimento != null) {
      const validadeEmDias = this.obterValidadeEmDias(
        solicitacaoDocumentoFornecedorArquivo.dataVencimento,
      );
      if (validadeEmDias < 16) { return { color: 'red' }; }

      if (validadeEmDias >= 16 && validadeEmDias <= 30) { return { color: 'yellow' }; }

      return { color: 'black' };
    }
  }

  formatarData(data: Date): string {
    if (data) {
      return this.datePipe.transform(data, 'dd/MM/yyyy');
    }

    return null;
  }

  abrirHistoricoDeArquivo(
    solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo,
  ) {
    const modalRef = this.modalService.open(HistoricoSolicitacaoDocumentoFornecedorArquivoComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.solicitacaoDocumentoFornecedorArquivo =
      solicitacaoDocumentoFornecedorArquivo;
  }

  baixarArquivo(solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo) {
    if (solicitacaoDocumentoFornecedorArquivo.arquivo) {
      const nomeDoArquivo =
        solicitacaoDocumentoFornecedorArquivo.solicitacaoDocumentoFornecedor.documentoFornecedor.descricaoDocumento +
        solicitacaoDocumentoFornecedorArquivo.arquivo.extensao;

      this.arquivoService.downloadFile(solicitacaoDocumentoFornecedorArquivo.arquivo.idArquivo, nomeDoArquivo).pipe(takeUntil(this.unsubscribe)).subscribe();
    } else {
      this.tratarArquivoNaoEnviado();
    }
  }

  solicitarAlteracaoValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
  ) {
    if (arquivo.idSolicitacaoDocumentoFornecedorArquivo) {
      if (
        !arquivo.validacaoArquivo ||
        arquivo.validacaoArquivo.situacaoValidacaoArquivo === this.enumSituacaoValidacao.Pendente
      ) {
        if (situacao === SituacaoValidacaoDocumentoFornecedor.Valido) {
          const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
          modalRef.componentInstance.confirmacao =
            'Tem certeza que deseja ' +
            (situacao === this.enumSituacaoValidacao.Valido ? 'validar' : 'invalidar') +
            ' esse documento?';
          modalRef.result.then(
            (result) => {
              if (result) {
                if (arquivo.validacaoArquivo) { this.alterarValidacao(arquivo, situacao); } else { this.inserirValidacao(arquivo, situacao); }
              }
            },
            (reason) => { },
          );
        } else if (situacao === SituacaoValidacaoDocumentoFornecedor.Invalido) {
          this.showModalMotivoRecusa(arquivo, situacao);
        }
      }
    } else { this.tratarArquivoNaoEnviado(); }
  }

  //#endregion

  // #region Pendências Fornecedor
  ativaGerarPendencia() {
    const modalRef = this.modalService.open(ManterPendenciasFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.pendenciaForm.controls.idFornecedor.setValue(this.idFornecedor);
    modalRef.componentInstance.estaInserindoPendencia = true;

    modalRef.result.then((result) => {
      this.obterPendenciasFornecedor();
    });
  }
  // #endregion

  //#region Visita Tecnica

  realizarAgendamento() {
    const modalRef = this.modalService.open(ManterVisitaTecnicaComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.form.controls.idFornecedorVisitaTecnica.setValue(this.idFornecedor);

    modalRef.result.then((result) => {
      if (result) {
        this.visitasTecnicas.push(result);
      }
    });
  }

  editarVisitaTecnica(visitaTecnica: VisitaTecnica) {
    const modalRef = this.modalService.open(ManterVisitaTecnicaComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.form.patchValue(visitaTecnica);

    modalRef.result.then((result) => {
      if (result) {
        const index = this.visitasTecnicas.findIndex(
          (obj) => obj.idVisitaTecnica === result.idVisitaTecnica,
        );
        this.visitasTecnicas.splice(index, 1, result);
      }
    });
  }

  solicitarExclusaoVisitaTecnica(visitaTecnica: VisitaTecnica) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.deletarVisitaTecnica(visitaTecnica.idVisitaTecnica),
        (reason) => { },
      );
  }

  deletarVisitaTecnica(idVisitaTecnica: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.visitaTecnicaService.deletar(idVisitaTecnica).subscribe(
      (response) => {
        this.tratarDelecaoVisitaTecnica(idVisitaTecnica);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  realizarVisitaTecnica(idVisitaTecnica) {
    this.router.navigate(['/fornecedores/local/visitatecnica/', idVisitaTecnica], {
      relativeTo: this.route,
    });
  }

  exibirPlanosAcoes() {
    if (!this.planos) {
      this.obterPlanosAcoes();
    }
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterPlanosAcoes();
  }

  abrirModalDePlanoDeAcao(plano: PlanoAcaoFornecedor = null) {
    const modalRef = this.modalService.open(ManterPlanoAcaoFornecedorComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.fornecedor = this.fornecedor;

    if (plano != null) {
      modalRef.componentInstance.planoAcaoFornecedor = plano;
    }

    modalRef.result.then((result) => {
      this.obterPlanosAcoes();
    });
  }

  // #endregion

  selectTab(aba?: string) {
    if (!aba) { this.tabAtiva = 'dados-gerais'; } else { this.tabAtiva = aba; }
  }
  permiteAlterarUsuarioPrincipal() {
    this.formGestaoUsuario.enable();
    this.habilitarBtnAlterarUsuario = false;
  }

  solicitarAtualizarUsuario() {
    if (this.usuarioNaoExiste) {
      if (this.formGestaoUsuario.valid) {
        const usuario = this.criarUsuario(this.formGestaoUsuario.value);
        this.inserirNovoUsuario(usuario);
      } else {
        this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      }
    } else {
      this.atualizarUsuarioPrincipal();
    }
  }
  // #endregion  Usuário Principal
  // #endregion

  //#region Dados Erp
  exibirDadosErp() {
    if (!this.permitirExibirDadosErp) {
      this.permitirExibirDadosErp = true;
      this.obterFornecedorTermosPesquisa();
      this.obterGruposContas();
      this.obterTermosPesquisa();
    }
  }

  alterarCodigoFornecedor() {
    this.fornecedorService.alterarCodigoFornecedor(this.idFornecedor, this.form.value).subscribe(
      (response) => { },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      },
    );
  }

  alterarFornecedorGrupoContas() {
    const grupoContas = this.form.getRawValue().grupoContas;
    this.fornecedorService
      .alterarFornecedorGrupoContas(this.idFornecedor, grupoContas ? grupoContas.idGrupoContas : 0)
      .subscribe(
        (response) => { },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  incluirTermoPesquisa() {
    if (this.termoJaInserido()) {
      this.toastr.warning('Termo de pesquisa já registrado');
      return;
    }

    const fornecedorTermoPesquisa = new FornecedorTermoPesquisa(
      this.idFornecedor,
      this.termoPesquisaFormulario.idTermoPesquisa,
      Situacao.Ativo,
    );

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.inserirTermoPesquisa(fornecedorTermoPesquisa).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.obterFornecedorTermosPesquisa();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  termoJaInserido() {
    return this.fornecedorTermosPesquisa.find(
      (ftp) => ftp.idTermoPesquisa === this.termoPesquisaFormulario.idTermoPesquisa,
    );
  }

  solicitarExclusaoTermoPesquisa() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluirTermoPesquisa(),
        (reason) => { },
      );
  }

  alterarSituacaoTermoPesquisa(situacao: Situacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .alterarSituacaoTermoPesquisaBatch(this.termosPesquisaSelecionados, situacao)
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.paginaTermoPesquisa = 1;
          this.obterFornecedorTermosPesquisa();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  selecaoTermoPesquisa(termosPesquisa: Array<FornecedorTermoPesquisa>) {
    this.termosPesquisaSelecionados = termosPesquisa;
  }

  paginacaoTermosPesquisa(event) {
    this.paginaTermoPesquisa = event.page;
    this.itensPorPaginaTermoPesquisa = event.recordsPerPage;
    this.obterFornecedorTermosPesquisa();
  }

  permitirExibirUsuarios(): boolean {
    const perfilUsuarioLogado = this.authService.usuario().permissaoAtual.perfil;
    const perfisComPermissao = [
      PerfilUsuario.Administrador,
      PerfilUsuario.Gestor,
      PerfilUsuario.GestorDeFornecedores,
    ];

    if (perfisComPermissao.includes(perfilUsuarioLogado)) {
      return true;
    }

    return false;
  }
  //#endregion

  podeAlterarStatusHomologacao(): boolean {
    return (
      (this.usuarioLogado &&
        this.usuarioLogado.permissaoAtual.pessoaJuridica.isEmpresaCadastradora) ||
      (this.usuarioLogado &&
        !this.usuarioLogado.permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai)
    );
  }

  showModalMotivoRecusa(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
  ) {
    const modalRef = this.modalService.open(ModalMotivoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalRef.componentInstance.nomeDoc = arquivo.documentoFornecedor.descricaoDocumento;

    modalRef.result.then(
      (result) => {
        if (result) {
          if (arquivo.validacaoArquivo) { this.alterarValidacao(arquivo, situacao); } else { this.inserirValidacao(arquivo, situacao, result); }
        }
      },
      (reason) => { },
    );
  }

  private obterPermissoes() {
    const usuario = this.authService.usuario();
    if (
      [PerfilUsuario.Administrador, PerfilUsuario.GestorDeFornecedores].includes(
        usuario.permissaoAtual.perfil,
      ) &&
      this.rede === 'local'
    ) {
      this.habilitarPlanoDeAcoes = true;
    }

    if (
      [PerfilUsuario.Administrador, PerfilUsuario.GestorDeFornecedores].includes(
        usuario.permissaoAtual.perfil,
      ) &&
      this.rede === 'local'
    ) {
      this.habilitarVisitaTecnica = true;
    }

    if (
      [PerfilUsuario.Administrador, PerfilUsuario.GestorDeFornecedores].includes(
        usuario.permissaoAtual.perfil,
      ) &&
      this.rede === 'local'
    ) {
      this.habilitarPendenciaFornecedor = true;
    }
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.idFornecedor = params['idFornecedor'];
      this.rede = params['tipo'];
      if (this.idFornecedor) {
        this.obterFornecedor();
        this.obterVisitasTecnicas();
        this.obterPlanosAcoes();
        this.obterPermissoes();
        this.obterPendenciasFornecedor();
      }
      this.obterCategoriasFornecimento();
    });
  }

  private obterFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.obterPorId(this.idFornecedor).subscribe(
      (response) => {
        if (response) {
          this.fornecedor = response;
          if (this.fornecedor.possuiCategoriaFornecimentoInteresse) {
            this.fornecedor.categoriasFornecimento.push(
              Object.assign(
                {},
                new CategoriaFornecimento(0, 'Outras', 'Outras', this._idTenantAtual),
              ),
            );
          }
          this.preencherFormulario(this.fornecedor);
          if (this.fornecedor.idPessoaJuridicaFornecedor) {
            this.obterPessoaJuridica();
          }
          if (response.cnpj.length > 14) {
            this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cnpj;
          } else {
            this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cpf;
          }
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private obterVisitasTecnicas() {
    if (
      this.authService.perfil() === PerfilUsuario.Administrador ||
      this.authService.perfil() === PerfilUsuario.GestorDeFornecedores
    ) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.visitaTecnicaService.obter(this.idFornecedor).subscribe(
        (response) => {
          if (response) {
            this.visitasTecnicas = response;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    }
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      cnpj: ['', Validators.compose([Validators.required, CustomValidators.cnpj])],
      razaoSocial: ['', Validators.required],
      nomeFantasia: [''],
      nomeUsuario: ['', Validators.required],
      emailUsuario: ['', Validators.required],
      categoriasFornecimento: [new Array<CategoriaFornecimento>(), Validators.required],
      status: [StatusFornecedor, Validators.required],
      idPessoaJuridicaFornecedor: [0],
      codigoFornecedor: [''],
      grupoContas: [null],
    });
  }

  private preencherFormulario(fornecedor: FornecedorInteressado) {
    this.form.patchValue(fornecedor);
  }

  private obterFornecedorInteressado(): FornecedorInteressado {
    const form = this.form.value;
    const fornecedorInteressado = new FornecedorInteressado(
      this.idFornecedor,
      this.fornecedor.idPessoaJuridicaFornecedor,
      this.fornecedor.idTenant,
      this.fornecedor.origem,
      this.fornecedor.idUsuario,
      this.fornecedor.cnpj,
      this.fornecedor.razaoSocial,
      this.fornecedor.nomeFantasia,
      this.fornecedor.aceitarTermo,
      form.status,
      null,
      form.codigoFornecedor,
    );
    return fornecedorInteressado;
  }

  private salvar() {
    if (this.buscaDeUsuarioRealizada || this.form.controls.nomeUsuario.valid) {
      if (this.form.valid) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        const form = this.form.value;
        // let fornecedorInteressado = this.obterFornecedorInteressado();

        const fornecedorInteressado = new FornecedorInteressado(
          0,
          0,
          0,
          OrigemFornecedor.Interessado,
          0,
          this.form.controls.cnpj.value,
          this.form.controls.razaoSocial.value,
          this.form.controls.nomeFantasia.value,
          true,
          StatusFornecedor.Novo,
          null,
          null,
        );

        // usuario
        if (this.usuario) {
          fornecedorInteressado.contato = this.usuario.pessoaFisica.nome;
          fornecedorInteressado.email = this.usuario.email;
          fornecedorInteressado.idUsuario = this.usuario.idUsuario;
        } else {
          fornecedorInteressado.contato = form.nomeUsuario;
          fornecedorInteressado.email = form.emailUsuario;
        }

        // categorias
        if (this.categoriasFornecimento && this.categoriasFornecimento.length) {
          fornecedorInteressado.categoriasFornecimento = this.form.value.categoriasFornecimento;
        }

        fornecedorInteressado.status = StatusFornecedor['Novo'];

        this.inserir(fornecedorInteressado);
        this.blockUI.stop();
      } else {
        this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      }
    } else {
      this.toastr.warning('Por favor confirme o usuário responsável clicando no botão de buscar');
    }
  }

  private inserir(fornecedorInteressado: FornecedorInteressado) {
    this.fornecedorService.inserir(fornecedorInteressado).subscribe(
      (response) => {
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.navegarFornecedor(response.idFornecedor);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private alterar(fornecedorInteressado: FornecedorInteressado) {
    if (this.form.value.status !== 0) {
      let statusHomologacaoAlterado = false;

      this.fornecedorService
        .obterPorId(fornecedorInteressado.idFornecedor)
        .subscribe((fornecedorAtual) => {
          const alterouStatusHomologacao = fornecedorAtual.status !== fornecedorInteressado.status;
          const verificaHomologadoComPendenciaOuHomologadoo =
            fornecedorInteressado.status === StatusFornecedor.Ativo ||
            fornecedorInteressado.status === StatusFornecedor.AtivoComPendencias;

          statusHomologacaoAlterado =
            verificaHomologadoComPendenciaOuHomologadoo && alterouStatusHomologacao;
        });

      this.fornecedorService.alterar(fornecedorInteressado).subscribe(
        (response) => {
          if (statusHomologacaoAlterado) {
            this.fornecedorService.enviarDocumentosParaEmail(fornecedorInteressado);
          }

          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private tratarFornecedor(fornecedor: FornecedorInteressado) {
    if (fornecedor) { this.fornecedorCadastrado(fornecedor); } else { this.fornecedorNaoCadastrado(); }
  }

  private fornecedorCadastrado(fornecedor: FornecedorInteressado) {
    this.preencherFormulario(fornecedor);
    this.fornecedor = fornecedor;
    this.idFornecedor = fornecedor.idFornecedor;
    const idTenant = this.authService.usuario().permissaoAtual.idTenant;

    if (fornecedor.idTenant !== idTenant) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
      modalRef.componentInstance.confirmacao = `Fornecedor já cadastrado. Para habilitar para sua empresa clique em "Adicionar a Meus Fornecedores"`;
      modalRef.componentInstance.confirmarLabel = 'none';
      modalRef.componentInstance.cancelarLabel = 'Fechar';
    } else {
      const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
      modalRef.componentInstance.confirmacao = `Fornecedor já se encontra em Meus Fornecedores`;
      modalRef.componentInstance.confirmarLabel = 'none';
      modalRef.componentInstance.cancelarLabel = 'Fechar';
      modalRef.result.then(() => {
        this.navegarFornecedor(this.idFornecedor);
      });
    }
  }

  private fornecedorNaoCadastrado() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Fornecedor não encontrado, deseja incluir novo?';
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then((result) => {
      if (result) { this.habilitarInclusao = true; }
    });
  }

  private navegarFornecedor(idFornecedor: number) {
    this.router.navigate(['../', idFornecedor], { relativeTo: this.route });
  }

  private adicionarRedeLocal() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.adicionarRedeLocal([this.fornecedor]).subscribe(
      (response) => {
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.navegarFornecedor(this.fornecedor.idFornecedor);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
  private obterUsuarioPrincipal() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.pessoaJuridica.idUsuarioPrincipal) {
      const idUsuarioPrincipal = this.pessoaJuridica.idUsuarioPrincipal;
      this.usuarioService.ObterPorIdSemPermissao(idUsuarioPrincipal).subscribe(
        (response) => {
          this.form.patchValue(this.fornecedor);
          this.form.patchValue({
            nomeUsuario: response.pessoaFisica.nome,
            emailUsuario: response.email,
          });

          this.formGestaoUsuario.patchValue({
            idUsuarioPrincipal: response.idUsuario,
            nomeUsuario: response.pessoaFisica.nome,
            emailUsuario: response.email,
          });
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.blockUI.stop();
    }
  }

  private tratarUsuario(usuario: Usuario) {
    if (!usuario) {
      this.usuarioNaoExistente();
    } else {
      this.usuarioExistente(usuario);
    }
  }

  private usuarioNaoExistente() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Usuário não encontrado, insira o nome do usuário para incluí-lo.';
    modalRef.result.then((result) => {
      if (result) {
        this.buscaDeUsuarioRealizada = true;
        this.usuarioNaoExiste = true;
        this.usuario = null;

        // this.habilitarBtnAlterarUsuario = false;
        this.formGestaoUsuario.patchValue({
          nomeUsuario: '',
        });
        this.habilitarBtnAtualizarUsuario = true;
      }
    });
  }

  private usuarioExistente(usuario: Usuario) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Já existe um usuário com esse endereço de e-mail, deseja utiliza-lo como responsável pelo fornecedor?';
    modalRef.result.then((result) => {
      if (result) {
        this.buscaDeUsuarioRealizada = true;
        this.usuario = usuario;
        this.usuarioNaoExiste = false;
        this.form.patchValue({
          nomeUsuario: usuario.pessoaFisica.nome,
          emailUsuario: usuario.email,
        });

        this.form.controls.nomeUsuario.disable();
        this.form.controls.emailUsuario.disable();

        // Usuario Principal
        if (this.pessoaJuridica) {
          this.habilitarBtnAtualizarUsuario = true;
          this.formGestaoUsuario.patchValue(this.pessoaJuridica);
          this.formGestaoUsuario.patchValue({
            idUsuarioPrincipal: usuario.idUsuario,
            nomeUsuario: usuario.pessoaFisica.nome,
            emailUsuario: usuario.email,
          });
          this.formGestaoUsuario.disable();
        }
        // End Usuario Principal
      }
    });
  }

  private construirTableTermoPesquisa() {
    this.settingsTermoPesquisa = new CustomTableSettings(
      [
        new CustomTableColumn('Descricao', 'termoPesquisa.descricao', CustomTableColumnType.text),
        new CustomTableColumn(
          'Situação',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          Situacao,
        ),
      ],
      'check',
    );
  }

  private verificaRemocaoCategoriaOutras() {
    if (
      this.fornecedor.possuiCategoriaFornecimentoInteresse &&
      !this.form.value.categoriasFornecimento.some(
        (categoria) => categoria.idCategoriaFornecimento === 0,
      )
    ) {
      return true;
    }

    return false;
  }

  private categoriasFornecimentoSemOutras() {
    return this.form.value.categoriasFornecimento.filter(
      (categoria) => categoria.idCategoriaFornecimento !== 0,
    );
  }

  private obterValidadeEmDias(dataVencimento: Date) {
    const diferenca = Math.abs(new Date(dataVencimento).getTime() - this.obterDataAtual().getTime());
    const diferencaEmDias = Math.ceil(diferenca / (1000 * 3600 * 24));
    return diferencaEmDias;
  }

  private obterDataAtual() {
    const data = new Date();
    this.datePipe.transform(data, 'dd/MM/yyyy');
    return data;
  }

  private inserirValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
    motivoRecusa?: string,
  ) {
    const solicitacaoDocumentoFornecedorValidacaoDto =
      this.montarSolicitacaoDocumentoFornecedorValidacao(arquivo, situacao, motivoRecusa);

    this.solicitacaoDocumentoFornecedorArquivoService
      .inserirValidacao(solicitacaoDocumentoFornecedorValidacaoDto)
      .subscribe(
        (response) => {
          arquivo.validacaoArquivo = response;
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  private montarSolicitacaoDocumentoFornecedorValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacaoValidacaoArquivo: SituacaoValidacaoDocumentoFornecedor,
    motivoRecusa: string,
  ): SolicitacaoDocumentoFornecedorValidacaoDto {
    const validacao = new SolicitacaoDocumentoFornecedorValidacao(
      0,
      arquivo.idSolicitacaoDocumentoFornecedorArquivo,
      situacaoValidacaoArquivo,
      this.authService.usuario().permissaoAtual.idTenant,
      motivoRecusa,
    );

    const solicitacaoDocumentoFornecedorValidacaoDto = new SolicitacaoDocumentoFornecedorValidacaoDto(
      validacao,
    );

    solicitacaoDocumentoFornecedorValidacaoDto.nomeDocumento =
      arquivo.documentoFornecedor.descricaoDocumento;
    solicitacaoDocumentoFornecedorValidacaoDto.razaoSocial = this.fornecedor.razaoSocial;
    solicitacaoDocumentoFornecedorValidacaoDto.idPessoaJuridicaFornecedor =
      this.fornecedor.idPessoaJuridicaFornecedor;

    return solicitacaoDocumentoFornecedorValidacaoDto;
  }
  private alterarValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
  ) {
    const validacao = new SolicitacaoDocumentoFornecedorValidacao(
      arquivo.validacaoArquivo.idSolicitacaoDocumentoFornecedorValidacao,
      arquivo.validacaoArquivo.idSolicitacaoDocumentoFornecedorArquivo,
      situacao,
      arquivo.validacaoArquivo.idTenant,
    );
    this.solicitacaoDocumentoFornecedorArquivoService.alterarValidacao(validacao).subscribe(
      (response) => {
        arquivo.validacaoArquivo.situacaoValidacaoArquivo = situacao;
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      },
    );
  }

  private tratarArquivoNaoEnviado() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Não foi possível realizar esta operação, aguardando envio do arquivo';
    modalRef.componentInstance.confirmarLabel = 'none';
    modalRef.componentInstance.cancelarLabel = 'Fechar';
  }

  private obterPendenciasFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pendenciasFornecedorService.ObterPorIdFornecedor(this.idFornecedor).subscribe(
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

  private tratarDelecaoVisitaTecnica(id: number) {
    this.visitasTecnicas = this.visitasTecnicas.filter((c) => c.idVisitaTecnica !== id);
  }

  private obterPlanosAcoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .listarPorIdFornecedor(
        this.itensPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        this.idFornecedor,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.planos = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.planos = new Array<PlanoAcaoFornecedor>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obterPessoaJuridica() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService
      .obterPorIdSemFiltroPermissao(this.fornecedor.idPessoaJuridicaFornecedor)
      .subscribe(
        (response) => {
          if (response) {
            this.pessoaJuridica = response;
            this.obterUsuarioPrincipal();
            this.blockUI.stop();
          }
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private contruirFormularioGestaoUsuarios() {
    this.formGestaoUsuario = this.fb.group({
      idPessoaJuridica: [0, Validators.required],
      idUsuarioPrincipal: [null, Validators.required],
      nomeUsuario: ['', Validators.required],
      emailUsuario: ['', Validators.required],
    });

    this.formGestaoUsuario.disable();
  }

  private criarUsuario(form): Usuario {
    return new Usuario(
      form.idUsuario,
      form.idPessoaFisica,
      SituacaoUsuario.Liberado,
      form.emailUsuario,
      form.dataInclusao,
      form.primeiroAcesso,
      null,
      form.telefone,
      form.ramal,
      form.celular,
      new PessoaFisica(
        form.idPessoa,
        form.codigoPessoa,
        TipoPessoa.PessoaFisica,
        form.cnd,
        form.idTenant,
        form.idPessoaFisica,
        form.nomeUsuario,
      ),
      new Array<Permissao>(),
    );
  }

  private atualizarUsuarioPrincipal() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.pessoaJuridica && this.formGestaoUsuario.controls.idUsuarioPrincipal.value) {
      const idUsuarioPrincipal = this.formGestaoUsuario.controls.idUsuarioPrincipal.value;
      this.pessoaJuridica.idUsuarioPrincipal = idUsuarioPrincipal;
      this.pessoaJuridicaService.alterar(this.pessoaJuridica).subscribe(
        (response) => {
          this.habilitarBtnAlterarUsuario = true;
          this.habilitarBtnAtualizarUsuario = false;
          this.formGestaoUsuario.disable();
          this.form.controls.nomeUsuario.enable();
          this.form.controls.emailUsuario.enable();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserirNovoUsuario(usuario: Usuario) {
    this.usuarioService.inserir(usuario).subscribe(
      (response) => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.USER_CREATION);
          this.formGestaoUsuario.patchValue({
            idUsuarioPrincipal: response.idUsuario,
            nomeUsuario: response.pessoaFisica.nome,
            emailUsuario: response.email,
          });
          this.atualizarUsuarioPrincipal();
          this.formGestaoUsuario.disable();
          this.habilitarBtnAlterarUsuario = true;
        }

        this.blockUI.stop();
      },
      (error) => {
        if (error.error === 'Existe um usuário com o mesmo email') {
          this.toastr.error(this.translationLibrary.translations.ALERTS.EMAIL_ALREADY_IN_USE);
        } else { this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR); }
        this.blockUI.stop();
      },
    );
  }

  private obterFornecedorTermosPesquisa() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .filtrarTermoPesquisa(
        this.itensPorPaginaTermoPesquisa,
        this.paginaTermoPesquisa,
        'ftp.IdFornecedorTermoPesquisa',
        Ordenacao.ASC,
        this.idFornecedor,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.fornecedorTermosPesquisa = response.itens;
            this.totalPaginasTermoPesquisa = response.numeroPaginas;
          } else {
            this.fornecedorTermosPesquisa = new Array<FornecedorTermoPesquisa>();
            this.totalPaginasTermoPesquisa = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obterGruposContas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.grupoContasService.obter().subscribe(
      (response) => {
        if (response) {
          this.gruposContas = response;
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private obterTermosPesquisa() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.termoPesquisaService.obter().subscribe(
      (response) => {
        if (response) {
          this.termosPesquisa = response;
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private excluirTermoPesquisa() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .deletarTermoPesquisaBatch(this.idFornecedor, this.termosPesquisaSelecionados)
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.paginaTermoPesquisa = 1;
          this.obterFornecedorTermosPesquisa();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
}
