import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import {
  Arquivo,
  PerfilTributario,
  PerfilUsuario, PessoaJuridica,
  PorteEmpresa,
  TipoAprovacao,
  TipoCadastroEmpresa,
  TipoDocumentoFornecedor,
  TipoPessoa,
  Usuario
} from '@shared/models';
import { DadosGeraisDto } from '@shared/models/dto/dados-gerais-dto';
import {
  ArquivoService,
  AutenticacaoService,
  FornecedorService,
  NaturezaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { SdkUsuarioPrincipalModalComponent } from './../../../shared/components/sdk-usuario-principal-modal/sdk-usuario-principal-modal.component';
import { FornecedorInteressado } from './../../../shared/models/fornecedor-interessado';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dados-gerais',
  templateUrl: './dados-gerais.component.html',
  styleUrls: ['./dados-gerais.component.scss'],
})
export class DadosGeraisComponent extends Unsubscriber implements OnInit {
  get isTenantMaster(): boolean {
    return this._isTenantMaster;
  }

  get showBtnSalvar(): boolean {
    return (
      (this.isTenantMaster ||
        !this.idPessoaJuridica ||
        this.authService.usuario().permissaoAtual.perfil === PerfilUsuario.Gestor) &&
      this.canEditData()
    );
  }
  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
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

  currentUser: Usuario;
  opcoesPerfilTributario: any[];
  enumPerfilTributario = PerfilTributario;
  enumPorteEmpresa = PorteEmpresa;
  opcoesPorteEmpresa: any[];
  naturezasJuridicas$: Observable<Array<Usuario>>;
  naturezasJuridicasLoading: boolean;
  opcoesTipoCadastroEmpresa: any[];
  enumTipoCadastroEmpresa = TipoCadastroEmpresa;
  logo: string = '';
  tipoDocumentoSelecionado: any;
  pessoaJuridica: PessoaJuridica;
  dadosGerais: DadosGeraisDto;
  tipoDocumento: TipoDocumentoFornecedor;
  TipoDocumentoFornecedor = TipoDocumentoFornecedor;
  idPessoaJuridica: number;
  porte: any;
  alterarCodigoERP: boolean;
  private documentoFornecedor;
  private _isTenantMaster: boolean;

  private idTenantFornecedor: number | null;

  constructor(
    private naturezaJuridicaService: NaturezaJuridicaService,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private arquivoService: ArquivoService,
    private route: ActivatedRoute,
    private router: Router,
    private fornecedorService: FornecedorService,
    private modalService: NgbModal,
  ) {
    super();
    this.opcoesTipoCadastroEmpresa = Object.keys(this.enumTipoCadastroEmpresa).filter(Number);
    this.opcoesPerfilTributario = Object.keys(this.enumPerfilTributario).filter(Number);
    this.opcoesPorteEmpresa = Object.keys(this.enumPorteEmpresa).filter(Number);
  }

  ngOnInit() {
    this.currentUser = this.authService.usuario();
    // Captura o Id do fornecedor passado na rota Parent.
    const paramId = this.route.parent.snapshot.params.id;

    this.idTenantFornecedor = parseInt(this.route.snapshot.params.idTenantFornecedor) || null;
    if (paramId) {
      this.idPessoaJuridica = +paramId;
    }
    this.subNaturezaJuridica();
    this.construirFormulario();
    this.obterParametros();
    this.alterarCodigoERP = this.podeAltetarCodigoERP() && this.canEditData();
  }

  canEditData() {
    const isSupplierProfile =
      !this.idTenantFornecedor &&
      this.currentUser.permissaoAtual.perfil === PerfilUsuario.Fornecedor;

    const isMineSupplier = this.idTenantFornecedor
      ? this.idTenantFornecedor === this.currentUser.permissaoAtual.idTenant
      : false;

    return isSupplierProfile || isMineSupplier || !this.idPessoaJuridica;
  }

