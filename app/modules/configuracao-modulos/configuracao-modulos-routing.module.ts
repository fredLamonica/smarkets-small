import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarEmpresasComponent } from './listar-empresas/listar-empresas.component';
import { ManterConfiguracaoCompraAutomatizadaComponent } from './manter-configuracao-compra-automatizada/manter-configuracao-compra-automatizada.component';
import { ManterConfiguracaoEmpresaComponent } from './manter-configuracao-empresa/manter-configuracao-empresa.component';
import { ManterConfiguracaoIntegracaoComponent } from './manter-configuracao-integracao/manter-configuracao-integracao.component';
import { ManterConfiguracaoPlataformaComponent } from './manter-configuracao-plataforma/manter-configuracao-plataforma.component';

const routes: Routes = [
  { path: '', component: ListarEmpresasComponent },
  { path: ':idPessoaJuridica', component: ManterConfiguracaoEmpresaComponent },
  { path: 'plataforma/:idPessoaJuridica', component: ManterConfiguracaoPlataformaComponent },
  { path: 'integracao/:idPessoaJuridica', component: ManterConfiguracaoIntegracaoComponent },
  { path: 'compra-automatizada/:idPessoaJuridica', component: ManterConfiguracaoCompraAutomatizadaComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracaoModulosRoutingModule { }
