import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkHeaderDefaultComponent } from './sdk-header-default.component';

describe('SdkHeaderDefaultComponent', () => {
  let component: SdkHeaderDefaultComponent;
  let fixture: ComponentFixture<SdkHeaderDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkHeaderDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkHeaderDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
