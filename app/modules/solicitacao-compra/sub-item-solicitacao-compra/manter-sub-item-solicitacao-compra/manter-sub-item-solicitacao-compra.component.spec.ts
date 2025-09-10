import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterSubItemSolicitacaoCompraComponent } from './manter-sub-item-solicitacao-compra.component';

describe('ManterSubItemSolicitacaoCompraComponent', () => {
  let component: ManterSubItemSolicitacaoCompraComponent;
  let fixture: ComponentFixture<ManterSubItemSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterSubItemSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterSubItemSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
