import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFornecedorClienteComponent } from './manter-fornecedor-cliente.component';

describe('ManterFornecedorClienteComponent', () => {
  let component: ManterFornecedorClienteComponent;
  let fixture: ComponentFixture<ManterFornecedorClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterFornecedorClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterFornecedorClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
