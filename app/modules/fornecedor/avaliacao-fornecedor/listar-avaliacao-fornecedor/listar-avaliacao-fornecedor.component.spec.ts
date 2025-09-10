import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAvaliacaoFornecedorComponent } from './listar-avaliacao-fornecedor.component';

describe('ListarAvaliacaoFornecedorComponent', () => {
  let component: ListarAvaliacaoFornecedorComponent;
  let fixture: ComponentFixture<ListarAvaliacaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarAvaliacaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAvaliacaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
