import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkCardEntryComponent } from './sdk-card-entry.component';

describe('SdkCardEntryComponent', () => {
  let component: SdkCardEntryComponent;
  let fixture: ComponentFixture<SdkCardEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkCardEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkCardEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
