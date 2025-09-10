import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterQuestionariosGestaoFornecedorComponent } from './manter-questionarios-gestao-fornecedor.component';

describe('ManterQuestionariosGestaoFornecedorComponent', () => {
  let component: ManterQuestionariosGestaoFornecedorComponent;
  let fixture: ComponentFixture<ManterQuestionariosGestaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterQuestionariosGestaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterQuestionariosGestaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
