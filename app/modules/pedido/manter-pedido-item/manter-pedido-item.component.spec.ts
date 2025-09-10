import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPedidoItemComponent } from './manter-pedido-item.component';

describe('ManterPedidoItemComponent', () => {
  let component: ManterPedidoItemComponent;
  let fixture: ComponentFixture<ManterPedidoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPedidoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPedidoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
