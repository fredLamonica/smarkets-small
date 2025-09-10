import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarQuestionariosFornecedorComponent } from './listar-questionarios-fornecedor.component';

describe('ListarQuestionariosFornecedorComponent', () => {
  let component: ListarQuestionariosFornecedorComponent;
  let fixture: ComponentFixture<ListarQuestionariosFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarQuestionariosFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarQuestionariosFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
