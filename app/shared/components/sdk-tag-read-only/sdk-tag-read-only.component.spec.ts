import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkTagReadOnlyComponent } from './sdk-tag-read-only.component';

describe('SdkTagReadOnlyComponent', () => {
  let component: SdkTagReadOnlyComponent;
  let fixture: ComponentFixture<SdkTagReadOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkTagReadOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkTagReadOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