  // onKeyUpDocumento() especifica qual o tipoDocumento está selecionado.
  onKeyUpDocumento() {
    if (this.idPessoaJuridica) {
      if (this.form.controls.cnpj.value.length > 14) {
        this.tipoDocumento = TipoDocumentoFornecedor.Cnpj;
      } else {
        this.tipoDocumento = TipoDocumentoFornecedor.Cpf;
      }
    }
  }

  podeAltetarCodigoERP(): boolean {
    return [
      PerfilUsuario.Administrador,
      PerfilUsuario.Gestor,
      PerfilUsuario.GestorDeFornecedores,
    ].includes(this.authService.usuario().permissaoAtual.perfil)
      ? true
      : false;
  }

  // imagenSelecionada() abre uma janela no computador do usuário para inserir no cadastro do Fornecedor.
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

  // salvarArquivo() envia o arquivo para o Azure Storage.
  async salvarArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }

  // salvar() cria ou edita um Fornecedor, envia para o Backend.
  salvar() {
    if (this.formularioValido()) {
      const form = this.form.value;
      if (!this.idPessoaJuridica) {
        const modalRef = this.modalService.open(SdkUsuarioPrincipalModalComponent, {
          centered: true,
          backdrop: 'static',
        });

        modalRef.componentInstance.email = form.email;
        modalRef.result.then((result) => {
          if (result) {
            this.tratarUsuarioPrincipal(form, result);
          }
        });
      } else {
        const generalData = this.form.getRawValue();
        this.updateSupplierData(generalData);
      }
    } else {
      this.blockUI.stop();
    }
  }

  private subNaturezaJuridica() {
    this.naturezasJuridicasLoading = true;
    this.naturezasJuridicas$ = this.naturezaJuridicaService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.naturezasJuridicasLoading = false)),
    );
  }

  private construirFormulario() {
    const perfil: PerfilUsuario = this.authService.perfil();
    this.form = this.fb.group({
      idPessoaJuridica: [0],
      idNaturezaJuridica: [null],
      nomeFantasia: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      codigoFornecedor: [''],
      inscricaoEstadual: [''],
      inscricaoMunicipal: [''],
      tipoCadastro: [''],
      capitalSocial: [null],
      capitalIntegralizado: [null],
      dataIntegralizacao: [''],
      patrimonioLiquido: [null],
      perfilTributario: [''],
      optanteSimplesNacional: [''],
      numeroFuncionarios: [null],
      homePage: [''],
      dataValidade: [''],
      idUsuarioPrincipal: [null],
      contato: ['', Validators.required],
      telefone: ['', [Validators.maxLength(20), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      porte: [0],
    });
  }
  private obterParametros() {
    if (this.idPessoaJuridica) {
      this.obterDadosGerais();
    } else {
      this.documentoFornecedor = this.fornecedorService.obterDocumento();
      this.fornecedorService.alterarDocumento('');
    }
  }

  // obterDadosGerais() usa o idFornecedor para pegar as informações do Fornecedor.
  private obterDadosGerais() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .obterDadosGerais(this.idPessoaJuridica, this.idTenantFornecedor)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.dadosGerais = response;
            this.preencherFormulario(this.dadosGerais);
            this.blockUI.stop();
          }
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private preencherFormulario(dados: DadosGeraisDto) {
    if (dados.dataIntegralizacao) {
      dados.dataIntegralizacao = new Date(dados.dataIntegralizacao).toISOString().substring(0, 10);
    }
    if (dados.dataValidade) {
      dados.dataValidade = new Date(dados.dataValidade).toISOString().substring(0, 10);
    }
    this.form.patchValue(dados);
    this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cnpj;

    const idTenantUsuarioLogado = this.authService.usuario().permissaoAtual.idTenant;
    this._isTenantMaster = idTenantUsuarioLogado === 1; // IdTenant Master(Smarkets)
    if (!this._isTenantMaster) {
      this.form.disable();

      if (this.canEditData()) {
        this.form.controls.codigoFornecedor.enable();
      }
    }
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }

  private updateSupplierData(generalData: DadosGeraisDto) {
    this.fornecedorService.updateSupplierData(this.idPessoaJuridica, generalData).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.blockUI.stop();
          this.toastr.success('Os Dados Gerais do Fornecedor foram atualizados!');
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private inserirFornecedor(fornecedor: FornecedorInteressado) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.inserir(fornecedor).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);

          this.router.navigate(
            [`./../../${response.idPessoaJuridicaFornecedor}/dados-gerais/${response.idTenant}`],
            {
              relativeTo: this.route,
            },
          );
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private tratarUsuarioPrincipal(formValue, resultModalUsuario) {
    if (resultModalUsuario.usuarioExistente) {
      this.usuarioExistente(formValue, resultModalUsuario.usuario);
    } else {
      this.usuarioNaoExistente(formValue, resultModalUsuario.email);
    }
  }

  private usuarioNaoExistente(formValue, email: string) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-confirmacao-usuario',
    });
    modalRef.componentInstance.confirmacao = 'Usuário não encontrado! Deseja cadastrar novo?';
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then((result) => {
      if (result) {
        const userModalRef = this.modalService.open(SdkUsuarioPrincipalModalComponent, {
          centered: true,
          backdrop: 'static',
          size: 'lg',
          windowClass: 'modal-usuario',
        });
        userModalRef.componentInstance.exibirCadastro = true;
        userModalRef.componentInstance.email = email;
        userModalRef.result.then((usuario) => {
          if (usuario) {
            const fornecedor = this.instanciarFornecedor(formValue, usuario);
            this.inserirFornecedor(fornecedor);
          }
        });
      }
    });
  }

  private usuarioExistente(formValue, usuario: Usuario) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-confirmacao-usuario',
    });
    modalRef.componentInstance.confirmacao =
      'Já existe um usuário com esse endereço de e-mail, deseja realizar o vínculo com esse fornecedor?';
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then((result) => {
      if (result) {
        const fornecedor = this.instanciarFornecedor(formValue, usuario);
        this.inserirFornecedor(fornecedor);
      }
    });
  }

  private instanciarFornecedor(formValue: any, usuario: Usuario): FornecedorInteressado {
    const pessoaJuridica = new PessoaJuridica(
      0,
      null,
      TipoPessoa.PessoaJuridica,
      null,
      0,
      formValue.idPessoaJuridica,
      formValue.idNaturezaJuridica,
      this.documentoFornecedor,
      formValue.razaoSocial,
      formValue.nomeFantasia,
      formValue.inscricaoEstadual,
      formValue.inscricaoMunicipal,
      formValue.tipoCadastro,
      formValue.capitalSocial,
      formValue.capitalIntegralizado,
      formValue.dataIntegralizacao,
      formValue.dataValidade,
      null,
      formValue.patrimonioLiquido,
      +formValue.perfilTributario,
      formValue.optanteSimplesNacional,
      null,
      formValue.porte,
      null,
      formValue.numeroFuncionarios,
      formValue.homePage,
      null,
      null,
      formValue.idUsuarioPrincipal,
      null,
      null,
      null,
      null,
      TipoAprovacao.Departamento,
      false,
      true,
      false,
      null,
      false,
      false,
      null,
      null,
      null,
      formValue.contato,
      formValue.telefone,
      formValue.email,
    );
    const fornecedor = new FornecedorInteressado(
      0,
      0,
      0,
      null,
      0,
      this.documentoFornecedor,
      formValue.razaoSocial,
      formValue.nomeFantasia,
      null,
      null,
      pessoaJuridica,
      formValue.codigoFornecedor,
    );

    if (usuario.idUsuario) {
      fornecedor.idUsuario = usuario.idUsuario;
    } else {
      fornecedor.usuario = usuario;
    }

    return fornecedor;
  }
}
