import { Component, OnInit, ViewChild } from '@angular/core';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { ListarIvaComponent } from '../iva/listar-iva/listar-iva.component';
import { ListarOrganizacaoCompraComponent } from '../organizacao-compras/listar-organizacao-compra/listar-organizacao-compra.component';
import { ListarGrupoCompradoresComponent } from '../grupo-compradores/listar-grupo-compradores/listar-grupo-compradores.component';
import { ListarOrigemMaterialComponent } from '../origem-material/listar-origem-material/listar-origem-material.component';
import { ListarUtilizacaoMaterialComponent } from '../utilizacao-material/listar-utilizacao-material/listar-utilizacao-material.component';
import { ListarCategoriaMaterialComponent } from '../categoria-material/listar-categoria-material/listar-categoria-material.component';

@Component({
  selector: 'app-parametros-integracao',
  templateUrl: './parametros-integracao.component.html',
  styleUrls: ['./parametros-integracao.component.scss']
})
export class ParametrosIntegracaoComponent implements OnInit {
  @ViewChild('iva') ivaComponent: ListarIvaComponent;
  @ViewChild('organizacaoCompra') organizacaoCompraComponent: ListarOrganizacaoCompraComponent;
  @ViewChild('grupoCompradores') grupoCompradoresComponent: ListarGrupoCompradoresComponent;
  @ViewChild('origemMaterial') origemMaterialComponent: ListarOrigemMaterialComponent;
  @ViewChild('utilizacaoMaterial') utilizacaoMaterialComponent: ListarUtilizacaoMaterialComponent;
  @ViewChild('categoriaMaterial') categoriaMaterialComponent: ListarCategoriaMaterialComponent;

  public termo: string;
  public tabAtiva:
    | 'organizacaoCompra'
    | 'iva'
    | 'grupo-compradores'
    | 'origem-material'
    | 'utilizacao-material'
    | 'categoria-material' = 'iva';

  get componenteAtivo(): OperacoesFiltro {
    switch (this.tabAtiva) {
      case 'iva': {
        return this.ivaComponent;
      }
      case 'organizacaoCompra': {
        return this.organizacaoCompraComponent;
      }
      case 'grupo-compradores': {
        return this.grupoCompradoresComponent;
      }
      case 'origem-material': {
        return this.origemMaterialComponent;
      }
      case 'utilizacao-material': {
        return this.utilizacaoMaterialComponent;
      }
      case 'categoria-material': {
        return this.categoriaMaterialComponent;
      }
    }
  }

  constructor() {}

  ngOnInit() {
    this.tabAtiva = 'iva';
  }

  public buscar(termo) {
    this.termo = termo;
    this.componenteAtivo.ResetPagination();
    this.componenteAtivo.Hydrate(this.termo);
  }

  public onScroll() {
    this.componenteAtivo.onScroll(this.termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.componenteAtivo.ResetPagination();
    this.componenteAtivo.Hydrate(this.termo);
  }

  public selectTab(
    aba:
      | 'organizacaoCompra'
      | 'iva'
      | 'grupo-compradores'
      | 'origem-material'
      | 'utilizacao-material'
      | 'categoria-material'
  ) {
    if (!aba) this.tabAtiva = 'organizacaoCompra';
    else this.tabAtiva = aba;
  }
}
