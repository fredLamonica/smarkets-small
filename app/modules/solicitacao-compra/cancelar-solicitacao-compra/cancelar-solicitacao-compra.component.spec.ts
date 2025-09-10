import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarSolicitacaoCompraComponent } from './cancelar-solicitacao-compra.component';

describe('CancelarSolicitacaoCompraComponent', () => {
  let component: CancelarSolicitacaoCompraComponent;
  let fixture: ComponentFixture<CancelarSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelarSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
