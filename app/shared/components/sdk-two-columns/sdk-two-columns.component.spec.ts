import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkTwoColumnsComponent } from './sdk-two-columns.component';

describe('SdkTwoColumnsComponent', () => {
  let component: SdkTwoColumnsComponent;
  let fixture: ComponentFixture<SdkTwoColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkTwoColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkTwoColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
