import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCategoriasQuestoesGestaoFornecedorComponent } from './manter-categorias-questoes-gestao-fornecedor.component';

describe('ManterCategoriasQuestoesGestaoFornecedorComponent', () => {
  let component: ManterCategoriasQuestoesGestaoFornecedorComponent;
  let fixture: ComponentFixture<ManterCategoriasQuestoesGestaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCategoriasQuestoesGestaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCategoriasQuestoesGestaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
