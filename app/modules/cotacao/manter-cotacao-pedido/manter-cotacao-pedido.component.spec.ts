import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCotacaoPedidoComponent } from './manter-cotacao-pedido.component';

describe('ManterCotacaoPedidoComponent', () => {
  let component: ManterCotacaoPedidoComponent;
  let fixture: ComponentFixture<ManterCotacaoPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCotacaoPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCotacaoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
