import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasQuestoesGestaoFornecedorComponent } from './categorias-questoes-gestao-fornecedor.component';

describe('CategoriasQuestoesGestaoFornecedorComponent', () => {
  let component: CategoriasQuestoesGestaoFornecedorComponent;
  let fixture: ComponentFixture<CategoriasQuestoesGestaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriasQuestoesGestaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasQuestoesGestaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
