import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestaoGestaoFornecedorComponent } from './questao-gestao-fornecedor.component';

describe('QuestaoGestaoFornecedorComponent', () => {
  let component: QuestaoGestaoFornecedorComponent;
  let fixture: ComponentFixture<QuestaoGestaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestaoGestaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoGestaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
