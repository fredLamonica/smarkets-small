import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPendenciaFornecedorComponent } from './listar-pendencia-fornecedor.component';

describe('ListarPendenciaFornecedorComponent', () => {
  let component: ListarPendenciaFornecedorComponent;
  let fixture: ComponentFixture<ListarPendenciaFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPendenciaFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPendenciaFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
