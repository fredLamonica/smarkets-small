import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarResultadoAvaliacaoFornecedorComponent } from './listar-resultado-avaliacao-fornecedor.component';

describe('ListarResultadoAvaliacaoFornecedorComponent', () => {
  let component: ListarResultadoAvaliacaoFornecedorComponent;
  let fixture: ComponentFixture<ListarResultadoAvaliacaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarResultadoAvaliacaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarResultadoAvaliacaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
