import { ConfiguracaoWorkflowComponent } from './configuracao-workflow/configuracao-workflow.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", component: ConfiguracaoWorkflowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracaoWorkflowRoutingModule { }
