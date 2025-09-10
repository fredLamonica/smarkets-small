import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkSuspenseMenuButtonComponent } from './sdk-suspense-menu-button.component';

describe('SdkSuspenseMenuButtonComponent', () => {
  let component: SdkSuspenseMenuButtonComponent;
  let fixture: ComponentFixture<SdkSuspenseMenuButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkSuspenseMenuButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkSuspenseMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
