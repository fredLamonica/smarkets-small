import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkUserSelectComponent } from './sdk-user-select.component';

describe('SdkUserSelectComponent', () => {
  let component: SdkUserSelectComponent;
  let fixture: ComponentFixture<SdkUserSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkUserSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkUserSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
