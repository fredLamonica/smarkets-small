import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CentroCusto, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Departamento, PerfilUsuario, PerfilUsuarioLabel, Permissao, PessoaJuridica } from '@shared/models';
import { AutenticacaoService, CentroCustoService, DepartamentoService, PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-permissao',
  templateUrl: './manter-permissao.component.html',
  styleUrls: ['./manter-permissao.component.scss'],
})
export class ManterPermissaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  PerfilUsuario = PerfilUsuario;

  idPermissao: number;
  idUsuario: number;

  centrosCusto: Array<CentroCusto>;
  departamentos: Array<Departamento>;

  form: FormGroup;
  formBusca: FormGroup;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;

  empresas: Array<PessoaJuridica>;

  selecionada: PessoaJuridica;

  settings: CustomTableSettings;

  camposObrigatorio: boolean; // Centro de Custo e Departamento

  perfis = new Array<PerfilUsuario>();

  constructor(
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private usuarioService: UsuarioService,
    private departamentoService: DepartamentoService,
    private centroCustoService: CentroCustoService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.selecionada = null;
    this.criarFormulario();
    this.criarFormularioBusca();
    this.construirTabelas();
    if (this.idPermissao) { this.obterPermissao(); } else { this.form.patchValue({ idUsuario: this.idUsuario }); }
    this.buscarEmpresas();
  }

  cancelar() {
    this.activeModal.close();
  }

  async selecao(empresa: PessoaJuridica) {
    this.selecionada = empresa;

    if (empresa) {
      this.habilitarCampos();
      this.form.controls.idCentroCusto.reset();
      this.form.controls.idDepartamento.reset();
      this.form.controls.perfil.reset();
      this.form.patchValue({ idTenant: empresa.idTenant });
      await this.listarItens(empresa.idPessoaJuridica);

      this.setPerfis();
    }
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.buscarEmpresas();
  }

  buscar() {
    this.pagina = 1;
    this.buscarEmpresas();
  }

  buscarEmpresas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const termo = this.formBusca.value.termo;
    this.pessoaJuridicaService
      .filtrarEmpresasPermissao(this.idUsuario, this.itensPorPagina, this.pagina, termo)
      .subscribe(
        (response) => {
          if (response) {
            this.empresas = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.empresas = new Array<PessoaJuridica>();
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

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid && this.camposObrigatorioPorPerfilValidos(this.form.value)) {
      const form = this.form.value;
      const permissao = new Permissao(
        form.idPermissao,
        form.idUsuario,
        form.idTenant,
        form.perfil,
        form.idCentroCusto,
        form.idDepartamento,
      );

      if (this.idPermissao) { this.alterar(permissao); } else { this.inserir(permissao); }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  inserir(permissao: Permissao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService.inserirPermissao(permissao).subscribe(
      (response) => {
        if (response) {
          this.activeModal.close();
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  alterar(permissao: Permissao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService.alterarPermissao(permissao).subscribe(
      (response) => {
        if (response) {
          this.activeModal.close();
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  changePerfil(): boolean {
    const perfil = this.form.value.perfil;

    if (
      perfil == PerfilUsuario.Requisitante ||
      perfil == PerfilUsuario.Comprador ||
      perfil == PerfilUsuario.Aprovador
    ) {
      return (this.camposObrigatorio = true);
    }

    return (this.camposObrigatorio = false);
  }

  campoBuscaChanged() {
    const termo: string = this.form.value.termo;
    if (termo == null || termo.length == 0) {
      this.buscar();
    }
  }

  getProfileEnum(item: any) {
    return PerfilUsuarioLabel.get(item);
  }
  private setPerfis() {
    this.perfis = new Array<PerfilUsuario>();
    const usuario = this.authService.usuario();
    if (this.selecionada && this.selecionada.atividades) {
      if (
        this.selecionada.atividades.administrador &&
        usuario.permissaoAtual.perfil == PerfilUsuario.Administrador
      ) {
        this.perfis.push(PerfilUsuario.Administrador);
      }
      if (this.selecionada.atividades.comprador) {
        this.perfis = this.perfis.concat([
          PerfilUsuario.Aprovador,
          PerfilUsuario.Cadastrador,
          PerfilUsuario.Comprador,
          PerfilUsuario.Gestor,
          PerfilUsuario.Recebimento,
          PerfilUsuario.Requisitante,
          PerfilUsuario.RequisitanteTrack,
          PerfilUsuario.ConsultorTrack
        ]);
      }

      if (this.selecionada.atividades.vendedor) {
        this.perfis.push(PerfilUsuario.Fornecedor);
      }

      if (this.selecionada.atividades.comprador && this.selecionada.habilitarModuloFornecedores) {
        this.perfis.push(PerfilUsuario.GestorDeFornecedores);
      }
    }
  }

  private criarFormularioBusca() {
    this.formBusca = this.fb.group({
      termo: [''],
    });
  }

  private camposObrigatorioPorPerfilValidos(formValue): boolean {
    const perfil = this.form.value.perfil;
    if (
      perfil == PerfilUsuario.Requisitante ||
      perfil == PerfilUsuario.Comprador ||
      perfil == PerfilUsuario.Aprovador
    ) {
      if (formValue.idCentroCusto == null) { return false; }
      if (formValue.idDepartamento == null) { return false; }
    }

    return true;
  }

  private criarFormulario() {
    this.form = this.fb.group({
      idPermissao: [0],
      idUsuario: [0],
      idTenant: [null, Validators.required],
      perfil: [null, Validators.required],
      idCentroCusto: [null],
      idDepartamento: [null],

      razaoSocial: [''],
      nomeFantasia: [''],
      cnpj: [''],
    });

    this.form.controls.perfil.disable();
    this.form.controls.idCentroCusto.disable();
    this.form.controls.idDepartamento.disable();
  }

  private construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Pessoa Física/Jurídica', 'nomeFantasia', CustomTableColumnType.text),
        new CustomTableColumn('Razão social', 'razaoSocial', CustomTableColumnType.text),
        new CustomTableColumn('CPF/CNPJ', 'cnpj', CustomTableColumnType.text),
      ],
      'radio',
    );
  }

  private habilitarCampos() {
    this.form.controls.idCentroCusto.enable();
    this.form.controls.idDepartamento.enable();
    this.form.controls.perfil.enable();
  }

  private obterPermissao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService.obterPermissaoPorId(this.idUsuario, this.idPermissao).subscribe(
      (response) => {
        this.preencherFormulario(response);
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private async preencherFormulario(permissao: Permissao) {
    this.form.patchValue(permissao);
    this.form.patchValue({
      razaoSocial: permissao.pessoaJuridica.razaoSocial,
      nomeFantasia: permissao.pessoaJuridica.nomeFantasia,
      cnpj: permissao.pessoaJuridica.cnpj,
    });

    this.form.controls.perfil.enable();
    this.form.controls.idCentroCusto.enable();
    this.form.controls.idDepartamento.enable();

    this.selecionada = permissao.pessoaJuridica;
    this.setPerfis();

    await this.listarItens(permissao.pessoaJuridica.idPessoaJuridica);
    this.changePerfil();
  }

  private async listarItens(idPessoaJuridica: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      await this.buscarCentrosCusto(idPessoaJuridica);
      await this.buscarDepartamentos(idPessoaJuridica);
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.form.reset();
    }
    this.blockUI.stop();
  }

  private async buscarCentrosCusto(idPessoaJuridica: number) {
    this.centrosCusto = await this.centroCustoService
      .listarPorEmpresa(idPessoaJuridica)
      .toPromise();
  }

  private async buscarDepartamentos(idPessoaJuridica: number) {
    this.departamentos = await this.departamentoService
      .listarPorEmpresa(idPessoaJuridica)
      .toPromise();
  }
}
