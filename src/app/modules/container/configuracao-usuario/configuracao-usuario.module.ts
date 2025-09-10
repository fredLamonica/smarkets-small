import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AreaUsuarioComponent } from './area-usuario/area-usuario.component';
import { InformacoesPessoaisComponent } from './informacoes-pessoais/informacoes-pessoais.component';

const routes: Routes = [
  {
    path: '',
    component: AreaUsuarioComponent
  },
  {
    path: 'informacoes-pessoais',
    component: InformacoesPessoaisComponent
  }
];

@NgModule({
  declarations: [
    AreaUsuarioComponent,
    InformacoesPessoaisComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ConfiguracaoUsuarioModule { }