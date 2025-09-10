import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { GrupoCategoriaProdutoDto } from '../../../../shared/models/dto/grupo-categoria-produto-dto';
import { CatalogoService } from '../../../../shared/providers/catalogo.service';
import { EstrategiaFiltro } from '../../models/estrategia-filtro.enum';
import { TipoFiltro } from '../../models/tipo-filtro.enum';
import { FiltroLateralMarketplaceComponent } from '../base/filtro-lateral-marketplace-component';

@Component({
  selector: 'smk-filtro-requisicao',
  templateUrl: './filtro-requisicao.component.html',
  styleUrls: ['./filtro-requisicao.component.scss'],
})
export class FiltroRequisicaoComponent extends FiltroLateralMarketplaceComponent implements OnInit, OnChanges {

  listContainerCollapsedItemsToDisplay: number = 18;

  constructor(private catalogoService: CatalogoService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected processeFiltroVazio(): void {
    this.filtroVazio = !this.filtro || (!this.filtro.filtroLateral.idsCategorias);
  }

  protected inicializeFiltros(): void {
    this.obterFiltros(TipoFiltro.todos, EstrategiaFiltro.demaisFiltros);
  }

  protected obterFiltros(tipoFiltro: TipoFiltro, estrategia: EstrategiaFiltro): void {
    switch (tipoFiltro) {
      case TipoFiltro.todos:
        this.obterCategorias();

        break;

      case TipoFiltro.categoria:
        if (estrategia === EstrategiaFiltro.demaisFiltros) {
          if (this.somenteCategoriasPaiListadas) {
            this.obterCategorias();
          }
        } else {
          this.obterCategorias();
        }

        break;
    }
  }

  private obterCategorias(): void {
    this.categoriasLoading = true;

    const obterCategoriasObservable = this.catalogoService.obterCategoriasRequisicao(
      this.filtro.filtroSuperior.termo,
      this.filtro.filtroLateral.idsEstados,
      this.filtro.filtroLateral.idsCategorias,
      this.filtro.filtroLateral.idsFornecedores,
      this.filtro.filtroLateral.idsMarcas,
      this.itensPorPagina,
      this.filtro.filtroSuperior.tipoBusca,
      null,
      null,
      this.filtro.filtroLateral.idCategoriaProdutoPai,
      this.filtro.filtroLateral.primeiroFiltroCategoria,
      true,
      this.filtro.filtroSuperior.buscaDetalhada,
    );

    if (this.somenteCategoriasPaiListadas && this.filtro.filtroLateral.idsCategorias) {
      this.ajusteConfiguracoesDeCategoria(false);
    }

    obterCategoriasObservable.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((categorias) => {
        this.categorias = categorias ? categorias : new Array<GrupoCategoriaProdutoDto>();
        this.categoriasLoading = false;
      });
  }

}
