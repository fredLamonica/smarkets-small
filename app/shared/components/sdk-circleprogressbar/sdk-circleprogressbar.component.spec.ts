import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkCircleprogressbarComponent } from './sdk-circleprogressbar.component';

describe('SdkCircleprogressbarComponent', () => {
  let component: SdkCircleprogressbarComponent;
  let fixture: ComponentFixture<SdkCircleprogressbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkCircleprogressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkCircleprogressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
