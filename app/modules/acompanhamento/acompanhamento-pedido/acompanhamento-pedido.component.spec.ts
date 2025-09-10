import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcompanhamentoPedidoComponent } from './acompanhamento-pedido.component';

describe('AcompanhamentoPedidoComponent', () => {
  let component: AcompanhamentoPedidoComponent;
  let fixture: ComponentFixture<AcompanhamentoPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcompanhamentoPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanhamentoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
