import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterAvaliacaoFornecedorComponent } from './manter-avaliacao-fornecedor.component';

describe('ManterAvaliacaoFornecedorComponent', () => {
  let component: ManterAvaliacaoFornecedorComponent;
  let fixture: ComponentFixture<ManterAvaliacaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterAvaliacaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterAvaliacaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
