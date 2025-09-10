import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkTimelineComponent } from './sdk-timeline.component';

describe('SdkTimelilneComponent', () => {
  let component: SdkTimelineComponent;
  let fixture: ComponentFixture<SdkTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
