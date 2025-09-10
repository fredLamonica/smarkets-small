import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCategoriaFornecimentoCategoriaProdutoComponent } from './listar-categoria-fornecimento-categoria-produto.component';

describe('ListarCategoriaFornecimentoCategoriaProdutoComponent', () => {
  let component: ListarCategoriaFornecimentoCategoriaProdutoComponent;
  let fixture: ComponentFixture<ListarCategoriaFornecimentoCategoriaProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListarCategoriaFornecimentoCategoriaProdutoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCategoriaFornecimentoCategoriaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
