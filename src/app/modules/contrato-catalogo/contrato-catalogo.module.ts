import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ListarContratosComponent } from './listar-contratos/listar-contratos.component';

const routes: Routes = [
  {
    path: '',
    component: ListarContratosComponent
  }
];

@NgModule({
  declarations: [
    ListarContratosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ContratoCatalogoModule { }