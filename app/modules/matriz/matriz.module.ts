import { ModalMatrizResponsabilidadeComponent } from './matriz-responsabilidade/modal-matriz-responsabilidade/modal-matriz-responsabilidade.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrizResponsabilidadeComponent } from './matriz-responsabilidade/matriz-responsabilidade.component';
import { SharedModule } from '@shared/shared.module';
import { MatrizTabComponent } from './matriz-tab/matriz-tab.component';
import { MatrizRoutingModule } from './matriz-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [MatrizResponsabilidadeComponent, MatrizTabComponent, ModalMatrizResponsabilidadeComponent],
  imports: [
    CommonModule,
    MatrizRoutingModule,
    SharedModule, 
    InfiniteScrollModule,
    TextMaskModule
  ],
  entryComponents: [
    ModalMatrizResponsabilidadeComponent
  ]
})
export class MatrizModule { }
