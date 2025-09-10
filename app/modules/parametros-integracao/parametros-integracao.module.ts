import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosIntegracaoRoutingModule } from './parametros-integracao-routing.module';
import { ListarIvaComponent } from './iva/listar-iva/listar-iva.component';
import { ManterIvaComponent } from './iva/manter-iva/manter-iva.component';
import { ListarOrganizacaoCompraComponent } from './organizacao-compras/listar-organizacao-compra/listar-organizacao-compra.component';
import { ManterOrganizacaoCompraComponent } from './organizacao-compras/manter-organizacao-compra/manter-organizacao-compra.component';
import { ParametrosIntegracaoComponent } from './parametros-integracao/parametros-integracao.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ManterGrupoCompradoresComponent } from './grupo-compradores/manter-grupo-compradores/manter-grupo-compradores.component';
import { ListarGrupoCompradoresComponent } from './grupo-compradores/listar-grupo-compradores/listar-grupo-compradores.component';
import { ListarOrigemMaterialComponent } from './origem-material/listar-origem-material/listar-origem-material.component';
import { ManterOrigemMaterialComponent } from './origem-material/manter-origem-material/manter-origem-material.component';
import { ListarUtilizacaoMaterialComponent } from './utilizacao-material/listar-utilizacao-material/listar-utilizacao-material.component';
import { ManterUtilizacaoMaterialComponent } from './utilizacao-material/manter-utilizacao-material/manter-utilizacao-material.component';
import { ListarCategoriaMaterialComponent } from './categoria-material/listar-categoria-material/listar-categoria-material.component';
import { ManterCategoriaMaterialComponent } from './categoria-material/manter-categoria-material/manter-categoria-material.component';

@NgModule({
  declarations: [
    ParametrosIntegracaoComponent,
    ListarIvaComponent, 
    ManterIvaComponent, 
    ListarOrganizacaoCompraComponent, 
    ManterOrganizacaoCompraComponent,
    ListarGrupoCompradoresComponent,
    ManterGrupoCompradoresComponent,
    ListarOrigemMaterialComponent,
    ManterOrigemMaterialComponent,
    ListarUtilizacaoMaterialComponent,
    ManterUtilizacaoMaterialComponent,
    ListarCategoriaMaterialComponent,
    ManterCategoriaMaterialComponent
  ],
  imports: [
    CommonModule,
    ParametrosIntegracaoRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    NgbModalModule
  ],
  entryComponents: [
    ListarIvaComponent,
    ManterIvaComponent, 
    ListarOrganizacaoCompraComponent, 
    ManterOrganizacaoCompraComponent,
    ListarGrupoCompradoresComponent,
    ManterGrupoCompradoresComponent,
    ListarOrigemMaterialComponent,
    ManterOrigemMaterialComponent,
    ListarUtilizacaoMaterialComponent,
    ManterUtilizacaoMaterialComponent,
    ListarCategoriaMaterialComponent,
    ManterCategoriaMaterialComponent
  ]
})
export class ParametrosIntegracaoModule { }