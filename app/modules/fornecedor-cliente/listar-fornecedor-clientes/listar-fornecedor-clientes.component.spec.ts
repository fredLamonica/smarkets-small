import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFornecedorClientesComponent } from './listar-fornecedor-clientes.component';

describe('ListarFornecedorClientesComponent', () => {
  let component: ListarFornecedorClientesComponent;
  let fixture: ComponentFixture<ListarFornecedorClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarFornecedorClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarFornecedorClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
