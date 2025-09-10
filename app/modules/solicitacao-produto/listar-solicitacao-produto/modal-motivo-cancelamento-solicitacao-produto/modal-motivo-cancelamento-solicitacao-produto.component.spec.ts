import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMotivoCancelamentoSolicitacaoProdutoComponent } from './modal-motivo-cancelamento-solicitacao-produto.component';

describe('ModalMotivoCancelamentoSolicitacaoProdutoComponent', () => {
  let component: ModalMotivoCancelamentoSolicitacaoProdutoComponent;
  let fixture: ComponentFixture<ModalMotivoCancelamentoSolicitacaoProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMotivoCancelamentoSolicitacaoProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMotivoCancelamentoSolicitacaoProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
