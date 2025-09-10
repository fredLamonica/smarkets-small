import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkVerticalHeaderLeftComponent } from './sdk-vertical-header-left.component';

describe('SdkVerticalHeaderLeftComponent', () => {
  let component: SdkVerticalHeaderLeftComponent;
  let fixture: ComponentFixture<SdkVerticalHeaderLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkVerticalHeaderLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkVerticalHeaderLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
