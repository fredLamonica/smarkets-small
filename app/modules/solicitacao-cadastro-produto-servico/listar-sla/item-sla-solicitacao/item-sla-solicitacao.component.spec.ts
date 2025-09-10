import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSlaSolicitacaoComponent } from './item-sla-solicitacao.component';

describe('ItemSlaSolicitacaoComponent', () => {
  let component: ItemSlaSolicitacaoComponent;
  let fixture: ComponentFixture<ItemSlaSolicitacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSlaSolicitacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSlaSolicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
