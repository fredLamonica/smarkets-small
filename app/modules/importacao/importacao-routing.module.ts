import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarCargaClientesComponent } from './listar-carga-clientes/listar-carga-clientes.component';
import { ListarCargaCondicaoPagamentoComponent } from './listar-carga-condicao-pagamento/listar-carga-condicao-pagamento.component';
import { ListarCargaEmpresasComponent } from './listar-carga-empresas/listar-carga-empresas.component';
import { ListarCargaFornecedorComponent } from './listar-carga-fornecedor/listar-carga-fornecedor.component';
import { ListarCargaImagemComponent } from './listar-carga-imagem/listar-carga-imagem.component';
import { ListarCargaInformacaoContratosComponent } from './listar-carga-informacao-contratos/listar-carga-informacao-contratos.component';
import { ListarCargaPrecificacaoProdutoIaComponent } from './listar-carga-precificacao-produto-ia/listar-carga-precificacao-produto-ia.component';
import { ListarCargaProdutoIaComponent } from './listar-carga-produto-ia/listar-carga-produto-ia.component';
import { ListarCargaProdutoComponent } from './listar-carga-produto/listar-carga-produto.component';
import { ListarCargaUsuarioComponent } from './listar-carga-usuario/listar-carga-usuario.component';
import { ListarImportacaoSolicitacaoCompraComponent } from './listar-importacao-solicitacao-compra/listar-importacao-solicitacao-compra.component';
import { UploadsModelosImportacaoComponent } from './uploads-modelos-importacao/uploads-modelos-importacao.component';

const routes: Routes = [
  { path: 'solicitacao-compra', component: ListarImportacaoSolicitacaoCompraComponent },
  { path: 'carga-cliente', component: ListarCargaClientesComponent },
  { path: 'carga-usuario', component: ListarCargaUsuarioComponent },
  { path: 'carga-fornecedor', component: ListarCargaFornecedorComponent },
  { path: 'carga-condicao-pagamento', component: ListarCargaCondicaoPagamentoComponent },
  { path: 'carga-produto', component: ListarCargaProdutoComponent },
  { path: 'carga-informacao-contratos', component: ListarCargaInformacaoContratosComponent },
  { path: 'uploads-modelos-importacao', component: UploadsModelosImportacaoComponent },
  { path: 'carga-imagem', component: ListarCargaImagemComponent },
  { path: 'carga-empresa', component: ListarCargaEmpresasComponent },
  { path: 'carga-produto-ia', component: ListarCargaProdutoIaComponent },
  { path: 'carga-precificacao-produto-ia', component: ListarCargaPrecificacaoProdutoIaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportacaoRoutingModule { }
