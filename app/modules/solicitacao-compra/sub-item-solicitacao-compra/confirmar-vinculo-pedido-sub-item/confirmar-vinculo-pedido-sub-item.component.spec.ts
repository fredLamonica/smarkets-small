import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarVinculoPedidoSubItemComponent } from './confirmar-vinculo-pedido-sub-item.component';

describe('ConfirmarVinculoPedidoSubItemComponent', () => {
  let component: ConfirmarVinculoPedidoSubItemComponent;
  let fixture: ComponentFixture<ConfirmarVinculoPedidoSubItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarVinculoPedidoSubItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarVinculoPedidoSubItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
