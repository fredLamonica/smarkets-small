import { CategoriaQuestao } from '@shared/models/categoria-questao';
import { QuestaoGestaoFornecedorService } from './../../../../../shared/providers/questao-gestao-fornecedor.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'manter-categorias-questoes-gestao-fornecedor',
  templateUrl: './manter-categorias-questoes-gestao-fornecedor.component.html',
  styleUrls: ['./manter-categorias-questoes-gestao-fornecedor.component.scss']
})
export class ManterCategoriasQuestoesGestaoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  private idQuestionarioGestaoFornecedor: number = 0;
  public form: FormGroup;

  public categoriaQuestao: CategoriaQuestao;

  constructor(
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public questaoGestaoFornecedorService: QuestaoGestaoFornecedorService
  ) {}

  ngOnInit() {
    this.contruirFormularioQuestao();

    if (this.categoriaQuestao) {
      this.preencherFormularioQuestao();
    }
  }

  private contruirFormularioQuestao() {
    this.form = this.fb.group({
      idCategoriaQuestao: [0],
      idQuestionarioGestaoFornecedor: [this.idQuestionarioGestaoFornecedor],
      descricao: ['', Validators.required],
      notaExplicativa: ['', Validators.required],
      peso: [0, Validators.required],
      idTenant: [0]
    });
  }

  private preencherFormularioQuestao() {
    this.form.patchValue(this.categoriaQuestao);
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    if (this.form.valid) {
      this.activeModal.close(this.form.value);
    }
  }

  private inserir(categoriaQuestao: CategoriaQuestao) {
    this.blockUI.start();
    this.questaoGestaoFornecedorService.inserirCategoriaQuestao(categoriaQuestao).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success(
            'Falha ao inserir nova categoria questão. Por favor, tente novamente.'
          );
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  private alterar(categoriaQuestao: CategoriaQuestao) {
    this.blockUI.start();
    this.questaoGestaoFornecedorService.alterarCategoriaQuestao(categoriaQuestao).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success('Falha ao alterar categoria questão. Por favor, tente novamente.');
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }
}
