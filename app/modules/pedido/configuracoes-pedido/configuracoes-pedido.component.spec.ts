import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracoesPedidoComponent } from './configuracoes-pedido.component';

describe('ConfiguracoesPedidoComponent', () => {
  let component: ConfiguracoesPedidoComponent;
  let fixture: ComponentFixture<ConfiguracoesPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracoesPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracoesPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
