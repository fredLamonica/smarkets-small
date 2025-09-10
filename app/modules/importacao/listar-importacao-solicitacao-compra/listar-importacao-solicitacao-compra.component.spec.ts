import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarImportacaoSolicitacaoCompraComponent } from './listar-importacao-solicitacao-compra.component';

describe('ListarImportacaoSolicitacaoCompraComponent', () => {
  let component: ListarImportacaoSolicitacaoCompraComponent;
  let fixture: ComponentFixture<ListarImportacaoSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarImportacaoSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarImportacaoSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
