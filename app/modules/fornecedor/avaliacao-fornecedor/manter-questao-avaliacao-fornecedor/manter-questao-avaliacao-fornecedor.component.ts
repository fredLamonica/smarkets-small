import { Component, OnInit } from '@angular/core';
import { RespostaMultiplaEscolhaAvaliacaoFornecedor, TipoQuestao } from '@shared/models';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manter-questao-avaliacao-fornecedor',
  templateUrl: './manter-questao-avaliacao-fornecedor.component.html',
  styleUrls: ['./manter-questao-avaliacao-fornecedor.component.scss']
})
export class ManterQuestaoAvaliacaoFornecedorComponent implements OnInit {
  public form: FormGroup = this.contruirFormularioQuestao();
  public formResposta: FormGroup = this.contruirFormularioResposta();
  @BlockUI() blockUI: NgBlockUI;
  public TipoQuestao = TipoQuestao;
  public indexEditando: number = null;

  constructor(
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) {}

  ngOnInit() {}

  private contruirFormularioQuestao() {
    return this.fb.group({
      idQuestaoAvaliacaoFornecedor: [0],
      idAvaliacaoFornecedor: [0],
      descricao: ['', Validators.required],
      notaExplicativa: [''],
      tipo: [1, Validators.required],
      respostas: [new Array<RespostaMultiplaEscolhaAvaliacaoFornecedor>()],
      peso: [0, Validators.required],
      permiteComentario: [false, Validators.required],
      idTenant: [0]
    });
  }

  private contruirFormularioResposta() {
    return this.fb.group({
      idRespostaMultiplaEscolhaAvaliacaoFornecedor: [0],
      idQuestaoAvaliacaoFornecedor: [0],
      descricao: ['', Validators.required],
      valor: [0, Validators.required]
    });
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    if (this.form.valid) {
      if (this.form.controls.idQuestaoAvaliacaoFornecedor.value) {
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
      this.isNullOrWhitespace(this.form.controls.notaExplicativa.value) ||
      (!this.form.controls.respostas.value.some(
        x => x.idRespostaMultiplaEscolhaAvaliacaoFornecedor >= 0
      ) &&
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
      x => x.idRespostaMultiplaEscolhaAvaliacaoFornecedor >= 0
    );
    if (
      this.isNullOrWhitespace(this.form.controls.descricao.value) ||
      this.isNullOrWhitespace(this.form.controls.notaExplicativa.value) ||
      (!this.form.controls.respostas.value.some(
        x => x.idRespostaMultiplaEscolhaAvaliacaoFornecedor >= 0
      ) &&
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
          idRespostaMultiplaEscolhaAvaliacaoFornecedor: 0,
          idQuestaoAvaliacaoFornecedor: 0,
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

  public editarResposta(resposta: RespostaMultiplaEscolhaAvaliacaoFornecedor, index) {
    this.indexEditando = index;
    this.formResposta.patchValue(resposta);
  }

  public solicitarExclusaoResposta(index) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.excluirResposta(index),
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
}
