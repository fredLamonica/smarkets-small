import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkTimelineEntryComponent } from './sdk-timeline-entry.component';

describe('SdkTimelilneEntryComponent', () => {
  let component: SdkTimelineEntryComponent;
  let fixture: ComponentFixture<SdkTimelineEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkTimelineEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkTimelineEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
