import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFornecedorUsuarioComponent } from './listar-fornecedor-usuario.component';

describe('ListarFornecedorUsuarioComponent', () => {
  let component: ListarFornecedorUsuarioComponent;
  let fixture: ComponentFixture<ListarFornecedorUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarFornecedorUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarFornecedorUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
