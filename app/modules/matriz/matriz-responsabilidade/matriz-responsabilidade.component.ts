import { Component, OnInit, Input } from '@angular/core';
import { CategoriaProduto, Ordenacao, PessoaJuridica, TipoRequisicao, UnidadeMedidaTempo, MatrizResponsabilidade } from '@shared/models';
import { MatrizResponsabilidadeService, TranslationLibraryService, AutenticacaoService, CategoriaProdutoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ModalMatrizResponsabilidadeComponent } from './modal-matriz-responsabilidade/modal-matriz-responsabilidade.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent, AuditoriaComponent } from '@shared/components';

@Component({
  selector: 'matriz-responsabilidade',
  templateUrl: './matriz-responsabilidade.component.html',
  styleUrls: ['./matriz-responsabilidade.component.scss']
})
export class MatrizResponsabilidadeComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public TipoRequisicao = TipoRequisicao;
  public UnidadeMedidaTempo = UnidadeMedidaTempo;

  public matrizResponsabilidade: Array<MatrizResponsabilidade> = new Array<MatrizResponsabilidade>();
  public pagina: number = 1;
  public totalPaginas: number = 0;
  @Input() termo: string;

  public idCategoriaProduto: number;

  public empresa: PessoaJuridica;
  categorias: Array<CategoriaProduto>;

  constructor(
    private matrizService: MatrizResponsabilidadeService,
    private categoriaProdutoService: CategoriaProdutoService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private authService: AutenticacaoService
  ) { }

  ngOnInit() {
    this.obterListas();
    this.empresa = this.authService.usuario().permissaoAtual.pessoaJuridica;
    this.obterMatriz();
  }

  public filtrarPorCategoria(categoriaProduto: CategoriaProduto) {
    this.resetPaginacao();
    this.idCategoriaProduto = categoriaProduto ? categoriaProduto.idCategoriaProduto : null;
    this.obterMatriz();
  }

  public obterMatriz(termo?: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (termo) {
      this.termo = termo;
    }
    else {
      this.termo = '';
    }
    this.matrizService.obter("idMatrizResponsabilidade", Ordenacao.DESC, 16, this.pagina, this.termo, this.idCategoriaProduto).subscribe(
      response => {
        if (response) {
          this.matrizResponsabilidade = this.matrizResponsabilidade.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.matrizResponsabilidade = new Array<MatrizResponsabilidade>();
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

  public onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterMatriz();
    }
  }

  public resetPaginacao() {
    this.pagina = 1;
    this.matrizResponsabilidade = new Array<MatrizResponsabilidade>();
  }

  public editar(index: number) {
    const modalRef = this.modalService.open(ModalMatrizResponsabilidadeComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idMatrizResponsabilidade = this.matrizResponsabilidade[index].idMatrizResponsabilidade;
    modalRef.result.then(result => {
      if (result) {
        this.resetPaginacao();
        this.obterMatriz();
      }
    });
  }

  public deletar(index: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true
    });
    modalRef.componentInstance.confirmacao = `Deseja excluir a matriz informada?`;
    modalRef.componentInstance.confirmarLabel = "Excluir";
    modalRef.result.then(result => {
      if (result) {
        this.matrizService.deletar(this.matrizResponsabilidade[index].idMatrizResponsabilidade).subscribe(
          response => {
            if (response) {
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.resetPaginacao();
              this.obterMatriz();
            }
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
      }
    });


  }

  public inserir() {
    const modalRef = this.modalService.open(ModalMatrizResponsabilidadeComponent, { centered: true, size: 'lg' });
    modalRef.result.then(result => {
      if (result) {
        this.resetPaginacao();
        this.obterMatriz();
      }
    });
  }
  
  public auditar(index: number){
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: "lg" });
    modalRef.componentInstance.nomeClasse = "MatrizResponsabilidade";
    modalRef.componentInstance.idEntidade = this.matrizResponsabilidade[index].idMatrizResponsabilidade;;
  }


  public async obterListas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.categorias = await this.categoriaProdutoService.listar().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

}
