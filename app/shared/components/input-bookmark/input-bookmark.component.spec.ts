import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBookmarkComponent } from './input-bookmark.component';

describe('InputBookmarkComponent', () => {
  let component: InputBookmarkComponent;
  let fixture: ComponentFixture<InputBookmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputBookmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
