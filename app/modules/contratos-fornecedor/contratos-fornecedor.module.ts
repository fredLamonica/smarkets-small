import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../../shared/shared.module';
import { CatalogoModule } from '../catalogo/catalogo.module';
import { AbaContratoFornecedorComponent } from './components/aba-contrato-fornecedor/aba-contrato-fornecedor.component';
import { FiltroContratoFornecedorComponent } from './components/filtro-contrato-fornecedor/filtro-contrato-fornecedor.component';
import { FiltroSuperiorContratoFornecedorComponent } from './components/filtro-superior-contrato-fornecedor/filtro-superior-contrato-fornecedor.component';
import { ContratosFornecedorRoutingModule } from './contratos-fornecedor-routing';
import { ContratosFornecedorComponent } from './contratos-fornecedor.component';

@NgModule({
  declarations: [
    ContratosFornecedorComponent,
    AbaContratoFornecedorComponent,
    FiltroSuperiorContratoFornecedorComponent,
    FiltroContratoFornecedorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContratosFornecedorRoutingModule,
    CatalogoModule,
    NgSelectModule,
    InfiniteScrollModule,
    SharedModule,
  ],
  entryComponents: [
    AbaContratoFornecedorComponent,
    FiltroSuperiorContratoFornecedorComponent,
    FiltroContratoFornecedorComponent,
  ],
})
export class ContratosFornecedorModule { }
