import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { CatalogoItem } from '../../../../shared/models/catalogo/catalogo-item';
import { SituacaoRequisicaoItem } from '../../../../shared/models/enums/situacao-requisicao-item';
import { RegularizacaoItem } from '../../../../shared/models/regularizacao/regularizacao-item';
import { RequisicaoItem } from '../../../../shared/models/requisicao/requisicao-item';
import { CatalogoService } from '../../../../shared/providers/catalogo.service';
import { RegularizacaoService } from '../../../../shared/providers/regularizacao.service';
import { RequisicaoService } from '../../../../shared/providers/requisicao.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { ResumoCarrinhoComponent } from '../../../container/resumo-carrinho/resumo-carrinho.component';
import { AbaMarketplaceComponent } from '../base/aba-marketplace-component';

@Component({
  selector: 'smk-aba-requisicao',
  templateUrl: './aba-requisicao.component.html',
  styleUrls: ['./aba-requisicao.component.scss'],
})
export class AbaRequisicaoComponent extends AbaMarketplaceComponent implements OnInit, OnChanges {

  @Input() empresa: number;

  modoRegularizacao: boolean;
  modoImobilizado: boolean;

  protected itemOrdenacaoValor: string;

  constructor(
    private injector: Injector,
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private requisicaoService: RequisicaoService,
    private regularizacaoService: RegularizacaoService,
    private errorService: ErrorService,
  ) {
    super(injector);
    this.itemOrdenacaoValor = 'pt.ValorReferencia';
    this.opcoesOrdenacao = this.getOpcoesOrdenacao();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  adicionarAoCarrinho(event) {
    const item: CatalogoItem = event.item;

    this.startLoading();

    if (this.modoRegularizacao) {
      const regularizacaoItem: RegularizacaoItem = new RegularizacaoItem({
        quantidade: event.quantidade,
        valorUnitario: item.produto.valorReferencia,
        idProduto: item.produto.idProduto,
        produto: item.produto,
      });

      this.regularizacaoService.postItem(regularizacaoItem, this.empresa).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.stopLoading()))
        .subscribe(
          () => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            ResumoCarrinhoComponent.atualizarCarrinho.next();
          },
          (error) => {
            this.errorService.treatError(error);
          },
        );
    } else {
      const requisicaoItem = new RequisicaoItem(
        0,
        0,
        null,
        null,
        item.produto.idProduto,
        item.produto,
        null,
        null,
        null,
        null,
        item.produto.moeda,
        item.produto.valorReferencia,
        null,
        null,
        null,
        null,
        null,
        null,
        SituacaoRequisicaoItem['Pré Requisição'],
        event.quantidade,
        null,
        null,
        null,
        this.usuarioAtual.permissaoAtual.pessoaJuridica.filial
          ? this.usuarioAtual.permissaoAtual.pessoaJuridica.idPessoaJuridica
          : this.empresa,
        this.modoImobilizado
      );
      requisicaoItem.quantidadeRestante = requisicaoItem.quantidade;

      this.requisicaoService.inserirItem(requisicaoItem).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.stopLoading()))
        .subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            ResumoCarrinhoComponent.atualizarCarrinho.next();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          },
        );
    }

  }

  protected obter(): void {
    this.produtosLoading = true;

    this.catalogoService.filtrarProdutosRequisicao(
      this.registrosPorPagina,
      this.pagina,
      this.filtro.ordenacao.itemOrdenacao,
      this.filtro.ordenacao.ordem,
      this.filtro.filtroSuperior.termo,
      this.filtro.filtroLateral.idsEstados,
      this.filtro.filtroLateral.idsCategorias,
      this.filtro.filtroLateral.idsFornecedores,
      this.filtro.filtroLateral.idsMarcas,
      this.filtro.filtroSuperior.tipoBusca,
      null,
      null,
      this.filtro.filtroLateral.primeiroFiltroCategoria,
      true,
      this.filtro.filtroSuperior.buscaDetalhada,
    ).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.registros = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.registros = new Array<any>();
            this.totalPaginas = 1;
          }

          this.isFirstLoad = false;
          this.produtosLoading = false;
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  modoAtivo(): boolean {
    if (this.usuarioAtual!.permissaoAtual!.pessoaJuridica!.habilitarRegularizacao || this.usuarioAtual!.permissaoAtual!.pessoaJuridica!.habilitarImobilizado) {
      return true;
    }

    return false;
  }

  mudarCheckbox(event: any) {
    if (event.target.checked === true) {
      if (event.target.id === 'modoRegularizacao') {
        this.modoImobilizado = false;
      }

      if (event.target.id === 'modoImobilizado') {
        this.modoRegularizacao = false;
      }
    }
  }

}
