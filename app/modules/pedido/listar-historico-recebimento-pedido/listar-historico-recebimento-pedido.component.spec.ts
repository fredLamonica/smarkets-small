import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarHistoricoRecebimentoPedidoComponent } from './listar-historico-recebimento-pedido.component';

describe('ListarHistoricoRecebimentoPedidoComponent', () => {
  let component: ListarHistoricoRecebimentoPedidoComponent;
  let fixture: ComponentFixture<ListarHistoricoRecebimentoPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarHistoricoRecebimentoPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarHistoricoRecebimentoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
