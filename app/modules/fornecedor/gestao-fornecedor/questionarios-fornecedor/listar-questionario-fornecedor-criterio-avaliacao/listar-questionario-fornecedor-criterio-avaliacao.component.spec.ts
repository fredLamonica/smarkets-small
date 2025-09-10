import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarQuestionarioFornecedorCriterioAvaliacaoComponent } from './listar-questionario-fornecedor-criterio-avaliacao.component';

describe('ListarQuestionarioFornecedorCriterioAvaliacaoComponent', () => {
  let component: ListarQuestionarioFornecedorCriterioAvaliacaoComponent;
  let fixture: ComponentFixture<ListarQuestionarioFornecedorCriterioAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarQuestionarioFornecedorCriterioAvaliacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarQuestionarioFornecedorCriterioAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
