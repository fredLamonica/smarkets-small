import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkButtonComponent } from './sdk-button.component';

describe('SdkButtonComponent', () => {
  let component: SdkButtonComponent;
  let fixture: ComponentFixture<SdkButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
