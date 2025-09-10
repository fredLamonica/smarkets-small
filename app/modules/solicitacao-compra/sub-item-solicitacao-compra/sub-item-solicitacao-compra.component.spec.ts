import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubItemSolicitacaoCompraComponent } from './sub-item-solicitacao-compra.component';

describe('SubItemSolicitacaoCompraComponent', () => {
  let component: SubItemSolicitacaoCompraComponent;
  let fixture: ComponentFixture<SubItemSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubItemSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubItemSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
