import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCnaeComponent } from './item-cnae.component';

describe('ItemCnaeComponent', () => {
  let component: ItemCnaeComponent;
  let fixture: ComponentFixture<ItemCnaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCnaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCnaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
