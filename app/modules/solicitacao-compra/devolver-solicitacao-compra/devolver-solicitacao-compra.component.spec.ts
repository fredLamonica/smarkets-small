import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolverSolicitacaoCompraComponent } from './devolver-solicitacao-compra.component';

describe('DevolverSolicitacaoCompraComponent', () => {
  let component: DevolverSolicitacaoCompraComponent;
  let fixture: ComponentFixture<DevolverSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevolverSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolverSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
