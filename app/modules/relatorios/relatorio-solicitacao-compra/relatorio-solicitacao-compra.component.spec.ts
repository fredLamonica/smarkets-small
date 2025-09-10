import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioSolicitacaoCompraComponent } from './relatorio-solicitacao-compra.component';

describe('RelatorioSolicitacaoCompraComponent', () => {
  let component: RelatorioSolicitacaoCompraComponent;
  let fixture: ComponentFixture<RelatorioSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
