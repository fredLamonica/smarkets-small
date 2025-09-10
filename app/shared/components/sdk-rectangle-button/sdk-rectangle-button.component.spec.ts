import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkRectangleButtonComponent } from './sdk-rectangle-button.component';

describe('SdkRectangleButtonComponent', () => {
  let component: SdkRectangleButtonComponent;
  let fixture: ComponentFixture<SdkRectangleButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkRectangleButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkRectangleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
