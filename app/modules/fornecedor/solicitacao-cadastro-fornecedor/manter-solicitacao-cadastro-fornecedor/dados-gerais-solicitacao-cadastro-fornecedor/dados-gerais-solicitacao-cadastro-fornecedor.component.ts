import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ManterUsuarioModalComponent } from '@shared/components/modals/manter-usuario-modal/manter-usuario-modal.component';
import { NaturezaJuridica, PerfilTributario, PerfilTributarioDisplay, PorteEmpresa, TipoCadastroEmpresa, Usuario } from '@shared/models';
import { UsuarioDto } from '@shared/models/dto/usuario-dto';
import { TipoEmpresa, TipoEmpresaDisplay } from '@shared/models/enums/tipo-empresa';
import { TipoOrganizacao, TipoOrganizacaoDisplay } from '@shared/models/enums/tipo-organizacao';
import { TipoSlaSolicitacao } from '@shared/models/enums/tipo-sla-solicitacao';
import { SlaSolicitacao } from '@shared/models/sla-solicitacao/sla-solicitacao';
import { AutenticacaoService, NaturezaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { SlaSolicitacaoService } from '@shared/providers/sla-solicitacao.service';
import { SolicitacaoCadastroFornecedorService } from '@shared/providers/solicitacao-cadastro-fornecedor.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { ReloadMenuService } from '../reload-menu.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dados-gerais-solicitacao-cadastro-fornecedor',
  templateUrl: './dados-gerais-solicitacao-cadastro-fornecedor.component.html',
  styleUrls: ['./dados-gerais-solicitacao-cadastro-fornecedor.component.scss'],
})
export class DadosGeraisSolicitacaoCadastroFornecedorComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;

  maskCnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  maskTelefone = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  isCreate = false;
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

  listaDeSlas$: Observable<Array<SlaSolicitacao>>;
  listaDeSlasLoading: boolean;

  usuarioSolicitante: boolean = true;

  private idPessoaJuridica: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private naturezaJuridicaService: NaturezaJuridicaService,
    private solicitacaoCadastroFornecedorService: SolicitacaoCadastroFornecedorService,
    private reloadMenuService: ReloadMenuService,
    private slaSolicitacaoService: SlaSolicitacaoService,
    private autenticacaoService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {

    const paramId = this.route.snapshot.params.id;

    this.construirFormulario();
    this.subListas();

    if (paramId && paramId !== 'novo') {
      this.idPessoaJuridica = +paramId;

      this.obterDadosGerais();

    } else {
      this.isCreate = true;
      if (this.isNullOrWhitespace(this.solicitacaoCadastroFornecedorService.cnpj)) {
        this.blockUI.start('Favor inicie o cadastro pela tela de listagem. Redirecionando...');
        setTimeout(() => {
          this.router.navigate(
            ['./../../../solicitacao-cadastro-fornecedor'],
            {
              relativeTo: this.route,
            },
          );
          this.blockUI.stop();
        }, 8000);
      }
    }
  }

  subListas() {
    this.subNaturezaJuridica();
    this.popularListaSla();
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (this.formularioValido()) {
      this.processeCamposPermitidosParaUsuarioSolicitante(false);

      const form = this.form.value;

      this.processeCamposPermitidosParaUsuarioSolicitante(true);

      if (this.idPessoaJuridica) {
        this.alterar(form);
      } else {
        this.inserir(form);
      }
    } else {
      this.blockUI.stop();
    }
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

  mapeiaParaSolicitacaoFornecedor(formValue) {
    const {
      idPessoaJuridica: idSolicitacaoFornecedor,
      razaoSocial,
      nomeFantasia,
      porte,
      status,
      cnpj,
      dataCadastro: dataAberturaCnpj,
      idNaturezaJuridica,
      numeroFuncionarios,
      tipoCadastro,
      homePage,
      contato,
      telefone,
      email,
      perfilTributario,
      inscricaoEstadual,
      inscricaoMunicipal,
      patrimonioLiquido,
      optanteSimplesNacional,
      capitalSocial,
      capitalIntegralizado,
      dataIntegralizacao,
      idUsuarioPrincipal: idUsuario,
      codigoERP,
      solicitadoPor,
      idSlaSolicitacao,
      idUsuarioSolicitante,
      idEmpresaSolicitante,
    } = formValue;

    return {
      idSolicitacaoFornecedor,
      razaoSocial,
      nomeFantasia,
      porte,
      status,
      cnpj,
      dataAberturaCnpj,
      idNaturezaJuridica,
      numeroFuncionarios,
      tipoCadastro,
      homePage,
      contato,
      telefone,
      email,
      perfilTributario,
      inscricaoEstadual,
      inscricaoMunicipal,
      patrimonioLiquido,
      optanteSimplesNacional,
      capitalSocial,
      capitalIntegralizado,
      dataIntegralizacao,
      idUsuario,
      codigoERP,
      solicitadoPor,
      idSlaSolicitacao,
      idUsuarioSolicitante,
      idEmpresaSolicitante,
    };

  }

  mapeiaParaPessoaJuridica(formValue) {
    const {
      idSolicitacaoFornecedor: idPessoaJuridica,
      razaoSocial,
      nomeFantasia,
      porte,
      status,
      cnpj,
      dataAberturaCnpj: dataCadastro,
      idNaturezaJuridica,
      numeroFuncionarios,
      tipoCadastro,
      homePage,
      contato,
      telefone,
      email,
      perfilTributario,
      inscricaoEstadual,
      inscricaoMunicipal,
      patrimonioLiquido,
      optanteSimplesNacional,
      capitalSocial,
      capitalIntegralizado,
      dataIntegralizacao,
      idUsuario: idUsuarioPrincipal,
      codigoERP,
      solicitadoPor,
      idSlaSolicitacao,
      idUsuarioSolicitante,
      idEmpresaSolicitante,
    } = formValue;

    return {
      idPessoaJuridica,
      razaoSocial,
      nomeFantasia,
      porte,
      status,
      cnpj,
      dataCadastro,
      idNaturezaJuridica,
      numeroFuncionarios,
      tipoCadastro,
      homePage,
      contato,
      telefone,
      email,
      perfilTributario,
      inscricaoEstadual,
      inscricaoMunicipal,
      patrimonioLiquido,
      optanteSimplesNacional,
      capitalSocial,
      capitalIntegralizado,
      dataIntegralizacao,
      idUsuarioPrincipal,
      codigoERP,
      solicitadoPor,
      idSlaSolicitacao,
      idUsuarioSolicitante,
      idEmpresaSolicitante,
    };
  }

  slaSearchFn(term: string, item: SlaSolicitacao) {
    return item.descricaoTempo.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      idPessoaJuridica: [0],
      razaoSocial: ['', Validators.required],
      nomeFantasia: [''],
      status: [0],
      cnpj: [''],
      porte: [0],
      dataCadastro: [null],
      idNaturezaJuridica: [null],
      numeroFuncionarios: [null],
      tipoCadastro: [''],
      homePage: [''],
      contato: [null, Validators.required],
      telefone: [null, Validators.required],
      email: [null, Validators.required],
      perfilTributario: [''],
      inscricaoEstadual: [''],
      inscricaoMunicipal: [''],
      patrimonioLiquido: [0],
      optanteSimplesNacional: [''],
      capitalSocial: [null],
      capitalIntegralizado: [null],
      dataIntegralizacao: [null],
      idUsuarioPrincipal: [null],
      codigoERP: [null],
      solicitadoPor: [0],
      idSlaSolicitacao: [null, Validators.required],
      idUsuarioSolicitante: [0],
      idEmpresaSolicitante: [0],
    });
  }

  private obterDadosGerais() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoCadastroFornecedorService.obterSolicitacaoCadastroFornecedor(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.solicitacaoCadastroFornecedorService.cnpj = response.cnpj;
            const resp = this.mapeiaParaPessoaJuridica(response);
            this.preencherFormulario(resp);

            const usuarioLogado: Usuario = this.autenticacaoService.usuario();

            if (usuarioLogado && usuarioLogado.permissaoAtual && usuarioLogado.permissaoAtual.idUsuario !== resp.idUsuarioSolicitante) {
              this.usuarioSolicitante = false;
              this.processeCamposPermitidosParaUsuarioSolicitante(true);
            }

            this.blockUI.stop();
          }
        },
        (error) => {
          if (error.status === 400) {
            this.toastr.error(error.error);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.blockUI.stop();
        },
      );
  }

  private processeCamposPermitidosParaUsuarioSolicitante(desabilitar: boolean) {
    if (desabilitar && !this.usuarioSolicitante) {
      this.form.controls.porte.disable();
      this.form.controls.tipoCadastro.disable();
      this.form.controls.perfilTributario.disable();
      this.form.controls.optanteSimplesNacional.disable();
      this.form.controls.idSlaSolicitacao.disable();
    } else {
      this.form.controls.porte.enable();
      this.form.controls.tipoCadastro.enable();
      this.form.controls.perfilTributario.enable();
      this.form.controls.optanteSimplesNacional.enable();
      this.form.controls.idSlaSolicitacao.enable();
    }
  }

  private preencherFormulario(generalDataDto: any) {
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

    this.form.patchValue(generalDataDto);
  }

  private subNaturezaJuridica() {
    this.naturezasJuridicasLoading = true;
    this.naturezasJuridicas$ = this.naturezaJuridicaService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.naturezasJuridicasLoading = false)),
    );
  }
  private popularListaSla() {
    this.listaDeSlasLoading = true;
    this.listaDeSlas$ = this.slaSolicitacaoService.getPorTipo(TipoSlaSolicitacao.Fornecedor).pipe(
      catchError(() => of(new Array<SlaSolicitacao>())),
      tap(() => this.listaDeSlasLoading = false));
  }

  private inserir(formValue) {
    const solicitacao = this.mapeiaParaSolicitacaoFornecedor(formValue);
    solicitacao.cnpj = this.solicitacaoCadastroFornecedorService.cnpj;

    this.solicitacaoCadastroFornecedorService.insert(solicitacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.solicitacaoCadastroFornecedorService.cnpj = '';
            this.idPessoaJuridica = response.idSolicitacaoFornecedor;
            this.router.navigate([`fornecedores/manter-solicitacao-fornecedor/enderecos/${response.idSolicitacaoFornecedor}`]);
            this.reloadMenuService.reloadMenu(response.idSolicitacaoFornecedor);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.obterDadosGerais();
          }
          this.blockUI.stop();
        },
        (error) => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.blockUI.stop();
        },
      );
  }

  private alterar(formValue) {
    const solicitacao = this.mapeiaParaSolicitacaoFornecedor(formValue);

    this.solicitacaoCadastroFornecedorService.upadate(solicitacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
          this.blockUI.stop();
        },
        (error) => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.blockUI.stop();
        },
      );
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {

      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (this.isCreate && !this.form.value.idUsuarioPrincipal) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    const openDate = moment(this.form.value.dataCadastro).valueOf();

    const currentDate = moment(moment().format('YYYY-MM-DD')).valueOf();

    if (!openDate && openDate >= currentDate) {
      this.toastr.warning('A data de abertura deve ser menor que a data atual');
      return false;
    }

    return true;
  }

  private isNullOrWhitespace(input) {
    return !input || !input.toString().trim();
  }
}
