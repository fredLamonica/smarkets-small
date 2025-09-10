import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPessoaJuridicaComponent } from './item-pessoa-juridica.component';

describe('ItemPessoaJuridicaComponent', () => {
  let component: ItemPessoaJuridicaComponent;
  let fixture: ComponentFixture<ItemPessoaJuridicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPessoaJuridicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPessoaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
