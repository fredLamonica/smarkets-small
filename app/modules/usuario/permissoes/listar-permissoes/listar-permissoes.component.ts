import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, PerfilUsuario, Permissao } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../shared/providers/usuario.service';
import { ManterPermissaoComponent } from '../manter-permissao/manter-permissao.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'listar-permissoes',
  templateUrl: './listar-permissoes.component.html',
  styleUrls: ['./listar-permissoes.component.scss'],
})
export class ListarPermissoesComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  PerfilUsuario = PerfilUsuario;

  @Input() idUsuario: number;
  @Input() disabled: boolean;

  permissoes: Array<Permissao>;
  selecionadas: Array<Permissao>;
  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  settings: CustomTableSettings;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit() {
    this.construirTabela();
    this.ObterPermissoes();
  }

  ObterPermissoes(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService
      .filtrarPermissoes(this.idUsuario, this.itensPorPagina, this.pagina, termo)
      .subscribe(
        (response) => {
          if (response) {
            this.permissoes = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.permissoes = new Array<Permissao>();
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

  solicitarExclusao() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(),
        (reason) => { },
      );
  }

  selecao(permissoes: Array<Permissao>) {
    this.selecionadas = permissoes;
  }

  incluir() {
    const modalRef = this.modalService.open(ManterPermissaoComponent, {
      centered: true,
      size: 'lg',
      keyboard: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.idUsuario = this.idUsuario;
    modalRef.result.then((result) => {
      this.pagina = 1;
      this.ObterPermissoes();
    });
  }

  alterar() {
    const modalRef = this.modalService.open(ManterPermissaoComponent, {
      centered: true,
      size: 'lg',
      keyboard: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.idUsuario = this.idUsuario;
    modalRef.componentInstance.idPermissao = this.selecionadas[0].idPermissao;
    modalRef.result.then((result) => {
      this.pagina = 1;
      this.ObterPermissoes();
    });
  }

  paginacao(event) {
    this.itensPorPagina = event.recordsPerPage;
    this.pagina = event.page;
    this.ObterPermissoes();
  }

  private construirTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn(
          'Pessoa Física/Jurídica',
          'pessoaJuridica.nomeFantasia',
          CustomTableColumnType.text,
        ),
        new CustomTableColumn(
          'Razão social',
          'pessoaJuridica.razaoSocial',
          CustomTableColumnType.text,
        ),
        new CustomTableColumn('CPF/CNPJ', 'pessoaJuridica.cnpj', CustomTableColumnType.text),
        new CustomTableColumn('Departamento', 'departamento.descricao', CustomTableColumnType.text),
        new CustomTableColumn(
          'Centro de custo',
          'centroCusto.descricao',
          CustomTableColumnType.text,
        ),
        new CustomTableColumn(
          'Perfil',
          'perfil',
          CustomTableColumnType.enum,
          null,
          null,
          PerfilUsuario,
        ),
      ],
      this.disabled ? 'none' : 'check',
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService.removerPermissoes(this.idUsuario, this.selecionadas).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.pagina = 1;
        this.ObterPermissoes();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
