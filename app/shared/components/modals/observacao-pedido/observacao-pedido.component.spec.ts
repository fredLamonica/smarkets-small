import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacaoPedidoComponent } from './observacao-pedido.component';

describe('ObservacaoPedidoComponent', () => {
  let component: ObservacaoPedidoComponent;
  let fixture: ComponentFixture<ObservacaoPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacaoPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacaoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
