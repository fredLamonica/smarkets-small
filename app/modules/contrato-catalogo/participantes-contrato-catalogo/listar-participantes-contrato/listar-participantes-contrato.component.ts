import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { ContratoCatalogoParticipante, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, SituacaoContratoCatalogoItem } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ContratoCatalogoParticipanteFiltro } from '../../../../shared/models/fltros/contrato-catalogo-participante-filtro';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { ManterParticipanteContratoComponent } from '../manter-participante-contrato/manter-participante-contrato.component';
import { ManterParticipanteItensContratoComponent } from './../manter-participante-itens-contrato/manter-participante-itens-contrato.component';
import { VincularItemParticipanteContratoComponent } from './../vincular-item-participante-contrato/vincular-item-participante-contrato.component';

@Component({
  selector: 'listar-participantes-contrato',
  templateUrl: './listar-participantes-contrato.component.html',
  styleUrls: ['./listar-participantes-contrato.component.scss'],
})
export class ListarParticipantesContratoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input('id-contrato') idContrato: number;

  @Output() atualizacao = new EventEmitter<any>();

  Situacao = SituacaoContratoCatalogoItem;

  settings: CustomTableSettings;
  participantes: Array<ContratoCatalogoParticipante>;
  selecionados: Array<ContratoCatalogoParticipante>;
  isSmarkets: boolean = false;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenarPor: string = 'IdContratoCatalogoParticipante';
  ordenacao: Ordenacao = Ordenacao.DESC;
  form: FormGroup;

  contratoCatalogoParticipanteFiltro: ContratoCatalogoParticipanteFiltro = new ContratoCatalogoParticipanteFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private errorService: ErrorService,
    private authService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.construirTabelas();
    this.obterParticipantes();
    this.isSmarkets = this.authService.usuario().permissaoAtual.isSmarkets;
    this.construirFormulario();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Empresa', 'pessoaJuridica.nomeFantasia', CustomTableColumnType.text, null, null, null, 'nomeFantasia'),
        new CustomTableColumn('Rasão social', 'pessoaJuridica.razaoSocial', CustomTableColumnType.text, null, null, null, 'razaoSocial'),
        new CustomTableColumn('CNPJ', 'pessoaJuridica.cnpj', CustomTableColumnType.text, null, null, null, 'cnpj'),
        new CustomTableColumn('Situação', 'situacao', CustomTableColumnType.enum, null, null, SituacaoContratoCatalogoItem),
      ], 'check', this.ordenarPor, this.ordenacao,
    );
  }

  buscar() {
    this.pagina = 1;
    this.obterParticipantes(this.form.value.termo);
  }

  campoBuscaChanged() {
    const termo: string = this.form.value.termo;
    if (termo === null || termo.length === 0) {
      this.buscar();
    }
  }

  // CALLBACK de ordenação
  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterParticipantes(this.form.value.termo);
  }

  selecao(participantes: Array<ContratoCatalogoParticipante>) {
    this.selecionados = participantes;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterParticipantes(this.form.value.termo);
  }

  // #region Deleção
  solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }
  // #endregion

  // #region Alterar situacao
  alterarSituacao(situacao: SituacaoContratoCatalogoItem) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.alterarSituacaoParticipantesContratoBatch(this.idContrato, this.selecionados, situacao).subscribe((resultado) => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();

      this.obterParticipantes();
    }, (error) => {
      this.errorService.treatError(error);
      this.blockUI.stop();
    });
  }
  // #endregion

  //#region  Modal Manter Participantes
  incluir() {
    const modalRef = this.modalService.open(ManterParticipanteContratoComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idContrato = this.idContrato;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.atualizacao.emit({ length: result.length });
          this.pagina = 1;
          this.obterParticipantes();
        }
      },
    );
  }

  vincularItem() {
    const modalRef = this.modalService.open(VincularItemParticipanteContratoComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idContrato = this.idContrato;
    modalRef.componentInstance.participante = this.selecionados[0];
  }

  //#endregion

  abrirItensPorEmpresa() {
    const modalRef = this.modalService.open(ManterParticipanteItensContratoComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idContrato = this.idContrato;
    modalRef.componentInstance.participante = this.selecionados[0];
  }

  private construirFormulario() {
    this.form = this.fb.group({
      termo: [''],
    });
  }

  private obterParticipantes(termo: string = '') {

    this.contratoCatalogoParticipanteFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoParticipanteFiltro.itensPorPagina = this.itensPorPagina;
    this.contratoCatalogoParticipanteFiltro.pagina = this.pagina;
    this.contratoCatalogoParticipanteFiltro.itemOrdenar = this.ordenarPor;
    this.contratoCatalogoParticipanteFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoParticipanteFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.filtrarParticipantesContrato(this.contratoCatalogoParticipanteFiltro).subscribe(
      (response) => {
        if (response) {
          this.participantes = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.participantes = new Array<ContratoCatalogoParticipante>();
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
    this.contratoService.deletarParticipantesContratoBatch(this.idContrato, this.selecionados).subscribe((resultado) => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.atualizacao.emit({ length: this.selecionados.length * -1 });
      this.pagina = 1;
      this.obterParticipantes();
    }, (error) => {
      this.errorService.treatError(error);
      this.blockUI.stop();
    });
  }

}
