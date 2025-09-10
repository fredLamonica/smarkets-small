import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesbloqueioItemSolicitacaoCompraComponent } from './desbloqueio-item-solicitacao-compra.component';

describe('DesbloqueioItemSolicitacaoCompraComponent', () => {
  let component: DesbloqueioItemSolicitacaoCompraComponent;
  let fixture: ComponentFixture<DesbloqueioItemSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesbloqueioItemSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesbloqueioItemSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
