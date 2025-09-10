import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterItemSolicitacaoCompraComponent } from './manter-item-solicitacao-compra.component';

describe('ManterItemSolicitacaoCompraComponent', () => {
  let component: ManterItemSolicitacaoCompraComponent;
  let fixture: ComponentFixture<ManterItemSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterItemSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterItemSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
