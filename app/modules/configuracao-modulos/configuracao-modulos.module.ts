import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfiguracaoModulosRoutingModule } from './configuracao-modulos-routing.module';
import { ListarEmpresasComponent } from './listar-empresas/listar-empresas.component';
import { ManterConfiguracaoCompraAutomatizadaComponent } from './manter-configuracao-compra-automatizada/manter-configuracao-compra-automatizada.component';
import { ManterConfiguracaoEmpresaComponent } from './manter-configuracao-empresa/manter-configuracao-empresa.component';
import { ManterConfiguracaoIntegracaoComponent } from './manter-configuracao-integracao/manter-configuracao-integracao.component';
import { ManterConfiguracaoPlataformaComponent } from './manter-configuracao-plataforma/manter-configuracao-plataforma.component';

@NgModule({
  declarations: [ListarEmpresasComponent,
    ManterConfiguracaoPlataformaComponent,
    ManterConfiguracaoEmpresaComponent,
    ManterConfiguracaoCompraAutomatizadaComponent,
    ManterConfiguracaoIntegracaoComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracaoModulosRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    NgbModalModule,
  ],
})
export class ConfiguracaoModulosModule { }
