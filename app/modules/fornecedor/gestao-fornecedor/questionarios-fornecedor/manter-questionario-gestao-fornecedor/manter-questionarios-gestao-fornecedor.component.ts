import { CategoriaQuestao } from '@shared/models/categoria-questao';
import { Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QuestionarioGestaoFornecedor } from '@shared/models/questionario-gestao-fornecedor';
import { Component, OnInit } from '@angular/core';
import { QuestaoGestaoFornecedor } from '@shared/models/questao-gestao-fornecedor';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import {
  TranslationLibraryService,
  AutenticacaoService,
  CategoriaFornecimentoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { Subscription } from 'rxjs';
import { QuestionarioGestaoFornecedorService } from '@shared/providers/questionario-gestao-fornecedor.service';
import {
  RespostaMultiplaEscolhaFornecedor,
  CategoriaFornecimento,
  QuestionarioGestaoFornecedorCriterioAvaliacao
} from '@shared/models';
import { QuestaoGestaoFornecedorComponent } from '../questao-gestao-fornecedor/questao-gestao-fornecedor.component';
import { ManterCategoriasQuestoesGestaoFornecedorComponent } from '../manter-categorias-questoes-gestao-fornecedor/manter-categorias-questoes-gestao-fornecedor.component';
import { QuestaoGestaoFornecedorService } from '@shared/providers/questao-gestao-fornecedor.service';

@Component({
  selector: 'app-manter-questionarios-gestao-fornecedor',
  templateUrl: './manter-questionarios-gestao-fornecedor.component.html',
  styleUrls: ['./manter-questionarios-gestao-fornecedor.component.scss']
})
export class ManterQuestionariosGestaoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public form: FormGroup = this.contruirFormulario();
  public termo: string = '';
  private idQuestionarioGestaoFornecedor: number;
  private paramsSub: Subscription;
  public categorias: Array<CategoriaFornecimento>;
  public tabAtiva:
    | 'questionario-gestao-fornecedor'
    | 'questoes-gestao-fornecedor'
    | 'categorias-questoes-gestao-fornecedor';
  public permitirExibirCriteriosAvaliacao = false;
  private idCategoriaQuestaoProvisorio: number = -1;
  private idQuestaoProvisorio: number = -1;

  public categoriaQuestoes: Array<CategoriaQuestao>;

  constructor(
    private questionarioGestaoFornecedorService: QuestionarioGestaoFornecedorService,
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private translationLibrary: TranslationLibraryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
    public questaoGestaoFornecedorService: QuestaoGestaoFornecedorService
  ) {}

  ngOnInit() {
    this.selectTab();
    this.obterParametros();
    this.carregarListas();
  }

  private contruirFormulario() {
    return this.fb.group({
      idQuestionarioGestaoFornecedor: [0],
      nome: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      introducao: ['', Validators.required],
      questoes: [Array<QuestaoGestaoFornecedor>()],
      categoriasQuestao: [Array<CategoriaQuestao>()],
      idTenant: [0],
      categoriasFornecimento: [Array<CategoriaFornecimento>(), Validators.required],
      criteriosAvaliacao: [Array<QuestionarioGestaoFornecedorCriterioAvaliacao>()],
      usaTodasCategorias: [false]
    });
  }

  private async carregarListas() {
    try {
      if (this.idQuestionarioGestaoFornecedor) {
        this.form.patchValue(await this.obterQuestionarioGestaoFornecedor());
        if (!this.form.controls.idQuestionarioGestaoFornecedor.value) {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
      this.obterCategorias();
    } catch {
      this.translationLibrary.translations.ALERTS.this.toastr.error(
        this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async obterQuestionarioGestaoFornecedor(): Promise<QuestionarioGestaoFornecedor> {
    return this.questionarioGestaoFornecedorService
      .obterPorId(this.idQuestionarioGestaoFornecedor)
      .toPromise();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idQuestionarioGestaoFornecedor = +params['idQuestionarioGestaoFornecedor'];
    });
  }

  public obterCategorias() {
    this.categoriaFornecimentoService.obter().subscribe(
      response => {
        if (response) this.categorias = response;
        if (this.form.controls.usaTodasCategorias.value)
          this.form.controls.categoriasFornecimento.patchValue(this.categorias);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public incluirQuestao(idQuestionarioGestaoFornecedor: number) {
    const modalRef = this.modalService.open(QuestaoGestaoFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.categoriasQuestao = this.form.controls.categoriasQuestao.value;
    modalRef.componentInstance.form.controls.idQuestionarioGestaoFornecedor.setValue(
      idQuestionarioGestaoFornecedor
    );

    modalRef.result.then(result => {
      if (result) {
        var questoes: Array<QuestaoGestaoFornecedor> = this.form.controls.questoes.value;
        result.idQuestaoGestaoFornecedor = this.idQuestaoProvisorio;
        this.form.controls.questoes.value.push(result);
        this.idQuestaoProvisorio -= 1;
      }
    });
  }

  public solicitarExclusao(questionarioGestaoFornecedor: QuestaoGestaoFornecedor) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.deletar(questionarioGestaoFornecedor.idQuestaoGestaoFornecedor),
        reason => {}
      );
  }

  public deletar(id: number) {
    this.form.controls.questoes.setValue(
      this.form.controls.questoes.value.filter(c => c.idQuestaoGestaoFornecedor != id)
    );
  }

  public editar(questaoGestaoFornecedor: QuestaoGestaoFornecedor) {
    const modalRef = this.modalService.open(QuestaoGestaoFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    let questao = this.criaCopiaQuestao(questaoGestaoFornecedor);
    modalRef.componentInstance.categoriasQuestao = this.form.controls.categoriasQuestao.value;
    modalRef.componentInstance.form.patchValue(questao);

    modalRef.result.then(result => {
      if (result) {
        const index = this.form.controls.questoes.value.findIndex(
          obj => obj.idQuestaoGestaoFornecedor == result.idQuestaoGestaoFornecedor
        );
        this.form.controls.questoes.value.splice(index, 1, result);
      }
    });
  }

  public onAuditoriaClick(IdQuestaoGestaoFornecedor: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'QuestaoGestaoFornecedor';
    modalRef.componentInstance.idEntidade = IdQuestaoGestaoFornecedor;
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }

  public selectTab(
    aba?:
      | 'questionario-gestao-fornecedor'
      | 'questoes-gestao-fornecedor'
      | 'categorias-questoes-gestao-fornecedor'
  ) {
    if (!aba) this.tabAtiva = 'questionario-gestao-fornecedor';
    else this.tabAtiva = aba;
  }

  public salvar() {
    if (
      this.form.invalid ||
      this.isNullOrWhitespace(this.form.controls.nome.value) ||
      this.isNullOrWhitespace(this.form.controls.introducao.value) ||
      this.isNullOrWhitespace(this.form.controls.dataInicio.value) ||
      this.isNullOrWhitespace(this.form.controls.dataFim.value)
    ) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    } else {
      if (this.form.controls.categoriasFornecimento.value.length == this.categorias.length) {
        this.form.controls.usaTodasCategorias.patchValue(true);
      } else this.form.controls.usaTodasCategorias.patchValue(false);

      let dataInicio = new Date(this.form.controls.dataInicio.value);
      let dataFim = new Date(this.form.controls.dataFim.value);
      if (dataInicio.getTime() < dataFim.getTime()) {
        if (this.form.controls.idQuestionarioGestaoFornecedor.value) {
          this.alterar();
        } else {
          this.adicionar();
        }
      } else {
        this.toastr.warning('A data de início não pode ser maior que a data final');
      }
    }
  }

  private adicionar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.questionarioGestaoFornecedorService.inserir(this.form.value).subscribe(
      response => {
        if (response.usaTodasCategorias)
          response.categoriasFornecimento = this.categorias.map(categoria => categoria);
        this.form.patchValue(response);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        document.getElementById('questionarioGestaoFornecedor-tab').click();
        this.navegarQuestionario(response.idQuestionarioGestaoFornecedor);
      },
      error => {
        if (
          error.error ==
          'Já existe um Questionário com o nome de "' + this.form.controls.nome.value + '"'
        ) {
          this.toastr.error(error.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  private alterar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.questionarioGestaoFornecedorService.alterar(this.form.value).subscribe(
      response => {
        if (response.usaTodasCategorias)
          response.categoriasFornecimento = this.categorias.map(categoria => categoria);
        this.form.patchValue(response);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        if (
          error.error ==
          'Já existe um Questionário com o nome de "' + this.form.controls.nome.value + '"'
        ) {
          this.toastr.error(error.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  private navegarQuestionario(idQuestionario: number) {
    this.router.navigate(['../', idQuestionario], { relativeTo: this.route });
  }

  public cancelar() {
    this.router.navigate(['./../../'], { relativeTo: this.route });
  }

  private criaCopiaQuestao(questaoGestaoFornecedor: QuestaoGestaoFornecedor) {
    let questao = new QuestaoGestaoFornecedor();
    questao.descricao = questaoGestaoFornecedor.descricao;
    questao.idQuestaoGestaoFornecedor = questaoGestaoFornecedor.idQuestaoGestaoFornecedor;
    questao.idQuestionarioGestaoFornecedor = questaoGestaoFornecedor.idQuestionarioGestaoFornecedor;
    questao.idTenant = questaoGestaoFornecedor.idTenant;
    questao.notaExplicativa = questaoGestaoFornecedor.notaExplicativa;
    questao.permiteComentario = questaoGestaoFornecedor.permiteComentario;
    questao.peso = questaoGestaoFornecedor.peso;
    questao.tipo = questaoGestaoFornecedor.tipo;
    questao.respostas = new Array<RespostaMultiplaEscolhaFornecedor>();
    questao.idCategoriaQuestao = questaoGestaoFornecedor.idCategoriaQuestao;
    questaoGestaoFornecedor.respostas.map(r => questao.respostas.push(r));

    let catQuestao = questaoGestaoFornecedor.categoriaQuestao;

    questao.categoriaQuestao = new CategoriaQuestao(
      catQuestao.idCategoriaQuestao,
      catQuestao.descricao,
      catQuestao.notaExplicativa,
      catQuestao.peso,
      catQuestao.notaCategoria,
      catQuestao.idTenant
    );

    return questao;
  }

  public toggleUsoTodasCategorias() {
    if (!this.form.controls.usaTodasCategorias.value) {
      this.form.controls.categoriasFornecimento.patchValue(this.categorias);
      this.form.controls.usaTodasCategorias.patchValue(true);
    } else {
      this.form.controls.categoriasFornecimento.patchValue(new Array<CategoriaFornecimento>());
      this.form.controls.usaTodasCategorias.patchValue(false);
    }
  }

  //#region  Categoria Questões
  public incluirCategoria() {
    const modalRef = this.modalService.open(ManterCategoriasQuestoesGestaoFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.idQuestionarioGestaoFornecedor = this.form.getRawValue().idQuestionarioGestaoFornecedor;

    modalRef.result.then(result => {
      if (result) {
        result.idCategoriaQuestao = this.idCategoriaQuestaoProvisorio;
        let categoriasQuestao = this.form.controls.categoriasQuestao.value;
        categoriasQuestao.push(result);
        this.idCategoriaQuestaoProvisorio -= 1;
      }
    });
  }

  public editarCategoria($event: Event) {
    const modalRef = this.modalService.open(ManterCategoriasQuestoesGestaoFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.categoriaQuestao = $event;

    modalRef.result.then(result => {
      if (result) {
        const index = this.form.controls.categoriasQuestao.value.findIndex(
          obj => obj.idCategoriaQuestao == result.idCategoriaQuestao
        );
        this.form.controls.categoriasQuestao.value.splice(index, 1, result);
      }
    });
  }

  // private obterCategoriasQuestoes() {
  //   this.questaoGestaoFornecedorService.obterCategoriaQuestao().subscribe(
  //     response => {
  //       if (response) this.categoriaQuestoes = response;
  //       this.blockUI.stop();
  //     },
  //     error => {
  //       this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
  //       this.blockUI.stop();
  //     }
  //   );
  // }

  public solicitarExluirCategoriaQuestao(idCategoriaQuestao: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.exluirCategoriaQuestao(idCategoriaQuestao),
        reason => {}
      );
  }

  private exluirCategoriaQuestao(idCategoriaQuestao: number) {
    let categoriasQuestao = this.form.controls.categoriasQuestao;
    categoriasQuestao.setValue(
      categoriasQuestao.value.filter(cq => cq.idCategoriaQuestao != idCategoriaQuestao)
    );
  }

  //#region Categoria Questões
  public exibirCriteriosAvaliacao() {
    this.permitirExibirCriteriosAvaliacao = true;
  }
}
