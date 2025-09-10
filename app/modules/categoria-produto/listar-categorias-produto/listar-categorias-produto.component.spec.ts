import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCategoriasProdutoComponent } from './listar-categorias-produto.component';

describe('ListarCategoriasProdutoComponent', () => {
  let component: ListarCategoriasProdutoComponent;
  let fixture: ComponentFixture<ListarCategoriasProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCategoriasProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCategoriasProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
