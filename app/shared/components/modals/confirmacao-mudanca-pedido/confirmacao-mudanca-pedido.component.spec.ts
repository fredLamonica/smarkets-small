import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacaoMudancaPedidoComponent } from './confirmacao-mudanca-pedido.component';

describe('ConfirmacaoMudancaPedidoComponent', () => {
  let component: ConfirmacaoMudancaPedidoComponent;
  let fixture: ComponentFixture<ConfirmacaoMudancaPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacaoMudancaPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacaoMudancaPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
