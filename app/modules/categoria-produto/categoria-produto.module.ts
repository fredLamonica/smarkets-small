import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';
import { SharedModule } from '@shared/shared.module';
import { CategoriaProdutoRoutingModule } from './categoria-produto-routing.module';
import { ListarCategoriasProdutoComponent } from './listar-categorias-produto/listar-categorias-produto.component';
import { ManterCategoriaProdutoComponent } from './manter-categoria-produto/manter-categoria-produto.component';
import { SelecionarIconeCategoriaComponent } from './selecionar-icone-categoria/selecionar-icone-categoria.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CategoriaProdutoRoutingModule,
    TreeModule.forRoot()
  ],
  entryComponents: [SelecionarIconeCategoriaComponent],
  declarations: [ListarCategoriasProdutoComponent, ManterCategoriaProdutoComponent, SelecionarIconeCategoriaComponent]
})
export class CategoriaProdutoModule { }
