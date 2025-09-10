import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSolicitacaoCadastroFornecedorComponent } from './item-solicitacao-cadastro-fornecedor.component';

describe('ItemSolicitacaoCadastroFornecedorComponent', () => {
  let component: ItemSolicitacaoCadastroFornecedorComponent;
  let fixture: ComponentFixture<ItemSolicitacaoCadastroFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSolicitacaoCadastroFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSolicitacaoCadastroFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
