import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Marca, CustomTableSettings, CustomTableColumn, CustomTableColumnType } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TranslationLibraryService, ProdutoService, MarcaService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'manter-produto-marca',
  templateUrl: './manter-produto-marca.component.html',
  styleUrls: ['./manter-produto-marca.component.scss']
})
export class ManterProdutoMarcaComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input() marcas: Array<Marca>;

  @Input('id-produto') idProduto: number;

  @Output() atualizacao = new EventEmitter<Array<Marca>>()

  public form: FormGroup;

  public marcasLivres: Array<Marca>;

  public settings: CustomTableSettings;

  public marcasInclusao: Array<Marca>;
  public marcasExclusao: Array<Marca>;

  public itensPorPagina: number = 5;
  public totalPaginas: number;
  public pagina: number = 1;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private produtoService: ProdutoService,
    private marcaService: MarcaService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.construirTabelas();
  }

  public construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn("#", "idMarca", CustomTableColumnType.text, null, null),
        new CustomTableColumn("Código", "codigo", CustomTableColumnType.text, null, null),
        new CustomTableColumn("Marca", "nome", CustomTableColumnType.text, null, null)
      ], "check"
    );
  }

  public construirFormulario() {
    this.form = this.fb.group({
      termo: ['']
    })
  }

  // #region inclusao
  public abrirIncluirMarcas(content) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.marcasLivres = new Array<Marca>();
    let termo = this.form.value.termo;
    this.marcaService.filtrarMarcasProduto(this.idProduto, this.itensPorPagina, this.pagina, termo).subscribe(
      response => {
        if (response) {
          this.marcasLivres = response.itens;
          this.totalPaginas = response.numeroPaginas;
        }
        this.modalService.open(content, { size: 'lg', centered: true });
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public fecharIncluirMarcas() {
    this.marcasInclusao = new Array<Marca>();
    this.marcasLivres = new Array<Marca>();

    this.pagina = 1;
    this.itensPorPagina = 5;
    
    this.form.patchValue({ termo: '' });
    this.modalService.dismissAll();
  }

  public buscar() {
    this.pagina = 1;
    this.buscarMarcas();
  }

  public campoBuscaChanged(){
    let termo: string = this.form.value.termo;
    if (termo == null || termo.length == 0){
      this.buscar();
    }
  }

  public buscarMarcas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    let termo = this.form.value.termo;
    this.marcaService.filtrarMarcasProduto(this.idProduto, this.itensPorPagina, this.pagina, termo).subscribe(
      response => {
        if (response) {
          this.marcasLivres = response.itens;
          this.totalPaginas = response.numeroPaginas;
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public selecaoInclusao(marcas: Array<Marca>) {
    this.marcasInclusao = marcas;
  }

  public incluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.inserirMarcas(this.idProduto, this.marcasInclusao).subscribe(
      response => {
        this.marcas = this.marcas.concat(this.marcasInclusao);
        this.atualizacao.emit(this.marcas);
        this.fecharIncluirMarcas();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  // #endregion 

  // #region exclusao
  public selecaoExclusao(marcas: Array<Marca>) {
    this.marcasExclusao = marcas;
  }

  public solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(), 
      reason => {}
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.deletarMarcas(this.idProduto, this.marcasExclusao).subscribe(
      response => {
        let ids = this.marcasExclusao.map(m => { return m.idMarca });
        this.marcas = this.marcas.filter(m => !ids.find(i => i == m.idMarca));
        this.atualizacao.emit(this.marcas);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      }, responseError => {
        this.toastr.error(responseError.error);
        this.blockUI.stop();
      }
    );
  }
  // #endregion

  public paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.buscarMarcas();
  }

}