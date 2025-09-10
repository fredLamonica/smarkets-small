import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CriterioAvaliacaoPedido } from '@shared/models/pedido/criterio-avaliacao-pedido';
import { CriterioAvaliacaoService, TranslationLibraryService, CategoriaProdutoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CategoriaProduto } from '@shared/models';

@Component({
  selector: 'manter-criterio-avaliacao',
  templateUrl: './manter-criterio-avaliacao.component.html',
  styleUrls: ['./manter-criterio-avaliacao.component.scss']
})
export class ManterCriterioAvaliacaoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  public currentDate = this.getCurrentDate();

  private getCurrentDate(): string {
    return moment().format('YYYY-MM-DD');
  }

  public criterioAvaliacaoPedido: CriterioAvaliacaoPedido;

  public categorias: Array<CategoriaProduto>;

  constructor(
    private criterioAvaliacaoService: CriterioAvaliacaoService,
    private categoriaProdutoService: CategoriaProdutoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.carregarListas();

    if (this.criterioAvaliacaoPedido) {
      this.preencherFormulario();
    }
  }

  private carregarListas() {
    this.obterCategorias();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idCriterioAvaliacaoPedido: [0],
      descricao: [null, Validators.required],
      dataInicioVigencia: [null, Validators.required],
      dataFimVigencia: [null, Validators.required],
      categoriasProduto: [Array<CategoriaProduto>(), Validators.required] }
    )
  }

  private preencherFormulario() {
    this.form.patchValue(this.criterioAvaliacaoPedido);
    this.form.controls.dataInicioVigencia.patchValue(moment(this.criterioAvaliacaoPedido.dataInicioVigencia).format('YYYY-MM-DD'));
    this.form.controls.dataFimVigencia.patchValue(moment(this.criterioAvaliacaoPedido.dataFimVigencia).format('YYYY-MM-DD'));
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    if (!this.form.invalid && !this.isNullOrWhitespace(this.form.controls.descricao.value)) {
      if (this.form.controls.idCriterioAvaliacaoPedido.value) {
        this.alterar(this.form.value);
      }
      else {
        this.inserir(this.form.value);
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private inserir(criterio: CriterioAvaliacaoPedido) {
    this.blockUI.start();
    this.criterioAvaliacaoService.inserir(criterio).subscribe(
      response => {
        this.activeModal.close(response);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private alterar(criterio: CriterioAvaliacaoPedido) {
    this.blockUI.start();
    this.criterioAvaliacaoService.alterar(criterio).subscribe(
      response => {
        this.activeModal.close(response);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public obterCategorias() {
    this.categoriaProdutoService.listar().subscribe(
      response => {
        if (response)
          this.categorias = response;
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  
  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch{ }
    return a || b;
  }

  public selecionarTodos() {
    this.form.get('categoriasProduto').patchValue(this.categorias);
  }
  
}
