import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkListViewComponent } from './sdk-list-view.component';

describe('SdkListViewComponent', () => {
  let component: SdkListViewComponent;
  let fixture: ComponentFixture<SdkListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
