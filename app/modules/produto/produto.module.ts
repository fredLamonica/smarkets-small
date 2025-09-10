import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TreeModule } from 'angular-tree-component';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from './../../shared/shared.module';
import { ClonarProdutosEmpresaBaseComponent } from './listar-produtos-empresa-base/clonar-produtos-empresa-base/clonar-produtos-empresa-base.component';
import { ItemProdutoEmpresaBaseComponent } from './listar-produtos-empresa-base/item-produto-empresa-base/item-produto-empresa-base.component';
import { ListarProdutosEmpresaBaseComponent } from './listar-produtos-empresa-base/listar-produtos-empresa-base.component';
import { ListarProdutosComponent } from './listar-produtos/listar-produtos.component';
import { ManterProdutoAnexoComponent } from './manter-produto-anexo/manter-produto-anexo.component';
import { ManterProdutoContaContabilComponent } from './manter-produto-conta-contabil/manter-produto-conta-contabil.component';
import { ManterProdutoMarcaComponent } from './manter-produto-marca/manter-produto-marca.component';
import { ManterProdutoComponent } from './manter-produto/manter-produto.component';
import { ProdutoRoutingModule } from './produto-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, ProdutoRoutingModule, TextMaskModule, TreeModule.forRoot()],
  declarations: [
    ListarProdutosComponent,
    ManterProdutoComponent,
    ManterProdutoMarcaComponent,
    ManterProdutoContaContabilComponent,
    ManterProdutoAnexoComponent,
    ListarProdutosEmpresaBaseComponent,
    ItemProdutoEmpresaBaseComponent,
    ClonarProdutosEmpresaBaseComponent,
  ],
  entryComponents: [
    ClonarProdutosEmpresaBaseComponent,
  ],
})
export class ProdutoModule { }
