import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComentarioModalComponent } from './item-comentario-modal.component';

describe('ItemComentarioModalComponent', () => {
  let component: ItemComentarioModalComponent;
  let fixture: ComponentFixture<ItemComentarioModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemComentarioModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComentarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
