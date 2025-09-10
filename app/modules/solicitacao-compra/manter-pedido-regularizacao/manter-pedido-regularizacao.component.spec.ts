import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPedidoRegularizacaoComponent } from './manter-pedido-regularizacao.component';

describe('ManterPedidoRegularizacaoComponent', () => {
  let component: ManterPedidoRegularizacaoComponent;
  let fixture: ComponentFixture<ManterPedidoRegularizacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPedidoRegularizacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPedidoRegularizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
