import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoQuestao, RespostaMultiplaEscolhaFornecedor } from '@shared/models';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { CategoriaQuestao } from '@shared/models/categoria-questao';
import { QuestaoGestaoFornecedorService } from '@shared/providers/questao-gestao-fornecedor.service';

@Component({
  selector: 'app-questao-gestao-fornecedor',
  templateUrl: './questao-gestao-fornecedor.component.html',
  styleUrls: ['./questao-gestao-fornecedor.component.scss']
})
export class QuestaoGestaoFornecedorComponent implements OnInit {
  public form: FormGroup = this.contruirFormularioQuestao();
  public formResposta: FormGroup = this.contruirFormularioResposta();
  @BlockUI() blockUI: NgBlockUI;
  public TipoQuestao = TipoQuestao;
  public indexEditando: number = null;
  public categoriasQuestao: Array<CategoriaQuestao>;

  constructor(
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public questaoGestaoFornecedorService: QuestaoGestaoFornecedorService
  ) {}

  ngOnInit() {}

  private contruirFormularioQuestao() {
    return this.fb.group({
      idQuestaoGestaoFornecedor: [0],
      idQuestionarioGestaoFornecedor: [0],
      descricao: ['', Validators.required],
      notaExplicativa: [''],
      tipo: [1, Validators.required],
      respostas: [new Array<RespostaMultiplaEscolhaFornecedor>()],
      peso: [0, Validators.required],
      permiteComentario: [false, Validators.required],
      idTenant: [0],
      idCategoriaQuestao: [0, Validators.required],
      categoriaQuestao: [CategoriaQuestao]
    });
  }

  private contruirFormularioResposta() {
    return this.fb.group({
      idRespostaMultiplaEscolhaFornecedor: [0],
      idQuestaoGestaoFornecedor: [0],
      descricao: ['', Validators.required],
      valor: [0, Validators.required]
    });
  }

  public cancelar() {
    this.activeModal.close();
  }

  public incluir() {
    if (this.form.valid && this.form.value.idCategoriaQuestao != 0) {
      if (this.form.controls.idQuestaoGestaoFornecedor.value) {
        this.alterar();
      } else {
        this.adicionar();
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  public adicionar() {
    if (
      this.isNullOrWhitespace(this.form.controls.descricao.value) ||
      (!this.form.controls.respostas.value.some(x => x.idRespostaMultiplaEscolhaFornecedor >= 0) &&
        this.form.controls.tipo.value == 2)
    ) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    } else {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      try {
        this.activeModal.close(this.form.value);
        this.blockUI.stop();
      } catch {
        this.blockUI.stop();
      }
    }
  }

  public alterar() {
    var a = !this.form.controls.respostas.value.some(
      x => x.idRespostaMultiplaEscolhaFornecedor >= 0
    );
    if (
      this.isNullOrWhitespace(this.form.controls.descricao.value) ||
      (!this.form.controls.respostas.value.some(x => x.idRespostaMultiplaEscolhaFornecedor >= 0) &&
        this.form.controls.tipo.value == 2)
    ) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    } else {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      try {
        this.activeModal.close(this.form.value);
        this.blockUI.stop();
      } catch {
        this.blockUI.stop();
      }
    }
  }

  public incluirRespostaMultiplaEscolha() {
    if (
      this.formResposta.valid &&
      !this.isNullOrWhitespace(this.formResposta.controls.descricao.value)
    ) {
      let index = this.form.controls.respostas.value.findIndex(
        r => r.descricao == this.formResposta.controls.descricao.value
      );
      if (index < 0 || index == this.indexEditando) {
        if (this.indexEditando != null) {
          this.form.controls.respostas.value.splice(this.indexEditando, 1, this.formResposta.value);
          this.indexEditando = null;
        } else {
          this.form.controls.respostas.value.push(this.formResposta.value);
        }
        this.formResposta.patchValue({
          idRespostaMultiplaEscolhaFornecedor: 0,
          idQuestaoGestaoFornecedor: 0,
          descricao: '',
          valor: 0
        });
      } else {
        this.toastr.warning('Já existe uma resposta com essa descrição para essa mesma pergunta');
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  public editarResposta(resposta: RespostaMultiplaEscolhaFornecedor, index) {
    this.indexEditando = index;
    this.formResposta.patchValue(resposta);
  }

  public solicitarExclusaoResposta(resposta) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.excluirResposta(resposta),
        reason => {}
      );
  }

  private excluirResposta(index) {
    this.form.controls.respostas.value.splice(index, 1);
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }

  public alterarCategoria(categoriaQuestao: CategoriaQuestao) {
    this.form.controls['categoriaQuestao'].setValue(categoriaQuestao);
  }
}
