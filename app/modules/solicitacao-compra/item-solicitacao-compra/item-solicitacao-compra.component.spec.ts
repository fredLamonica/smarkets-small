import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSolicitacaoCompraComponent } from './item-solicitacao-compra.component';

describe('ItemSolicitacaoCompraComponent', () => {
  let component: ItemSolicitacaoCompraComponent;
  let fixture: ComponentFixture<ItemSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
