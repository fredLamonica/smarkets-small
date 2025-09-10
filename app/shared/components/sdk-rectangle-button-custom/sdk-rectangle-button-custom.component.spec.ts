import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkRectangleButtonCustomComponent } from './sdk-rectangle-button-custom.component';

describe('SdkRectangleButtonCustomComponent', () => {
  let component: SdkRectangleButtonCustomComponent;
  let fixture: ComponentFixture<SdkRectangleButtonCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkRectangleButtonCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkRectangleButtonCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
