import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionarioGestaoFornecedor } from '@shared/models/questionario-gestao-fornecedor';
import { QuestionarioGestaoFornecedorService } from '@shared/providers/questionario-gestao-fornecedor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao, AuditoriaComponent } from '@shared/components';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { TranslationLibraryService } from '@shared/providers';
import { CategoriaFornecimento } from '@shared/models';

@Component({
  selector: 'listar-questionarios-fornecedor',
  templateUrl: './listar-questionarios-fornecedor.component.html',
  styleUrls: ['./listar-questionarios-fornecedor.component.scss']
})
export class ListarQuestionariosFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public questionarios: Array<QuestionarioGestaoFornecedor> =
    new Array<QuestionarioGestaoFornecedor>();

  private totalPaginas: number;
  public pagina = 1;
  private itemOrdenacao: string = 'q.IdQuestionarioGestaoFornecedor';
  private termo: string = '';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private questionarioGestaoFornecedorService: QuestionarioGestaoFornecedorService
  ) {}

  ngOnInit() {
    this.ResetPagination();
    this.Hydrate();
  }

  ResetPagination() {
    this.questionarios = new Array<QuestionarioGestaoFornecedor>();
    this.pagina = 1;
  }

  onScroll(termo?: string) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.Hydrate(termo);
    }
  }

  Hydrate(termo?: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (termo) this.termo = termo;
    this.questionarioGestaoFornecedorService
      .filtrar(16, this.pagina, this.itemOrdenacao, this.termo)
      .subscribe(
        response => {
          if (response) {
            this.questionarios = this.questionarios.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.questionarios = new Array<QuestionarioGestaoFornecedor>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        responseError => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public ImprimeCategoria(categorias: Array<CategoriaFornecimento>) {
    var stringCategorias: string = '';

    if (categorias && categorias.length > 0) {
      for (let index = 0; index < categorias.length - 1; index++) {
        stringCategorias = stringCategorias + categorias[index].descricao + ', ';
      }
      stringCategorias = stringCategorias + categorias[categorias.length - 1].descricao;
    }

    return stringCategorias;
  }

  incluirQuestionario() {
    this.router.navigate(['/fornecedores/configuracoes/questionario/novo'], {
      relativeTo: this.route
    });
  }

  editarQuestionario(idQuestionarioGestaoFornecedor) {
    this.router.navigate(
      ['/fornecedores/configuracoes/questionario/', idQuestionarioGestaoFornecedor],
      { relativeTo: this.route }
    );
  }

  public solicitarExclusao(questionarioGestaoFornecedor: QuestionarioGestaoFornecedor) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.deletar(questionarioGestaoFornecedor.idQuestionarioGestaoFornecedor),
        reason => {}
      );
  }

  public onAuditoriaClick(idQuestionarioGestaoFornecedor: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'QuestionarioGestaoFornecedor';
    modalRef.componentInstance.idEntidade = idQuestionarioGestaoFornecedor;
  }

  public deletar(id: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.questionarioGestaoFornecedorService.deletar(id).subscribe(
      response => {
        this.ResetPagination();
        this.Hydrate();
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
}
