import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { DisparoAvaliacaoFornecedor, FornecedorInteressado, Usuario } from '@shared/models';
import { AvaliacaoFornecedorService, FornecedorService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-disparo-avaliacao',
  templateUrl: './manter-disparo-avaliacao-fornecedor.component.html',
  styleUrls: ['./manter-disparo-avaliacao-fornecedor.component.scss'],
})
export class ManterDisparoAvaliacaoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  get fornecedores(): Array<FornecedorInteressado> {
    return this._fornecedores;
  }

  set fornecedores(fornecedores: Array<FornecedorInteressado>) {
    this._fornecedores = fornecedores;
    this.propagateChange(this._fornecedores);
  }

  get usuarios(): Array<Usuario> {
    return this._usuarios;
  }

  set usuarios(usuarios: Array<Usuario>) {
    this._usuarios = usuarios;
    this.propagateChange(this._usuarios);
  }

  readonly: boolean = false;
  idAvaliacaoFornecedor: number;
  idDisparoAvaliacaoFornecedor: number;

  fornecedoresDisponiveis: Array<FornecedorInteressado> = new Array<FornecedorInteressado>();
  fornecedoresDisponiveisSelecionados: Array<FornecedorInteressado> = new Array<FornecedorInteressado>();
  fornecedoresDisponiveisBusca: Array<FornecedorInteressado>;

  fornecedoresIncluidosSelecionados: Array<FornecedorInteressado> = new Array<FornecedorInteressado>();
  fornecedoresIncluidosBusca: Array<FornecedorInteressado>;

  todosFornecedoresDisponiveisSelecionados: boolean = false;
  todosFornecedoresIncluidosSelecionados: boolean = false;

  usuariosDisponiveis: Array<Usuario> = new Array<Usuario>();
  usuariosDisponiveisSelecionados: Array<Usuario> = new Array<Usuario>();
  usuariosDisponiveisBusca: Array<Usuario>;

  usuariosIncluidosSelecionados: Array<Usuario> = new Array<Usuario>();
  usuariosIncluidosBusca: Array<Usuario>;

  todosUsuariosDisponiveisSelecionados: boolean = false;
  todosUsuariosIncluidosSelecionados: boolean = false;

  private _fornecedores: Array<FornecedorInteressado>;

  //#endregion

  private _usuarios: Array<Usuario>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private fornecedorService: FornecedorService,
    private usuarioService: UsuarioService,
    private avaliacaoFornecedorService: AvaliacaoFornecedorService,
  ) { }

  ngOnInit() {
    if (!this.idDisparoAvaliacaoFornecedor) {
      this.obterFornecedores();
      this.obterUsuarios();
    }
  }

  // #region ControlValue Methods
  writeValue(obj: any): void {
    this.fornecedores = obj;
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  exibirFornecedorDisponivel(fornecedor: FornecedorInteressado): boolean {
    return (
      !this.fornecedoresDisponiveisBusca ||
      this.fornecedoresDisponiveisBusca.findIndex(
        (f) => f.idFornecedor === fornecedor.idFornecedor,
      ) != -1
    );
  }

  exibirFornecedorIncluido(fornecedor: FornecedorInteressado): boolean {
    return (
      !this.fornecedoresIncluidosBusca ||
      this.fornecedoresIncluidosBusca.findIndex((f) => f.idFornecedor === fornecedor.idFornecedor) !=
      -1
    );
  }

  selecionarFornecedorIncluido(fornecedor: FornecedorInteressado) {
    if (this.fornecedorIncluidoSelecionado(fornecedor)) {
      this.fornecedoresIncluidosSelecionados.splice(
        this.fornecedoresIncluidosSelecionados.findIndex(
          (f) => f.idFornecedor === fornecedor.idFornecedor,
        ),
        1,
      );
      this.todosFornecedoresIncluidosSelecionados = false;
    } else { this.fornecedoresIncluidosSelecionados.push(fornecedor); }
  }

  fornecedorIncluidoSelecionado(fornecedor: FornecedorInteressado): boolean {
    return (
      this.fornecedoresIncluidosSelecionados.findIndex(
        (f) => f.idFornecedor === fornecedor.idFornecedor,
      ) != -1
    );
  }

  fornecedorDisponivelSelecionado(fornecedor: FornecedorInteressado): boolean {
    return (
      this.fornecedoresDisponiveisSelecionados.findIndex(
        (f) => f.idFornecedor === fornecedor.idFornecedor,
      ) != -1
    );
  }

  selecionarFornecedorDisponivel(fornecedor: FornecedorInteressado) {
    if (this.fornecedorDisponivelSelecionado(fornecedor)) {
      this.fornecedoresDisponiveisSelecionados.splice(
        this.fornecedoresDisponiveisSelecionados.findIndex(
          (f) => f.idFornecedor === fornecedor.idFornecedor,
        ),
        1,
      );
      this.todosFornecedoresDisponiveisSelecionados = false;
    } else { this.fornecedoresDisponiveisSelecionados.push(fornecedor); }
  }

  buscarFornecedoresDisponiveis(termo) {
    termo = termo.toLowerCase().trim();
    this.fornecedoresDisponiveisSelecionados = new Array<FornecedorInteressado>();
    this.todosFornecedoresDisponiveisSelecionados = false;
    if (termo != '') {
      this.fornecedoresDisponiveisBusca = this.fornecedoresDisponiveis.filter(
        (f) => f.idFornecedor.toString() === termo || f.razaoSocial.toLowerCase().includes(termo),
      );
    } else { this.limparFiltroFornecedoresDisponiveis(); }
  }

  limparFiltroFornecedoresDisponiveis() {
    this.fornecedoresDisponiveisBusca = null;
  }

  buscarFornecedoresIncluidos(termo) {
    termo = termo.toLowerCase().trim();
    this.fornecedoresIncluidosSelecionados = new Array<FornecedorInteressado>();
    this.todosFornecedoresIncluidosSelecionados = false;
    if (termo != '') {
      this.fornecedoresIncluidosBusca = this.fornecedores.filter(
        (f) => f.idFornecedor.toString() === termo || f.razaoSocial.toLowerCase().includes(termo),
      );
    } else { this.limparFiltroFornecedoresIncluidos(); }
  }

  limparFiltroFornecedoresIncluidos() {
    this.fornecedoresIncluidosBusca = null;
  }

  remover() {
    this.fornecedoresIncluidosSelecionados.forEach((fornecedor) => {
      this.fornecedoresDisponiveis.push(fornecedor);
      this.fornecedores.splice(
        this.fornecedores.findIndex((f) => f.idFornecedor === fornecedor.idFornecedor),
        1,
      );
    });

    this.fornecedoresIncluidosSelecionados = new Array<FornecedorInteressado>();
    this.todosFornecedoresIncluidosSelecionados = false;

    this.fornecedoresDisponiveis = this.fornecedoresDisponiveis.sort((a, b) =>
      a.idFornecedor < b.idFornecedor ? 1 : -1,
    );
  }

  adicionar() {
    this.fornecedoresDisponiveisSelecionados.forEach((fornecedor) => {
      this.fornecedores.push(fornecedor);
      this.fornecedoresDisponiveis.splice(
        this.fornecedoresDisponiveis.findIndex((f) => f.idFornecedor === fornecedor.idFornecedor),
        1,
      );
    });

    this.fornecedoresDisponiveisSelecionados = new Array<FornecedorInteressado>();
    this.todosFornecedoresDisponiveisSelecionados = false;

    this.fornecedores = this.fornecedores.sort((a, b) =>
      a.idFornecedor < b.idFornecedor ? 1 : -1,
    );
  }

  selecionarTodosIncluidos() {
    if (this.todosFornecedoresIncluidosSelecionados) {
      this.todosFornecedoresIncluidosSelecionados = false;
      this.fornecedoresIncluidosSelecionados = new Array<FornecedorInteressado>();
    } else {
      this.todosFornecedoresIncluidosSelecionados = true;
      this.fornecedores.forEach((fornecedor) => {
        if (
          this.exibirFornecedorIncluido(fornecedor) &&
          !this.fornecedorIncluidoSelecionado(fornecedor)
        ) {
          this.fornecedoresIncluidosSelecionados.push(fornecedor);
        }
      });
    }
  }

  selecionarTodosDisponiveis() {
    if (this.todosFornecedoresDisponiveisSelecionados) {
      this.todosFornecedoresDisponiveisSelecionados = false;
      this.fornecedoresDisponiveisSelecionados = new Array<FornecedorInteressado>();
    } else {
      this.todosFornecedoresDisponiveisSelecionados = true;
      this.fornecedoresDisponiveis.forEach((fornecedor) => {
        if (
          this.exibirFornecedorDisponivel(fornecedor) &&
          !this.fornecedorDisponivelSelecionado(fornecedor)
        ) {
          this.fornecedoresDisponiveisSelecionados.push(fornecedor);
        }
      });
    }
  }

  exibirUsuarioDisponivel(usuario: Usuario): boolean {
    return (
      !this.usuariosDisponiveisBusca ||
      this.usuariosDisponiveisBusca.findIndex((u) => u.idUsuario === usuario.idUsuario) != -1
    );
  }

  exibirUsuarioIncluido(usuario: Usuario): boolean {
    return (
      !this.usuariosIncluidosBusca ||
      this.usuariosIncluidosBusca.findIndex((u) => u.idUsuario === usuario.idUsuario) != -1
    );
  }

  usuarioDisponivelSelecionado(usuario: Usuario): boolean {
    return (
      this.usuariosDisponiveisSelecionados.findIndex((u) => u.idUsuario === usuario.idUsuario) != -1
    );
  }

  selecionarUsuarioDisponivel(usuario: Usuario) {
    if (this.usuarioDisponivelSelecionado(usuario)) {
      this.usuariosDisponiveisSelecionados.splice(
        this.usuariosDisponiveisSelecionados.findIndex((u) => u.idUsuario === usuario.idUsuario),
        1,
      );
      this.todosUsuariosDisponiveisSelecionados = false;
    } else { this.usuariosDisponiveisSelecionados.push(usuario); }
  }

  selecionarUsuarioIncluido(usuario: Usuario) {
    if (this.usuarioIncluidoSelecionado(usuario)) {
      this.usuariosIncluidosSelecionados.splice(
        this.usuariosIncluidosSelecionados.findIndex((u) => u.idUsuario === usuario.idUsuario),
        1,
      );
      this.todosUsuariosIncluidosSelecionados = false;
    } else { this.usuariosIncluidosSelecionados.push(usuario); }
  }

  usuarioIncluidoSelecionado(usuario: Usuario): boolean {
    return (
      this.usuariosIncluidosSelecionados.findIndex((u) => u.idUsuario === usuario.idUsuario) != -1
    );
  }

  selecionarTodosUsuariosIncluidos() {
    if (this.todosUsuariosIncluidosSelecionados) {
      this.todosUsuariosIncluidosSelecionados = false;
      this.usuariosIncluidosSelecionados = new Array<Usuario>();
    } else {
      this.todosUsuariosIncluidosSelecionados = true;
      this.usuarios.forEach((usuario) => {
        if (this.exibirUsuarioIncluido(usuario) && !this.usuarioIncluidoSelecionado(usuario)) {
          this.usuariosIncluidosSelecionados.push(usuario);
        }
      });
    }
  }

  selecionarTodosUsuariosDisponiveis() {
    if (this.todosUsuariosDisponiveisSelecionados) {
      this.todosUsuariosDisponiveisSelecionados = false;
      this.usuariosDisponiveisSelecionados = new Array<Usuario>();
    } else {
      this.todosUsuariosDisponiveisSelecionados = true;
      this.usuariosDisponiveis.forEach((usuario) => {
        if (this.exibirUsuarioDisponivel(usuario) && !this.usuarioDisponivelSelecionado(usuario)) {
          this.usuariosDisponiveisSelecionados.push(usuario);
        }
      });
    }
  }

  buscarUsuariosDisponiveis(termo) {
    termo = termo.toLowerCase().trim();
    this.usuariosDisponiveisSelecionados = new Array<Usuario>();
    this.todosUsuariosDisponiveisSelecionados = false;
    if (termo != '') {
      this.usuariosDisponiveisBusca = this.usuariosDisponiveis.filter(
        (u) => u.idUsuario.toString() === termo || u.pessoaFisica.nome.toLowerCase().includes(termo),
      );
    } else { this.limparFiltroUsuariosDisponiveis(); }
  }

  limparFiltroUsuariosDisponiveis() {
    this.usuariosDisponiveisBusca = null;
  }

  buscarUsuariosIncluidos(termo) {
    termo = termo.toLowerCase().trim();
    this.usuariosIncluidosSelecionados = new Array<Usuario>();
    this.todosUsuariosIncluidosSelecionados = false;
    if (termo != '') {
      this.usuariosIncluidosBusca = this.usuarios.filter(
        (u) => u.idUsuario.toString() === termo || u.pessoaFisica.nome.toLowerCase().includes(termo),
      );
    } else { this.limparFiltroUsuariosIncluidos(); }
  }

  limparFiltroUsuariosIncluidos() {
    this.usuariosIncluidosBusca = null;
  }

  removerUsuario() {
    this.usuariosIncluidosSelecionados.forEach((usuario) => {
      this.usuariosDisponiveis.push(usuario);
      this.usuarios.splice(
        this.usuarios.findIndex((f) => f.idUsuario === usuario.idUsuario),
        1,
      );
    });

    this.usuariosIncluidosSelecionados = new Array<Usuario>();
    this.todosUsuariosIncluidosSelecionados = false;

    this.usuariosDisponiveis = this.usuariosDisponiveis.sort((a, b) =>
      a.idUsuario < b.idUsuario ? 1 : -1,
    );
  }

  adicionarUsuario() {
    this.usuariosDisponiveisSelecionados.forEach((usuario) => {
      this.usuarios.push(usuario);
      this.usuariosDisponiveis.splice(
        this.usuariosDisponiveis.findIndex((u) => u.idUsuario === usuario.idUsuario),
        1,
      );
    });

    this.usuariosDisponiveisSelecionados = new Array<Usuario>();
    this.todosUsuariosDisponiveisSelecionados = false;

    this.usuarios = this.usuarios.sort((a, b) => (a.idUsuario < b.idUsuario ? 1 : -1));
  }

  //#endregion

  voltar() {
    this.activeModal.close();
  }
  disparar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (
      this.usuarios &&
      this.usuarios.length > 0 &&
      this.fornecedores &&
      this.fornecedores.length > 0
    ) {
      this.confirmarDisparo();
    } else { this.toastr.warning('Para gerar novo disparo selecione os fornecedores e usuários!'); }
    this.blockUI.stop();
  }
  // #endregion

  //#region Fornecedores
  private obterFornecedores() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.obterFornecedoresQualificados(this.idAvaliacaoFornecedor).subscribe(
      (response) => {
        if (response) {
          this.preencherFornecedor(response);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private preencherFornecedor(fornecedor: Array<FornecedorInteressado>) {
    const fornecedores = fornecedor.map((f) => {
      return new FornecedorInteressado(
        f.idFornecedor,
        f.idPessoaJuridicaFornecedor,
        f.idTenant,
        f.origem,
        f.idUsuario,
        f.cnpj,
        f.razaoSocial,
        null,
        f.aceitarTermo,
        f.status,
      );
    });
    this.fornecedores = new Array<FornecedorInteressado>();
    this.fornecedoresDisponiveis = fornecedores;
  }

  //#region Usuarios
  private obterUsuarios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.avaliacaoFornecedorService.obterUsuariosEmpresa().subscribe(
      (response) => {
        if (response) {
          this.preencherUsuarios(response);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private preencherUsuarios(usuario: Array<Usuario>) {
    const usuarios = usuario.map((u) => {
      return new Usuario(
        u.idUsuario,
        u.idPessoaFisica,
        u.situacao,
        u.email,
        u.dataInclusao,
        u.primeiroAcesso,
        u.token,
        u.telefone,
        u.ramal,
        u.celular,
        u.pessoaFisica,
        u.permissoes,
      );
    });
    this.usuarios = new Array<Usuario>();
    this.usuariosDisponiveis = usuarios;
  }

  private confirmarDisparo() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
    });

    modalRef.componentInstance.confirmacao = 'Deseja realmente disparar essa avaliação?';

    modalRef.result.then((result) => {
      if (result) {
        this.realizarDisparo();
      }
    });
  }

  private realizarDisparo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const novoDisparo = this.montarDisparo();
    this.avaliacaoFornecedorService.disparar(novoDisparo).subscribe(
      (resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close();
      },
      (error) => {
        this.blockUI.stop();
        switch (error.error) {
          case 'Não é possível disparar uma avaliação com a data de início anterior à data de hoje':
            this.toastr.warning(
              'Não é possível disparar uma avaliação com a data de início anterior à data de hoje',
            );
            break;
          default:
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      },
    );
  }

  private montarDisparo(): DisparoAvaliacaoFornecedor {
    const disparo = new DisparoAvaliacaoFornecedor();

    disparo.idAvaliacaoFornecedor = this.idAvaliacaoFornecedor;
    disparo.usuarios = this.usuarios;
    disparo.fornecedores = this.fornecedores;

    return disparo;
  }
}
