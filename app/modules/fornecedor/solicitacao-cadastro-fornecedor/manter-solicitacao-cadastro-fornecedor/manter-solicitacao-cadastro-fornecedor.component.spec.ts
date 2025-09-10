import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterSolicitacaoCadastroFornecedorComponent } from './manter-solicitacao-cadastro-fornecedor.component';

describe('ManterSolicitacaoCadastroFornecedorComponent', () => {
  let component: ManterSolicitacaoCadastroFornecedorComponent;
  let fixture: ComponentFixture<ManterSolicitacaoCadastroFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterSolicitacaoCadastroFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterSolicitacaoCadastroFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
