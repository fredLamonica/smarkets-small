import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSolicitacaoProdutoComponent } from './listar-solicitacao-produto.component';

describe('ListarSolicitacaoProdutoComponent', () => {
  let component: ListarSolicitacaoProdutoComponent;
  let fixture: ComponentFixture<ListarSolicitacaoProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarSolicitacaoProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarSolicitacaoProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
