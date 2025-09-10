import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, SituacaoUsuario, Usuario } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
})
export class ListaUsuariosComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  Situacao = SituacaoUsuario;
  usuarios: Array<Usuario>;
  settings: CustomTableSettings;
  selecionados: Array<Usuario>;
  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'idUsuario';
  ordenacao: Ordenacao = Ordenacao.ASC;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.configurarTabela();
    this.construirFormulario();
    this.obterUsuarios();
  }

  construirFormulario() {
    this.form = this.fb.group({
      termo: [''],
    });
  }

  buscar() {
    this.pagina = 1;
    this.obterUsuarios();
  }

  // CALLBACK de ordenação
  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterUsuarios();
  }

  solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }

  selecao(usuarios: Array<Usuario>) {
    this.selecionados = usuarios;
  }

  alterarSituacao(situacao: SituacaoUsuario) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService.alterarSituacaoBatch(this.selecionados, situacao).subscribe(
      (resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.obterUsuarios();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  auditar() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'Usuario';
    modalRef.componentInstance.idEntidade = this.selecionados[0].idUsuario;
  }

  // #region paginacao

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterUsuarios();
  }

  campoBuscaChanged() {
    const termo: string = this.form.value.termo;
    if (termo == null || termo.length == 0) {
      this.buscar();
    }
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('#', 'idUsuario', CustomTableColumnType.text, null, null, null, 'idUsuario'),
        new CustomTableColumn('Nome', 'pessoaFisica.nome', CustomTableColumnType.text, null, null, null, 'nome'),
        new CustomTableColumn('E-mail', 'email', CustomTableColumnType.text, null, null, null, 'email'),
        new CustomTableColumn('Situação', 'situacao', CustomTableColumnType.enum, null, null, SituacaoUsuario),
      ], 'check', this.ordenarPor, this.ordenacao,
    );
  }

  private obterUsuarios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const termo: string = this.form.value.termo;

    this.usuarioService.filtrar(this.registrosPorPagina, this.pagina, this.ordenarPor, this.ordenacao, termo).subscribe(
      (response) => {
        if (response) {
          this.usuarios = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.usuarios = new Array<Usuario>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService.excluir(this.selecionados[0].idUsuario).subscribe(
      (resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.pagina = 1;
        this.obterUsuarios();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
  //#endregion
}
