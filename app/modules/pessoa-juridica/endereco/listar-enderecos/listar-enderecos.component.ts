import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import {
  CustomTableColumn,
  CustomTableColumnType, CustomTableSettings,
  Endereco, Ordenacao, TipoEndereco
} from '@shared/models';
import { EnderecoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { EnderecoFiltro } from '../../../../shared/models/fltros/endereco-filtro';
import { ManterEnderecoComponent } from '../manter-endereco/manter-endereco.component';

@Component({
  selector: 'listar-enderecos',
  templateUrl: './listar-enderecos.component.html',
  styleUrls: ['./listar-enderecos.component.scss'],
})
export class ListarEnderecosComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-pessoa') idPessoa: number;
  @Input('disabled') disabled: boolean;

  settings: CustomTableSettings;
  enderecos: Array<Endereco>;
  selecionados: Array<Endereco>;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenacao: Ordenacao = Ordenacao.DESC;
  itemOrdenar: string = 'e.IdEndereco';
  enderecoFiltro: EnderecoFiltro = new EnderecoFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private enderecoService: EnderecoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.construirTabelas();
    this.obterEnderecos();
  }

  obterEnderecos(termo: string = '') {

    this.enderecoFiltro.idPessoa = this.idPessoa;
    this.enderecoFiltro.itemOrdenar = this.itemOrdenar;
    this.enderecoFiltro.itensPorPagina = this.itensPorPagina;
    this.enderecoFiltro.ordenacao = this.ordenacao;
    this.enderecoFiltro.pagina = this.pagina;
    this.enderecoFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.enderecoService.filtrar(this.enderecoFiltro).subscribe(
      (response) => {
        if (response) {
          this.enderecos = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.enderecos = new Array<Endereco>();
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

  selecao(enderecos: Array<Endereco>) {
    this.selecionados = enderecos;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterEnderecos('');
  }

  //#region Manter Endereco
  incluirEndereco() {
    const modalRef = this.modalService.open(ManterEnderecoComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.result.then((result) => {
      if (result) {
        this.pagina = 1;
        this.obterEnderecos();
      }
    });
  }

  editarEndereco() {
    const modalRef = this.modalService.open(ManterEnderecoComponent, {
      centered: true,
      size: 'lg',
    });
    if (this.selecionados && this.selecionados.length) {
      modalRef.componentInstance.idEndereco = this.selecionados[0].idEndereco;
    }
    modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.result.then((result) => {
      if (result) {
        this.obterEnderecos();
      }
    });
  }
  //#endregion

  // #region Exclusao de Endereco
  solicitarExclusao() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(),
        (reason) => { },
      );
  }

  private construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Cidade', 'cidade.nome', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Bairro', 'bairro', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Logradouro', 'logradouro', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Número', 'numero', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Tipo', 'tipo', CustomTableColumnType.enum, null, null, TipoEndereco),
      ],
      'check',
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.enderecoService.deletarBatch(this.selecionados).subscribe(
      (resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.pagina = 1;
        this.obterEnderecos();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
  // #endregion
}
