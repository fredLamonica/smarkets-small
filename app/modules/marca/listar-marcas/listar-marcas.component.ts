import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MarcaService, TranslationLibraryService } from '@shared/providers';
import { Marca, CustomTableSettings, CustomTableColumn, CustomTableColumnType, Ordenacao } from '@shared/models';
import { Router } from '@angular/router';
import { ModalConfirmacaoExclusao } from "@shared/components";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-listar-marcas',
  templateUrl: './listar-marcas.component.html',
  styleUrls: ['./listar-marcas.component.scss']
})
export class ListarMarcasComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  public marcas: Array<Marca>;
  closeResult: string;

  public settings: CustomTableSettings;
  public selecionados: Array<Marca>;

  public registrosPorPagina: number = 5;
  public pagina: number = 1;
  public totalPaginas: number = 0;
  public ordenarPor: string = "idMarca";
  public ordenacao: Ordenacao = Ordenacao.DESC;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private marcaService: MarcaService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.configurarTabela();
    this.construirFormulario();
    this.obterMarcas();
  }
  
  public construirFormulario() {
    this.form = this.fb.group({
      termo: ['']
    })
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn("#", "idMarca", CustomTableColumnType.text, null, null, null, "idMarca"),
        new CustomTableColumn("Código", "codigo", CustomTableColumnType.text, null, null, null, "codigo"),
        new CustomTableColumn("Marca", "nome", CustomTableColumnType.text, null, null, null, "nome")
      ], "check", this.ordenarPor, this.ordenacao
    );
  }

  public buscar(){
    this.pagina = 1;
    this.obterMarcas();
  }

  // CALLBACK de ordenação
  public ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterMarcas();
  }

  private obterMarcas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.marcaService.filtrar(this.registrosPorPagina, this.pagina, this.ordenarPor, this.ordenacao, this.form.value.termo).subscribe(
      response => {
        if (response) {
          this.marcas = response.itens;
          this.totalPaginas = response.numeroPaginas;
        }
        else {
          this.marcas = new Array<Marca>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(),
      reason => {});
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.marcaService.excluir(this.selecionados[0].idMarca).subscribe(resultado => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.pagina = 1;
      this.obterMarcas();
    }, responseError => {
      this.toastr.error(responseError.error);
      this.blockUI.stop();
    });
  }

  public selecao(marcas: Array<Marca>) {
    this.selecionados = marcas;
  }

  // #region paginacao

  public paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterMarcas();
  }

  public campoBuscaChanged(){
    let termo: string = this.form.value.termo;
    if (termo == null || termo.length == 0){
      this.buscar();
    }
  }


  //#endregion
}
