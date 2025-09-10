import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterConfiguracaoAvaliacaoFornecedorComponent } from './manter-configuracao-avaliacao-fornecedor.component';

describe('ManterConfiguracaoAvaliacaoFornecedorComponent', () => {
  let component: ManterConfiguracaoAvaliacaoFornecedorComponent;
  let fixture: ComponentFixture<ManterConfiguracaoAvaliacaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterConfiguracaoAvaliacaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterConfiguracaoAvaliacaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
