import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterQuestaoAvaliacaoFornecedorComponent } from './manter-questao-avaliacao-fornecedor.component';

describe('ManterQuestaoAvaliacaoFornecedorComponent', () => {
  let component: ManterQuestaoAvaliacaoFornecedorComponent;
  let fixture: ComponentFixture<ManterQuestaoAvaliacaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterQuestaoAvaliacaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterQuestaoAvaliacaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
