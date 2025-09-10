import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPedidoComponent } from './manter-pedido.component';

describe('ManterPedidoComponent', () => {
  let component: ManterPedidoComponent;
  let fixture: ComponentFixture<ManterPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
