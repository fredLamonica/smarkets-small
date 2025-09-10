import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFornecedorCategoriaProdutoComponent } from './manter-fornecedor-categoria-produto.component';

describe('ManterFornecedorCategoriaProdutoComponent', () => {
  let component: ManterFornecedorCategoriaProdutoComponent;
  let fixture: ComponentFixture<ManterFornecedorCategoriaProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterFornecedorCategoriaProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterFornecedorCategoriaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
