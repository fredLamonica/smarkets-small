import { Component, OnInit, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  QuestionarioGestaoFornecedorCriterioAvaliacao,
  Situacao,
  CustomTableSettings,
  CustomTableColumn,
  CustomTableColumnType,
  Ordenacao
} from '@shared/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationLibraryService, QuestionarioGestaoFornecedorService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'listar-questionario-fornecedor-criterio-avaliacao',
  templateUrl: './listar-questionario-fornecedor-criterio-avaliacao.component.html',
  styleUrls: ['./listar-questionario-fornecedor-criterio-avaliacao.component.scss']
})
export class ListarQuestionarioFornecedorCriterioAvaliacaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input('idQuestionarioGestaoFornecedor') idQuestionarioGestaoFornecedor: number;
  public criteriosAvaliacao: QuestionarioGestaoFornecedorCriterioAvaliacao[];
  public form: FormGroup;
  public selecionados = new Array<QuestionarioGestaoFornecedorCriterioAvaliacao>();

  public settings: CustomTableSettings;
  public itensPorPagina: number = 5;
  public totalPaginas: number;
  public Ordenacao = Ordenacao;
  public Situacao = Situacao;
  public pagina: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private questionarioGestaoFornecedorService: QuestionarioGestaoFornecedorService
  ) {}

  ngOnInit() {
    this.obterCriteriosAvaliacao();
    this.construirFormulario();
    this.construirTabelas();
  }

  public construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Descrição', 'descricao', CustomTableColumnType.text),
        new CustomTableColumn('Nota Início', 'notaInicio', CustomTableColumnType.text),
        new CustomTableColumn('Nota Fim', 'notaFim', CustomTableColumnType.text),
        new CustomTableColumn(
          'Situação',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          Situacao
        )
      ],
      'check'
    );
  }

  public construirFormulario() {
    this.form = this.formBuilder.group({
      idQuestionarioGestaoFornecedor: [this.idQuestionarioGestaoFornecedor],
      descricao: [null, Validators.required],
      notaInicio: [null],
      notaFim: [null],
      situacao: [Situacao.Ativo]
    });
  }

  public obterCriteriosAvaliacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.questionarioGestaoFornecedorService
      .filtrarCriterioAvaliacao(
        this.itensPorPagina,
        this.pagina,
        'qgfca.IdQuestionarioGestaoFornecedorCriterioAvaliacao',
        Ordenacao.ASC,
        this.idQuestionarioGestaoFornecedor
      )
      .subscribe(
        response => {
          if (response) {
            this.criteriosAvaliacao = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.criteriosAvaliacao = new Array<QuestionarioGestaoFornecedorCriterioAvaliacao>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public incluir() {
    if (this.form.controls.notaInicio.value == null) this.form.controls.notaInicio.setValue(0);
    if (this.form.controls.notaFim.value == null) this.form.controls.notaFim.setValue(0);
    if (this.validar()) {
      const criterioAvaliacao = this.form.value as QuestionarioGestaoFornecedorCriterioAvaliacao;

      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.questionarioGestaoFornecedorService
        .inserirCriterioAvaliacao(criterioAvaliacao)
        .subscribe(
          response => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.obterCriteriosAvaliacao();
          },
          error => {
            switch (error.error) {
              case 'A nota de início não pode ser maior do que a nota de fim':
              case 'Já existe um critério de avaliação ativo definido para o intervalo':
                this.toastr.warning(error.error);
                break;
              default:
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR
                );
                break;
            }
            this.blockUI.stop();
          }
        );
    }
  }

  private validar(): boolean {
    let formulario = this.form.value;
    if (this.isNullOrWhitespace(formulario.descricao) || this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (formulario.notaInicio > formulario.notaFim) {
      this.toastr.warning('A nota de início não pode ser maior do que a nota de fim');
      return false;
    }

    return true;
  }

  public solicitarExclusao() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.excluir(),
        reason => {}
      );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.questionarioGestaoFornecedorService
      .deletarCriterioAvaliacaoBatch(this.selecionados)
      .subscribe(
        response => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.pagina = 1;
          this.obterCriteriosAvaliacao();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public alterarSituacao(situacao: Situacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.questionarioGestaoFornecedorService
      .alterarSituacaoCriterioAvaliacaoBatch(this.selecionados, situacao)
      .subscribe(
        response => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.pagina = 1;
          this.obterCriteriosAvaliacao();
        },
        error => {
          switch (error.error) {
            case 'Já existe um critério de avaliação ativo para o intervalo de um ou mais critérios selecionados':
              this.toastr.warning(error.error);
              break;
            default:
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              break;
          }
          this.blockUI.stop();
        }
      );
  }

  public selecao(criterios: Array<QuestionarioGestaoFornecedorCriterioAvaliacao>) {
    this.selecionados = criterios;
  }

  public paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterCriteriosAvaliacao();
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }
}
