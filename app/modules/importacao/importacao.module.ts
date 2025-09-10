import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ImportacaoRoutingModule } from './importacao-routing.module';
import { ListarCargaClientesComponent } from './listar-carga-clientes/listar-carga-clientes.component';
import { ListarCargaCondicaoPagamentoComponent } from './listar-carga-condicao-pagamento/listar-carga-condicao-pagamento.component';
import { ListarCargaEmpresasComponent } from './listar-carga-empresas/listar-carga-empresas.component';
import { ListarCargaFornecedorComponent } from './listar-carga-fornecedor/listar-carga-fornecedor.component';
import { ListarCargaImagemComponent } from './listar-carga-imagem/listar-carga-imagem.component';
import { ListarCargaInformacaoContratosComponent } from './listar-carga-informacao-contratos/listar-carga-informacao-contratos.component';
import { DownloadArquivosComponent } from './listar-carga-produto-ia/download-arquivos/download-arquivos.component';
import { ListarCargaProdutoIaComponent } from './listar-carga-produto-ia/listar-carga-produto-ia.component';
import { ListarCargaProdutoComponent } from './listar-carga-produto/listar-carga-produto.component';
import { ListarCargaUsuarioComponent } from './listar-carga-usuario/listar-carga-usuario.component';
import { ListarImportacaoSolicitacaoCompraComponent } from './listar-importacao-solicitacao-compra/listar-importacao-solicitacao-compra.component';
import { UploadsModelosImportacaoComponent } from './uploads-modelos-importacao/uploads-modelos-importacao.component';
import { ListarCargaPrecificacaoProdutoIaComponent } from './listar-carga-precificacao-produto-ia/listar-carga-precificacao-produto-ia.component';

@NgModule({
  imports: [CommonModule, SharedModule, ImportacaoRoutingModule],
  declarations: [
    ListarImportacaoSolicitacaoCompraComponent,
    ListarCargaClientesComponent,
    ListarCargaUsuarioComponent,
    ListarCargaFornecedorComponent,
    ListarCargaCondicaoPagamentoComponent,
    ListarCargaProdutoComponent,
    ListarCargaInformacaoContratosComponent,
    ListarCargaEmpresasComponent,
    UploadsModelosImportacaoComponent,
    ListarCargaImagemComponent,
    ListarCargaProdutoIaComponent,
    DownloadArquivosComponent,
    ListarCargaPrecificacaoProdutoIaComponent,
  ],
  entryComponents: [
    DownloadArquivosComponent,
  ]
})
export class ImportacaoModule { }
