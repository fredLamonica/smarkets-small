import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarVinculoPedidoItemComponent } from './confirmar-vinculo-pedido-item.component';

describe('ConfirmarVinculoPedidoItemComponent', () => {
  let component: ConfirmarVinculoPedidoItemComponent;
  let fixture: ComponentFixture<ConfirmarVinculoPedidoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarVinculoPedidoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarVinculoPedidoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
