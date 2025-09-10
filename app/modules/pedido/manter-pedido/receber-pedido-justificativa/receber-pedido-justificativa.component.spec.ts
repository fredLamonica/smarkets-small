import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceberPedidoJustificativaComponent } from './receber-pedido-justificativa.component';

describe('ReceberPedidoJustificativaComponent', () => {
  let component: ReceberPedidoJustificativaComponent;
  let fixture: ComponentFixture<ReceberPedidoJustificativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceberPedidoJustificativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceberPedidoJustificativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
