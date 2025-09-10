import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  AvaliacaoFornecedorService,
  TranslationLibraryService,
  AutenticacaoService,
  CategoriaFornecimentoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  QuestaoAvaliacaoFornecedor,
  AvaliacaoFornecedor,
  RespostaMultiplaEscolhaAvaliacaoFornecedor,
  CategoriaFornecimento
} from '@shared/models';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { ManterQuestaoAvaliacaoFornecedorComponent } from '../manter-questao-avaliacao-fornecedor/manter-questao-avaliacao-fornecedor.component';
import * as moment from 'moment';

@Component({
  selector: 'app-manter-avaliacao-fornecedor',
  templateUrl: './manter-avaliacao-fornecedor.component.html',
  styleUrls: ['./manter-avaliacao-fornecedor.component.scss']
})
export class ManterAvaliacaoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public form: FormGroup = this.contruirFormulario();
  public termo: string = '';
  private idAvaliacaoFornecedor: number;
  private paramsSub: Subscription;
  public categorias: Array<CategoriaFornecimento>;

  constructor(
    private avaliacaoFornecedorService: AvaliacaoFornecedorService,
    private authService: AutenticacaoService,
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private translationLibrary: TranslationLibraryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.contruirFormulario;
    this.obterParametros();
    this.carregarListas();
  }

  private contruirFormulario() {
    return this.fb.group({
      idAvaliacaoFornecedor: [0],
      nome: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      introducao: ['', Validators.required],
      questoes: [Array<QuestaoAvaliacaoFornecedor>()],
      idTenant: [0],
      categoriasFornecimento: [Array<CategoriaFornecimento>(), Validators.required]
    });
  }

  private async carregarListas() {
    try {
      if (this.idAvaliacaoFornecedor) {
        this.form.patchValue(await this.obterAvaliacaoFornecedor());
        if (!this.form.controls.idAvaliacaoFornecedor.value) {
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

  private async obterAvaliacaoFornecedor(): Promise<AvaliacaoFornecedor> {
    return this.avaliacaoFornecedorService.obterPorId(this.idAvaliacaoFornecedor).toPromise();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idAvaliacaoFornecedor = +params['idAvaliacaoFornecedor'];
    });
  }

  public obterCategorias() {
    let idTenant = this.authService.usuario().permissaoAtual.idTenant;
    this.categoriaFornecimentoService.obter().subscribe(
      response => {
        if (response) this.categorias = response;
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public incluirQuestao(idAvaliacaoFornecedor: number) {
    const modalRef = this.modalService.open(ManterQuestaoAvaliacaoFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.form.controls.idAvaliacaoFornecedor.setValue(idAvaliacaoFornecedor);
    modalRef.result.then(result => {
      if (result) {
        let idProvisorio: number;
        let questoes: Array<QuestaoAvaliacaoFornecedor> = this.form.controls.questoes.value;
        if (questoes.length == 0) idProvisorio = 1;
        else idProvisorio = questoes[questoes.length - 1].idQuestaoAvaliacaoFornecedor + 1;
        result.idQuestaoAvaliacaoFornecedor = idProvisorio;
        questoes.push(result);
      }
    });
  }

  public solicitarExclusao(idQuestao: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.excluirQuestao(idQuestao),
        reason => {}
      );
  }

  private excluirQuestao(idQuestao: number) {
    this.form.controls.questoes.setValue(
      this.form.controls.questoes.value.filter(c => c.idQuestaoAvaliacaoFornecedor != idQuestao)
    );
  }

  public editarQuestao(questaoAvaliacaoFornecedor: QuestaoAvaliacaoFornecedor) {
    const modalRef = this.modalService.open(ManterQuestaoAvaliacaoFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    let questao = this.criaCopiaQuestao(questaoAvaliacaoFornecedor);
    modalRef.componentInstance.form.patchValue(questao);
    modalRef.result.then(result => {
      if (result) {
        const index = this.form.controls.questoes.value.findIndex(
          obj => obj.idQuestaoAvaliacaoFornecedor == result.idQuestaoAvaliacaoFornecedor
        );
        this.form.controls.questoes.value.splice(index, 1, result);
      }
    });
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }

  public salvar() {
    if (this.validarAvaliacao()) {
      if (this.form.controls.idAvaliacaoFornecedor.value) {
        this.alterar();
      } else {
        this.adicionar();
      }
    }
  }

  private validarAvaliacao(): boolean {
    if (
      this.form.invalid ||
      this.isNullOrWhitespace(this.form.controls.nome.value) ||
      this.isNullOrWhitespace(this.form.controls.introducao.value) ||
      this.isNullOrWhitespace(this.form.controls.dataInicio.value) ||
      this.isNullOrWhitespace(this.form.controls.dataFim.value)
    ) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    } else {
      let dataInicio = moment(this.form.controls.dataInicio.value).toDate();
      let dataFim = moment(this.form.controls.dataFim.value).toDate();
      let dataHoraAtual = moment().toObject();
      let hoje = new Date(dataHoraAtual.years, dataHoraAtual.months, dataHoraAtual.date);

      if (dataInicio < hoje) {
        this.toastr.warning('A data de início da Avaliação não pode ser anterior à data de hoje');
        return false;
      } else {
        if (dataFim < dataInicio) {
          this.toastr.warning('A data final da Avaliação não pode ser anterior à data de início');
          return false;
        } else {
          return true;
        }
      }
    }
  }

  private adicionar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.avaliacaoFornecedorService.inserir(this.form.value).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.router.navigate(['./../'], { relativeTo: this.route });
      },
      error => {
        switch (error.error) {
          case 'Já existe uma Avaliação com o nome de "' + this.form.controls.nome.value + '"':
          case 'A data final da Avaliação não pode ser anterior à data de início':
          case 'A data de início da Avaliação não pode ser anterior à data de hoje':
            this.toastr.error(error.error);
            break;
          default:
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  private alterar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.avaliacaoFornecedorService.alterar(this.form.value).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.router.navigate(['./../'], { relativeTo: this.route });
      },
      error => {
        switch (error.error) {
          case 'Já existe uma Avaliação com o nome de "' + this.form.controls.nome.value + '"':
          case 'A data final da Avaliação não pode ser anterior à data de início':
          case 'A data de início da Avaliação não pode ser anterior à data de hoje':
            this.toastr.error(error.error);
            break;
          default:
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  public cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  private criaCopiaQuestao(questao: QuestaoAvaliacaoFornecedor): QuestaoAvaliacaoFornecedor {
    let questaoNova = new QuestaoAvaliacaoFornecedor(
      questao.idQuestaoAvaliacaoFornecedor,
      questao.idAvaliacaoFornecedor,
      questao.peso,
      questao.tipo,
      questao.descricao,
      questao.notaExplicativa,
      questao.permiteComentario,
      new Array<RespostaMultiplaEscolhaAvaliacaoFornecedor>(),
      questao.idTenant
    );
    questao.respostas.map(r => questaoNova.respostas.push(r));

    return questaoNova;
  }
}
