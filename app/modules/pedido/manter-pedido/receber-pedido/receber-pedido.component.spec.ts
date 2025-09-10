import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceberPedidoComponent } from './receber-pedido.component';

describe('ReceberPedidoComponent', () => {
  let component: ReceberPedidoComponent;
  let fixture: ComponentFixture<ReceberPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceberPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceberPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
