import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes compartilhados
import { InputNumberMinValueComponent } from './components/input-number-min-value/input-number-min-value.component';
import { CatalogoItemComponent } from './components/catalogo-item/catalogo-item.component';

// Serviços
import { MockDataService } from './services/mock/mock-data.service';
import { MockAuthService } from './services/mock/mock-auth.service';
import { MockMenuService } from './services/mock/mock-menu.service';

// Guards
import { MockAuthGuard } from './guards/mock-auth.guard';

// Interceptors
import { MockInterceptor } from './interceptors/mock.interceptor';

@NgModule({
  declarations: [
    InputNumberMinValueComponent,
    CatalogoItemComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    InputNumberMinValueComponent,
    CatalogoItemComponent
  ],
  providers: [
    MockDataService,
    MockAuthService,
    MockMenuService,
    MockAuthGuard,
    MockInterceptor
  ]
})
export class SharedModule { }