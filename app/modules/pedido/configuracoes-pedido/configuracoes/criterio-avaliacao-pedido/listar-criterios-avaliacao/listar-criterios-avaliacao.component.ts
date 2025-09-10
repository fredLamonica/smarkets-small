import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CriterioAvaliacaoPedido } from '@shared/models/pedido/criterio-avaliacao-pedido';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CriterioAvaliacaoService } from '@shared/providers/criterio-avaliacao.service';
import { ManterCriterioAvaliacaoComponent } from '../manter-criterio-avaliacao/manter-criterio-avaliacao.component';
import { CategoriaProduto } from '@shared/models';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'listar-criterios-avaliacao',
  templateUrl: './listar-criterios-avaliacao.component.html',
  styleUrls: ['./listar-criterios-avaliacao.component.scss']
})
export class ListarCriteriosAvaliacaoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  private termo: string = '';

  public criteriosAvalicaoList: Array<CriterioAvaliacaoPedido> = new Array<CriterioAvaliacaoPedido>();
  public criteriosAvalicaoAllList: Array<CriterioAvaliacaoPedido> = new Array<CriterioAvaliacaoPedido>();

  constructor(private criterioAvaliacaoService: CriterioAvaliacaoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.obterCriterios();
  }

  public buscar(termo) {
    this.termo = termo;
    this.filtrar();
  }

  public filtrar() {
    this.criteriosAvalicaoList = this.criteriosAvalicaoAllList.filter(
      x => x.descricao.trim().toLowerCase().indexOf(this.termo.trim().toLowerCase()) !== -1
    );
  }

  public limparFiltro() {
    this.termo = '';
    this.filtrar();
  }

  obter(termo?: string) {
    this.termo = termo;
    this.obterCriterios(this.termo);
  }

  private async obterCriterios(termo: string = '') {
    try {
      this.blockUI.start();
      this.criteriosAvalicaoAllList = await this.criterioAvaliacaoService.obterTodos().toPromise();
      this.blockUI.stop();
      this.criteriosAvalicaoList = this.criteriosAvalicaoAllList;
    } catch {
      this.translationLibrary.translations.ALERTS.
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterCriterioAvaliacaoComponent, { centered: true, size: 'lg' });
    modalRef.result.then(result => {
      if (result) {
        this.obterCriterios();
      }
    });
  }

  public editarItem(criterioAvaliacao: CriterioAvaliacaoPedido) {
    const modalRef = this.modalService.open(ManterCriterioAvaliacaoComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.criterioAvaliacaoPedido = criterioAvaliacao;
    modalRef.result.then(result => {
      if (result) {
        this.obterCriterios();
      }
    });
  }

  public onExcluirClick(idCriterioAvaliacaoPedido: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.removerCriterio(idCriterioAvaliacaoPedido),
      reason => { }
    );
  }

  private removerCriterio(idCriterioAvaliacaoPedido: number) {
    this.blockUI.start();
    this.criterioAvaliacaoService.excluir(idCriterioAvaliacaoPedido).subscribe(
      response => {
        if (response) {
          this.obter('');
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        }
        else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }, responseError => {
        this.blockUI.stop();

        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        }
        else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }

      }
    )
  }

  public ImprimeCategoria(a: Array<CategoriaProduto>) {
    var categorias: string = '';
    if (a.length > 0) {
      for (let index = 0; index < a.length - 1; index++) {
        categorias = categorias + a[index].nome + ', ';
      }
      categorias = categorias + a[a.length - 1].nome;
    }
    return categorias;
  }
}