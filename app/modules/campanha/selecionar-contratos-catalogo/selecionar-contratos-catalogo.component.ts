import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratoCatalogo, Ordenacao, SituacaoContratoCatalogo } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ContratoCatalogoDto } from '../../../shared/models/contrato-catalogo/contrato-catalogo-dto';
import { ContratoCatalogoFiltro } from '../../../shared/models/fltros/contrato-catalogo-filtro';
import { ContratoCatalogoService } from '../../../shared/providers/contrato-catalogo.service';

@Component({
  selector: 'app-selecionar-contratos-catalogo',
  templateUrl: './selecionar-contratos-catalogo.component.html',
  styleUrls: ['./selecionar-contratos-catalogo.component.scss'],
})
export class SelecionarContratosCatalogoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  SituacaoContratoCatalogo = SituacaoContratoCatalogo;
  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'idContratoCatalogo';
  ordenacao: Ordenacao = Ordenacao.DESC;

  contratos: Array<ContratoCatalogoDto & { checked: boolean }>;

  contratoCatalogoFiltro: ContratoCatalogoFiltro = new ContratoCatalogoFiltro();

  // #region Seleção

  allSelected: boolean = false;

  private termo: string = '';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public contratoCatalogoService: ContratoCatalogoService,
  ) { }

  ngOnInit() {
    this.resetPaginacao();
    this.obterContratos();
  }

  buscar(termo: string) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterContratos();
  }

  resetPaginacao() {
    this.contratos = new Array<ContratoCatalogoDto & { checked: boolean }>();
    this.pagina = 1;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterContratos();
  }

  confirmar() {
    this.activeModal.close(this.contratos.filter((contrato) => contrato.checked));
  }

  fechar() {
    this.activeModal.close();
  }

  select(contrato: ContratoCatalogo & { checked: boolean }) {
    contrato.checked = !contrato.checked;
    if (this.contratos.findIndex(contrato => !contrato.checked) === -1) {
      this.allSelected = true;
    } else {
      this.allSelected = false;
    }
  }

  selectAll() {
    if (this.contratos.findIndex((contrato) => !contrato.checked) !== -1) {
      this.contratos.forEach((contrato) => contrato.checked = true);
      this.allSelected = true;
    } else {
      this.contratos.forEach((contrato) => contrato.checked = false);
      this.allSelected = false;
    }
  }

  private obterContratos() {

    this.contratoCatalogoFiltro.itensPorPagina = this.registrosPorPagina;
    this.contratoCatalogoFiltro.pagina = this.pagina;
    this.contratoCatalogoFiltro.itemOrdenar = this.ordenarPor;
    this.contratoCatalogoFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoFiltro.termo = this.termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoCatalogoService.filtrar(
      this.contratoCatalogoFiltro,
    ).subscribe(
      (response) => {
        if (response) {
          this.contratos = response.itens as Array<ContratoCatalogoDto & { checked: boolean }>;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.contratos = new Array<ContratoCatalogoDto & { checked: boolean }>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  // #endregion

}
