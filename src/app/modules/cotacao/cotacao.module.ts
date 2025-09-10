import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ListarCotacoesComponent } from './listar-cotacoes/listar-cotacoes.component';

const routes: Routes = [
  {
    path: '',
    component: ListarCotacoesComponent
  }
];

@NgModule({
  declarations: [
    ListarCotacoesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CotacaoModule { }