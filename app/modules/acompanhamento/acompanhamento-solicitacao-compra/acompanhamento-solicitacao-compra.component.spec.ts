import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcompanhamentoSolicitacaoCompraComponent } from './acompanhamento-solicitacao-compra.component';

describe('AcompanhamentoSolicitacaoCompraComponent', () => {
  let component: AcompanhamentoSolicitacaoCompraComponent;
  let fixture: ComponentFixture<AcompanhamentoSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcompanhamentoSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanhamentoSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
