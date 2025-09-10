import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcaoPosRemocaoPedidoComponent } from './acao-pos-remocao-pedido.component';

describe('AcaoPosRemocaoPedidoComponent', () => {
  let component: AcaoPosRemocaoPedidoComponent;
  let fixture: ComponentFixture<AcaoPosRemocaoPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcaoPosRemocaoPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcaoPosRemocaoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
